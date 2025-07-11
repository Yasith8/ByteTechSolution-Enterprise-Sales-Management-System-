window.addEventListener('load', () => {
    refreshCustomerPaymentTable();
    refreshCustomerPaymentForm();
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
        { dataType: 'text', propertyName: 'balance' }
    ]

    fillDataIntoTable(tableCustomerPayment, customerpayments, displayColumnList, refillCustomerPaymentForm, divModifyButton)

    $('#tableCustomerPayment').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshCustomerPaymentForm = () => {
    customerpayment = new Object();
    oldcustomerpayment = null;

    buttonSubmit.disabled = false;
    buttonUpdate.disabled = true;
    buttonSubmit.classList.remove('elementHide')
    buttonClear.classList.remove('elementHide')
    buttonUpdate.classList.add('elementHide')

    staticBackdropLabel.textContent = "Add New Customer Payment";
    transactionDitails.classList.add('elementHide')
    removeValidationColor([selectPaymentType, decimalPaidAmount, selectCustomer, selectInvoice])
    inputFieldsHandler([selectPaymentType, decimalPaidAmount, selectCustomer, selectInvoice], false)

    invoiceTotalAmountRow.classList.add('elementHide');
    //load customer data
    const customers = getServiceAjaxRequest('/customer/alldata')
    console.log("CUSTOMERS", customers)
    $('#selectCustomer').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#selectCustomer').parent(),
        width: '100%'
    })
    fillMultipleItemOfDataIntoSingleSelect(selectCustomer, "Select Customer Details", customers, 'name', 'mobile')

    fillMultipleItemOfDataIntoSingleSelect(selectInvoice, "Select Customer First", [], "invoiceno", "finalamount")

    /*     selectCustomer.addEventListener('change', () => {
            customerpayment.invoice_id = null;
            removeValidationColor([selectInvoice])
            const selectedCustomer = selectValueHandler(selectCustomer)
            console.log("sssCUSTOMERS", selectedCustomer)

            customerInvoices = getServiceAjaxRequest(`/invoice/invoicebycustomer/${selectedCustomer.id}`);
            fillMultipleItemOfDataIntoSingleSelect(selectInvoice, "Select Customer First", customerInvoices, "invoiceno", "finalamount")

        }) */

    decimalDueAmount.disabled = true;
    selectInvoice.addEventListener('change', () => {
        selectedInvoice = selectValueHandler(selectInvoice);
        invoiceTotalAmountRow.classList.remove('elementHide');
        invoiceTotalAmountText.textContent = selectedInvoice.finalamount;

        decimalDueAmount.value = selectedInvoice.balance;
        customerpayment.totalamount = parseFloat(decimalDueAmount.value);
    })

    decimalBalance.disabled = true;
    decimalBalance.value = 0.00;
    decimalPaidAmount.addEventListener('input', () => {
        const paidAmount = parseFloat(decimalPaidAmount.value);
        const dueAmount = parseFloat(decimalDueAmount.value);

        //if paid amount is max than due amount equal the due amount to the paidamount
        if (paidAmount > dueAmount) {
            decimalPaidAmount.value = dueAmount.toFixed(2);
            customerpayment.paidamount = dueAmount;
        } else {
            customerpayment.paidamount = paidAmount;
        }

        //balance set to the obj
        const newBalance = dueAmount - paidAmount;
        decimalBalance.value = newBalance;
        customerpayment.balance = newBalance;
    })

    const paymenttypes = getServiceAjaxRequest('/paymenttype/alldata')
    fillDataIntoSelect(selectPaymentType, "Select Payment Type", paymenttypes, "name")


}

const testOne = () => {
    customerpayment.invoice_id = null;
    removeValidationColor([selectInvoice])
    const selectedCustomer = selectValueHandler(selectCustomer)
    console.log("sssCUSTOMERS", selectedCustomer)

    customerInvoices = getServiceAjaxRequest(`/invoice/invoicebycustomer/${selectedCustomer.id}`);
    fillMultipleItemOfDataIntoSingleSelect(selectInvoice, "Select Customer First", customerInvoices, "invoiceno", "finalamount")
}

