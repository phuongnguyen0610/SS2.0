/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */
//SuiteScript activities
define(['N/record', 'N/search', 'N/log'], 
    
    function(record, search, log){

    function getInputData(){
        return search.load({
            type: record.Type.INVENTORY_ITEM,
            id: '3458'
        })
    }

    function map(context){

        var searchResult = JSON.parse(context.value);
        var inventoryItemId = searchResult.id;
        // updateCustomField(inventoryItemId);
        context.write({
            key: inventoryItemId,
            value: searchResult
        });
        log.debug({
            title: 'inventoryItemId', 
            details: inventoryItemId
        })
    }

    function reduce(context){
        var itemId = context.key;
        var values = context.values.map(JSON.parse);
        log.debug(itemId,'Start Reduce Stage: ' + itemId);
        var itemRec = record.load({
            type: record.Type.INVENTORY_ITEM,
            id: itemId
        }); 
        var quantityavailable = 0;
        var location ='';
        log.debug('values.length', values.length);

        for (i=0; i<values.length; i++){
            log.debug(i, values[i]);
            quantityavailable = values[i].values.locationquantityavailable;
            location = values[i].values.inventorylocation.value;
            log.debug("location", location);
            log.debug("quantityavailable", quantityavailable);

            if (location ==10){
                log.debug("location is Chicago"); 
                itemRec.setValue({
                    fieldId:'custitem_kdl_chicago',
                    value: quantityavailable
                })
            }else if(location ==27){
                log.debug("location is Toronto");
                itemRec.setValue({
                    fieldId: 'custitem_kdl_toronto',
                    value: quantityavailable
                })
            }
            itemRec.save();
        }
    }
    
    return{

        getInputData: getInputData, 
        map: map, 
        reduce: reduce

    }
}
)