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
    }
);