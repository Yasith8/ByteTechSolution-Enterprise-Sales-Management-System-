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
    $('#storageForm').modal('show');
    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectStorageType, selectStorageInterface, selectCapacity])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    storage = JSON.parse(JSON.stringify(ob))
    oldStorage = ob;


    //asign itemcode
    staticBackdropLabel.textContent = storage.itemcode;

    //assign item name
    textItemName.value = storage.itemname;
    //assign profit rate
    numberProfitRate.value = storage.profitrate;
    //assign rop 
    numberROP.value = storage.rop;
    //assign roq 
    numberROQ.value = storage.roq;
    //assign warranty
    numberWarranty.value = storage.warranty;
    //asign description
    textDescription.value = storage.description;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name", ob.itemstatus_id.name);

    storageinterfaces = getServiceAjaxRequest("/storageinterface/alldata")
    fillDataIntoSelect(selectStorageInterface, "Please Select Storage Interface", storageinterfaces, "name", ob.storageinterface_id.name);

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name", ob.capacity_id.name);

    storagetypes = getServiceAjaxRequest("/storagetype/alldata")
    fillDataIntoSelect(selectGpuType, "Please Select Storage Type", storagetypes, "name", ob.storagetype_id.name);

    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectStorageType, selectStorageInterface, selectCapacity], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/STORAGE");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectStorageType, selectStorageInterface, selectCapacity], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;

}

const checkStorageInputErrors = () => {
    let errors = "";

    if (storage.itemname == null) {
        errors = errors + "Storage Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (storage.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (storage.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (storage.storageinterface_id == null) {
        errors = errors + "Interface can't be Null...!\n";
        selectStorageInterface.classList.add("is-invalid");
    }
    if (storage.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (storage.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (storage.storagetype_id == null) {
        errors = errors + "Storage Type can't be Null...!\n";
        selectStorageType.classList.add("is-invalid");
    }
    if (storage.capacity_id == null) {
        errors = errors + "Storage Capacity can't be Null...!\n";
        selectCapacity.classList.add("is-invalid");
    }

    return errors;
}

const buttonStorageSubmit = () => {
    let errors = checkStorageInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/storage", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(storage),
                async: false,

                success: function(data) {
                    console.log("success", data);
                    postServiceResponce = data;
                },

                error: function(resData) {
                    console.log("Fail", resData);
                    postServiceResponce = resData;
                }

            });

            //if response is success
            if (postServiceResponce == "OK") {
                alert("Save successfully...!");
                //hide the model
                $('#storageAddModal').modal('hide');
                //reset the Item form
                formStorage.reset();
                //refreash Item form
                refreshStorageForm();
                //refreash Item table
                refreshStorageTable();
            } else {
                alert("Fail to submit Storage form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}


const checkGpuFormUpdates = () => {
    updates = "";

    if (gpu.itemname != oldGpu.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (gpu.purchaseprice != oldGpu.purchaseprice) {
        updates = updates + "Purchase Price is Changed \n";
    }
    if (gpu.profitrate != oldGpu.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (gpu.warranty != oldGpu.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (gpu.rop != oldGpu.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (gpu.roq != oldGpu.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (gpu.interface_id.name != oldGpu.interface_id.name) {
        updates = updates + "Interface is Changed \n";
    }
    if (gpu.description != oldGpu.description) {
        updates = updates + "Description is Changed \n";
    }
    if (gpu.brand_id.name != oldGpu.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (gpu.gpuchipset_id.name != oldGpu.gpuchipset_id.name) {
        updates = updates + "GPU Chipset is Changed \n";
    }
    if (gpu.gputype_id.name != oldGpu.gputype_id.name) {
        updates = updates + "GPU Type is Changed \n";
    }
    if (gpu.gpuseries_id.name != oldGpu.gpuseries_id.name) {
        updates = updates + "GPU Series is Changed \n";
    }
    if (gpu.motherboardformfactor_id.name != oldGpu.motherboardformfactor_id.name) {
        updates = updates + "Motherboard Form Factor is Changed \n";
    }
    if (gpu.capacity_id.name != oldGpu.capacity_id.name) {
        updates = updates + "Capacity is Changed \n";
    }
    if (gpu.itemstatus_id.name != oldGpu.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}