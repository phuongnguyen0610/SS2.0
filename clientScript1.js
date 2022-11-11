//The script ensures that the transaction date is not older than one week, and that the total is valid.
/**
 * @NApiversion 2.x
 * @NScriptType ClientScript
 */

define(['N/ui/message'],
    function (msg){

        function showErrorMessage(msgText){
            var myMsg = msg.create({
                title: "Cannot save record", 
                message: msgText, 
                type: msg.TYPE.ERROR
            });

            myMsg.show({
                duration: 5000
            });
        }

        function saveRec (context){
            var rec = context.currentRecord;
            var currentDate = new Date();
            var oneWeekAgo = new Date(currentDate - 1000*60*60*24*7);
            //Validate transaction date is not older than current time by one week
            if (rec.getValue({
                fieldID: 'trandate'
            })< oneWeekAgo){
                showErrorMessage("Cannot save sales order with trandate one week old"); 
                return false;
            }
            //Validate total is greater than 0
            if (rec.getValue({
                fieldID: 'total'
            })<=0){
                showErrorMessage('Cannot save sales order with negative total amount.');
                return false;
            }
            return true;
        }
        return {
            saveRecord: saveRec
        }
        
    }
);

