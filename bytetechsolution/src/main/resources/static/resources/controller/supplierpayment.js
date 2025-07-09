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
        { dataType: 'text', propertyName: 'payedamount' },
        { dataType: 'text', propertyName: 'newdueamount' },
        { dataType: 'function', propertyName: getpaymenttype },
    ]

    fillDataIntoTable(tableSupplierPayment, supplierpayments, displayPropertyList, refillSupplierPaymentrForm, divModifyButton)
        //table show with dataTable
    $('#tableSupplierPayment').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshSupplierPaymentForm = () => {
    supplierpayment = new Object();
    oldSupplierPayment = null;

    staticBackdropLabel.textContent = "Add New Supplier Payment";

    removeValidationColor([selectSupplier, , decimalPayedAmount, selectPaymentType])
    inputFieldsHandler([selectSupplier, decimalPayedAmount, selectPaymentType, textCheckNo, dateCheckDate, textTranseferNo, dateTransferDate], false)
    buttonClear.classList.add('elementHide')
    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.remove('elementHide')

    suppliers = getServiceAjaxRequest('/supplier/activesupplier');
    fillMultipleItemOfDataIntoSingleSelect(selectSupplier, "Select Supplier", suppliers, 'supplierid', 'name')

    paymenttype = getServiceAjaxRequest('/paymenttype/alldata')
    fillDataIntoSelect(selectPaymentType, "Select Payment type", paymenttype, 'name')

    checkNoCol.classList.add('elementHide')
    checkDateCol.classList.add('elementHide')
    transferNoCol.classList.add('elementHide')
    TransfernoDate.classList.add('elementHide')

    selectPaymentType.addEventListener('change', () => {
        const selectedPaymentType = selectValueHandler(selectPaymentType);
        supplierpayment.checkno = textCheckNo.value = null
        supplierpayment.checkdate = dateCheckDate.value = null
        supplierpayment.transferno = textTranseferNo.value = null
        supplierpayment.transferdate = dateTransferDate.value = null
        removeValidationColor([textCheckNo, dateCheckDate, textTranseferNo, dateTransferDate])

        if (selectedPaymentType.name == "Cheque") {
            checkNoCol.classList.remove('elementHide')
            checkDateCol.classList.remove('elementHide')
            transferNoCol.classList.add('elementHide')
            TransfernoDate.classList.add('elementHide')
            let currentDateMin = new Date();
            let minDate = currentDateMin.setFullYear(currentDateMin.getFullYear())
            console.log("middate", minDate);

            let currentDateMax = new Date();
            let maxDate = currentDateMax.setDate(currentDateMax.getDate() + 90)
            console.log("maxdate", maxDate);

            console.log("MIN===========>", getCurrentDate(minDate), "||||||| max=======>", getCurrentDate(maxDate))
            setDateLimits(dateCheckDate, getCurrentDate(minDate), getCurrentDate(maxDate))

        } else if (selectedPaymentType.name == "Bank Transfer") {
            checkNoCol.classList.add('elementHide')
            checkDateCol.classList.add('elementHide')
            transferNoCol.classList.remove('elementHide')
            TransfernoDate.classList.remove('elementHide')

            let currentDateMin = new Date();
            let minDate = currentDateMin.setFullYear(currentDateMin.getFullYear())
            console.log("middate", minDate);

            let currentDateMax = new Date();
            let maxDate = currentDateMax.setDate(currentDateMax.getDate() + 7)
            console.log("maxdate", maxDate);

            console.log("MIN===========>", getCurrentDate(minDate), "||||||| max=======>", getCurrentDate(maxDate))
            setDateLimits(dateTransferDate, getCurrentDate(minDate), getCurrentDate(maxDate))
        } else {
            checkNoCol.classList.add('elementHide')
            checkDateCol.classList.add('elementHide')
            transferNoCol.classList.add('elementHide')
            TransfernoDate.classList.add('elementHide')
        }

    })


    refreshInnerSupplierPaymentGrnTable()

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/SUPPLIERPAYMENT");

    if (!userPrivilages.update) {
        buttonClear.classList.add('elementHide')
        buttonUpdate.classList.add('elementHide')
        buttonSubmit.classList.add('elementHide')
        inputFieldsHandler([selectSupplier, decimalPayedAmount, decimalTotalDueAmount, newDueAmount, selectPaymentType, textCheckNo, dateCheckDate, textTranseferNo, dateTransferDate], true)
    }
}

