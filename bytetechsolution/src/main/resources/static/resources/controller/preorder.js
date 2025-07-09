window.addEventListener('load', () => {
    refreshOrderTable()
    refreshOrderForm()
})

const refreshOrderTable = () => {
    //load the order data
    orders = getServiceAjaxRequest("/invoice/alldata")
    const displayColumnList = [
        { dataType: 'text', propertyName: 'invoiceno' },
        { dataType: 'function', propertyName: getCustomerName },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'text', propertyName: 'finalamount' },
        { dataType: 'function', propertyName: getInvoiceStatus },
    ]

    fillDataIntoTable(tableOrders, orders, displayColumnList, refillOrdersForm, divModifyButton)

    $('#tableOrders').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}
const refreshOrderForm = () => {
    //form config
    decimalTotalAmount.disabled = true;
    decimalFinalAmount.disabled = true;

    btnUpdate.classList.add('elementHide')
    btnSubmit.classList.remove('elementHide')
    removeValidationColor([selectCustomer])

    invoice = new Object();
    oldInvoice = null;

    invoice.invoice_item = new Array()
    selectCustomer.disabled = false;

    staticBackdropLabel.textContent = "Add New Pre Order";

    decimalBalance.disabled = true;

    //load customer data
    const customers = getServiceAjaxRequest('/customer/getallactivecustomers')
    $('#selectCustomer').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#selectCustomer').parent(),
        width: '100%'
    })
    fillMultipleItemOfDataIntoSingleSelect(selectCustomer, "Select Customer Details", customers, 'name', 'mobile')


    selectInvoiceStatus.disabled = true;
    const invoicestatus = getServiceAjaxRequest("/invoicestatus/alldata")
    fillDataIntoSelect(selectInvoiceStatus, "Select the Order Status", invoicestatus, 'name', invoicestatus[1].name)

    //seasonal discount selection
    selectSeasonalDiscount.disabled = true;
    const seasonalDiscount = getServiceAjaxRequest('/seasonaldiscount/alldata')
    console.log("SEASONAL DISCOUNTS", seasonalDiscount)
    let currentDate = getCurrentDate(new Date())
    console.log("CURRENT DATE", currentDate)
        //if multiple sesasonal discount availbe - filter if need one find
    let suitableDiscount = seasonalDiscount.filter(discount =>
        discount.startdate <= currentDate && discount.enddate >= currentDate
    );

    //if multiple discount hv to the same date, it will select the max one automatically
    let selectedMaxSeasonalDiscount = null;
    if (suitableDiscount.length > 0) {
        selectedMaxSeasonalDiscount = suitableDiscount.reduce((max, current) =>
            current.profitrate > max.discountrate ? current : max
        );
    }
    console.log("SUITALBE DISCOUNT", selectedMaxSeasonalDiscount)

    if (selectedMaxSeasonalDiscount) {
        selectedDiscount = [selectedMaxSeasonalDiscount][0];
        fillDataIntoSelect(selectSeasonalDiscount, "Seasonal Discount", [selectedMaxSeasonalDiscount], 'name', selectedDiscount.name);
        invoice.seasonaldiscount_id = selectedDiscount;
    } else {
        seasonaldiscounts = getServiceAjaxRequest('/seasonaldiscount/alldata')
        noDiscount = seasonaldiscounts.filter((discount) => discount.id == 6);
        fillDataIntoSelect(selectSeasonalDiscount, "No Seasonal Discount", noDiscount, 'name', noDiscount[0].name);
        invoice.seasonaldiscount_id = noDiscount[0];
    }

    // Updated paid amount validation with max limit
    decimalPaidAmount.addEventListener('input', () => {
        const paidAmount = parseFloat(decimalPaidAmount.value) || 0;
        const finalAmount = parseFloat(invoice.finalamount) || 0;

        // Validate that paid amount doesn't exceed final amount
        if (paidAmount > finalAmount) {
            decimalPaidAmount.value = finalAmount.toFixed(2);
            invoice.paidamount = finalAmount;
            fillDataIntoSelect(selectInvoiceStatus, "Select the Order Status", invoicestatus, 'name', invoicestatus[0].name)
        } else {
            // Update invoice object with valid amount
            invoice.paidamount = paidAmount;
            fillDataIntoSelect(selectInvoiceStatus, "Select the Order Status", invoicestatus, 'name', invoicestatus[1].name)
        }

        // Calculate balance
        const balance = finalAmount - (invoice.paidamount || 0);

        // Update balance display 
        decimalBalance.value = balance.toFixed(2);
        invoice.balance = balance;
    });

    // Set max attribute for paid amount input when final amount changes
    const updatePaidAmountMax = () => {
        const finalAmount = parseFloat(invoice.finalamount) || 0;
        decimalPaidAmount.setAttribute('max', finalAmount);
        decimalPaidAmount.setAttribute('step', '0.01');
        decimalPaidAmount.setAttribute('min', '0');
    };



    refreshInnerOrderTableAndForm()
}

