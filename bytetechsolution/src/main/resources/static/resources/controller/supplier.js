window.addEventListener('load', () => {
    refreshSupplierTable();
    refreshSupplierForm();
})

const refreshSupplierTable = () => {
    suppliers = getServiceAjaxRequest("/supplier/alldata");

    const displayMainColumnList = [
        { dataType: 'text', propertyName: 'supplierid' },
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'agentname' },
        { dataType: 'text', propertyName: 'phone' },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'function', propertyName: getSupplierStatus },
    ]

    fillDataIntoTable(tableSupplier, suppliers, displayMainColumnList, refillSupplierForm, divModifyButton)

    $('#tableSupplier').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}

const refreshSupplierForm = () => {
    supplier = new Object();
    oldSupplier = null;

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Supplier";

    supplier.supplier_has_brand_category = new Array();


    supplierstatuses = getServiceAjaxRequest("/supplierstatus/alldata")
    fillDataIntoSelect(selectSupplierStatus, "Select Supplier Status", supplierstatuses, "name");

    banknames = getServiceAjaxRequest("/bankname/alldata")
    fillDataIntoSelect(selectBankName, "Select Bank Name", banknames, "name");

    removeValidationColor([selectInnerCategory, selectInnerBrand, , textSupplierName, numberSupplierPhone, textSupplierEmail, textAddress, textAgentName, numberAgentPhone, textAgentEmail, selectBankName, textBranch, textAccountName, numberAccountNo, selectSupplierStatus])


    //made security privilages
    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/SUPPLIER");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([selectInnerCategory, selectInnerBrand, textSupplierName, numberSupplierPhone, textSupplierEmail, textAddress, textAgentName, numberAgentPhone, textAgentEmail, selectBankName, textBranch, textAccountName, numberAccountNo, selectSupplierStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }


    refreshSupplierInnerFormAndTable();
}

const refreshSupplierInnerFormAndTable = () => {

    //inner form

    supplierItem = new Object();
    oldSupplierItem = null;

    inputFieldsHandler([selectInnerCategory, selectInnerBrand], false)
    removeValidationColor([selectInnerCategory, selectInnerBrand])

    buttonInnerSubmit.disabled = false;
    buttonInnerSubmit.classList.add('inner-add-btn');

    buttonInnerUpdate.disabled = true;
    buttonInnerUpdate.classList.remove('inner-update-btn');



    categories = getServiceAjaxRequest('/category/alldata')
    fillDataIntoSelect(selectInnerCategory, "Please Select Category", categories, "name");

    fillDataIntoSelect(selectInnerBrand, "Please Select Category First", [], "name");

    selectInnerCategory.addEventListener('change', () => {
        let category = selectValueHandler(selectInnerCategory);

        brands = getServiceAjaxRequest("/brand/brandbycategory/" + category.name);
        fillDataIntoSelect(selectInnerBrand, "Please Select Brand", brands, "name");
    })


    //inner table

    let displayPropertyList = [
        { dataType: 'function', propertyName: getInnerFormCategory },
        { dataType: 'function', propertyName: getInnerFormBrand },
    ]

    fillDataIntoInnerTable(innerSupplierTable, supplier.supplier_has_brand_category, displayPropertyList, refillInnerSupplierForm, deleteInnerSupplierForm)

}


const refillSupplierForm = (ob, rowIndex) => {
    $('#supplierAddModal').modal('show');
    removeValidationColor([selectInnerCategory, selectInnerBrand, textSupplierName, numberSupplierPhone, textSupplierEmail, textAddress, textAgentName, numberAgentPhone, textAgentEmail, selectBankName, textBranch, textAccountName, numberAccountNo, selectSupplierStatus])


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    supplier = JSON.parse(JSON.stringify(ob));
    oldSupplier = ob;

    //assign itemcode
    staticBackdropLabel.textContent = supplier.supplierid;

    //asign the obj name
    textSupplierName.value = supplier.name;
    //assign phone
    numberSupplierPhone.value = supplier.phone;
    //assign email
    textSupplierEmail.value = supplier.email;
    //assign address
    textAddress.value = supplier.address;
    //assign agent name
    textAgentName.value = supplier.agentname;
    //assign agent phone
    numberAgentPhone.value = supplier.agentphone;
    //assign agent email
    textAgentEmail.value = supplier.agentemail;
    //assign bank name
    selectBankName.value = supplier.bankname_id.name;
    //assign branch
    textBranch.value = supplier.branch;
    //assign account name
    textAccountName.value = supplier.accountname;
    //assign account no
    numberAccountNo.value = supplier.accountno;
    //assign supplier status
    selectSupplierStatus.value = supplier.supplierstatus_id.name

    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/SUPPLIER");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([selectInnerCategory, selectInnerBrand, textSupplierName, numberSupplierPhone, textSupplierEmail, textAddress, textAgentName, numberAgentPhone, textAgentEmail, selectBankName, textBranch, textAccountName, numberAccountNo, selectSupplierStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;

    refreshSupplierInnerFormAndTable()

}

