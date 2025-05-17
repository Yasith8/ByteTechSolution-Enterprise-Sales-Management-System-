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
    buttonUpdate.disabled = true;
    buttonSubmit.classList.remove('elementHide')
    buttonUpdate.classList.add('elementHide')

    staticBackdropLabel.textContent = "Add New Purchase Request";

    selectSupplierQuotation.disabled = false;

    prequest.purchase_request_item = new Array();

    selectPurchaseStatus.disabled = true;
    purchaseStatuses = getServiceAjaxRequest("/purchasestatus/alldata")
    fillDataIntoSelect(selectPurchaseStatus, "Select Purchase Status", purchaseStatuses, "name", purchaseStatuses[1].name);
    selectDynamicValidator(selectPurchaseStatus, '', 'prequest', 'purchasestatus_id')

    supplierQuotations = getServiceAjaxRequest("/supplierquotation/quotationbyvaliddate")
        //fillMultipleItemOfDataIntoSingleSelect(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_id.name");
    fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_id.name");

    selectSupplierQuotation.addEventListener('change', () => {
        console.log(selectSupplierQuotation.value)
        prequest.purchase_request_item = [];
        refreshPurchaseRequestHasItemInnerFormAndTable()
    })



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

    buttonInnerSubmit.classList.remove('elementHide')
    buttonInnerUpdate.classList.add('elementHide')

    inputFieldsHandler([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal], false)
    removeValidationColor([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal])

    buttonInnerSubmit.disabled = false;
    buttonInnerSubmit.classList.add('inner-add-btn');


    decimalLineTotal.disabled = true;
    decimalItemPrice.disabled = true;

    //if supplier quotation eka fill nam
    if (selectSupplierQuotation.value == "Select Supplier Quotation") {
        console.log("EMPTY");
        //auto add item code when item select
        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Purchase Request First", [], "", "");
        selectSupplierQuotation.addEventListener('change', () => {
            prequest.selectItemName_id = null;
            removeValidationColor([selectItemName]);
            const selectedSupplierQuotation = selectValueHandler(selectSupplierQuotation);
            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", selectedSupplierQuotation.quotation_item, "itemcode", "itemname");
            console.log("pr some array", selectedSupplierQuotation.quotation_item)

        })

    } else {
        console.log("NOT EMPTY");

        const selectedSupplierQuotation = selectValueHandler(selectSupplierQuotation);
        console.log("quotation item", selectedSupplierQuotation);
        console.log("quotation item main array", prequest.purchase_request_item);

        // Extract all itemcodes from the purchase request items
        const prItemCodes = prequest.purchase_request_item.map(item => item.itemcode);

        // Filter out quotation items that already exist in the purchase request items
        const remainPRItem = selectedSupplierQuotation.quotation_item.filter(
            (qItem) => !prItemCodes.includes(qItem.itemcode)
        );

        console.log("Filtered quotation items not in purchase request:", remainPRItem);

        decimalItemPrice.value = null;
        decimalLineTotal.value = null;
        numberQuantity.value = null;


        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", remainPRItem, "itemcode", "itemname");
        selectSupplierQuotation.addEventListener('change', () => {
            prequest.selectItemName_id = null;
            removeValidationColor([selectItemName]);
            console.log("pr some array", selectedSupplierQuotation.quotation_item)
        })
    }


    selectItemName.addEventListener('change', () => {
        const selectedItemName = selectValueHandler(selectItemName);
        purchaseRequestItem.itemname = selectedItemName.itemname
        purchaseRequestItem.itemcode = selectedItemName.itemcode

        numberQuantity.value = selectedItemName.quantity;
        decimalItemPrice.value = selectedItemName.unitprice;
        textValidator(numberQuantity, '^(100|[1-9][0-9]?)$', 'purchaseRequestItem', 'quantity');
        textValidator(decimalItemPrice, '', 'purchaseRequestItem', 'unitprice');


        decimalLineTotal.value = selectedItemName.lineprice
        numberQuantity.addEventListener('input', () => {
            const newQuantity = parseFloat(numberQuantity.value);
            decimalLineTotal.value = newQuantity * selectedItemName.unitprice
        })
        textValidator(decimalLineTotal, '', 'purchaseRequestItem', 'linetotal');
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

    staticBackdropLabel.textContent = ob.requestcode;

    buttonSubmit.disabled = true;
    buttonUpdate.disabled = false;
    buttonSubmit.classList.add('elementHide')
    buttonUpdate.classList.remove('elementHide')

    prequest = JSON.parse(JSON.stringify(ob));
    oldPrequest = ob;

    decimalTotalAmount.value = prequest.totalamount
    dateRequiredDate.value = prequest.requireddate
    textNote.value = prequest.note

    inputFieldsHandler([dateRequiredDate, textNote, selectItemName, selectPurchaseStatus, numberQuantity, buttonDelete], false);

    selectPurchaseStatus.disabled = false;
    purchaseStatuses = getServiceAjaxRequest("/purchasestatus/alldata")
    fillDataIntoSelect(selectPurchaseStatus, "Select Purchase Status", purchaseStatuses, "name", prequest.purchasestatus_id.name);

    if (prequest.purchasestatus_id.name == "Recived") {
        inputFieldsHandler([decimalTotalAmount, dateRequiredDate, textNote, selectSupplierQuotation, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal], true);
    }

    if (prequest.purchasestatus_id.name == "Deleted") {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }

    selectPurchaseStatus.addEventListener('change', () => {
        if (prequest.purchasestatus_id.name == "Recived") {
            inputFieldsHandler([decimalTotalAmount, dateRequiredDate, textNote, selectSupplierQuotation, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal], true);
        }
    })

    selectPurchaseStatus.addEventListener('change', () => {
        if (prequest.purchasestatus_id.name == "Deleted") {
            buttonDelete.disabled = true;
            buttonDelete.classList.remove('modal-btn-delete');
        } else {
            buttonDelete.disabled = false;
            buttonDelete.classList.add('modal-btn-delete');
        }
    })

    selectSupplierQuotation.disabled = true;
    supplierQuotations = getServiceAjaxRequest("/supplierquotation/alldata")
    fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_id.name", prequest.supplier_quotation_id.quotationid, prequest.supplier_quotation_id.supplier_id.name);

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/PREQUEST");
    if (!userPrivilages.update) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([decimalTotalAmount, dateRequiredDate, textNote, selectSupplierQuotation, selectPurchaseStatus, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal], true);
        buttonClear.classList.remove('modal-btn-clear');
    }


    refreshPurchaseRequestHasItemInnerFormAndTable()
}

