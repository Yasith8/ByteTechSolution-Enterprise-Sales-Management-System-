window.addEventListener('load', () => {
    refreshCustomerPaymentTable()
})

const refreshCustomerPaymentTable = () => {
    //load the order data
    customerpayments = getServiceAjaxRequest("/customerpayment/alldata")
    const displayColumnList = [
        { dataType: 'text', propertyName: 'paymentno' },
        { dataType: 'function', propertyName: getInvoice },
        { dataType: 'function', propertyName: getCustomer },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'text', propertyName: 'paidamount' },
        { dataType: 'text', propertyName: 'balance' },
        { dataType: 'function', propertyName: getInvoiceStatus },
    ]

    fillDataIntoTable(tableCustomerPayment, customerpayments, displayColumnList, refillCustomerPaymentForm, divModifyButton)

    $('#tableCustomerPayment').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refillCustomerPaymentForm = (ob) => {
    customerPayment = JSON.parse(JSON.stringify(ob));
    oldCustomerPayment = ob;

    $('#customerpaymentAddModal').modal('show');
    staticBackdropLabel.textContent = customerPayment.paymentno;

    selectCustomer.disabled = true;
    const customers = getServiceAjaxRequest('/customer/alldata')
    fillMultipleItemOfDataIntoSingleSelect(selectCustomer, "Select Customer Details", customers, 'name', 'mobile', customerPayment.customer_id.name, customerPayment.customer_id.mobile)

    selectInvoice.disabled = true;
    const invoices = getServiceAjaxRequest('/invoice/alldata')
    fillDataIntoSelect(selectInvoice, "Select Invoice", invoices, 'invoiceno', customerPayment.invoice_id.invoiceno);

    decimalTotalAmount.disabled = true;
    decimalTotalAmount.value = customerPayment.totalamount;

    decimalPaidAmount.disabled = true;
    decimalPaidAmount.value = customerPayment.paidamount;

    decimalBalance.value = customerPayment.balance;

    const paymenttypes = getServiceAjaxRequest('/paymenttype/alldata')
    fillDataIntoSelect(selectPaymentType, "Select Payment Type", paymenttypes, 'name', customerPayment.paymettype_id.name);

    const invoicestatus = getServiceAjaxRequest('/invoicestatus/alldata')
    fillDataIntoSelect(selectInvoiceStatus, "Select Invoice Status", invoicestatus, 'name', customerPayment.invoicestatus_id.name);


}

const getInvoice = (ob) => {
    return ob.invoice_id.invoiceno;
}

const getCustomer = (ob) => {
    return ob.customer_id.name
}

const getInvoiceStatus = (ob) => {
    if (ob.invoicestatus_id.name == 'Completed') {
        return '<p class="common-status-available">' + ob.invoicestatus_id.name + '</p>';
    }

    if (ob.invoicestatus_id.name == 'Processing') {
        return '<p class="common-status-resign">' + ob.invoicestatus_id.name + '</p>'
    }
    if (ob.invoicestatus_id.name == 'Deleted') {
        return '<p class="common-status-delete">' + ob.invoicestatus_id.name + '</p>'
    } else {
        return '<p class="common-status-other">' + ob.invoicestatus_id.name + '</p>'
    }
}


const UserInputErrors = () => {
    let errors = "";

    return errors;
}

const checkUserUpdates = () => {
    let updates = "";

    return updates;
}

const updateCustomerPayment = () => {
    let errors = UserInputErrors();

    if (errors = "") {
        let updates = checkUserUpdates();

        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated",
                text: "There are no any updates in Custoomer Payment Form",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#103D45",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
        } else {
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to update the Custoomer Payment details?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#103D45",
                cancelButtonColor: "#F25454",
                confirmButtonText: "Yes, send it!",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    let putServiceResponse;

                    $.ajax("/customerpayment", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(customerPayment),


                        success: function(successResponseOb) {
                            putServiceResponse = successResponseOb;
                        },

                        error: function(failedResponseOb) {
                            putServiceResponse = failedResponseOb;
                        }

                    });

                    if (putServiceResponse == "OK") {
                        Swal.fire({
                            title: "Success!",
                            text: "Customer Payment update successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            $('#customerpaymentAddModal').modal('hide');
                            formCustomerPayment.reset();
                            //refreash Item form
                            refreshCustomerPaymentTable();
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: "Customer Payment Updation failed due to the following errors:<br>" + putServiceResponse,
                            icon: "error",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonColor: "#F25454"
                        });
                    }
                }
            })
        }

    } else {
        Swal.fire({
            title: "Error!",
            html: "Updation of Order failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}

const refreshCustomerPayment = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Customer Payment Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refreshCustomerPaymentTable();

            Swal.fire({
                title: "Success!",
                text: "Order Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
}