const getInnerFormBrand = (ob) => {
    return ob.brand_id.name;
}
const getInnerFormCategory = (ob) => {
    return ob.category_id.name;
}
const getSupplierStatus = (ob) => {
    if (ob.supplierstatus_id.name == 'Active') {
        return '<p class="supplier-status-available">' + ob.supplierstatus_id.name + '</p>';
    }

    if (ob.supplierstatus_id.name == 'Resign') {
        return '<p class="supplier-status-resign">' + ob.supplierstatus_id.name + '</p>'
    }


    if (ob.supplierstatus_id.name == 'Delete') {
        return '<p class="supplier-status-delete">' + ob.supplierstatus_id.name + '</p>'
    } else {
        return '<p class="supplier-status-other">' + ob.supplierstatus_id.name + '</p>'
    }
}


const refillInnerSupplierForm = (ob, rowIndex) => {}
const deleteInnerSupplierForm = (ob, rowIndex) => {
    let userConfirm = confirm(`Are you sure to remove the ${ob.brand_id.name} ${ob.category_id.name} from this supplier?`);

    if (userConfirm) {
        //remove the item
        supplier.supplier_has_brand_category.splice(rowIndex, 1)
        refreshSupplierInnerFormAndTable()
        alert("Removed Successfully!")
    }
}

const checkInnerItemFormErrors = () => {
    let errors = "";

    if (supplierItem.category_id == null) {
        errors += "Category cannot be null \n";
    }
    if (supplierItem.brand_id == null) {
        errors += "Brand cannot be null \n";
    }

    return errors;
}

const itemExistTableHandler = () => {
    let selectedCategory = JSON.parse(selectInnerCategory.value);
    let selectedBrand = JSON.parse(selectInnerBrand.value);


    buttonSubmit.disabled = false;
    selectInnerCategory.classList.remove('is-invalid');
    selectInnerBrand.classList.remove('is-invalid');


    supplier.supplier_has_brand_category.map(element => {
        if (element.brand_id.name === selectedBrand.name && element.category_id.name === selectedCategory.name) {
            console.log("invalid");
            buttonSubmit.disabled = true;
            selectInnerCategory.classList.add('is-invalid');
            selectInnerBrand.classList.add('is-invalid');
        }
    });


}

const innerSupplierProductAdd = () => {
    //error check
    let errors = checkInnerItemFormErrors();
    if (errors == "") {
        //optimize if time have add unique names instead of common name
        let userConform = confirm("Are you sure to assign this product to supplier?")
        if (userConform) {
            //add obj into array
            supplier.supplier_has_brand_category.push(supplierItem)
            console.log(supplier.supplier_has_brand_category);
            alert("Items assigned to the supplier successfully!")
            refreshSupplierInnerFormAndTable();
        }
    } else {
        alert("Item assign failed because of following errors! \n" + errors)
    }
    //get user confirmation


}



const innerSupplierProductUpdate = () => {

}

const checkSupplierSubmitErrors = () => {
    let errors = "";
    if (supplier.name == null) {
        errors += "Supplier Name is required\n";
    }
    if (supplier.phone == null) {
        errors += "Supplier Phone No is required\n";
    }
    if (supplier.email == null) {
        errors += "Supplier Email is required\n";
    }
    if (supplier.agentname == null) {
        errors += "Agent Name is required\n";
    }
    if (supplier.agentphone == null) {
        errors += "Agent Phone no is required\n";
    }
    if (supplier.agentemail == null) {
        errors += "Agent Email is required\n";
    }
    if (supplier.bankname_id == null) {
        errors += "Bank Name is required\n";
    }
    if (supplier.branch == null) {
        errors += "Bank Branch is required\n";
    }
    if (supplier.accountname == null) {
        errors += "Bank Account Name is required\n";
    }
    if (supplier.accountno == null) {
        errors += "Bank Account No is required\n";
    }
    if (supplier.supplierstatus_id == null) {
        errors += "Supplier Status is required\n";
    }
    if (supplier.supplier_has_brand_category.length == 0) {
        errors += "At least one Item need to assign to the supplier\n";
    }

    return errors;
}


