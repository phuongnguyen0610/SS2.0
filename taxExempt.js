/**
 * *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    'N/record', 
    'N/currentRecord'
],function(record, currentRecord){

    function myBeforeSubmit(context){
        // if (context.type !== context.UserEventType.CREATE)
        // return;

        // var recordId = context.newRecord.id;

                //load sales order
        // var newSalesOrder = record.load({
        //     type: record.Type.SALES_ORDER,
        //     id: recordId,
        //     isDynamic: true //false
        //     });
            var newSalesOrder = context.newRecord;
            var salesOrderTransactionDate = newSalesOrder.getValue({
                fieldId: 'trandate'
            });
            log.debug({
                title: 'salesOrderTransactionDate', 
                details: salesOrderTransactionDate
            })
        //load customer record
        var custId = newSalesOrder.getValue({
                        fieldId: 'entity'
                    });	
        var customerRecord = record.load({
                    type: record.Type.CUSTOMER,
                    id: custId,
                    isDynamic: true //false
                    });
        var resellerExpirationDate = customerRecord.getValue({
            fieldId: 'custentity_kdl_reseller_expiration_date'
        });

        log.debug({
            title: 'resellerExpirationDate', 
            details: resellerExpirationDate
        })

        var resaleNumber = customerRecord.getValue({
            fieldId: 'resalenumber'
        });
        log.debug({
            title: 'resaleNumber', 
            details: resaleNumber
        })
        //load item record
        var numLines = newSalesOrder.getLineCount({
            sublistId: 'item'
          });
          
          if(numLines >0){
              for(i = 0 ; i<numLines ; i++){						
                  var internalId = newSalesOrder.getSublistValue({
                      sublistId: 'item',
                      fieldId: 'item',
                      line: i
                  });

                //   log.debug({tittle: 'internal id', details: internalId})
                  var itemrecord = record.load({
                    type: 'inventoryitem',
                    id: internalId,
                  });
                  var taxExempt = itemrecord.getValue({
                    fieldId: 'custitem_kdl_tax_exempt'
                  });
                //   log.debug({tittle: 'taxExempt', details: taxExempt});

                  var taxCode = newSalesOrder.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                            line: i
                  });

                  log.debug({
                      title: 'taxCode',
                      details: taxCode
                  });
                    if (resellerExpirationDate && resaleNumber && (salesOrderTransactionDate<resellerExpirationDate)){
                    if (taxExempt==true){
                        newSalesOrder.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                            value: -8, 
                            line: i
                        });
                    }
                }
              }
        }

        // try {
        //     var newSalesOrderId = newSalesOrder.save();
        //     log.debug({    
        //           title: 'Sales order record created successfully', 
        //            details: 'New sales order record ID:  ' + newSalesOrderId
        //     });
            
        //  } catch (e) {
        //      log.error({
        //          title: e.name,
        //             details: e.message
        //      }); 
        //  } 
              
    }

    return{
        beforeSubmit: myBeforeSubmit
    };
});







