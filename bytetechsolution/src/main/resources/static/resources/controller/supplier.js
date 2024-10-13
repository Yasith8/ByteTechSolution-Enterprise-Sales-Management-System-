window.addEventListener('load', () => {
    refreshSupplierTable();
    refreshSupplierForm();
})

const refreshSupplierTable = () => {
    suppliers = getServiceAjaxRequest("/supplier/alldata");

    const displayMainColumnList = [
        { dataType: 'text', propertyName: 'supplierid' },
        { dataType: 'text', propertyName: 'suppliername' },
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

    /* //optimize need to assign inner form data */

}

const getInnerFormBrand = (ob) => {
    return ob.brand_id.name;
}
const getInnerFormCategory = (ob) => {
    return ob.category_id.name;
}
const getSupplierStatus = (ob) => {
    return ob.supplierstatus_id.name;
}


const refillInnerSupplierForm = (ob, rowIndex) => {

}
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

}

const updateSupplier = () => {

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