const refillInnerPurchaseItemForm = (ob, rowIndex) => {
    document.querySelectorAll('.inner-delete-btn').forEach((btn) => {
        btn.classList.add('custom-disabled');
    });

    document.querySelectorAll('.inner-edit-button').forEach((btn) => {
        btn.classList.add('custom-disabled');
    });

    buttonInnerSubmit.classList.add('elementHide')
    buttonInnerUpdate.classList.remove('elementHide')

    //bcuz of come the single obj, it stored in the array
    const quotationItemArray = new Array();
    quotationItemArray.push(ob);
    //fill the select and assign the values and disabled
    fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", quotationItemArray, "itemcode", "itemname", ob.itemcode, ob.itemname);
    purchaseRequestItem.itemname_id = ob
    purchaseRequestItem.itemname = ob.itemname
    purchaseRequestItem.itemcode = ob.itemcode
    console.log("itnm", ob)
    selectItemName.disabled = true;

    numberQuantity.value = ob.quantity;
    decimalItemPrice.value = ob.unitprice;
    decimalLineTotal.value = ob.linetotal;

    textValidator(numberQuantity, '^(100|[1-9][0-9]?)$', 'purchaseRequestItem', 'quantity');
    textValidator(decimalItemPrice, '', 'purchaseRequestItem', 'unitprice');


    numberQuantity.addEventListener('input', () => {
        const newQuantity = parseFloat(numberQuantity.value);
        decimalLineTotal.value = newQuantity * ob.unitprice;

        purchaseRequestItem.quantity = numberQuantity.value;
        purchaseRequestItem.unitprice = decimalItemPrice.value;
        purchaseRequestItem.linetotal = decimalLineTotal.value;
        console.log("pri", purchaseRequestItem)
    })
    textValidator(decimalLineTotal, '', 'purchaseRequestItem', 'linetotal')





}

