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

    //supplier data getting
    suppliers = getServiceAjaxRequest('/supplier/alldata');
    fillMultipleItemOfDataIntoSingleSelect(selectSupplier, "Select Supplier", suppliers, "supplierid", "name");


    //date managing accordsing to requeire date
    let currentDateMin = new Date();
    let minDate = currentDateMin.setFullYear(currentDateMin.getFullYear())
    let currentDateMax = new Date();
    //let maxDate = currentDateMax.setFullYear(currentDateMax.getFullYear())
    let maxDate = currentDateMax.setDate(currentDateMax.getDate() + 14)

    console.log("MIN===========>", getCurrentDate(minDate), "||||||| max=======>", getCurrentDate(maxDate))

    setDateLimits(dateRequiredDate, getCurrentDate(minDate), getCurrentDate(maxDate))



    //purchase status getting
    selectPurchaseStatus.disabled = true;
    purchaseStatuses = getServiceAjaxRequest("/purchasestatus/alldata")
    fillDataIntoSelect(selectPurchaseStatus, "Select Purchase Status", purchaseStatuses, "name", purchaseStatuses[1].name);
    selectDynamicValidator(selectPurchaseStatus, '', 'prequest', 'purchasestatus_id')


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
    // inner form
    purchaseRequestItem = new Object();
    oldPurchaseRequestItem = null;

    buttonInnerSubmit.classList.remove('elementHide')
    buttonInnerUpdate.classList.add('elementHide')

    inputFieldsHandler([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal, selectSupplierQuotation], false)
    removeValidationColor([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal, selectSupplierQuotation])


    decimalTotalAmount.disabled = true;
    const totalAmount = calculateTotalAmount();
    decimalTotalAmount.value = totalAmount;
    prequest.totalamount = parseFloat(totalAmount);
    textValidator(decimalTotalAmount, '', 'prequest', 'totalamount');



    if (selectSupplierQuotation.value == "") {
        fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Valid Date and Supplier First", [], "quotationid", "supplier_id.name");
        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Supplier Quotation First", [], "", "");
        selectSupplier.addEventListener('change', () => {
            prequest.supplier_quotation_id = null;
            prequest.validatedate = null;
            removeValidationColor([selectSupplierQuotation, dateRequiredDate]);

            fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Valid Date First", [], "quotationid", "supplier_id.name");
            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Supplier Quotation First", [], "", "");
            ['change', 'input'].forEach(eventType => {
                dateRequiredDate.addEventListener(eventType, () => {
                    const selectedsupplierId = selectValueHandler(selectSupplier);
                    const selectedDate = dateRequiredDate.value;
                    supplierquotations = getServiceAjaxRequest(`/supplierquotation/quotationbyvaliddate?validdate=${selectedDate}&supplier_id=${selectedsupplierId.id}`)
                    console.log("Selected SQs>>>>", supplierquotations)

                    //Filter quotations to show only those with available items(not in purchase request table)
                    const filteredQuotations = filterAvailableQuotations(supplierquotations, prequest.purchase_request_item);
                    fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Supplier Quotation", filteredQuotations, "quotationid", "supplier_id.name");
                });
            });
        })
    } else {
        // Supplier quotation is already selected, maintain the existing state and load appropriate data
        console.log("Supplier quotation already selected, maintaining state");
        // Check if supplier and date are selected
        const selectedSupplier = selectValueHandler(selectSupplier);
        const selectedDate = dateRequiredDate.value;

        if (selectedSupplier && selectedDate) {
            // Load quotations based on existing supplier and date
            supplierquotations = getServiceAjaxRequest(`/supplierquotation/quotationbyvaliddate?validdate=${selectedDate}&supplier_id=${selectedSupplier.id}`);

            // Filter quotations to show only those with available items
            const filteredQuotations = filterAvailableQuotations(supplierquotations, prequest.purchase_request_item);

            // Maintain the currently selected quotation if it's still available
            const currentQuotationValue = selectSupplierQuotation.value;
            fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Supplier Quotation", filteredQuotations, "quotationid", "supplier_id.name");

            // Try to restore the previous selection if it's still available
            if (currentQuotationValue !== "Select Supplier Quotation") {
                const stillAvailable = filteredQuotations.find(q => q.quotationid == currentQuotationValue);
                if (stillAvailable) {
                    selectSupplierQuotation.value = currentQuotationValue;
                }
            }

            // Load items based on current or updated quotation selection
            // loadItemsForSelectedQuotation(existingItemCodes);
        } else {
            // If supplier or date is not selected, show appropriate messages
            fillMultipleItemOfDataOnSignleSelectRecursion(selectSupplierQuotation, "Select Valid Date and Supplier First", [], "quotationid", "supplier_id.name");
            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Supplier Quotation First", [], "", "");
        }
    }

    buttonInnerSubmit.disabled = false;
    buttonInnerSubmit.classList.add('inner-add-btn');

    decimalLineTotal.disabled = true;
    decimalItemPrice.disabled = true;

    // Get existing itemcodes from purchase request items
    const existingItemCodes = prequest.purchase_request_item.map(item => item.itemcode);

    if (selectSupplier.value == "Select Supplier") {
        console.log("EMPTY");
        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Purchase Request First", [], "", "");

        selectSupplierQuotation.addEventListener('change', () => {
            prequest.selectItemName_id = null;
            removeValidationColor([selectItemName]);
            const selectedSupplierQuotation = selectValueHandler(selectSupplierQuotation);
            console.log('selected Suplier Quotation', selectedSupplierQuotation)
            purchaseRequestItem.supplier_quotation_id = selectedSupplierQuotation;

            // Filter items to show only those not in the purchase request
            const availableItems = selectedSupplierQuotation.quotation_item.filter(item =>
                !existingItemCodes.includes(item.itemcode)
            );

            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", availableItems, "itemcode", "itemname");
            console.log("Available items for selection:", availableItems);
        });

    } else {
        console.log("NOT EMPTY");

        // Filter quotations to show only those with available items
        const availableSupplierQuotations = supplierquotations.filter(quotation => {
            const hasAvailableItems = quotation.quotation_item.some(qItem =>
                !existingItemCodes.includes(qItem.itemcode)
            );
            return hasAvailableItems;
        });

        console.log("Available supplier quotations:", availableSupplierQuotations);

        decimalItemPrice.value = null;
        decimalLineTotal.value = null;
        numberQuantity.value = null;

        // Show all available items from all available quotations
        const allAvailableItems = [];
        availableSupplierQuotations.forEach(quotation => {
            quotation.quotation_item.forEach(item => {
                if (!existingItemCodes.includes(item.itemcode)) {
                    allAvailableItems.push(item);
                }
            });
        });

        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", allAvailableItems, "itemcode", "itemname");

        selectSupplierQuotation.addEventListener('change', () => {
            const selectedSupplierQuotation = selectValueHandler(selectSupplierQuotation);
            purchaseRequestItem.supplier_quotation_id = selectedSupplierQuotation;
            prequest.selectItemName_id = null;
            prequest.unitprice = null;
            prequest.quantity = null;
            prequest.linetotal = null;
            removeValidationColor([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal]);

            const availableItems = selectedSupplierQuotation.quotation_item.filter(item =>
                !existingItemCodes.includes(item.itemcode)
            );

            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", availableItems, "itemcode", "itemname");
        });
    }

    // Rest of your existing selectItemName.addEventListener code remains the same...
    selectItemName.addEventListener('change', () => {
        const selectedItemName = selectValueHandler(selectItemName);
        purchaseRequestItem.itemname = selectedItemName.itemname
        purchaseRequestItem.itemcode = selectedItemName.itemcode

        console.log("Selected item", selectedItemName)

        purchaseRequestItem.category_id = selectedItemName.category_id
        numberQuantity.value = selectedItemName.quantity;
        decimalItemPrice.value = selectedItemName.unitprice;

        const currentQuantity = parseFloat(numberQuantity.value);
        const unitPrice = parseFloat(selectedItemName.unitprice);
        decimalLineTotal.value = (currentQuantity * unitPrice).toFixed(2);

        textValidator(numberQuantity, '^(100|[1-9][0-9]?)$', 'purchaseRequestItem', 'quantity');
        textValidator(decimalItemPrice, '', 'purchaseRequestItem', 'unitprice');

        //decimalLineTotal.value = selectedItemName.lineprice
        numberQuantity.addEventListener('input', () => {
            const newQuantity = parseFloat(numberQuantity.value);
            console.log("Quantity Pass:::::", newQuantity)

            const unitPrice = parseFloat(selectedItemName.unitprice)
            const newLineTotal = (newQuantity * unitPrice).toFixed(2);
            decimalLineTotal.value = newLineTotal;

            // Update the purchase request item object
            purchaseRequestItem.quantity = newQuantity;
            purchaseRequestItem.unitprice = unitPrice;
            purchaseRequestItem.linetotal = parseFloat(newLineTotal);
        })
        textValidator(decimalLineTotal, '', 'purchaseRequestItem', 'linetotal');
    });

    console.log(purchaseRequestItem);

    // inner table - rest of your existing code remains the same
    let displayPropertyList = [
        { dataType: 'text', propertyName: "itemcode" },
        { dataType: 'text', propertyName: "itemname" },
        { dataType: 'text', propertyName: "unitprice" },
        { dataType: 'text', propertyName: "quantity" },
        { dataType: 'text', propertyName: "linetotal" },
    ]

    fillDataIntoInnerTable(tableInnerPrequestItem, prequest.purchase_request_item, displayPropertyList, refillInnerPurchaseItemForm, deleteInnerPurchaseItemForm)
};