const submitSupplier = () => {
    console.log(supplier);
    let errors = checkSupplierSubmitErrors();
    if (errors == "") {
        let userConfirm = confirm("Are you sure for add this supplier?");
        if (userConfirm) {
            let postServiceResponce;

            $.ajax("/supplier", {
                type: "POST",
                data: JSON.stringify(supplier),
                contentType: "application/json",
                async: false,

                success: function(data) {
                    console.log("success", data);
                    postServiceResponce = data;
                },

                error: function(resData) {
                    console.log("Fail", resData);
                    postServiceResponce = resData;
                }
            })

            if (postServiceResponce == "OK") {
                alert("Supplier Added Successfully");
                //hide the model
                $('#supplierAddModal').modal('hide');
                //reset the Item form
                formSupplier.reset();
                //refreash Item form
                refreshSupplierForm();
                //refreash Item table
                refreshSupplierTable();
            } else {
                alert("Fail to submit Supplier form \n" + postServiceResponce);
            }
        }
    } else {
        alert("Submit not completed.Supplier form has following errors\n" + errors);
    }
}


const checkSupplierFormUpdates = () => {
    updates = "";

    if (supplier.name != oldSupplier.name) {
        updates = updates + "Supplier Name is Changed \n";
    }
    if (supplier.address != oldSupplier.address) {
        updates = updates + "Supplier Address is Changed \n";
    }
    if (supplier.phone != oldSupplier.phone) {
        updates = updates + "Supplier Phone is Changed \n";
    }
    if (supplier.email != oldSupplier.email) {
        updates = updates + "Supplier Email is Changed \n";
    }
    if (supplier.agentname != oldSupplier.agentname) {
        updates = updates + "Agent Name is Changed \n";
    }
    if (supplier.agentphone != oldSupplier.agentphone) {
        updates = updates + "Agent phone is Changed \n";
    }
    if (supplier.agentemail != oldSupplier.agentemail) {
        updates = updates + "Agent Email is Changed \n";
    }
    if (supplier.bankname_id.name != oldSupplier.bankname_id.name) {
        updates = updates + "Supplier Bank name is Changed \n";
    }
    if (supplier.branch != oldSupplier.branch) {
        updates = updates + "Bank Branch is Changed \n";
    }
    if (supplier.accountname != oldSupplier.accountname) {
        updates = updates + "Account name is Changed \n";
    }
    if (supplier.accountno != oldSupplier.accountno) {
        updates = updates + "Account no is Changed \n";
    }
    if (supplier.supplierstatus_id.name != oldSupplier.supplierstatus_id.name) {
        updates = updates + "Supplier Status is Changed \n";
    }
    if (supplier.supplier_has_brand_category.length != oldSupplier.supplier_has_brand_category.length) {
        updates = updates + "Supplier Inner Form is Changed \n";
    } else {
        for (let newSupplierItem of supplier.supplier_has_brand_category) {
            const matchOldSupplier = oldSupplier.supplier_has_brand_category.find(oldSupplierItem => oldSupplierItem.id === newSupplierItem.id);

            if (!matchOldSupplier) {
                updates = updates + "Supplier Inner Form is Changed \n";
            }
        }
    }

    //optimize supplier order tika danna

    return updates;
}

const updateSupplier = () => {
    let errors = checkSupplierSubmitErrors();

    if (errors == "") {
        //check form update

        let updates = checkSupplierFormUpdates();

        if (updates = "") {
            alert("Nothing Update")
        } else {
            let userConfirm = confirm("Are you sure to Update this changes?\n" + updates);

            if (userConfirm) {
                //call the put service request
                let putServiceResponse;

                $.ajax("/supplier", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(supplier),

                    success: function(successResponseOb) {
                        putServiceResponse = successResponseOb;
                    },

                    error: function(failedResponseOb) {
                        putServiceResponse = failedResponseOb;
                    }
                });

                if (putServiceResponse == "OK") {
                    alert("Supplier Updated Successfully");

                    $('#supplierAddModal').modal('hide');
                    refreshSupplierTable();
                    formSupplier.reset();
                    refreshSupplierForm();
                } else {
                    alert("Update not completed:\n" + putServiceResponse);
                    refreshSupplierForm()
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Supplier Form  has Following Errors..\n" + errors)
    }
}

const deleteSupplier = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Supplier? " + ob.name);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/supplier", {
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
            $('#supplierAddModal').modal('hide');
            refreshSupplierTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}

const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#supplierAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formSupplier.reset();
        divModifyButton.className = 'd-none';

        refreshSupplierForm();
    }
}