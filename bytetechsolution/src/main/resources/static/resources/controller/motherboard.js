window.addEventListener('load', () => {
    refreshMotherboardTable();
    refreshMotherboardForm();
})

const refreshMotherboardTable = () => {

    motherboards = getServiceAjaxRequest("/motherboard/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'text', propertyName: 'purchaseprice' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'function', propertyName: getMotherboardSeries },
        { dataType: 'function', propertyName: getMotherboardType },
        { dataType: 'function', propertyName: getMotherboardFormFactor },
        { dataType: 'function', propertyName: getMemoryType },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getItemStatus },
    ]


}
const refreshMotherboardForm = () => {

}