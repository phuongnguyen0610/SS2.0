/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */
//processes invoices and contains logic to handle errors
//Find the customers associated with all open invoices
//Apply a location-based discount to each invoice
//Write each invoice to the reduce stage so it is grouped by customer
//Initialize a new CustomerPayment for each customer applied only to the invoices specified in the reduce values
//Create a custom record capturing the details of the records that were processed
//Notify administrators of any exceptions using an email notification
//Prior to running this sample, you need to manually create a custom record type with id "customrecord_summary"
//and text fields with id "custrecord_time", "custrecord_usage", and "custrecord_yields". 
define(['N/Search', 'N/record', 'N/email', 'N/runtime', 'N/error'],
    function (search, record, email, runtime, error){
        function handleErrorAndSendNotification(e, stage){
            log.error('Stage:' +stage+ 'failed', e);

            var author = -5; 
            var recipients = 'notify@example.com'; 
            var subject = 'Map/Reduce Script' + runtime.getCurrentScript().id + 'failed for stage: '+ stage;
            var body = 'An error occurred with the following information: \n' +
                        'Error code: '+ e.name + '\n' +
                        'Error msg: '+ e.message;

            email.send({
                author: author, 
                recipients: recipients, 
                subject: subject, 
                body: body
            });
        }

        function handleErrorIfAny(summary){
            var inputSummary = summary.inputSummary; 
            var mapSummary = summary.mapSummary; 
            var reduceSummary = summary.reduceSummary; 

            if (inputSummary.error){
                var e = error.create({
                    name: 'INPUT_STAGE_FAILED', 
                    message: inputSummary.error
                }); 
                handleErrorAndSendNotification(e, 'getInputData');
            }

            handleErrorInStage('map', mapSummary);
            handleErrorInStage('reduce', reduceSummary);
        }

        function handleErrorInStage(stage, summary){
            var errorMsg =[];
            summary.errors.iterator().each(function(key,value){
                var msg = 'Failure to accept payment from customer id: '+ key+ '. Error was: '+
                JSON.parse(value).message+ '\n';
                errorMsg.push(msg); 
                return true;
            })
            if (errorMsg.length>0){
                var e = error.create({
                    name: 'RECORD_TRANSFORM_FAILED', 
                    message: JSON.stringify(errorMsg)
                })
                handleErrorAndSendNotification(e, stage);
            }
        }

        function createSummaryRecord(summary){
            try{
                var seconds = summary.seconds; 
                var usage = summary.usage;
                var yeilds = summary.yeilds; 

                var rec = record.create({
                    type: 'customrecord_summary'
                }); 

                rec.setValue({
                    fieldId: 'name', 
                    value: 'Summary for M/R script: '+ runtime.getCurrentScript().id
                }); 

                rec.setValue({
                    fieldId: 'custrecord_time', 
                    value: seconds
                });

                rec.setValue({
                    fieldId: 'custrecord_usage', 
                    value: usage
                })

                rec.setValue({
                    fieldId: 'custrecord_yields', 
                    value: yeilds
                }); 
                rec.save();
            }catch(e){
                handleErrorAndSendNotification(e, 'summarize')
            }
        }

        function applyLocationDiscountToInvoice(recordId){
            var invoice = record.load({
                type: record.Type.INVOICE, 
                id: recordId, 
                isDynamic: true
            });

            var location = invoice.getText({
                fieldId: 'location'
            }); 

            var discount; 
            if (location ==='East Coast'){
                discount = 'Eight Percent';
            }else if(location === 'West Coast'){
                discount = 'Five percent';
            }else if (location ==='United Kingdom'){
                discount = 'Nice Percent'; 
            }else{
                discount ='';
            }

            invoice.setText({
                fieldId: 'discountItem', 
                text: discount, 
                ignoreFieldChange: false
            }); 
            log.debug(recordId+ 'has been updated with location-based discount.');
            invoice.save();
        }

        function getInputData(){
            return search.create({
                type: record.Type.INVOICE, 
                filters: [['status', search.Operator.IS, 'open']], 
                columns: ['entity'], 
                title: 'Open Invoice Search'
            }); 
        }

        function map(context){
            var searchResult = JSON.parse(context.value); 
            var invoiceId = searchResult.id; 
            var entityId = searchResult.values.entity.value;

            applyLocationDiscountToInvoice(invoiceId);

            context.write({
                key: entityId, 
                value: invoiceId
            }); 
        }

        function reduce(context){
            var customerId = context.key; 

            var custPayment = record.transform({
                fromType: record.Type.CUSTOMER, 
                fromId: customerId, 
                toType: record.Type.CUSTOMER_PAYMENT, 
                isDynamic: true
            }); 

            var lineCount = custPayment.getLineCount('apply');
            for (var j=0; j<lineCount; j++){
                custPayment.selectLine({
                    sublistId: 'apply', 
                    line: j
                })
                custPayment.setCurrentSublistValue({
                    sublistId: 'apply',
                    fieldId: 'apply', 
                    value: true
                });
            }

            var custPaymentId = custPayment.save();

            context.write({
                key: custPaymentId
            });
        }

        function summarize(summary){
            handleErrorIfAny(summary); 
            createSummaryRecord(summary);
        }

        return {
            getInputData: getInputData, 
            map: map, 
            reduce: reduce, 
            summarize: summarize
        }

    }    
);