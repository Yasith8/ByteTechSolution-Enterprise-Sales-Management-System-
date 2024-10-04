window.addEventListener('load', () => {
    refreshStorageTable();
    refreshStorageForm();
})


const refreshStorageTable = () => {
    //get storage data
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

    brands = getServiceAjaxRequest("/brand/brandbycategory/Storage");
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

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

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
    brands = getServiceAjaxRequest("/brand/brandbycategory/Storage");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name", ob.itemstatus_id.name);

    storageinterfaces = getServiceAjaxRequest("/storageinterface/alldata")
    fillDataIntoSelect(selectStorageInterface, "Please Select Storage Interface", storageinterfaces, "name", ob.storageinterface_id.name);

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name", ob.capacity_id.name);

    storagetypes = getServiceAjaxRequest("/storagetype/alldata")
    fillDataIntoSelect(selectStorageType, "Please Select Storage Type", storagetypes, "name", ob.storagetype_id.name);

    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectStorageType, selectStorageInterface, selectCapacity], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
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


const checkStorageFormUpdates = () => {
    updates = "";

    if (storage.itemname != oldStorage.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (storage.purchaseprice != oldStorage.purchaseprice) {
        updates = updates + "Purchase Price is Changed \n";
    }
    if (storage.profitrate != oldStorage.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (storage.warranty != oldStorage.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (storage.rop != oldStorage.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (storage.roq != oldStorage.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (storage.storageinterface_id.name != oldStorage.storageinterface_id.name) {
        updates = updates + "Storage Interface is Changed \n";
    }
    if (storage.description != oldStorage.description) {
        updates = updates + "Description is Changed \n";
    }
    if (storage.brand_id.name != oldStorage.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (storage.storagetype_id.name != oldStorage.storagetype_id.name) {
        updates = updates + "Storage Type is Changed \n";
    }
    if (storage.capacity_id.name != oldStorage.capacity_id.name) {
        updates = updates + "Capacity is Changed \n";
    }
    if (storage.itemstatus_id.name != oldStorage.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonStorageUpdate = () => {
    //check form error
    let errors = checkStorageInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkStorageFormUpdates();

        //check there is no updates or any updations
        if (updates == "") {
            alert("Nothing Updates")
        } else {

            //get conformation from user to made updation
            let userConfirm = confirm("Are You Sure to Update this Changes? \n" + updates);

            //if user conform
            if (userConfirm) {
                //call put service requestd  -this use for updations
                let putServiceResponse;

                $.ajax("/storage", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(storage),


                    success: function(successResponseOb) {
                        putServiceResponse = successResponseOb;
                    },

                    error: function(failedResponseOb) {
                        putServiceResponse = failedResponseOb;
                    }

                });
                //check put service response
                if (putServiceResponse == "OK") {
                    alert("Updated Successfully");

                    //hide the moadel
                    $('#storageAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshStorageTable();
                    //reset the Item form
                    formStorage.reset();
                    //Item form refresh
                    refreshStorageForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshStorageForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Storage Form  has Following Errors..\n" + errors)
    }


}

const deleteStorage = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Storage? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/storage", {
            type: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(ob),
            async: false,

            success: function(data) {
                deleteServiceResponse = data
            },

            error: function(errData) {
                deleteServiceResponse = errData;
            }
        })

        //if delete response ok alert the success message and close the modal and refreash item table
        //so because of that we can see realtime update
        if (deleteServiceResponse == "OK") {
            alert("Delete Successfullly");
            $('#storageAddModal').modal('hide');
            refreshStorageTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}

const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#storageAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formStorage.reset();
        divModifyButton.className = 'd-none';

        refreshStorageForm();
    }
}