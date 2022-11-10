require(['N/currentRecord', 'N/record'], function(currentRecord, record){
    var newSalesOrderRecord = currentRecord.get();
    //       var taxExempt = thisrecord.getValue({fieldId: 'custitem_kdl_tax_exempt'});
    // console.log('aaaa :' + taxExempt);
    // if (!taxExempt){
    //     console.log("hello")
    // }else{
    //     console.log("true")
    // }
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
              var itemrecord = record.load({
                type: 'inventoryitem',
                id: internalId
            });
            var taxExempt = itemrecord.getValue({fieldId: 'custitem_kdl_tax_exempt'});

              console.log("taxExempt", taxExempt);
          }
    }
          });

        //   salesOrder.setCurrentSublistValue({
        //     sublistId: 'item',
        //     fieldId: 'taxcode',
        //     value: taxid
        // });
        // var recId = salesOrder.save();
        
// var custId = newRecord.getValue({
//     fieldId: 'entity'
// });	
// customerRecord = record.load({
// type: record.Type.CUSTOMER,
// id: custId,
// isDynamic: true
// });