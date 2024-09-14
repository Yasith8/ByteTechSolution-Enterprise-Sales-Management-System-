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
        const cpuchipset = selectValueHandler(selectGpuChipset);
        gpuseries = getServiceAjaxRequest("/motherboardseries/motherboardseriesbycpusocket/" + cpuchipset.name);
        fillDataIntoSelect(selectGpuSeries, "Select GPU Series", gpuseries, "name");
    })

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
    return ob.gpucapacity_id.name;
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