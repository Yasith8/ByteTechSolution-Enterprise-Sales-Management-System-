window.addEventListener('load', () => {
    refreshCustomerTable();
    refreshCustomerForm();
})


const refreshCustomerTable = () => {
    customers = getServiceAjaxRequest('/gpu/alldata');

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'text', propertyName: 'totalpurchase' },
        { dataType: 'function', propertyName: getCustomerStatus },
    ]

    fillDataIntoTable(tableCustomer, customers, displayPropertyList, refillCustomerForm, divModifyButton)
        //table show with dataTable
    $('#tableCustomer').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}
const refreshCustomerForm = () => {
    customer = new Object();


    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Customer";

    customerstatuses = getServiceAjaxRequest("/customerstatus/alldata");
    fillDataIntoSelect(selectCustomerStatus, "Please Select Customer Status", customerstatuses, "name");

    removeValidationColor([textName, textMobile, decimalTotalPurchase, textEmail, textAddress, selectCustomerStatus])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/CUSTOMER");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textName, textMobile, decimalTotalPurchase, textEmail, textAddress, selectCustomerStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
}

const getCustomerStatus = (ob) => {
    if (ob.customerstatus_id.name == "Available") {
        return '<p class="common-status-available">Available</p>';
    } else {
        return '<p class="common-status-delete">Not Available</p>'
    }
}