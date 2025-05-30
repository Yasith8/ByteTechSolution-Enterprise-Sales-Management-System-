window.addEventListener('load', () => {
    refreshInventoryTable();
    refreshFilterForm();
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
    fillDataIntoTable(tableInventory, inventories, displayPropertyList, refillFilterForm)
        //table show with dataTable
    $('#tableInventory').dataTable();
}

const refreshFilterForm = () => {
    route = "";

    categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Select Item Category", categories, "name")

    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Select Item Brand", brands, "name")


    selectCategory.addEventListener('change', () => {
        let selectedCategory = selectValueHandler(selectCategory);
        let selectedBrand = selectValueHandler(selectBrand);

        cpusockets = getServiceAjaxRequest("/cpusocket/alldata");
        fillDataIntoSelect(selectCpuSocket, "Select CPU Socket", cpusockets, "name")

        cpuseries = getServiceAjaxRequest("/cpuseries/alldata");
        fillDataIntoSelect(selectCpuSeries, "Select CPU Series", cpuseries, "name")

        cpugenerations = getServiceAjaxRequest("/cpugeneration/alldata");
        fillDataIntoSelect(selectCpuGeneration, "Select CPU Socket", cpusockets, "name")

        cpusuffixs = getServiceAjaxRequest("/cpusuffix/alldata");
        fillDataIntoSelect(selectCpuSuffix, "Select CPU Suffix", cpusuffixs, "name")

        route = `/${(selectedCategory.name).toLowerCase()}/filteritem?brand_id=${selectedBrand.id}`

        if (selectedCategory.name == "Processor") {
            console.log("Processor Selected");
            //show/hide fields
            elementHide([colCpuTotalCore, colCpuCache, colCpuSocket, colCpuSeries, colCpuGeneration, colCpuSuffix], true)
            elementHide([colCasingWidth, colCasingHeight, colCasingDepth, colCasingMotherboardFormFactor, colCasingColor, colCasingMaterial, colMboardMaxCapacity, colMboardCpuSocket, colMotherboardSeries, colotherboardType, colMotherboardFormFactor, colMotherboardMemoryType, colMBoardInterface], false)

            route = `/${(selectedCategory.name).toLowerCase()}/filteritem?brand_id=${selectedBrand.id}&totalcore=${numberCpuTotalCore?.value}&cache=${numbercache?.value}`

            console.log("Route being set:", route);

        }
        if (selectedCategory.name == "Motherboard") {
            console.log("Motherboard Selected")
            elementHide([colMboardMaxCapacity, colMboardCpuSocket, colMotherboardSeries, colotherboardType, colMotherboardFormFactor, colMotherboardMemoryType, colMBoardInterface], true)
            elementHide([colCasingWidth, colCasingHeight, colCasingDepth, colCasingMotherboardFormFactor, colCasingColor, colCasingMaterial, colCpuTotalCore, colCpuCache, colCpuSocket, colCpuSeries, colCpuGeneration, colCpuSuffix], false)

        }
    })
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

const refillFilterForm = () => {

}

const applyFilterHandler = () => {
    console.log("ROUTE>>>>>", route)
    filteredItems = getServiceAjaxRequest(route)
}