const refreshInnerOrderTableAndForm = () => {
    invoiceItem = new Object();

    buttonInnerSubmit.classList.remove('elementHide')
    buttonInnerUpdate.classList.add('elementHide')

    staticBackdropLabel.textContent = "Add New Order";

    //calculate total amount when the refesh the inner form
    decimalTotalAmount.disabled = true;
    const totalAmount = calculateTotalAmount();
    decimalTotalAmount.value = totalAmount;
    invoice.totalamount = parseFloat(totalAmount);

    availableQtyMsg.classList.add('elementHide')

    let selectedSeasonalDiscount = selectComplexValueHandler(selectSeasonalDiscount)
    console.log("SEASONAL DISCOUNT", selectedSeasonalDiscount)
    if (selectedSeasonalDiscount && selectedSeasonalDiscount.profitrate) {
        const profitRate = parseFloat(selectedSeasonalDiscount.profitrate);
        const discountAmount = parseFloat(totalAmount) * (profitRate / 100);
        const finalAmount = parseFloat(totalAmount) - discountAmount;

        decimalFinalAmount.value = finalAmount.toFixed(2);
        invoice.finalamount = finalAmount.toFixed(2)
    } else {
        decimalFinalAmount.value = parseFloat(totalAmount).toFixed(2);
        invoice.finalamount = parseFloat(totalAmount).toFixed(2);
    }


    removeValidationColor([selectItemName, decimalItemPrice, numberQuantity, decimalLinePrice, selectSerialNo, selectCategory])

    decimalItemPrice.disabled = true;
    decimalLinePrice.disabled = true;
    numberWarranty.disabled = true;
    //form
    categories = getServiceAjaxRequest("/category/alldata")
    fillDataIntoSelect(selectCategory, "Select the Category", categories, 'name')
    fillDataIntoSelect(selectSerialNo, "First Select the Category", [], 'serialno')

    fillMultipleItemOfDataIntoSingleSelect(selectItemName, "First Select Category", [], 'itemcode', 'itemname')
    selectCategory.addEventListener('change', () => {
        invoiceItem.itemname_id = null;
        removeValidationColor([selectItemName])
        invoiceItem.serialno = null;
        removeValidationColor([selectSerialNo])

        const selectedCategory = selectValueHandler(selectCategory)
        const categoryItems = getServiceAjaxRequest(`/${(selectedCategory.name).toLowerCase()}/filteritem`)
        console.log("CategoryItem", categoryItems)
        const inventryItems = getServiceAjaxRequest('/inventory/alldata')
        console.log("inventoryItems", inventryItems)

        filteredCategoryInventoryItems = filterInventoryItems(inventryItems, categoryItems)
        console.log("Filtered Category Inventory", filteredCategoryInventoryItems)

        const uniqueFilteredItems = [];
        const seenItemCodes = new Set();

        for (const item of filteredCategoryInventoryItems) {
            if (!seenItemCodes.has(item.itemcode)) {
                seenItemCodes.add(item.itemcode);
                uniqueFilteredItems.push(item);
            }
        }

        console.log("Unique Filtered Category Inventory", uniqueFilteredItems);

        fillDataIntoSelect(selectSerialNo, "First Select Item", [], 'serialno')
        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Category", uniqueFilteredItems, 'itemcode', 'itemname')


    })

    //when the select the itemname
    selectItemName.addEventListener('change', () => {
        invoiceItem.serialno = null;
        removeValidationColor([selectSerialNo])

        const selectedItem = selectValueHandler(selectItemName)
        console.log("SELECR", selectedItem)

        invoiceItem.itemcode = selectedItem.itemcode;
        invoiceItem.itemname = selectedItem.itemname;



        invoiceItem.itemprice = selectedItem.salesprice;
        decimalItemPrice.value = invoiceItem.itemprice;

        const selectedCategory = selectValueHandler(selectCategory)
        if (selectedCategory.name == "Accessories") {
            numberQuantity.disabled = false;
            numberQuantity.value = ""; // clear prev value

            const serialNos = filterAvailableAssessoriesInvoiceItems(filteredCategoryInventoryItems, selectedItem, invoice.invoice_item)
            console.log("Accessories Serial No", serialNos)

            if (serialNos.length > 0) {
                // Find the maximum available quantity across all serial numbers
                const maxAvailableQuantity = Math.max(...serialNos.map(item => item.quantity));

                numberQuantity.setAttribute("max", maxAvailableQuantity);
                numberQuantity.setAttribute("min", 1);
                availableQtyMsg.classList.remove('elementHide')
                availableQtyMsg.innerText = `Available quantity: ${maxAvailableQuantity}`;

                fillDataIntoSelect(selectSerialNo, "Select the Serial Number", serialNos, 'serialno')

                // Remove any existing event listeners to avoid duplicates
                numberQuantity.removeEventListener('input', quantityInputHandler);

                // Add new event listener
                numberQuantity.addEventListener('input', quantityInputHandler);

                function quantityInputHandler() {
                    let quantity = parseInt(numberQuantity.value || "0");
                    if (quantity > maxAvailableQuantity) {
                        numberQuantity.value = maxAvailableQuantity;
                        quantity = maxAvailableQuantity;
                    }
                    if (quantity < 1) {
                        numberQuantity.value = 1;
                        quantity = 1;
                    }
                    invoiceItem.quantity = quantity;
                    invoiceItem.lineprice = quantity * invoiceItem.itemprice;
                    decimalLinePrice.value = invoiceItem.lineprice.toFixed(2);
                }
            } else {
                // No stock available
                numberQuantity.setAttribute("max", 0);
                numberQuantity.setAttribute("min", 0);
                numberQuantity.value = 0;
                availableQtyMsg.innerText = `Available quantity: 0 (Out of Stock)`;
                fillDataIntoSelect(selectSerialNo, "Out of Stock", [], 'serialno')
            }
        } else {
            numberQuantity.disabled = true;
            selectSerialNo.disabled = false;
            availableQtyMsg.classList.add('elementHide')
            numberQuantity.value = 1;
            invoiceItem.quantity = 1;
            invoiceItem.lineprice = 1 * parseFloat(invoiceItem.itemprice)
            console.log("type of:::", typeof invoiceItem.quantity, " || Quantity::", invoiceItem.quantity)
            decimalLinePrice.value = invoiceItem.lineprice;
            const serialNos = filterAvailableInvoiceItems(filteredCategoryInventoryItems, selectedItem, invoice.invoice_item)
            console.log("TEST", serialNos)
            fillDataIntoSelect(selectSerialNo, "Select the Serial Number", serialNos, 'serialno')
        }

        //get item warranty
        selectedItemData = getServiceAjaxRequest(`/${(selectedCategory.name).toLowerCase()}/filteritem?itemcode=${selectedItem.itemcode}`)
        console.log('selected data', selectedItemData)

        numberWarranty.value = selectedItemData[0].warranty
        invoiceItem.warranty = selectedItemData[0].warranty

    })

    //table
    let displayPropertyList = [
        { dataType: 'text', propertyName: "serial_no" },
        { dataType: 'text', propertyName: "itemcode" },
        { dataType: 'text', propertyName: "itemname" },
        { dataType: 'text', propertyName: "itemprice" },
        { dataType: 'text', propertyName: "quantity" },
        { dataType: 'text', propertyName: "lineprice" },
    ]

    fillDataIntoInnerTable(innerInvoiceItemTable, invoice.invoice_item, displayPropertyList, refillInnerInvoiceItemForm, deleteInnerInvoiceItemForm)

}