const refillCustomerPaymentForm = (ob) => {
    customerpayment = JSON.parse(JSON.stringify(ob));
    oldcustomerpayment = ob;

    inputFieldsHandler([selectPaymentType, decimalPaidAmount], true)
    transactionDitails.classList.remove('elementHide')
    removeValidationColor([selectPaymentType, decimalPaidAmount, selectCustomer, selectInvoice])

    buttonSubmit.classList.add('elementHide')
    buttonUpdate.classList.add('elementHide')
    buttonClear.classList.add('elementHide')

    $('#customerpaymentAddModal').modal('show');
    staticBackdropLabel.textContent = `Customer Payment No: ${customerpayment.paymentno}`;

    fixedDate = getCurrentDate(customerpayment.addeddate)
    employeeUser = getServiceAjaxRequest(`/user/userbyid/${customerpayment.addeduser}`)
    console.log(employeeUser)
    transactionDitails.textContent = `This Transaction handled by ${employeeUser[0].employee_id.callingname} at ${fixedDate}`

    selectCustomer.disabled = true;
    const customers = getServiceAjaxRequest('/customer/alldata')
    fillMultipleItemOfDataIntoSingleSelect(selectCustomer, "Select Customer Details", customers, 'name', 'mobile', customerpayment.customer_id.name, customerpayment.customer_id.mobile)

    selectInvoice.disabled = true;
    const invoices = getServiceAjaxRequest('/invoice/alldata')
    fillDataIntoSelect(selectInvoice, "Select Invoice", invoices, 'invoiceno', customerpayment.invoice_id.invoiceno);

    decimalDueAmount.disabled = true;
    decimalDueAmount.value = customerpayment.totalamount;

    decimalPaidAmount.disabled = true;
    decimalPaidAmount.value = customerpayment.paidamount;

    decimalBalance.value = customerpayment.balance;

    const paymenttypes = getServiceAjaxRequest('/paymenttype/alldata')
    fillDataIntoSelect(selectPaymentType, "Select Payment Type", paymenttypes, 'name', customerpayment.paymenttype_id.name);

}

const getInvoice = (ob) => {
    return ob.invoice_id.invoiceno;
}

const getCustomer = (ob) => {
    return ob.customer_id.name
}




const UserInputErrors = () => {
    let errors = "";

    if (customerpayment.customer_id == null) {
        errors += "Supplier Selection must be required."
    }
    if (customerpayment.invoice_id == null) {
        errors += "Invoice Selection must be required."
    }
    if (customerpayment.paidamount == null) {
        errors += "Paid amount addion must be required."
    }
    if (customerpayment.paymenttype_id == null) {
        errors += "Payment type selection must be required."
    }

    return errors;
}

const submitCustomerPayment = () => {
    console.log("Customer Payment", customerpayment)
        //check errors in user inputs
    let errors = UserInputErrors();

    //if there is no errors open sweet alert to get a confomation
    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to place this customer payment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, Add it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            //if user conformed called post request
            if (result.isConfirmed) {

                let postServiceResponce;
                //ajax request
                $.ajax("/customerpayment", {
                    type: "POST", //method
                    contentType: "application/json",
                    data: JSON.stringify(customerpayment),
                    async: false,

                    //if success
                    success: function(data) {
                        console.log("success", data);
                        postServiceResponce = data;
                    },

                    //if not success
                    error: function(resData) {
                        console.log("Fail", resData);
                        postServiceResponce = resData;
                    }

                });


                if (postServiceResponce == "OK") {
                    Swal.fire({
                        title: "Success!",
                        text: "Customer Order Palced Successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        //hide the model
                        $('#customerpaymentAddModal').modal('hide');
                        //reset the Item form
                        formCustomerPayment.reset();
                        //refreash Item form
                        refreshCustomerPaymentForm();
                        //refreash Item table
                        refreshCustomerPaymentTable();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Adding Processor to the system failed due to the following errors:<br>" + postServiceResponce,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonColor: "#F25454"
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: "Error!",
            html: "Customer Payment Placement Failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
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




const buttonModalClose = () => {
    Swal.fire({
        title: "Are you sure to close the form?",
        text: "If you close this form, filled data will be removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Close",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {

        if (result.isConfirmed) {
            $('#customerpaymentAddModal').modal('hide');
            formCustomerPayment.reset();
            refreshCustomerPaymentForm();
            divModifyButton.className = 'd-none';
        }
    });
}