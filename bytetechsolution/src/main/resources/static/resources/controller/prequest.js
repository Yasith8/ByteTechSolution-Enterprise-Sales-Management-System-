window.addEventListener('load', () => {
    refreshPurchaseRequestTable();
    refreshPurchaseRequestForm();
})


const refreshPurchaseRequestTable = () => {
    //get prequest data from db
    prequests = getServiceAjaxRequest("/purchaserequest/alldata")

    const displayColumnList = [
        { dataType: 'text', propertyName: 'requestcode' },
        { dataType: 'function', propertyName: getSupplierName },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'text', propertyName: 'requireddate' },
        { dataType: 'function', propertyName: getPurchaseRequestStatus },
    ]

    fillDataIntoTable(tablePrequest, prequests, displayColumnList, refillPurchaseRequestForm, divModifyButton)

    $('#tablePrequest').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshPurchaseRequestForm = () => {
    prequest = new Object();
    oldPrequest = null;

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Purchase Request";

    prequest.purchase_request_item = new Array();

    purchaseStatuses = getServiceAjaxRequest("/purchasestatus/alldata")
    fillDataIntoSelect(selectPurchaseStatus, "Select Purchase Status", purchaseStatuses, "name", purchaseStatuses[1].name);
    selectDynamicValidator(selectPurchaseStatus, '', 'prequest', 'purchasestatus_id')

    supplierQuotations = getServiceAjaxRequest("/supplierquotation/quotationbyvaliddate")
        //fillMultipleItemOfDataIntoSingleSelect(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_id.name");
    fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_id.name");



    decimalTotalAmount.disabled = true;
    let totalAmount = 0
    prequest.purchase_request_item.forEach(item => {
        totalAmount += item.linetotal
    });
    decimalTotalAmount.value = totalAmount;
    textValidator(decimalTotalAmount, '', 'prequest', 'totalamount')

    removeValidationColor([decimalTotalAmount, dateRequiredDate, textNote, selectSupplierQuotation, selectPurchaseStatus, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal])


    //made security privilages
    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/PREQUEST");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([decimalTtoalAmount, dateRequiredDate, textNote, selectSupplierQuotation, selectPurchaseStatus, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

    refreshPurchaseRequestHasItemInnerFormAndTable();
}

const refreshPurchaseRequestHasItemInnerFormAndTable = () => {
    //inner form
    purchaseRequestItem = new Object();
    oldPurchaseRequestItem = null;

    inputFieldsHandler([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal], false)
    removeValidationColor([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal])

    buttonInnerSubmit.disabled = false;
    buttonInnerSubmit.classList.add('inner-add-btn');

    buttonInnerUpdate.disabled = true;
    buttonInnerUpdate.classList.remove('inner-update-btn');

    decimalLineTotal.disabled = true;
    decimalItemPrice.disabled = true;


    //auto add item code when item select
    fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", [], "", "");
    selectSupplierQuotation.addEventListener('change', () => {
        const selectedSupplierQuotation = selectValueHandler(selectSupplierQuotation);
        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", selectedSupplierQuotation.quotation_item, "itemcode", "itemname");

        selectItemName.addEventListener('change', () => {
            const selectedItemName = selectValueHandler(selectItemName);
            //contentValidator(selectedItemName.itemname, '', 'purchaseRequestItem', 'itemname');
            //contentValidator(selectedItemName.itemcode, '', 'purchaseRequestItem', 'itemcode');
            purchaseRequestItem.itemname = selectedItemName.itemname
            purchaseRequestItem.itemcode = selectedItemName.itemcode

            numberQuantity.value = selectedItemName.quantity;
            decimalItemPrice.value = selectedItemName.unitprice;
            textValidator(numberQuantity, '^(100|[1-9][0-9]?)$', 'purchaseRequestItem', 'quantity');
            textValidator(decimalItemPrice, '', 'purchaseRequestItem', 'unitprice');


            decimalLineTotal.value = selectedItemName.lineprice
            numberQuantity.addEventListener('keyup', () => {
                const newQuantity = numberQuantity.value;
                decimalLineTotal.value = newQuantity * selectedItemName.unitprice
            })
            textValidator(decimalLineTotal, '', 'purchaseRequestItem', 'linetotal');
        })

    })


    console.log(purchaseRequestItem);

    //inner table
    let displayPropertyList = [
        { dataType: 'text', propertyName: "itemcode" },
        { dataType: 'text', propertyName: "itemname" },
        { dataType: 'text', propertyName: "unitprice" },
        { dataType: 'text', propertyName: "quantity" },
        { dataType: 'text', propertyName: "linetotal" },
    ]

    fillDataIntoInnerTable(tableInnerPrequestItem, prequest.purchase_request_item, displayPropertyList, refillInnerPurchaseItemForm, deleteInnerPurchaseItemForm)

}