const refillOrdersForm = (ob, rowIndex) => {
    invoice = JSON.parse(JSON.stringify(ob));
    oldInvoice = ob;

    btnUpdate.classList.remove('elementHide')
    btnSubmit.classList.add('elementHide')

    $('#orderAddModal').modal('show');
    staticBackdropLabel.textContent = invoice.requestcode;

    selectCustomer.disabled = true;

    const customers = getServiceAjaxRequest('/customer/getallactivecustomers')
    $('#selectCustomer').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#selectCustomer').parent(),
        width: '100%'
    })
    fillMultipleItemOfDataIntoSingleSelect(selectCustomer, "Select Customer Details", customers, 'name', 'mobile', invoice.customer_id.name, invoice.customer_id.mobile)


    selectInvoiceStatus.disabled = true;
    const invoicestatus = getServiceAjaxRequest("/invoicestatus/alldata")
    fillDataIntoSelect(selectInvoiceStatus, "Select the Order Status", invoicestatus, 'name', invoice.invoicestatus_id.name)

    //seasonal discount selection
    selectSeasonalDiscount.disabled = true;
    const seasonalDiscount = getServiceAjaxRequest('/seasonaldiscount/alldata')
    console.log("SEASONAL DISCOUNTS", seasonalDiscount)
    let currentDate = getCurrentDate(new Date())
    console.log("CURRENT DATE", currentDate)
        //if multiple sesasonal discount availbe - filter if need one find
    let suitableDiscount = seasonalDiscount.filter(discount =>
        discount.startdate <= currentDate && discount.enddate >= currentDate
    );

    //if multiple discount hv to the same date, it will select the max one automatically
    let selectedMaxSeasonalDiscount = null;
    if (suitableDiscount.length > 0) {
        selectedMaxSeasonalDiscount = suitableDiscount.reduce((max, current) =>
            current.profitrate > max.discountrate ? current : max
        );
    }
    console.log("SUITALBE DISCOUNT", selectedMaxSeasonalDiscount)

    if (selectedMaxSeasonalDiscount) {
        selectedDiscount = [selectedMaxSeasonalDiscount][0];
        fillDataIntoSelect(selectSeasonalDiscount, "Seasonal Discount", [selectedMaxSeasonalDiscount], 'name', invoice.seasonaldiscount_id.name);
    } else {
        seasonaldiscounts = getServiceAjaxRequest('/seasonaldiscount/alldata')
        noDiscount = seasonaldiscounts.filter((discount) => discount.id == 6);
        fillDataIntoSelect(selectSeasonalDiscount, "No Seasonal Discount", noDiscount, 'name', invoice.seasonaldiscount_id.name);
    }


    console.log("SELECTED INVOICE STATUS", invoice.invoicestatus_id)

    if (invoice.invoicestatus_id.name == "Deleted") {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    refreshInnerOrderTableAndForm()
}

