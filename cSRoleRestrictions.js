//An error is thrown when running a client script to access a record with a role that does not have permission to view or edit the record
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/Search'],
    function (search){
        function getSalesRepEmail (context){
            var salesRep = context.currentRecord.getValue({
                fieldId: 'salesrep'
            });
            var salesRepEmail = search.lookupFields({
                type: 'employee', 
                id: salesRep, 
                columns: ['email']
            });
            alert(JSON.stringify(salesRepEmail));
        }
        return {
            fieldChanged: getSalesRepEmail
        }
    }
);