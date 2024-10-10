window.addEventListener('load', () => {
    refreshSupplierTable();
    refreshSupplierForm();
})

const refreshSupplierTable = () => {

}

const refreshSupplierForm = () => {
    supplier = new Object();

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
    categories = getServiceAjaxRequest('category/alldata')
    fillDataIntoSelect(selectInnerCategory, "Please Select Category", categories, "name");

    fillDataIntoSelect(selectInnerBrand, "Please Select Category First", [], "name");

    selectInnerCategory.addEventListener('onchange', () => {
        let category = selectInnerCategory.value;

        brands = getServiceAjaxRequest("/brand/brandbycategory/" + category);
        fillDataIntoSelect(selectInnerBrand, "Please Select Brand", brands, "name");
    })

}