const getCustomerName = (ob) => {
    return ob.customer_id.name;
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

const filterInventoryItems = (inventoryItems, categoryItems) => {
    //get all catecory item's itemcodes
    const existingItemCodes = categoryItems.map(item => item.itemcode);

    // check the inventory item code is in the existing item codes then filter it 
    const availableInventoryItems = inventoryItems.filter(inventory =>
        existingItemCodes.includes(inventory.itemcode)
    );

    console.log("Available Inventory Items after filtering:", availableInventoryItems);
    return availableInventoryItems;
};

const filterAvailableInvoiceItems = (inventories, invoiceItem, invoiceTableItems) => {
    const existingSerialNos = invoiceTableItems.map(item => item.serial_no);

    const availableInventoryItems = inventories.filter(inventory =>
        inventory.itemcode === invoiceItem.itemcode && inventory.status != false &&
        !existingSerialNos.includes(inventory.serialno)
    );

    console.log("Available Inventory Items after filtering:", availableInventoryItems);
    return availableInventoryItems;
};

const filterAvailableAssessoriesInvoiceItems = (inventories, selectedItem, invoiceTableItems) => {
    // Step 1: Count how many times each serialno is used in invoiceTableItems for this specific item
    const usedSerialCounts = {};
    for (const item of invoiceTableItems) {
        if (item.itemcode === selectedItem.itemcode) {
            usedSerialCounts[item.serial_no] = (usedSerialCounts[item.serial_no] || 0) + parseInt(item.quantity);
        }
    }

    // Step 2: Count available quantity in inventory for each serial number
    const inventoryCounts = {};
    for (const inv of inventories) {
        if (inv.itemcode === selectedItem.itemcode && inv.status !== false) {
            inventoryCounts[inv.serialno] = (inventoryCounts[inv.serialno] || 0) + parseInt(inv.quantity);
        }
    }

    // Step 3: Calculate available quantity for each serial number
    const availableSerials = [];
    for (const serialno in inventoryCounts) {
        const availableQty = inventoryCounts[serialno] - (usedSerialCounts[serialno] || 0);
        if (availableQty > 0) {
            availableSerials.push({
                serialno: serialno,
                quantity: availableQty
            });
        }
    }

    console.log("Used serial counts:", usedSerialCounts);
    console.log("Inventory counts:", inventoryCounts);
    console.log("Available serials with quantities:", availableSerials);

    return availableSerials;
};


const calculateTotalAmount = () => {
    let totalAmount = 0;
    invoice.invoice_item.forEach(item => {
        const lineTotal = parseFloat(item.lineprice) || 0;
        totalAmount += lineTotal;
    });
    return totalAmount.toFixed(2);
};

const refillInnerInvoiceItemForm = (ob, rowIndex) => {
    OldInvoiceItem = ob;
    document.querySelectorAll('.inner-delete-btn').forEach((btn) => {
        btn.classList.add('custom-disabled');
    });


    document.querySelectorAll('.inner-edit-button').forEach((btn) => {
        btn.classList.add('custom-disabled');
    });

    buttonInnerSubmit.classList.add('elementHide')
    buttonInnerUpdate.classList.remove('elementHide')

    if (ob.category_id.name !== "Accessories") {
        Swal.fire({
            title: "Edit Not Allowed",
            text: "Editing is only allowed for Accessories items.",
            icon: "info",
            confirmButtonColor: "#103D45"
        });
        orderItemForm.reset();
        refreshInnerOrderTableAndForm();
    } else {
        const invoiceItemArray = new Array();
        invoiceItemArray.push(ob);

        selectCategory.disabled = true;
        selectItemName.disabled = true;
        selectSerialNo.disabled = true;
        fillDataIntoSelect(selectCategory, "Select Category", invoiceItemArray, "name", ob.category_id.name)
        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select item", invoiceItemArray, "itemcode", "itemname", ob.itemcode, ob.itemname)
        fillDataIntoSelect(selectSerialNo, "Select Serial No", invoiceItemArray, "name", ob.serial_no)

        decimalItemPrice.disabled = true;
        decimalLinePrice.disabled = true;
        numberWarranty.disabled = true;

        numberWarranty.value = ob.warranty;


        numberQuantity.disabled = false;
        numberQuantity.value = ob.quantity;

        numberQuantity.addEventListener('input', () => {
            const newQuantity = parseFloat(numberQuantity.value);

            const itemPrice = parseFloat(ob.itemprice)
            const newLineTotal = (newQuantity * ob.itemprice).toFixed(2);

            // Update the invoice item object
            invoiceItem.quantity = newQuantity;

            invoiceItem.itemprice = itemPrice;
            decimalItemPrice.value = newLineTotal;

            invoiceItem.lineprice = parseFloat(newLineTotal);
            decimalLinePrice.value = invoiceItem.lineprice;
        })

    }

}

const deleteInnerInvoiceItemForm = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove item from the Invoice Item? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Delete",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            invoice.invoice_item.splice(rowIndex, 1);
            orderItemForm.reset();
            refreshInnerOrderTableAndForm();

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

const checkInnerInputErrors = () => {
    let errors = ""
    if (invoiceItem.category_id == null) {
        errors += "Item Category is required.\n"
    }
    if (invoiceItem.itemname_id == null) {
        errors += "Item selection is required.\n"
    }
    if (invoiceItem.quantity == null) {
        errors += "Atleast one quantity is required.\n"
    }
    if (invoiceItem.serialno == null) {
        errors += "Serial Number selection is required.\n If data not availble in the Serial Number dropdown current stock is Over\n"
    }
    return errors;
}

const innerOrderAdd = () => {
    let errors = checkInnerInputErrors();

    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add this product to the Order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, assign it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Invoice Inner Items", invoiceItem)

                const selectedCategory = selectValueHandler(selectCategory);

                if (selectedCategory.name === "Accessories") {
                    // For accessories, check if same item with same serial number already exists
                    const existingItemIndex = invoice.invoice_item.findIndex(item =>
                        item.itemcode === invoiceItem.itemcode &&
                        item.serial_no === invoiceItem.serialno.serialno
                    );

                    if (existingItemIndex !== -1) {
                        // Update existing item quantity
                        invoice.invoice_item[existingItemIndex].quantity = parseInt(invoice.invoice_item[existingItemIndex].quantity || "0") + parseInt(invoiceItem.quantity || "0");
                        invoice.invoice_item[existingItemIndex].lineprice = invoice.invoice_item[existingItemIndex].quantity * invoice.invoice_item[existingItemIndex].itemprice;
                    } else {
                        // Add new item
                        const { serialno, itemname_id, ...rest } = invoiceItem;
                        const updatedInvoiceItem = {...rest, serial_no: serialno.serialno };
                        invoice.invoice_item.push(updatedInvoiceItem);
                    }
                } else {
                    // For non-accessories, keep the original logic
                    const { serialno, itemname_id, ...rest } = invoiceItem;
                    const updatedInvoiceItem = {...rest, serial_no: serialno.serialno };
                    invoice.invoice_item.push(updatedInvoiceItem);
                }

                console.log("INVOICE BACKEND CODE:::::", invoice.invoice_item);

                Swal.fire({
                    title: "Success!",
                    text: "Items added to the Order successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    orderItemForm.reset();
                    refreshInnerOrderTableAndForm();
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
}

const checkInnerUpdate = () => {
    updates = "";
    if (invoiceItem.quantity != OldInvoiceItem.qunatity) {
        updates += "Quantity is changed. \n";
    }

    return updates;
}
const innerOrderUpdate = () => {
    let errors = checkInnerInputErrors();
    if (errors == "") {
        let updates = checkInnerUpdate();
        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated",
                text: "There are no any updates in Invoice Item Form",
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
                text: "Do you want to update Invoice Item Details?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#103D45",
                cancelButtonColor: "#F25454",
                confirmButtonText: "Yes",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Invoice Inner Items", invoiceItem)
                    const { serialno, itemname_id, ...rest } = invoiceItem;
                    updatedInvoiceItem = {...rest, serial_no: serialno.serialno }
                    console.log("UPDATED INVOICE ITEM", updatedInvoiceItem)

                    invoice.invoice_item.push(updatedInvoiceItem);
                    console.log("INVOICE BACKEND CODE:::::", invoice.invoice_item);

                    //purchase reqyest item obj eke hv the look
                    const invoiceItemIndex = invoice.invoice_item.findIndex((prItem) => prItem.itemcode === updatedInvoiceItem.itemcode);

                    //validate karanawa exist or not 
                    if (invoiceItemIndex !== -1) {
                        invoice.invoice_item[invoiceItemIndex] = updatedInvoiceItem;

                        Swal.fire({
                            title: "Success!",
                            text: "Items assigned to the Order successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            orderItemForm.reset();
                            refreshInnerOrderTableAndForm();
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
                                invoice.invoice_item.push(updatedInvoiceItem);
                                orderItemForm.reset();
                                refreshInnerOrderTableAndForm();
                            }
                        })
                    }
                }
            })
        }
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

