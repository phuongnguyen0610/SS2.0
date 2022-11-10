            /** 
 * phoneCall.js
 * @NApiVersion 2.x
 * @NModuleScope Public 
 */


// This script create a record, so it loads the N/record module.

define (['N/record'] ,

    // The next line marks the beginning of the callback
    // function. The 'record' argument is an object that 
    // represents the record module.

    function (record) {

        // The next line marks the beginning of the entry point
        // function.
   
        function scheduleCall (context) { 
            var newPhoneCall = record.create({
                type: record.Type.PHONE_CALL,
                isDynamic: true
            });
 
            newPhoneCall.setValue({
                fieldId: 'title',
                value: context.phoneCallTitle
            });
 
            newPhoneCall.setValue({
                fieldId: 'assigned',
                value: context.phoneCallOwner
            });
 
            newPhoneCall.setText({
                fieldId: 'phone',
                text: context.phoneNumber
            });
 
            try {
                var newPhoneCallId = newPhoneCall.save();
                  
                log.debug({
                    title: 'Phone call record created successfully', 
                    details: 'New phone call record ID:  ' + newPhoneCallId
                });

            } catch (e) {
                log.error({
                    title: e.name,
                    details: e.message
                });
            }
        }

    // Add the return statement that identifies the entry point funtion.
    return {
        schedule: scheduleCall, 
    }
}); 

          