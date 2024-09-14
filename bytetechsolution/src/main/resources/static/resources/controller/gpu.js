window.addEventListener('load', () => {
    refreshGpuTable();
    refreshGpuForm();
})


const refreshGpuTable = () => {

    //get gpu data
    gpus = getServiceAjaxRequest('/gpu/alldata')

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'text', propertyName: 'purchaseprice' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'function', propertyName: getGpuSeries },
        { dataType: 'function', propertyName: getGpuType },
        { dataType: 'function', propertyName: getMotherboardFormFactor },
        { dataType: 'function', propertyName: getInterface },
        { dataType: 'function', propertyName: getGpuChipset },
        { dataType: 'function', propertyName: getGpuCapacity },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableGpu, gpus, displayPropertyList, refillGpuForm, divModifyButton)
        //table show with dataTable
    $('#tableGpu').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}


const refreshGpuForm = () => {
    gpu = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name");

    gputypes = getServiceAjaxRequest("/gputype/alldata")
    fillDataIntoSelect(selectGpuType, "Please Select GPU Type", gputypes, "name");

    interfaces = getServiceAjaxRequest("/interface/alldata")
    fillDataIntoSelect(selectInterface, "Please Select Interface", interfaces, "name");

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name");

    gpuchipsets = getServiceAjaxRequest("/gpuchipset/alldata")
    fillDataIntoSelect(selectGpuChipset, "Please Select GPU Chipset", gpuchipsets, "name");

    fillDataIntoSelect(selectGpuSeries, "Select GPU Chipset First", [], "name")

    selectGpuChipset.addEventListener('change', () => {
        const gpuchipset = selectValueHandler(selectGpuChipset);
        gpuseries = getServiceAjaxRequest("/gpuseries/gpuseriesbygpuchipset/" + gpuchipset.name);
        fillDataIntoSelect(selectGpuSeries, "Select GPU Series", gpuseries, "name");
    })

    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardFormFactor, selectBrand, selectItemStatus, selectGpuType, selectInterface, selectCapacity, selectGpuChipset, selectGpuSeries])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/GPU");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardFormFactor, selectBrand, selectItemStatus, selectGpuType, selectInterface, selectCapacity, selectGpuChipset, selectGpuSeries], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getGpuSeries = (ob) => {
    return ob.gpuseries_id.name;
}

const getGpuType = (ob) => {
    return ob.gputype_id.name;
}

const getMotherboardFormFactor = (ob) => {
    return ob.motherboardformfactor_id.name;
}

const getInterface = (ob) => {
    return ob.interface_id.name;
}

const getGpuChipset = (ob) => {
    return ob.gpuchipset_id.name;
}

const getGpuCapacity = (ob) => {
    return ob.capacity_id.name;
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

const refillGpuForm = (ob, rowIndex) => {
    $('#gpuAddModal').modal('show');
    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardFormFactor, selectBrand, selectItemStatus, selectGpuType, selectInterface, selectCapacity, selectGpuChipset, selectGpuSeries])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    gpu = JSON.parse(JSON.stringify(ob));
    oldGpu = ob;

    //asign itemcode
    staticBackdropLabel.textContent = gpu.itemcode;

    //assign item name
    textItemName.value = gpu.itemname;
    //assign purchase price
    decimalPurchasePrice.value = gpu.purchaseprice;
    //assign profit rate
    numberProfitRate.value = gpu.profitrate;
    //assign sales price
    decimalSalesPrice.value = gpu.salesprice;
    //assign rop 
    numberROP.value = gpu.rop;
    //assign roq 
    numberROQ.value = gpu.roq;
    //assign warranty
    numberWarranty.value = gpu.warranty;
    //asign description
    textDescription.value = gpu.description;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name", ob.motherboardformfactor_id.name);

    gputypes = getServiceAjaxRequest("/gputype/alldata")
    fillDataIntoSelect(selectGpuType, "Please Select GPU Type", gputypes, "name", ob.gputype_id.name);

    interfaces = getServiceAjaxRequest("/interface/alldata")
    fillDataIntoSelect(selectInterface, "Please Select Interface", interfaces, "name", ob.interface_id.name);

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name", ob.capacity_id.name);

    gpuchipsets = getServiceAjaxRequest("/gpuchipset/alldata")
    fillDataIntoSelect(selectGpuChipset, "Please Select GPU Chipset", gpuchipsets, "name", ob.gpuchipset_id.name);

    fillDataIntoSelect(selectGpuSeries, "Select GPU Series", [], "name", ob.gpuseries_id.name);

    selectGpuChipset.addEventListener('change', () => {
        const gpuchipset = selectValueHandler(selectGpuChipset);
        gpuseries = getServiceAjaxRequest("/gpuseries/gpuseriesbygpuchipset/" + gpuchipset.name);
        fillDataIntoSelect(selectGpuSeries, "Select GPU Series", gpuseries, "name");
    })



    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardFormFactor, selectBrand, selectItemStatus, selectGpuType, selectInterface, selectCapacity, selectGpuChipset, selectGpuSeries], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/GPU");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardFormFactor, selectBrand, selectItemStatus, selectGpuType, selectInterface, selectCapacity, selectGpuChipset, selectGpuSeries], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;


}