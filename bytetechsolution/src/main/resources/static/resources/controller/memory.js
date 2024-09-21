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


const refillMemoryForm = (ob, rowIndex) => {
    $('#memoryAddModal').modal('show');
    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    memory = JSON.parse(JSON.stringify(ob));
    oldMemory = ob;

    //asign itemcode
    staticBackdropLabel.textContent = memory.itemcode;

    //assign item name
    textItemName.value = memory.itemname;
    //assign purchase price
    decimalPurchasePrice.value = memory.purchaseprice;
    //assign profit rate
    numberProfitRate.value = memory.profitrate;
    //assign sales price
    decimalSalesPrice.value = memory.salesprice;
    //assign rop 
    numberROP.value = memory.rop;
    //assign roq 
    numberROQ.value = memory.roq;
    //assign warranty
    numberWarranty.value = memory.warranty;
    //asign description
    textDescription.value = memory.description;

    numberSpeed.value = memory.speed;

    brands = getServiceAjaxRequest("/brand/brandbycategory/Memory");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name", ob.itemstatus_id.name);

    memoryformfactors = getServiceAjaxRequest("/memoryformfactor/alldata")
    fillDataIntoSelect(selectMemoryFormFactor, "Please Select Memory Form Factor", memoryformfactors, "name", ob.memoryformfactor_id.name);

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Select Memory Type", memorytypes, "name", ob.memorytype_id.name);

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name", ob.capacity_id.name);


    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/MEMORY");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;


}


const checkMemoryInputErrors = () => {
    let errors = "";

    if (memory.itemname == null) {
        errors = errors + "GPU Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (memory.purchaseprice == null) {
        errors = errors + "Purchase Price can't be Null...!\n";
        decimalPurchasePrice.classList.add("is-invalid");
    }
    if (memory.salesprice == null) {
        errors = errors + "Sales Price can't be Null...!\n";
        decimalSalesPrice.classList.add("is-invalid");
    }

    if (memory.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (memory.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (memory.speed == null) {
        errors = errors + "Memory Speed can't be Null...!\n";
        numberSpeed.classList.add("is-invalid");
    }

    if (memory.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (memory.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (memory.memorytype_id == null) {
        errors = errors + "Memory Type can't be Null...!\n";
        selectGpuType.classList.add("is-invalid");
    }
    if (memory.motherboardformfactor_id == null) {
        errors = errors + "Motherboard Form Factor can't be Null...!\n";
        selectMotherboardFormFactor.classList.add("is-invalid");
    }
    if (memory.capacity_id == null) {
        errors = errors + "GPU Capacity can't be Null...!\n";
        selectCapacity.classList.add("is-invalid");
    }

    return errors;
}