const calculateTotalAmount = () => {
    let totalAmount = 0;
    prequest.purchase_request_item.forEach(item => {
        const lineTotal = parseFloat(item.linetotal) || 0;
        totalAmount += lineTotal;
    });
    return totalAmount.toFixed(2);
};

const filterAvailableQuotations = (quotations, purchaseRequestItems) => {
    // Get all itemcodes that are already in the purchase request
    const existingItemCodes = purchaseRequestItems.map(item => item.itemcode);

    // Filter quotations to only include those that have at least one item not in the purchase request
    const availableQuotations = quotations.filter(quotation => {
        // Check if this quotation has at least one item that's not already in the purchase request
        const hasAvailableItems = quotation.quotation_item.some(qItem =>
            !existingItemCodes.includes(qItem.itemcode)
        );
        return hasAvailableItems;
    });

    console.log("Available quotations after filtering:", availableQuotations);
    return availableQuotations;
};

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

    console.log(ob)
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

    selectSupplier.disabled = true;
    suppliers = getServiceAjaxRequest("/supplier/alldata")
    fillMultipleItemOfDataIntoSingleSelect(selectSupplier, "Select Supplier", suppliers, "supplierid", "name", prequest.supplier_id.supplierid, prequest.supplier_id.name);

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
        const unitPrice = parseFloat(decimalItemPrice.value);
        const newLineTotal = (newQuantity * unitPrice);

        decimalLineTotal.value = newLineTotal.toFixed(2);

        // Update purchaseRequestItem object
        purchaseRequestItem.quantity = newQuantity;
        purchaseRequestItem.unitprice = unitPrice;
        purchaseRequestItem.linetotal = newLineTotal;

        console.log("Updated purchaseRequestItem:", purchaseRequestItem);
    });
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

    if (purchaseRequestItem.supplier_quotation_id == null) {
        errors += "Supplier Quotation is required.\n"
    }

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

                const totalAmount = calculateTotalAmount();
                decimalTotalAmount.value = totalAmount;
                prequest.totalamount = parseFloat(totalAmount);

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

                    const totalAmount = calculateTotalAmount();
                    decimalTotalAmount.value = totalAmount;
                    prequest.totalamount = parseFloat(totalAmount);

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
                        //refreash Item form
                        refreshPurchaseRequestForm();
                        //refreash Item table
                        refreshPurchaseRequestTable();
                        //reset the Item form
                        formPrequest.reset();
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
            html: "Sending Purchase Request failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
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
                            //refreash Item form
                            refreshPurchaseRequestForm();
                            //refreash Item table
                            refreshPurchaseRequestTable();
                            //reset the Item form
                            formPrequest.reset();
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
            html: "Purchase Request Updation failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
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
    // Create the complete HTML content for printing
    const printContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Purchase Order - ${ob.requestcode}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: white;
                    padding: 20px;
                }
                
                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                }
                
                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid #103d45;
                }
                
                .company-info {
                    display: flex;
                    align-items: flex-start;
                    gap: 20px;
                }
                
                .logo-container {
                    flex-shrink: 0;
                }
                
                .company-logo {
                    max-width: 120px;
                    height: auto;
                }
                
                .company-details {
                    color: #666;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .invoice-title {
                    font-size: 32px;
                    font-weight: bold;
                    color: #103d45;
                    margin-bottom: 15px;
                    text-align: right;
                }
                
                .invoice-details {
                    text-align: right;
                    font-size: 14px;
                }
                
                .invoice-details > div {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    min-width: 200px;
                }
                
                .invoice-details span:first-child {
                    font-weight: bold;
                    color: #666;
                }
                
                .invoice-details span:last-child {
                    color: #333;
                    font-weight: 600;
                }
                
                .shipping-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 8px;
                    border-left: 4px solid #103d45;
                }
                
                .shipping-box {
                    background: white;
                    padding: 15px;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .shipping-label {
                    font-size: 12px;
                    font-weight: bold;
                    color: #666;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                    letter-spacing: 0.5px;
                }
                
                .shipping-box > div:last-child {
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }
                
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .items-table thead {
                    background: linear-gradient(135deg, #103d45 0%, #0d3239 100%);
                    color: white;
                }
                
                .items-table th {
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .items-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 14px;
                }
                
                .items-table tbody tr:hover {
                    background: #b9f8c5;
                }
                
                .items-table tbody tr:last-child td {
                    border-bottom: none;
                }
                
                .items-table td:last-child,
                .items-table th:last-child {
                    text-align: right;
                    font-weight: 600;
                }
                
                .totals-section {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 30px;
                }
                
                .totals-table {
                    min-width: 300px;
                }
                
                .grand-total {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 20px;
                    background: linear-gradient(135deg, #103d45 0%, #0d3239 100%);
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                }
                
                .notes-section {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    border-left: 4px solid #10b981;
                }
                
                .notes-header {
                    font-weight: bold;
                    color: #374151;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .notes-content {
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                .notes-content p {
                    margin-bottom: 8px;
                }
                
                .invoice-footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    color: #6b7280;
                    font-size: 14px;
                }
                
                .invoice-footer p {
                    margin: 5px 0;
                }
                
                /* Print styles */
                @media print {
                    body {
                        padding: 0;
                        background: white;
                    }
                    
                    .invoice-container {
                        box-shadow: none;
                        padding: 20px;
                        max-width: none;
                    }
                    
                    .items-table {
                        box-shadow: none;
                    }
                    
                    .grand-total {
                        box-shadow: none;
                    }
                    
                    .shipping-details {
                        break-inside: avoid;
                    }
                    
                    .items-table {
                        break-inside: avoid;
                    }
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    .invoice-header {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .invoice-title {
                        text-align: left;
                    }
                    
                    .invoice-details {
                        text-align: left;
                    }
                    
                    .shipping-details {
                        grid-template-columns: 1fr;
                    }
                    
                    .items-table {
                        font-size: 12px;
                    }
                    
                    .items-table th,
                    .items-table td {
                        padding: 8px 6px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <!-- Header Section -->
                <div class="invoice-header">
                    <div class="company-info">
                        <div class="logo-container">
                            <div class="logo">
                                <div class="logo-icon">
                                    <img src="resources/image/logo/onlylogo.png" class="company-logo" alt="Company Logo" />
                                </div>
                            </div>
                        </div>
                        <div class="company-details">
                            <div><strong>No 72, Peoples Road</strong></div>
                            <div>Panadura, 12560</div>
                            <div>Phone: (038) 229-5555</div>
                            <div>Email: info@company.com</div>
                        </div>
                    </div>
                    <div>
                        <div class="invoice-title">PURCHASE ORDER</div>
                        <div class="invoice-details">
                            <div><span>PO NO:</span><span>${ob.requestcode || 'N/A'}</span></div>
                            <div><span>DATE:</span><span>${formatDate(ob.addeddate)}</span></div>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details -->
                <div class="shipping-details">
                    <div class="shipping-box">
                        <div class="shipping-label">Supplier</div>
                        <div>${ob.supplier_id?.name || 'N/A'}</div>
                    </div>
                    <div class="shipping-box">
                        <div class="shipping-label">Shipping Method</div>
                        <div>Standard Delivery</div>
                    </div>
                    <div class="shipping-box">
                        <div class="shipping-label">Quotation No</div>
                        <div>${ob.quotation_no || 'N/A'}</div>
                    </div>
                    <div class="shipping-box">
                        <div class="shipping-label">Required Date</div>
                        <div>${formatDate(ob.requireddate)}</div>
                    </div>
                </div>

                <!-- Items Table -->
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Item Code</th>
                            <th style="width: 45%;">Description</th>
                            <th style="width: 10%;">Qty</th>
                            <th style="width: 15%;">Unit Price</th>
                            <th style="width: 15%;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateItemRows(ob.purchase_request_item || [])}
                    </tbody>
                </table>

                <!-- Totals Section -->
                <div class="totals-section">
                    <div class="totals-table">
                        <div class="grand-total">
                            <div>TOTAL  </div>
                            <div> Rs. ${formatCurrency(ob.totalamount)}</div>
                        </div>
                    </div>
                </div>

                <!-- Notes Section -->
                <div class="notes-section">
                    <div class="notes-header">NOTES & TERMS</div>
                    <div class="notes-content">
                        <p><strong>Note:</strong> ${ob.note || 'No additional notes provided.'}</p>
                        <p>Thank you for your business. Please ensure all items are delivered by the required date.</p>
                        <p>For questions concerning this purchase order, please contact our procurement department.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="invoice-footer">
                    <p>If you have any questions about this Purchase Order, please contact</p>
                    <p><strong>spinfo@bytetechsolution.gmail.com</strong></p>
                </div>
            </div>
        </body>
        </html>
    `;

    // Open new tab and write content
    const newTab = window.open('', '_blank');
    newTab.document.write(printContent);
    newTab.document.close();

    // Auto-print when page loads
    newTab.onload = function() {
        newTab.print();
    };
};

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Helper function to format currency
const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    return parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// Helper function to generate item rows
const generateItemRows = (items) => {
    if (!items || items.length === 0) {
        return '<tr><td colspan="5" style="text-align: center; color: #666; font-style: italic;">No items found</td></tr>';
    }

    return items.map(item => `
        <tr>
            <td>${item.itemcode || 'N/A'}</td>
            <td>${item.itemname || 'N/A'}</td>
            <td style="text-align: center;">${item.quantity || 0}</td>
            <td style="text-align: right;">Rs. ${formatCurrency(item.unitprice)}</td>
            <td style="text-align: right;">Rs. ${formatCurrency(item.linetotal)}</td>
        </tr>
    `).join('');
};