/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/error'],
    function (error){
        function pageInit(context){
            if (context.mode !== 'create')
                return;
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'entity', 
                value: 107 //set the customer field to a specific customer
            })
        }

        function saveRecord(context){
            //when form changes are saved, the saveRecord event ensures that the customer field is set and at least one slaes order item is listed
            var currentRecord = context.currentRecord;
            if (!currentRecord.getValue({
                fieldId: 'entity'
            }) || currentRecord.getLineCount({
                sublistId: 'item'
            })<1)
            throw error.create({
                name: 'MISSING_REQ_ARG', 
                message: 'Please enter all the necessary fields on the salesorder before saving'
            });
            return true;
        }

        function validateField(context){
            //make sure the  number is less than 3
            var currentRecord = context.currentRecord; 
            var sublistName = context.sublistId; 
            var sublistFieldName = context.fieldId;
            var line = context.line;
            if (sublistName === 'item'){
                if (sublistFieldName === 'quantity'){
                    if (currentRecord.getCurrentSublistValue({
                        sublistId: sublistName, 
                        fieldId: sublistFieldName
                    })<3)
                    currentRecord.setValue({
                        fieldId: 'otherrefnum', 
                        value: 'Quantity is less than 3'
                    }); 
                    else
                        currentRecord.setValue({
                            fieldId: 'otherrefnum', 
                            value: 'Quantity accepted'
                        });
                }
            }
            return true; 
        }


        function fieldChanged(context){
            //updates a memo field to indicate that the item was selected
            var currentRecord = context.currentRecord; 
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId; 
            var line = context.line;
            if (sublistName === 'item' && sublistFieldName === 'item')
            currentRecord.setValue({
                fieldId: 'memo', 
                value: 'Item' + currentRecord.getCurrentSublistValue({
                    sublistId: 'item', 
                    fieldId: 'item'
                }) + 'is selected'
            });
        }

        function postSourcing(context){
            //updates price levels for that particular item
            var currentRecord = context.currentRecord; 
            var sublistName = context.sublistId; 
            var sublistFieldName = context.fieldId; 
            var line = context.line;
            if (sublistName === 'item' && sublistFieldName ==='item')
            if (currentRecord.getCurrentSublistValue({
                sublistId: sublistName, 
                fieldId: sublistFieldName
            })=== '39')
            if (currentRecord.getCurrentSublistValue({
                sublistId: sublistName, 
                fieldId: 'pricelevels'
            }) !== '1-1')
            currentRecord.setCurrentSublistValue({
                sublistId: sublistName, 
                fieldId: 'pricelevels', 
                value: '1-1'
            });
        }

        function lineInit(context){
            //when an existing partner is selected, the lineInit event changes the selected partner to a specific partner
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            if (sublistName === 'partners')
            currentRecord.setCurrentSublistValue({
                sublistId: sublistName, 
                fieldId: 'partner', 
                value: '55'
            });
        }

        function validateDelete(context){
            //update a memo field to indicate that the partner was deleted
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            if (sublistName === 'partners')
                if (currentRecord.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'partners'
                })=== '55')
                currentRecord.setValue({
                    fieldId: 'memo',
                    value: 'Removing partner sublist'
                }); 
            return true;
        }

        function validateInsert(context){
            //when adding a new partner or editing an existing partner, 
            //the validateInsert and validateLine events ensure that their contribution is set to 100%
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            if (sublistName === 'partners')
            if (currentRecord.getCurrentSublistValue({
                sublistId: sublistName, 
                fieldId: 'contribution'
            }) !== '100.0%'); 
            return true; 
        }

        function validateLine(context){
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId; 
            if (sublistName === 'partners')
                if (currentRecord.getCurrentSublistValue({
                    sublistId: sublistName, 
                    fieldId: 'contribution'
                })!== '100.0%')
                currentRecord.setCurrentSublistValue({
                    sublistId: sublistName, 
                    fieldId: 'contribution',
                    value: '100.0%'
                })
            return true;
        }

        function sublistChanged(context){
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId; 
            var op = context.operation;
            if (sublistName === 'item')
            currentRecord.setValue({
                fieldId: 'memo', 
                value: 'Total has changed to' + currentRecord.getValue({
                    fieldId: 'total'
                }) + 'with operation: ' +op
            });
        }

        return {
            pageInit: pageInit, 
            fieldChanged: fieldChanged, 
            postSourcing: postSourcing, 
            sublistChanged: sublistChanged, 
            lineInit: lineInit, 
            validateField: validateField, 
            validateLine: validateLine, 
            validateInsert: validateInsert, 
            validateDelete: validateDelete, 
            saveRecord: saveRecord
        };

    }
    );