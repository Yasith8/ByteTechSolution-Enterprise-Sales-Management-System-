window.addEventListener('load', () => {
    refreshSupplierTable();
    refreshSupplierForm();
})

const refreshSupplierTable = () => {

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

    removeValidationColor([textSupplierName, numberSupplierPhone, textSupplierEmail, textAddress, textAgentrName, numberAgentPhone, textAgentEmail, selectBankName, textBranch, textAccountName, numberAccountNo, selectSupplierStatus])


    //made security privilages
    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/SUPPLIER");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textSupplierName, numberSupplierPhone, textSupplierEmail, textAddress, textAgentrName, numberAgentPhone, textAgentEmail, selectBankName, textBranch, textAccountName, numberAccountNo, selectSupplierStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }


    refreshSupplierInnerFormAndTable();
}

const refreshSupplierInnerFormAndTable = () => {

    //inner form
    inputFieldsHandler([selectInnerCategory, selectInnerBrand], true)
    removeValidationColor([selectInnerCategory, selectInnerBrand])


    categories = getServiceAjaxRequest('category/alldata')
    fillDataIntoSelect(selectInnerCategory, "Please Select Category", categories, "name");

    fillDataIntoSelect(selectInnerBrand, "Please Select Category First", [], "name");

    selectInnerCategory.addEventListener('onchange', () => {
        let category = selectInnerCategory.value;

        brands = getServiceAjaxRequest("/brand/brandbycategory/" + category);
        fillDataIntoSelect(selectInnerBrand, "Please Select Brand", brands, "name");
    })


    //inner table

    let displayPropertyList = [
        { dataType: 'function', propertyName: getInnerFormBrand },
        { dataType: 'function', propertyName: getInnerFormCategory },
    ]

    fillDataIntoInnerTable(innerSupplierTable, supplier.supplier_has_brand_category, displayPropertyList, refillInnerSupplierForm, deleteInnerSupplierForm)

}

const getInnerFormBrand = (ob) => {
    return ob.brand_id.name;
}
const getInnerFormCategory = (ob) => {
    return ob.category_id.name;
}

const refillInnerSupplierForm = (ob, rowIndex) => {

}
const deleteInnerSupplierForm = (ob, rowIndex) => {

}