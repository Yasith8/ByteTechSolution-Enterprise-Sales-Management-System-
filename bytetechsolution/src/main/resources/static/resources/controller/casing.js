window.addEventListener('load', () => {
    refreshCasingTable();
    refreshCasingForm();
})


const refreshCasingTable = () => {

    //get casing data
    casings = getServiceAjaxRequest('/casing/alldata')

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getCaseMaterial },
        { dataType: 'function', propertyName: getCaseColor },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableCasing, casings, displayPropertyList, refillCasingForm, divModifyButton)
        //table show with dataTable
    $('#tableCasing').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}


const refreshCasingForm = () => {
    casing = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/brandbycategory/casing");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    casematerials = getServiceAjaxRequest("/casematerial/alldata")
    fillDataIntoSelect(selectCaseMaterial, "Please Select Case Material", casematerials, "name");

    casecolors = getServiceAjaxRequest("/casecolor/alldata")
    fillDataIntoSelect(selectCaseColor, "Please SelectCase Color", casecolors, "name");

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name");


    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMotherboardFormFactor, selectCaseColor, selectCaseMaterial])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMotherboardFormFactor, selectCaseColor, selectCaseMaterial], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getCaseMaterial = (ob) => {
    return ob.casematerial_id.name;
}

const getCaseColor = (ob) => {
    return ob.casecolor_id.name;
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

const refillCasingForm = (ob, rowIndex) => {
    $('#casingAddModal').modal('show');
    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMotherboardFormFactor, selectCaseColor, selectCaseMaterial])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    casing = JSON.parse(JSON.stringify(ob));
    oldCasing = ob;

    //asign itemcode
    staticBackdropLabel.textContent = casing.itemcode;

    //assign item name
    textItemName.value = casing.itemname;
    //assign profit rate
    numberProfitRate.value = casing.profitrate;
    //assign rop 
    numberROP.value = casing.rop;
    //assign roq 
    numberROQ.value = casing.roq;
    //assign warranty
    numberWarranty.value = casing.warranty;
    //asign description
    textDescription.value = casing.description;

    numberHeight.value = casing.height;
    numberWidth.value = casing.width;
    numberDepth.value = casing.depth;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Casing");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    casematerials = getServiceAjaxRequest("/casematerial/alldata")
    fillDataIntoSelect(selectCaseMaterial, "Please Select Case Material", casematerials, "name", ob.casematerial_id.name);

    casecolors = getServiceAjaxRequest("/casecolor/alldata")
    fillDataIntoSelect(selectCaseColor, "Please SelectCase Color", casecolors, "name", ob.casecolor_id.name);

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name", ob.motherboardformfactor_id.name);

    inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMotherboardFormFactor, selectCaseColor, selectCaseMaterial], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMotherboardFormFactor, selectCaseColor, selectCaseMaterial], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;


}

const checkCasingInputErrors = () => {
    let errors = "";

    if (casing.itemname == null) {
        errors = errors + "Case Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (casing.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }
    if (casing.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }
    if (casing.width == null) {
        errors = errors + "Width can't be Null...!\n";
        numberWidth.classList.add("is-invalid");
    }
    if (casing.height == null) {
        errors = errors + "Height can't be Null...!\n";
        numberHeight.classList.add("is-invalid");
    }
    if (casing.depth == null) {
        errors = errors + "Depth can't be Null...!\n";
        numberDepth.classList.add("is-invalid");
    }
    if (casing.casecolor_id == null) {
        errors = errors + "Case Coloor can't be Null...!\n";
        selectCaseColor.classList.add("is-invalid");
    }
    if (casing.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (casing.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (casing.motherboardformfactor_id == null) {
        errors = errors + "Motherboard Form Factor can't be Null...!\n";
        selectMotherboardFormFactor.classList.add("is-invalid");
    }
    if (casing.casematerial_id == null) {
        errors = errors + "Case Material can't be Null...!\n";
        selectCaseMaterial.classList.add("is-invalid");
    }

    return errors;
}

const buttonCasingSubmit = () => {
    let errors = checkCasingInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/casing", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(casing),
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
                $('#casingAddModal').modal('hide');
                //reset the Item form
                formCasing.reset();
                //refreash Item form
                refreshCasingForm();
                //refreash Item table
                refreshCasingTable();
            } else {
                alert("Fail to submit Casing form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}

const checkCasingFormUpdates = () => {
    updates = "";

    if (casing.itemname != oldCasing.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (casing.profitrate != oldCasing.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (casing.warranty != oldCasing.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (casing.rop != oldCasing.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (casing.roq != oldCasing.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (casing.casecolor_id.name != oldCasing.casecolor_id.name) {
        updates = updates + "Case Color is Changed \n";
    }
    if (casing.description != oldCasing.description) {
        updates = updates + "Description is Changed \n";
    }
    if (casing.width != oldCasing.width) {
        updates = updates + "width is Changed \n";
    }
    if (casing.height != oldCasing.height) {
        updates = updates + "height is Changed \n";
    }
    if (casing.depth != oldCasing.depth) {
        updates = updates + "depth is Changed \n";
    }
    if (casing.brand_id.name != oldCasing.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (casing.casematerial_id.name != oldCasing.casematerial_id.name) {
        updates = updates + "Case Material is Changed \n";
    }
    if (casing.motherboardformfactor_id.name != oldCasing.motherboardformfactor_id.name) {
        updates = updates + "Motherboard Form is Changed \n";
    }
    if (casing.itemstatus_id.name != oldCasing.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }


    return updates;
}

const buttonCasingUpdate = () => {
    //check form error
    let errors = checkCasingInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkCasingFormUpdates();

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

                $.ajax("/casing", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(casing),


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
                    $('#casingAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshCasingTable();
                    //reset the Item form
                    formCasing.reset();
                    //Item form refresh
                    refreshCasingForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshCasingForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Casing Form  has Following Errors..\n" + errors)
    }


}

const deleteCasing = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Casing? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/casing", {
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
            $('#casingAddModal').modal('hide');
            refreshCasingTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}


const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#casingAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formCasing.reset();
        divModifyButton.className = 'd-none';

        refreshCasingForm();
    }
}