const deleteInnerPurchaseItemForm = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove item from the Purchase Request? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Delete",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            prequest.purchase_request_item.splice(rowIndex, 1);
            refreshPurchaseRequestHasItemInnerFormAndTable();

            Swal.fire({
                title: "Success!",
                text: "Item Removed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
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
    //destructure the pr irem code for remove itemname_id
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
                    //purchaseItemForm.reset();
                    document.querySelectorAll('.inner-delete-btn').forEach((btn) => {
                        btn.classList.remove('custom-disabled');
                    });

                    document.querySelectorAll('.inner-edit-button').forEach((btn) => {
                        btn.classList.remove('custom-disabled');
                    });
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
    //destructure the pr irem code for remove itemname_id
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

                //purchase reqyest item obj eke hv the look
                const purchaseItemIndex = prequest.purchase_request_item.findIndex((prItem) => prItem.itemcode === updatedPurchaseRequestItem.itemcode);

                //validate karanawa exist or not 
                if (purchaseItemIndex !== -1) {
                    prequest.purchase_request_item[purchaseItemIndex] = updatedPurchaseRequestItem;

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
                        document.querySelectorAll('.inner-delete-btn').forEach((btn) => {
                            btn.classList.remove('custom-disabled');
                        });

                        document.querySelectorAll('.inner-edit-button').forEach((btn) => {
                            btn.classList.remove('custom-disabled');
                        });
                    });

                } else {
                    Swal.fire({
                        title: "Are you sure?",
                        text: "The Item you try to adding is not in the Item List. Sure to add as a New Item?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#103D45",
                        cancelButtonColor: "#F25454",
                        confirmButtonText: "Yes, Add it!",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            prequest.purchase_request_item.push(updatedPurchaseRequestItem);
                        }
                    })
                }
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
    if (prequest.purchasestatus_id.id != oldPrequest.purchasestatus_id.id) {
        console.log("new:---", prequest.purchasestatus_id, "--old---", oldPrequest.purchasestatus_id)
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
        for (let newPurchaseItem of prequest.purchase_request_item) {
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
        console.log("any updates", updates)
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

const innerClearButton = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Item Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPurchaseRequestHasItemInnerFormAndTable();

            Swal.fire({
                title: "Success!",
                text: "Item Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
}

const refreshPrequest = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Purchase Request Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refreshPurchaseRequestHasItemInnerFormAndTable();
            refreshPurchaseRequestForm();

            Swal.fire({
                title: "Success!",
                text: "Purchase Request Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
}

const printPrequestDetails = (ob, rowIndex) => {

    // Open a new tab
    const newTab = window.open();

    printPONO.textContent = ob.requestcode;
    printPODate.textContent = ob.addeddate;
    printSupplier.textContent = ob.supplier_id.name;
    printQuotation.textContent = ob.supplier_quotation_id.quotationid;
    printRequiredDate.textContent = ob.requireddate;
    printTotalAmount.textContent = ob.totalamount;



    ob.purchase_request_item.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${item.itemcode}</td>
        <td>${item.itemname}</td>
        <td>${item.quantity}</td>
        <td>${item.unitprice.toFixed(2)}</td>
        <td>${item.linetotal}</td>
      `;
        itemsContainer.appendChild(row);
    });

    // Write content to the new tab
    newTab.document.write(
        '<html><head>' +
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">' +
        '<link rel="stylesheet" href="resources/style/prequest.css">' +
        '<link rel="stylesheet" href="resources/style/common.css">' +
        '</head><body>' +
        printPurchaseRequestDetails.outerHTML +
        '<script>' +
        'document.getElementById("printPurchaseRequestDetails").removeAttribute("style");' +
        'window.onload = function() { window.print(); };' +
        '</script>' +
        '</body></html>'
    );

    // Close the document to finish loading
    newTab.document.close();
}