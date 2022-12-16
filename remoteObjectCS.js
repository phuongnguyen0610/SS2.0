//The following script interfaces with remote objects whenever it calls the NS database to create, load, copy or transform an object record
//The following client script loads a journal entry record and sets two line sublist lines when the saveRecord client event executes.
/** 
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 */

define(['N/record'],
    function (record){
        function saveRecord(context){
            var journalEntry = record.load({
                id: 6,
                type: record.TYPE.JOURNAL_ENTRY,
                isDynamic: true
            })
            journalEntry.selectNewLine({
                sublistId: 'line'
            });
            journalEntry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'account',
                value: 1
            });
            journalEntry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'debit',
                value: 1
            });
            journalEntry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'memo',
                value: 'Debit 1'
            });;
            journalEntry.commitLine({
                sublistId: 'line'
            });
            journalEntry.selectNewLine({
                sublistId: 'line'
            });
            journalEntry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'account',
                value: 1
            });
            journalEntry.setCurrentSublistValue({
                sublistId: 'line',   
                fieldId: 'credit',
                value: 1
          });
          journalEntry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'memo',
                value: "Credit 1"
          });
          journalEntry.commitLine({
                 sublistId: 'line'
          });
          var recordId = journalEntry.save();
          return true;
        }
        return {
            saveRecord: saveRecord
        }
    }
    );