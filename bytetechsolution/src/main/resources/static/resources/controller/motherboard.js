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

    fillDataIntoTable(tableMotherboard, motherboards, displayPropertyList, refillItemForm, divModifyButton)
        //table show with dataTable
    $('#tableMotherboard').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}
const refreshMotherboardForm = () => {
    processor = new Object();

    processor = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name");

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name");

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Supported Memory Type", memorytypes, "name");

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

    fillDataIntoSelect(selectMotherboardSeries, "Select Processor Socket First", [], "name")
    fillDataIntoSelect(selectMotherboardType, "Select Motherboard Series First", [], "name")



    selectCpuSocket.addEventListener('change', () => {
        const cpusocket = selectValueHandler(selectCpuSocket);
        motherboardSeries = getServiceAjaxRequest("/motherboardseries/motherboardseriesbycpusocket/" + cpusocket.name);
        fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardSeries, "name");

        selectMotherboardSeries.addEventListener('change', () => {
            const motherboardseries = selectValueHandler(selectMotherboardSeries);
            motherboardTypes = getServiceAjaxRequest("/motherboardtype/motherboardtypebymotherboardseries/" + motherboardseries.name);
            fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name");
        })

    })


    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/MOTHERBOARD");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getMotherboardSeries = (ob) => {
    return ob.motherboardseries_id.name;
}

const getMotherboardType = (ob) => {
    return ob.motherboardtype_id.name;
}

const getMotherboardFormFactor = (ob) => {
    return ob.motherboardformfactor_id.name;
}

const getMemoryType = (ob) => {
    return ob.memorytype_id.name;
}

const getCpuSocket = (ob) => {
    return ob.cpusocket_id.name;
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

const refillItemForm = () => {

}