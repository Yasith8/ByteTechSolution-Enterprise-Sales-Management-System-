window.addEventListener('load', () => {
    refreshInventoryTable()
})

const refreshInventoryTable = () => {
    inventories = getServiceAjaxRequest("/inventory/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'serialno' },
        { dataType: 'function', propertyName: getCategoryId },
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'function', propertyName: getStatus },
    ];

    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    fillDataIntoTable(tableInventory, inventories, displayPropertyList, refillGrnForm)
        //table show with dataTable
    $('#tableInventory').dataTable();
}

const getCategoryId = (ob) => {
    return ob.category_id.name;
}

const getStatus = (ob) => {
    if (ob.status) {
        return '<p class="common-status-available"> Available</p>';
    } else {
        return '<p class="common-status-delete">Not Available</p>'
    }
}

const refillGrnForm = () => {

}