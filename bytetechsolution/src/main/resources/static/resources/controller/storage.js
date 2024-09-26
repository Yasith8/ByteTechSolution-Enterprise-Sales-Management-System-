window.addEventListener('load', () => {
    refreshStorageTable();
    refreshStorageForm();
})


const refreshStorageTable = () => {
    //get gpu data
    storages = getServiceAjaxRequest('/storage/alldata')

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getStorageType },
        { dataType: 'function', propertyName: getStorageInterface },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableStorage, storages, displayPropertyList, refillStorageForm, divModifyButton)
        //table show with dataTable
    $('#tableStorage').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}

const refreshStorageForm = () => {
    storage = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/brandbycategory/STORAGE");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    storageInterfaces = getServiceAjaxRequest("/storageinterface/alldata")
    fillDataIntoSelect(selectStorageInterfaces, "Please Select Storage Interface", storageInterfaces, "name");

    storagetypes = getServiceAjaxRequest("/storagetype/alldata")
    fillDataIntoSelect(selectStorageType, "Please Select Storage Type", storagetypes, "name");


    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name");


    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectStorageType, selectStorageInterface, selectCapacity])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/STORAGE");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectStorageType, selectStorageInterface, selectCapacity], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name
}

const getStorageType = (ob) => {
    return ob.storagetype_id.name
}

const getStorageInterface = (ob) => {
    return ob.storageinterface_id.name
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

const refillStorageForm = (ob, rowIndex) => {

}