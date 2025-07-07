window.addEventListener('load', () => {
    refreshSupplierPaymentTable();
    refreshSupplierPaymentForm();
})

const refreshSupplierPaymentTable = () => {
    supplierpayments = getServiceAjaxRequest('/supplierpayment/alldata');

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'paymentno' },
        { dataType: 'function', propertyName: getSupplier },
        { dataType: 'text', propertyName: 'totaldueamount' },
        { dataType: 'text', propertyName: 'payeddueamount' },
        { dataType: 'text', propertyName: 'newdueamount' },
        { dataType: 'function', propertyName: getpaymenttype },
        { dataType: 'function', propertyName: getsupplierpaymentstatus },
    ]

    fillDataIntoTable(tableSupplierPayment, supplierpayments, displayPropertyList, refillSupplierPaymentrForm, divModifyButton)
        //table show with dataTable
    $('#tableSupplierPayment').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshSupplierPaymentForm = () => {
    supplirpayment = new Object();
    oldSupplierPayment = null;

    suppliers = getServiceAjaxRequest('/supplier/activesupplier');
    fillMultipleItemOfDataIntoSingleSelect(selectSupplier, "Select Supplier", suppliers, 'supplierid', 'name')

    selectSupplier.addEventListener('change', () => {
        selectedSupplier = selectValueHandler(selectSupplier);
    })
}

const refillSupplierPaymentrForm = () => {

}

const getSupplier = (ob) => {
    return `${ob.supplier_id.supplierid}-${ob.supplier_id.name}`
}

const getpaymenttype = (ob) => {
    return ob.paymenttype_id.name
}

const getsupplierpaymentstatus = (ob) => {
    if (ob.supplierpaymentstatus_id.name == 'Completed') {
        return '<p class="common-status-available">' + ob.supplierpaymentstatus_id.name + '</p>';
    }

    if (ob.supplierpaymentstatus_id.name == 'Pending') {
        return '<p class="common-status-resign">' + ob.supplierpaymentstatus_id.name + '</p>'
    } else {
        return '<p class="common-status-other">' + ob.supplierpaymentstatus_id.name + '</p>'
    }
}