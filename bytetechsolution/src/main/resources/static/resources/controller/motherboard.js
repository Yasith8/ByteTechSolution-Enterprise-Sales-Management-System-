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
    motherboard = new Object();

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

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], true);
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

const salePriceCalculator = () => {
    decimalSalesPrice.disabled = true;
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', 'motherboard', 'salesprice')
}

const refillItemForm = (ob, rowIndex) => {
    $('#motherboardAddModal').modal('show');
    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    motherboard = JSON.parse(JSON.stringify(ob));
    oldMotherboard = ob;

    //asign itemcode
    staticBackdropLabel.textContent = motherboard.itemcode;

    //assign item name
    textItemName.value = motherboard.itemname;
    //assign purchase price
    decimalPurchasePrice.value = motherboard.purchaseprice;
    //assign profit rate
    numberProfitRate.value = motherboard.profitrate;
    //assign sales price
    decimalSalesPrice.value = motherboard.salesprice;
    //assign rop 
    numberROP.value = motherboard.rop;
    //assign roq 
    numberROQ.value = motherboard.roq;
    //assign warranty
    numberWarranty.value = motherboard.warranty;
    //asign description
    textDescription.value = motherboard.description;
    //assign max capacity
    numberMaxCapacity.value = motherboard.maxcapacity


    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name", ob.motherboardformfactor_id.name);

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Supported Memory Type", memorytypes, "name", ob.memorytype_id.name);

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name", ob.cpusocket_id.name);

    motherboardseries = getServiceAjaxRequest("/motherboardseries/alldata");
    fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardseries, "name", ob.motherboardseries_id.name)

    motherboardTypes = getServiceAjaxRequest("/motherboardtype/alldata");
    fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name", ob.motherboardtype_id.name)



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


    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/MOTHERBOARD");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;

}