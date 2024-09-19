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
    memory = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Memory";

    brands = getServiceAjaxRequest("/brand/brandbycategory/Memory");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    memoryformfactors = getServiceAjaxRequest("/memoryformfactor/alldata")
    fillDataIntoSelect(selectMemoryFormFactor, "Please Select Memory Form Factor", memoryformfactors, "name");

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Select Memory Type", memorytypes, "name");

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name");

    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/MEMORY");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
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


const refillMemoryForm = () => {

}