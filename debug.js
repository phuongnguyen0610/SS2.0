require(['N/currentRecord', 'N/record'], function(currentRecord, record){
    function myAfterSubmit(context){
        if (context.type !== context.UserEventType.CREATE)
        return;

        var newSalesOrderRecord = context.newRecord;
        var salesOrderTransactionDate = newSalesOrderRecord.getValue({
            fieldId: 'trandate'
        });

        console.log('salesOrderTransactionDate', salesOrderTransactionDate)
        
        //load customer record
        var custId = newSalesOrderRecord.getValue({
                        fieldId: 'entity'
                    });	
        var customerRecord = record.load({
                    type: record.Type.CUSTOMER,
                    id: custId,
                    isDynamic: true
                    });
        var resellerExpirationDate = customerRecord.getValue({
            fieldId: 'custentity_kdl_reseller_expiration_date'
        });
;
        console.log("resellerExpirationDate", resellerExpirationDate);

        var resaleNumber = customerRecord.getValue({
            fieldId: 'custentity_kdl_resale_number'
        });

        console.log("resaleNumber", resaleNumber);
        
        //load item record
        var numLines = newSalesOrderRecord.getLineCount({
            sublistId: 'item'
          });
          if(numLines >0){
              for(i = 0 ; i<numLines ; i++){						
                  var internalId = newSalesOrderRecord.getSublistValue({
                      sublistId: 'item',
                      fieldId: 'item',
                      line: i
                  });

                  console.log("internalId", internalId);

                  var itemrecord = record.load({
                    type: 'inventoryitem',
                    id: internalId,
                  });
                  
                  var taxExempt = itemrecord.getValue({
                    fieldId: 'custitem_kdl_tax_exempt'
                  });

                  console.log('taxExempt', taxExempt);

                  if (resellerExpirationDate && resaleNumber && salesOrderTransactionDate<resellerExpirationDate){
                    if (taxExempt){
                        itemrecord.setValue({
                            fieldId: 'taxcode',
                            value: -8
                        });
                    }
                }
            }
        }

        try {
            var newSalesOrderId = newSalesOrderRecord.save();

            console.log('Sales order record created successfully. New sales order record ID: ', newSalesOrderId);
            
         } catch (e) {
             log.error({
                 title: e.name,
                    details: e.message
             }); 
         } 
              
    }

    return{
        afterSubmit: myAfterSubmit
    };
});