function validateLine(scriptContext) {
    if (scriptContext.sublistId == 'item') {
    var salesOrder = scriptContext.currentRecord;
    var basePrice = getItemBasePrice();
    var qty = salesOrder.getCurrentSublistValue({
    sublistId: 'item',
    fieldId : 'quantity',
    });
    salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId : 'custcol_media_value',
    value : qty * basePrice
    });
    }
    return true;
    }