window.addEventListener('load', () => {
    refreshSupplierPaymentTable();
    refreshSupplierPaymentForm();
})

const refreshSupplierPaymentTable = () => {
    supplierpayments = getServiceAjaxRequest('/supplierpayment/alldata');

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'text', propertyName: 'totalpurchase' },
        { dataType: 'function', propertyName: getCustomerStatus },
    ]

    fillDataIntoTable(tableSupplierPayment, supplierpayments, displayPropertyList, refillSupplierPaymentrForm, divModifyButton)
        //table show with dataTable
    $('#tableSupplierPayment').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshSupplierPaymentForm = () => {

}

const refillSupplierPaymentrForm = () => {

}