const invoiceUserInputErrors = () => {
    let errors = '';

    if (invoice.customer_id == null) {
        errors += 'Customer is required.\n';
    }
    if (invoice.invoice_item.length == 0) {
        errors += 'At least one item must add into the invoice.\n';
    }
    return errors;
}

const submitOrder = () => {
    console.log("INVOICE:::", invoice)

    // Get paid amount from input field
    const paidAmount = parseFloat(decimalPaidAmount.value) || 0;

    // Create updated invoice with paid amount
    const updatedInvoice = {
        ...invoice,
        finalamount: parseFloat(invoice.finalamount),
        paidamount: paidAmount, //get user added paid amount
        balance: parseFloat(invoice.finalamount) - paidAmount // Calculate balance for backend
    };

    console.log("UPDATED INVOICE:::", updatedInvoice)

    const errors = invoiceUserInputErrors();

    if (errors == "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to checkout order?",
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

                $.ajax("/invoice", {
                    type: "POST",
                    data: JSON.stringify(updatedInvoice),
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
                        text: "Order placed successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        $('#orderAddModal').modal('hide');
                        //refreash Item form
                        refreshOrderTable();
                        //refreash Item table
                        refreshOrderForm();
                        //reset the Item form
                        formOrder.reset();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Order Checkout failed due to the following errors:<br>" + postServiceResponce,
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
            html: "Order Checkout failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}

const checkUserUpdates = () => {
    let updates = "";
    if (invoice.invoice_item.length != oldInvoice.invoice_item.length) {
        updates = updates + "Order Items Inner Form is Changed <br>";
    } else {
        for (let newInvoiceItem of invoice.invoice_item) {
            const matchOldInvoices = oldInvoice.invoice_item.find(oldInvoiceItem => oldInvoiceItem.id === newInvoiceItem.id);

            if (!matchOldInvoices) {
                updates = updates + "Order Items Inner Form is Changed <br>";
            }
        }
    }
    return updates;
}

const updateOrder = () => {
    const { finalamount, ...rest } = invoice;
    console.log("INVOICE:::", invoice)
    updatedInvoice = { finalamount: parseFloat(finalamount), paidamount: parseFloat(finalamount), balance: 0, ...rest };
    console.log("UPDATED INVOICE:::", updatedInvoice)

    let errors = invoiceUserInputErrors();

    if (errors == "") {
        let updates = checkUserUpdates();

        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated",
                text: "There are no any updates in Order Form",
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
                text: "Do you want to update the Order details?",
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

                    $.ajax("/invoice", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(updatedInvoice),


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
                            text: "Order update successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            $('#orderAddModal').modal('hide');
                            //refreash Item form
                            refreshOrderForm();
                            //refreash Item table
                            refreshOrderTable();
                            //reset the Item form
                            formOrder.reset();
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
            html: "Updation of Order failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}

const deleteOrder = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete following Order? " Order No: ${ob.invoiceno}`,
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
            $.ajax("/invoice", {
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
                    text: "Order Deleted Successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    $('#orderAddModal').modal('hide');
                    refreshOrderTable()
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Order Deletion failed due to the following errors:<br>" + deleteServiceResponse,
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
            $('#orderAddModal').modal('hide');
            formOrder.reset();
            divModifyButton.className = 'd-none';
            refreshOrderForm();
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
            refreshInnerOrderTableAndForm();

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

const refreshOrder = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Order Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refreshInnerOrderTableAndForm();
            refreshOrderForm();

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

const printOrder = (ob, rowIndex) => {
        // Helper function to format date
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
        };

        // Helper function to format currency
        const formatCurrency = (amount) => {
            if (!amount) return '0.00';
            return parseFloat(amount).toFixed(2);
        };

        // Helper function to generate item rows
        const generateItemRows = (items) => {
            console.log('PRINT ITEMS', items)
            if (!items || items.length === 0) {
                return `
                <tr>
                    <td colspan="7" style="text-align: center; color: #666; font-style: italic;">
                        No items found
                    </td>
                </tr>
            `;
            }

            return items.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.serial_no || 'N/A'}</td>
                <td>${item.itemcode || 'N/A'}</td>
                <td>${item.itemname_id?.name || item.itemname || 'N/A'}</td>
                <td>Rs. ${formatCurrency(item.itemprice)}</td>
                <td>${item.quantity || 1}</td>
                <td>Rs. ${formatCurrency(item.lineprice || (item.quantity * item.purchaseprice))}</td>
            </tr>
        `).join('');
        };

        // Create the complete HTML content for printing
        const printContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Invoice - ${ob.invoiceid || ob.id}</title>
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
                
                .customer-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 8px;
                    border-left: 4px solid #103d45;
                }
                
                .customer-box {
                    background: white;
                    padding: 15px;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .customer-label {
                    font-size: 12px;
                    font-weight: bold;
                    color: #666;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                    letter-spacing: 0.5px;
                }
                
                .customer-box > div:last-child {
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
                    background: #f0f9ff;
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
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 14px;
                }
                
                .total-row:last-child {
                    border-bottom: none;
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
                
                .status-section {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    border-left: 4px solid #10b981;
                }
                
                .status-header {
                    font-weight: bold;
                    color: #374151;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .status-content {
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .status-completed {
                    background: #dcfce7;
                    color: #166534;
                }
                
                .status-pending {
                    background: #fef3c7;
                    color: #92400e;
                }
                
                .status-cancelled {
                    background: #fee2e2;
                    color: #991b1b;
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
                    
                    .customer-details {
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
                    
                    .customer-details {
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
                        <div class="invoice-title">ORDER INVOICE</div>
                        <div class="invoice-details">
                            <div><span>INVOICE ID:</span><span>${ob.invoiceid || ob.id || 'N/A'}</span></div>
                            <div><span>DATE:</span><span>${formatDate(ob.addeddate || ob.date)}</span></div>
                        </div>
                    </div>
                </div>

                <!-- Customer Details -->
                <div class="customer-details">
                    <div class="customer-box">
                        <div class="customer-label">Customer</div>
                        <div>${ob.customer_id?.name || ob.customer?.name || 'N/A'}</div>
                    </div>
                    <div class="customer-box">
                        <div class="customer-label">Contact</div>
                        <div>${ob.customer_id?.mobile || ob.customer?.mobile || 'N/A'}</div>
                    </div>
                    <div class="customer-box">
                        <div class="customer-label">Email</div>
                        <div>${ob.customer_id?.email || ob.customer?.email || 'N/A'}</div>
                    </div>
                    <div class="customer-box">
                        <div class="customer-label">Status</div>
                        <div>
                            <span class="status-badge ${ob.invoicestatus_id?.name === 'Completed' ? 'status-completed' : 
                                                        ob.invoicestatus_id?.name === 'Pending' ? 'status-pending' : 
                                                        'status-cancelled'}">
                                ${ob.invoicestatus_id?.name || ob.status || 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Items Table -->
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 8%;">#</th>
                            <th style="width: 15%;">Serial No</th>
                            <th style="width: 15%;">Item Code</th>
                            <th style="width: 25%;">Item Name</th>
                            <th style="width: 12%;">Unit Price</th>
                            <th style="width: 10%;">Qty</th>
                            <th style="width: 15%;">Line Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateItemRows(ob.invoice_item)}
                    </tbody>
                </table>

                <!-- Totals Section -->
                <div class="totals-section">
                    <div class="totals-table">
                        <div class="total-row">
                            <div>Subtotal:</div>
                            <div>Rs. ${formatCurrency(ob.totalamount)}</div>
                        </div>
                        ${ob.seasonaldiscount_id ? `
                        <div class="total-row">
                            <div>Discount (${ob.seasonaldiscount_id.name}):</div>
                            <div>- Rs. ${formatCurrency(ob.totalamount - ob.finalamount)}</div>
                        </div>
                        ` : ''}
                        <div class="grand-total">
                            <div>TOTAL AMOUNT</div>
                            <div>Rs. ${formatCurrency(ob.finalamount || ob.totalamount)}</div>
                        </div>
                    </div>
                </div>

                <!-- Status Section -->
                <div class="status-section">
                    <div class="status-header">ORDER INFORMATION</div>
                    <div class="status-content">
                        <p><strong>Order Status:</strong> ${ob.invoicestatus_id?.name || ob.status || 'Pending'}</p>
                        <p><strong>Payment Status:</strong> ${ob.paidamount ? 'Paid' : 'Pending Payment'}</p>
                        <p>Thank you for your order. We appreciate your business and look forward to serving you again.</p>
                        <p>For any questions or concerns, please contact our customer service team.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="invoice-footer">
                    <p>If you have any questions about this invoice, please contact</p>
                    <p><strong>spinfo@bytetechsolution.gmail.com</strong></p>
                    <p>Thank you for choosing our services!</p>
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