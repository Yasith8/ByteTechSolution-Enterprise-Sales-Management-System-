window.addEventListener('load', () => {
    refreshMemoryTable();
    refreshMemoryForm();
})

const refreshMemoryTable = () => {
    memories = getServiceAjaxRequest('/memory/alldata');

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'text', propertyName: 'purchaseprice' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'text', propertyName: 'speed' },
        { dataType: 'function', propertyName: getMemoryType },
        { dataType: 'function', propertyName: getMemoryFormFactor },
        { dataType: 'function', propertyName: getMemoryCapacity },
        { dataType: 'function', propertyName: getItemStatus },
    ]
    fillDataIntoTable(tableMemory, memories, displayPropertyList, refillMemoryForm, divModifyButton)
        //table show with dataTable
    $('#tableMemory').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshMemoryForm = () => {

}



const getBrandName = (ob) => {
    return ob.brand_id.name
}
const getMemoryType = (ob) => {
    return ob.memorytype_id.name
}
const getMemoryFormFactor = (ob) => {
    return ob.memoryformfactor_id.name
}
const getMemoryCapacity = (ob) => {
    return ob.capacity_id.name
}
const getItemStatus = (ob) => {
    if (ob.itemstatus_id.name == 'Available') {
        return '<p class="item-status-available">' + ob.itemstatus_id.name + '</p>';
    }

    if (ob.itemstatus_id.name == 'Low-Stock') {
        return '<p class="item-status-resign">' + ob.itemstatus_id.name + '</p>'
    }


    if (ob.itemstatus_id.name == 'Unavailable') {
        return '<p class="item-status-delete">' + ob.itemstatus_id.name + '</p>'
    } else {
        return '<p class="item-status-other">' + ob.itemstatus_id.name + '</p>'
    }
}