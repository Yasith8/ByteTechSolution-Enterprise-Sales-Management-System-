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

    // Open a new tab
    const newTab = window.open();

    printPONO.textContent = ob.requestcode;
    printPODate.textContent = ob.addeddate;
    printSupplier.textContent = ob.supplier_id.name;
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