const refreshInnerSupplierPaymentGrnTable = () => {
    supplierpayment.supplier_payment_has_grn = new Array();

    selectSupplier.addEventListener('change', () => {
        supplierpayment.supplier_payment_has_grn = [];
        selectedSupplier = selectValueHandler(selectSupplier);
        console.log(selectedSupplier)

        inCompletedInvoice = getServiceAjaxRequest(`grn/unpaidgrn/${selectedSupplier.id}`)
        console.log(inCompletedInvoice);

        // Sort GRNs by date (oldest first) - assuming there's a date field
        // If no date field, they should already be in chronological order from backend
        // inCompletedInvoice.sort((a, b) => new Date(a.date) - new Date(b.date));

        inCompletedInvoice.forEach((element, index) => {
            let supHasGrnObj = {
                grn_id: inCompletedInvoice[index],
                grnamount: element.finalamount,
                dueamount: parseFloat(element.finalamount) - parseFloat(element.paidamount || 0), // Calculate actual due amount
                payedamount: 0, // This will be updated when user pays
            }
            supplierpayment.supplier_payment_has_grn.push(supHasGrnObj)
        });

        calculateTotalAmount()
        setupPaymentDistribution(); // function to handle payment distribution

        console.log("sgrn", supplierpayment.supplier_payment_has_grn)

        const displayInnerPropertyList = [
            { dataType: 'function', propertyName: getGrnCode },
            { dataType: 'function', propertyName: getGrnTotalAmount },
            { dataType: 'text', propertyName: 'payedamount' },
            { dataType: 'text', propertyName: 'dueamount' },
        ]
        fillDataIntoTable(innerSupplierPaymentTable, supplierpayment.supplier_payment_has_grn, displayInnerPropertyList, refillInnerPaymentrForm, divModify1Button)
        $('#innerSupplierPaymentTable').dataTable();
    })
}

const setupPaymentDistribution = () => {
    newDueAmount.disabled = true;

    // Clear any existing event listeners to avoid duplicates
    decimalPayedAmount.removeEventListener('input', handlePaymentDistribution);
    decimalPayedAmount.removeEventListener('keyup', validatePaymentAmount);

    // Add event listeners
    decimalPayedAmount.addEventListener('input', handlePaymentDistribution);
    decimalPayedAmount.addEventListener('keyup', validatePaymentAmount);

    // Set max attribute based on total due amount
    const totalDueAmount = parseFloat(decimalTotalDueAmount.value) || 0;
    decimalPayedAmount.setAttribute('max', totalDueAmount);
    decimalPayedAmount.setAttribute('min', 0);
    decimalPayedAmount.setAttribute('step', '0.01');
}


// Validation function for payment amount
const validatePaymentAmount = function() {
    const totalDueAmount = parseFloat(decimalTotalDueAmount.value) || 0;
    const currentValue = parseFloat(this.value) || 0;

    // Regex for decimal validation (allows up to 2 decimal places)
    const decimalRegex = /^\d+(\.\d{1,2})?$/;

    // Check if value matches decimal pattern
    if (this.value && !decimalRegex.test(this.value)) {
        // Remove invalid characters
        this.value = this.value.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const parts = this.value.split('.');
        if (parts.length > 2) {
            this.value = parts[0] + '.' + parts[1];
        }

        // Limit to 2 decimal places
        if (parts[1] && parts[1].length > 2) {
            this.value = parts[0] + '.' + parts[1].substring(0, 2);
        }

        // Remove leading zeros except for decimal numbers
        this.value = this.value.replace(/^0+(\d)/, '$1');
    }

    // Check if value exceeds total due amount
    const enteredValue = parseFloat(this.value) || 0;
    if (enteredValue > totalDueAmount) {
        this.value = totalDueAmount.toFixed(2);
        showValidationError(this, `Payment amount cannot exceed total due amount (${totalDueAmount.toFixed(2)})`);
    } else if (enteredValue < 0) {
        this.value = 0;
        showValidationError(this, 'Payment amount cannot be negative');
    } else {
        removeValidationColor([this]);
    }

    // Call the text validator for additional validation
    textValidator(this, '^\\d+(\\.\\d{1,2})?$', 'supplierpayment', 'payedamount');
}