const getSupplierName = (ob) => {
    return ob.supplier_id.name;
}

const getPurchaseRequestStatus = (ob) => {
    if (ob.purchasestatus_id.name == 'Recived') {
        return '<p class="supplier-status-available">' + ob.purchasestatus_id.name + '</p>';
    }

    if (ob.purchasestatus_id.name == 'Requested') {
        return '<p class="supplier-status-resign">' + ob.purchasestatus_id.name + '</p>'
    }

    if (ob.purchasestatus_id.name == 'Rejected') {
        return '<p class="supplier-status-reject">' + ob.purchasestatus_id.name + '</p>'
    }
    if (ob.purchasestatus_id.name == 'Deleted') {
        return '<p class="supplier-status-delete">' + ob.purchasestatus_id.name + '</p>'
    } else {
        return '<p class="supplier-status-other">' + ob.purchasestatus_id.name + '</p>'
    }
}

const refillPurchaseRequestForm = (ob, rowIndex) => {
    $('#prequestAddModal').modal('show');
    removeValidationColor([decimalTotalAmount, dateRequiredDate, textNote, selectSupplierQuotation, selectPurchaseStatus, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal])


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    prequest = JSON.parse(JSON.stringify(ob));
    oldPrequest = ob;

    decimalTotalAmount.value = prequest.totalamount
    dateRequiredDate.value = prequest.requireddate
    textNote.value = prequest.note


    selectSupplierQuotation.value
    selectPurchaseStatus.value

    purchaseStatuses = getServiceAjaxRequest("/purchasestatus/alldata")
    fillDataIntoSelect(selectPurchaseStatus, "Select Purchase Status", purchaseStatuses, "name", prequest.purchasestatus_id.name);

    //bug issue when valid date issue
    supplierQuotations = getServiceAjaxRequest("/supplierquotation/quotationbyvaliddate")
        //fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_id.name");
    fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_quotation_id.supplier_id.name", prequest.supplier_quotation_id.quotationid, prequest.supplier_id.name);



    refreshPurchaseRequestHasItemInnerFormAndTable()
}

const refillInnerPurchaseItemForm = () => {

}

const deleteInnerPurchaseItemForm = () => {

}

