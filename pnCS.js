/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/record', 'N/log', 'N/search', 'N/ui/dialog'], (record, log, search, dialog)=>{
            function pageInit(scriptContext){
                dialog.alert({
                    title: 'Alert', 
                    message: 'Field has been updated'
                })
            }
            function fieldChanged(scriptContext){

            }
    return{
//
    }
})