// Enhanced payment distribution handler
const handlePaymentDistribution = () => {
    const totalPaidAmount = parseFloat(decimalPayedAmount.value) || 0;
    const totalDueAmount = parseFloat(decimalTotalDueAmount.value) || 0;

    // Validate that payment doesn't exceed total due
    if (totalPaidAmount > totalDueAmount) {
        decimalPayedAmount.value = totalDueAmount.toFixed(2);
        return;
    }

    // Reset all payment amounts in GRN list
    supplierpayment.supplier_payment_has_grn.forEach(grn => {
        grn.payedamount = 0;
        grn.dueamount = parseFloat(grn.grn_id.finalamount) - parseFloat(grn.grn_id.paidamount || 0);
    });

    // Distribute payment across GRNs (oldest first)
    let remainingPayment = totalPaidAmount;

    for (let i = 0; i < supplierpayment.supplier_payment_has_grn.length && remainingPayment > 0; i++) {
        let grn = supplierpayment.supplier_payment_has_grn[i];
        let grnDueAmount = grn.dueamount;

        if (remainingPayment >= grnDueAmount) {
            // Fully pay this GRN
            grn.payedamount = grnDueAmount;
            grn.dueamount = 0;
            remainingPayment -= grnDueAmount;
        } else {
            // Partially pay this GRN
            grn.payedamount = remainingPayment;
            grn.dueamount = grnDueAmount - remainingPayment;
            remainingPayment = 0;
        }
    }

    // Update new due amount in main form
    const newDue = totalDueAmount - totalPaidAmount;
    newDueAmount.value = newDue.toFixed(2);
    supplierpayment.newdueamount = newDue;


    // Refresh the inner table to show updated amounts
    refreshInnerTable();
}


const showValidationError = (element, message) => {
    element.classList.add('is-invalid');

    // Remove existing error message
    const existingError = element.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);

    // Auto-remove error after 3 seconds
    setTimeout(() => {
        element.classList.remove('is-invalid');
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 3000);
}

// Updated calculate total amount function
const calculateTotalAmount = () => {
    let totalDueAmount = 0;
    if (inCompletedInvoice && inCompletedInvoice.length > 0) {
        inCompletedInvoice.forEach(item => {
            let grnremainamount = parseFloat(item.finalamount) - parseFloat(item.paidamount || 0);
            totalDueAmount += grnremainamount;
        })
    }

    decimalTotalDueAmount.disabled = true;
    decimalTotalDueAmount.value = totalDueAmount.toFixed(2);
    supplierpayment.totaldueamount = decimalTotalDueAmount.value;

    // Update max attribute for payment amount field
    if (decimalPayedAmount) {
        decimalPayedAmount.setAttribute('max', totalDueAmount);

        // Reset payment amount if it exceeds new total
        const currentPayment = parseFloat(decimalPayedAmount.value) || 0;
        if (currentPayment > totalDueAmount) {
            decimalPayedAmount.value = totalDueAmount.toFixed(2);
            supplierpayment.payedamount = parseFloat(decimalPayedAmount.value)
            handlePaymentDistribution();
        }
    }

    console.log("Total Due Amount:", totalDueAmount)
}

// Function to refresh inner table with updated payment data
const refreshInnerTable = () => {
    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable('#innerSupplierPaymentTable')) {
        $('#innerSupplierPaymentTable').DataTable().destroy();
    }

    const displayInnerPropertyList = [
        { dataType: 'function', propertyName: getGrnCode },
        { dataType: 'function', propertyName: getGrnTotalAmount },
        { dataType: 'text', propertyName: 'payedamount' },
        { dataType: 'text', propertyName: 'dueamount' },
    ]

    fillDataIntoTable(innerSupplierPaymentTable, supplierpayment.supplier_payment_has_grn, displayInnerPropertyList, refillInnerPaymentrForm, divModify1Button)
    $('#innerSupplierPaymentTable').dataTable();
}


