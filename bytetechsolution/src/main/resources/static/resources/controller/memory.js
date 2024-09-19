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
}

const refreshMemoryForm = () => {

}