const checkInnerItemFormErrors = () => {
    let errors = ""

    if (purchaseRequestItem.itemname_id == null) {
        errors += "Item selection is required.\n"
    }
    if (purchaseRequestItem.quantity == null) {
        errors += "Quantity is required.\n"
    }

    return errors;
}
const innerPurchaseRequestItemAdd = () => {
    const { itemname_id, ...rest } = purchaseRequestItem;
    updatedPurchaseRequestItem = rest;
    let errors = checkInnerItemFormErrors();

    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to assign this product to the purchase request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, assign it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(updatedPurchaseRequestItem);
                prequest.purchase_request_item.push(updatedPurchaseRequestItem);
                console.log(prequest.purchase_request_item);

                let totalAmount = 0;
                prequest.purchase_request_item.forEach(item => {
                    totalAmount += parseFloat(item.linetotal);
                });
                decimalTotalAmount.value = totalAmount;
                prequest.totalamount = totalAmount;

                Swal.fire({
                    title: "Success!",
                    text: "Items assigned to the purchase request successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    refreshPurchaseRequestHasItemInnerFormAndTable();
                    purchaseItemForm.reset();
                });
            }
        });
    } else {
        Swal.fire({
            title: "Error!",
            html: "Item assignment failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
};


const innerPurchaseRequestItemUpdate = () => {

}

const checkPRequestFormErrors = () => {
    let errors = "";

    if (prequest.supplier_quotation_id == null) {
        errors += "Supplier Quotation is required.<br>";
    }
    if (prequest.purchasestatus_id == null) {
        errors += "Purchase Status is required.<br>";
    }
    if (prequest.totalamount == null) {
        errors += "Total Amount is required.<br>";
    }
    if (prequest.requireddate == null) {
        errors += "Required Date is required.<br>";
    }
    if (prequest.purchase_request_item.length == 0) {
        errors += "At least one item is required.<br>";
    }

    return errors;
}

const submitPrequest = () => {
    console.log(prequest);
    let errors = checkPRequestFormErrors();

    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to send the purchase request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, send it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                let postServiceResponce;

                $.ajax("/purchaserequest", {
                    type: "POST",
                    data: JSON.stringify(prequest),
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
                        text: "purchase request submit successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        $('#prequestAddModal').modal('hide');
                        //reset the Item form
                        formPrequest.reset();
                        //refreash Item form
                        refreshPurchaseRequestForm();
                        //refreash Item table
                        refreshPurchaseRequestTable();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Sending Purchase Request failed due to the following errors:<br>" + postServiceResponce,
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
            html: "Sending Purchase Request failed due to the following errors:<br>" + errors,
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}

const checkPrequstUpdates = () => {
    updates = "";

    if (prequest.supplier_quotation_id != oldPrequest.supplier_quotation_id) {
        updates = updates + "Supplier Quotation is Changed <br>";
    }
    if (prequest.purchasestatus_id != oldPrequest.purchasestatus_id) {
        updates = updates + "Purchase Status is Changed <br>";
    }
    if (prequest.totalamount != oldPrequest.totalamount) {
        updates = updates + "Total Amount is Changed <br>";
    }
    if (prequest.requireddate != oldPrequest.requireddate) {
        updates = updates + "Required Date is Changed <br>";
    }

    if (prequest.purchase_request_item.length != oldPrequest.purchase_request_item.length) {
        updates = updates + "Supplier Inner Form is Changed <br>";
    } else {
        for (let newPurchaseItem of supplier.purchase_request_item) {
            const matchOldPrequest = oldPrequest.purchase_request_item.find(oldPrequestItem => oldPrequestItem.id === newPurchaseItem.id);

            if (!matchOldPrequest) {
                updates = updates + "Purchase Request Item Inner Form is Changed <br>";
            }
        }
    }

    return updates;
}

const updatePrequest = () => {
    //check form error
    let errors = checkPRequestFormErrors();

    if (errors === "") {

        let updates = checkPrequstUpdates();

        //check there is no updates or any updations
        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated",
                text: "There are no any updates in Purchase Request Form",
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
                text: "Do you want to update Purchase Request Details?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#103D45",
                cancelButtonColor: "#F25454",
                confirmButtonText: "Yes",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    //call put service requestd  -this use for updations
                    let putServiceResponse;

                    $.ajax("/purchaserequest", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(prequest),


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
                            text: "purchase request update successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            $('#prequestAddModal').modal('hide');
                            //reset the Item form
                            formPrequest.reset();
                            //refreash Item form
                            refreshPurchaseRequestForm();
                            //refreash Item table
                            refreshPurchaseRequestTable();
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: "Purchase Request updation failed due to the following errors:<br>" + putServiceResponse,
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
            html: "Purchase Request Updation failed due to the following errors:<br>" + errors,
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}


const deletePrequest = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete following Purchase Request? "  ${ob.requestcode}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Delete",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse;
            //ajax request fot delete data
            $.ajax("/purchaserequest", {
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

            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Success!",
                    text: "Purchase Request Deleted Successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    $('#prequestAddModal').modal('hide');
                    refreshPurchaseRequestTable()
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Purchase Request Deletion failed due to the following errors:<br>" + deleteServiceResponse,
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: "#F25454"
                });
            }
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
            $('#prequestAddModal').modal('hide');
            purchaseItemForm.reset();
            divModifyButton.className = 'd-none';
            refreshPurchaseRequestForm();
        }
    });
}