const refillSupplierPaymentrForm = (ob, rowIndex) => {
    supplierpayment = JSON.parse(JSON.stringify(ob));
    oldsupplierpayment = ob;
    buttonClear.classList.add('elementHide')
    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.add('elementHide')

    $('#supplierPaymentAddModal').modal('show');

    staticBackdropLabel.textContent = `PaymentNo: ${supplierpayment.paymentno}`;

    inputFieldsHandler([selectSupplier, decimalPayedAmount, decimalTotalDueAmount, newDueAmount, selectPaymentType, textCheckNo, dateCheckDate, textTranseferNo, dateTransferDate], true)
    decimalTotalDueAmount.value = supplierpayment.totaldueamount;
    decimalPayedAmount.value = supplierpayment.payedamount;
    newDueAmount.value = supplierpayment.newdueamount;

    suppliers = getServiceAjaxRequest('/supplier/alldata')
    fillMultipleItemOfDataIntoSingleSelect(selectSupplier, "Select Supplier Payment", suppliers, 'supplierid', 'name', supplierpayment.supplier_id.supplierid, supplierpayment.supplier_id.name)


    paymenttype = getServiceAjaxRequest('/paymenttype/alldata')
    fillDataIntoSelect(selectPaymentType, "Select Payment type", paymenttype, 'name', supplierpayment.paymenttype_id.name)

    checkNoCol.classList.add('elementHide')
    checkDateCol.classList.add('elementHide')
    transferNoCol.classList.add('elementHide')
    TransfernoDate.classList.add('elementHide')

    const selectedPaymentType = selectValueHandler(selectPaymentType);
    removeValidationColor([textCheckNo, dateCheckDate, textTranseferNo, dateTransferDate])

    if (selectedPaymentType.name == "Cheque") {
        checkNoCol.classList.remove('elementHide')
        checkDateCol.classList.remove('elementHide')
        transferNoCol.classList.add('elementHide')
        TransfernoDate.classList.add('elementHide')

        textCheckNo.value = supplierpayment.chequeno;
        dateCheckDate.value = supplierpayment.checkdate;

    } else if (selectedPaymentType.name == "Bank Transfer") {
        checkNoCol.classList.add('elementHide')
        checkDateCol.classList.add('elementHide')
        transferNoCol.classList.remove('elementHide')
        TransfernoDate.classList.remove('elementHide')

        textTranseferNo.value = supplierpayment.transferno;
        dateTransferDate.value = supplierpayment.transferdatetime;

    } else {
        checkNoCol.classList.add('elementHide')
        checkDateCol.classList.add('elementHide')
        transferNoCol.classList.add('elementHide')
        TransfernoDate.classList.add('elementHide')
    }

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/SUPPLIERPAYMENT");

    if (!userPrivilages.update) {
        buttonClear.classList.add('elementHide')
        buttonUpdate.classList.add('elementHide')
        buttonSubmit.classList.add('elementHide')
        inputFieldsHandler([selectSupplier, decimalPayedAmount, decimalTotalDueAmount, newDueAmount, selectPaymentType, textCheckNo, dateCheckDate, textTranseferNo, dateTransferDate], true)
    }


}

const refillInnerPaymentrForm = () => {
    // Implementation for refilling inner form
}

const getSupplier = (ob) => {
    return ob.supplier_id.name;
}

const getGrnCode = (ob) => {
    return ob.grn_id.grncode;
}

const getGrnTotalAmount = (ob) => {
    return ob.grn_id.finalamount;
}

const getpaymenttype = (ob) => {
    return ob.paymenttype_id.name
}



const checkUserInputErrors = () => {
    let errors = "";

    if (supplierpayment.supplier_id == null) {
        errors += "Supplier Selection is Required\n";
    }
    if (supplierpayment.payedamount == null) {
        errors += "Atleast more than 0 is Required\n";
    }

    if (supplierpayment.paymenttype_id == null) {
        errors += "Payment type is Required\n";
    }

    if (supplierpayment.paymenttype_id && supplierpayment.paymenttype_id.name == "Cheque" && supplierpayment.chequeno == null) {
        errors += "Cheque Number is Required\n";
    }

    if (supplierpayment.paymenttype_id && supplierpayment.paymenttype_id.name == "Bank Transfer" && supplierpayment.transferno == null) {
        errors += "Transfer Number is Required\n";
    }

    if (supplierpayment.paymenttype_id && supplierpayment.paymenttype_id.name == "Cheque" && supplierpayment.checkdate == null) {
        errors += "Cheque Date is Required\n";
    }

    if (supplierpayment.paymenttype_id && supplierpayment.paymenttype_id.name == "Bank Transfer" && supplierpayment.transferdatetime == null) {
        errors += "Transfer date is Required\n";
    }

    return errors;
}

const customerPaymentSubmit = () => {
    console.log("Supplier Payment", supplierpayment)
    errors = checkUserInputErrors();

    if (errors == "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to make a customer payment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, make it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                let postServiceResponce;

                $.ajax("/supplierpayment", {
                    type: "POST",
                    data: JSON.stringify(supplierpayment),
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
                    Swal.fire({
                        title: "Success!",
                        text: "Payment made successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        $('#supplierPaymentAddModal').modal('hide');
                        //refreash Item form
                        refreshSupplierPaymentTable();
                        //refreash Item table
                        refreshSupplierPaymentForm();
                        //reset the Item form
                        formSupplierPayment.reset();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Supplier Payment is failed due to the following errors:<br>" + postServiceResponce,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonColor: "#F25454"
                    });
                }
            }

        })

    } else {
        Swal.fire({
            title: "Error!",
            html: "Supplier Payment failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
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
            divModifyButton.className = 'd-none';
            $('#supplierPaymentAddModal').modal('hide');
            //reset the Item form
            formSupplierPayment.reset();
            //refreash Item table
            refreshSupplierPaymentForm();
        }
    });
}

const refreshOrder = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Supplier Payment Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refreshSupplierPaymentForm();
            Swal.fire({
                title: "Success!",
                text: "Supplier Payment Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
}