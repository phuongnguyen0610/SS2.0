              /**
 * 
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

 define (['N/record', 'N/ui/serverWidget',  './phoneCall'],
 function(record, serverWidget, phone) {

    // In the beforeLoad function, disable the 
    // Notes field on the record.

     function myBeforeLoad (context) {
         if (context.type !== context.UserEventType.CREATE)
               return;
           var form = context.form;

           var notesField = form.getField({
                id: 'comments'
           });
        
           notesField.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
           });
      }

     // In the beforeSubmit function, add a message to the Notes field.
    
     function myBeforeSubmit(context) {
         if (context.type !== context.UserEventType.CREATE)
              return;
         var newEmployeeRecord = context.newRecord;
         newEmployeeRecord.setValue('comments', 'Orientation date TBD.');
     }

     // In the afterSubmit function, take several actions culiminating
     // in creating both a task record and a phone call record.
     
     function myAfterSubmit(context) {   

     // If the user is not creating a new record, then stop executing.

     if (context.type !== context.UserEventType.CREATE)
         return;

     // Use the context object's newRecord property to retrieve values
     // from the new record.

     var newEmployeeRecord = context.newRecord;
     var newEmployeeFirstName = newEmployeeRecord.getValue ({
           fieldId: 'firstname'
     });

     var newEmployeeLastName = newEmployeeRecord.getValue ({
         fieldId: 'lastname'
     });

     var newEmployeeSupervisor = newEmployeeRecord.getValue ({
         fieldId: 'supervisor'
     });

     var newEmployeePhoneNumber = newEmployeeRecord.getValue({
            fieldId: 'phone'
     });
         
     // If the user entered a value for the supervisor field,
     // create a task record for the supervisor.

     if (newEmployeeSupervisor) {
         var newTask = record.create({
             type: record.Type.TASK,
             isDynamic: true
         });
             
         newTask.setValue({
             fieldId: 'title',
             value: 'Schedule orientation session for ' +  
             newEmployeeFirstName +  ' ' + newEmployeeLastName
         });

         newTask.setValue({
             fieldId: 'assigned',
             value: newEmployeeSupervisor
         });    

         try {
             var newTaskId = newTask.save();
             log.debug({    
                   title: 'Task record created successfully', 
                    details: 'New task record ID:  ' + newTaskId
             });
             
          } catch (e) {
              log.error({
                  title: e.name,
                     details: e.message
              }); 
          } 
     } 

     // If the user entered values for both the supervisor and
     // phone number fields, use the phoneCall module to schedule a phone call.

     if (newEmployeeSupervisor && newEmployeePhoneNumber) {
         var phoneData =
             {
                 phoneNumber:  newEmployeePhoneNumber,
                    phoneCallOwner:   newEmployeeSupervisor,
                    phoneCallTitle:   'Welcome ' + newEmployeeFirstName +
                             ' ' + newEmployeeLastName
                };
         phone.schedule(phoneData);
     } 
  }

 return {
     beforeLoad: myBeforeLoad,
     beforeSubmit: myBeforeSubmit,
    afterSubmit: myAfterSubmit
    
 };
}); 

         