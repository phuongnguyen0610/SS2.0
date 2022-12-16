/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */

define(['N/search', 'N/record', 'N/email'], 
        (search, record, email)=>{
            const onAction = (scriptContext) =>{
            var recId = scriptContext.newRecord.id;
            var rec = record.load({
                type: record.Type.SALES_ORDER,
                id: recId
            });

            var discount = rec.getValue({
                fieldId:'discounttotal'
            });

            var salesrep = rec.getValue({
                fieldId:'salesrep'
            });

            var tranid = rec.getValue({
                fieldId: 'tranid'
            }); 

            log.debug('discount', discount);
            log.debug('salesrep', salesrep);
            if (discount !=0 || discount !=null){
                var empGroup = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: salesrep,
                    columns: 'custentity34'
                }); 
                empGroup = empGroup.custentity34;
                log.debug('empGroup', empGroup);

                var myEmplSearch = search.create({
                    type: search.Type.EMPLOYEE, 
                    title: 'My employee search', 
                    id: 'my_employee_search', 
                    columns: [{
                        name: "internalid"
                    }, {
                        name: "email"
                    }, {
                        name: "custentity34"
                    }], 
                    filters: [{
                        name: "custentity34", 
                        operator: 'is', 
                        values: empGroup
                    }]
                })

                var recipientId = new Array();

                myEmplSearch.run().each(function(result){
                    recipientId.push(result.getValue('email'));
                    return true;
                }); 

                var subject = 'Sales Order Transaction #' +tranid;
                log.debug('subject', subject);

                var emailBody = 'A Sales Order has been created with a Discount total of: '+discount;
                log.debug('emailBody', emailBody);

                email.send({
                    author: 22850, 
                    recipients: salesrep, 
                    subject: subject,
                    body: emailBody, 
                    cc: recipientId
                }); 
                
                log.debug('email has sent', 'email has sent');
            }
            }

            return {
                onAction
            }
        }
    )