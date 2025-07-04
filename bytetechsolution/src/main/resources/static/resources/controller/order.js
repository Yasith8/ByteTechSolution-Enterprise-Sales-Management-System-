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

    invoice = new Object();
    oldInvoice = null;

    invoice.invoice_item = new Array()

    //load customer data
    const customers = getServiceAjaxRequest('/customer/alldata')
    $('#selectCustomer').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#selectCustomer').parent(),
        width: '100%'
    })
    fillMultipleItemOfDataIntoSingleSelect(selectCustomer, "Select Customer Details", customers, 'name', 'mobile')


    selectInvoiceStatus.disabled = true;
    const invoicestatus = getServiceAjaxRequest("/invoicestatus/alldata")
    fillDataIntoSelect(selectInvoiceStatus, "Select the Order Status", invoicestatus, 'name', invoicestatus[0].name)

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
        selectedMaxSeasonalDiscount = validDiscounts.reduce((max, current) =>
            current.profitrate > max.discountrate ? current : max
        );
    }
    console.log("SUITALBE DISCOUNT", selectedMaxSeasonalDiscount)

    if (selectedMaxSeasonalDiscount) {
        fillDataIntoSelect(selectSeasonalDiscount, "Seasonal Discount", [selectedMaxSeasonalDiscount], 'name');
    } else {
        fillDataIntoSelect(selectSeasonalDiscount, "No Seasonal Discount", [], 'name');
    }

    refreshInnerOrderTableAndForm()
}

const refreshInnerOrderTableAndForm = () => {
    invoiceItem = new Object();

    buttonInnerSubmit.classList.remove('elementHide')
    buttonInnerUpdate.classList.add('elementHide')

    //calculate total amount when the refesh the inner form
    decimalTotalAmount.disabled = true;
    const totalAmount = calculateTotalAmount();
    decimalTotalAmount.value = totalAmount;
    invoice.totalamount = parseFloat(totalAmount);

    let selectedSeasonalDiscount = selectComplexValueHandler(selectSeasonalDiscount)
    console.log("SEASONAL DISCOUNT", selectedSeasonalDiscount)
    if (selectedSeasonalDiscount && selectedSeasonalDiscount.profitrate) {
        const profitRate = parseFloat(selectedSeasonalDiscount.profitrate);
        const discountAmount = parseFloat(totalAmount) * (profitRate / 100);
        const finalAmount = parseFloat(totalAmount) - discountAmount;

        decimalFinalAmount.value = finalAmount.toFixed(2);
    } else {
        decimalFinalAmount.value = parseFloat(totalAmount).toFixed(2);
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
        invoice.category_id = null;
        invoice.itemname_id = null;
        removeValidationColor([selectItemName])
        invoice.serialno = null;
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
        invoice.serialno = null;
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
            selectSerialNo.disabled = true;
            numberQuantity.value = ""; //clear prev value
            numberQuantity.addEventListener('input', () => {
                const quantity = parseInt(numberQuantity.value || "0"); // Handle empty input
                invoiceItem.quantity = quantity;
                invoiceItem.lineprice = quantity * itemprice;
                decimalLinePrice.value = invoiceItem.lineprice;
            })
        } else {
            numberQuantity.disabled = true;
            selectSerialNo.disabled = false;
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

    refreshInnerOrderTableAndForm()
}

const getCustomerName = (ob) => {

}

const getInvoiceStatus = (ob) => {

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
        inventory.itemcode === invoiceItem.itemcode &&
        !existingSerialNos.includes(inventory.serialno)
    );

    console.log("Available Inventory Items after filtering:", availableInventoryItems);
    return availableInventoryItems;
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

    let selectedCategory = selectValueHandler(selectCategory)
    let selectedItemName = selectValueHandler(selectItemName)
    numberWarranty.value = ob.warranty;

    if (selectedCategory.name != "Accessories") {
        numberQuantity.disabled = true;
        numberQuantity.value = ob.quantity;
        decimalLinePrice.value = ob.lineprice;
        decimalItemPrice.value = ob.itemprice;
    } else {
        numberQuantity.disabled = false;
        numberQuantity.value = ob.quantity;

        numberQuantity.addEventListener('input', () => {
            const newQuantity = parseFloat(numberQuantity.value);

            const itemPrice = parseFloat(ob.itemprice)
            const newLineTotal = (newQuantity * ob.itemprice).toFixed(2);

            // Update the purchase request item object
            invoiceItem.quantity = newQuantity;
            invoiceItem.itemprice = itemPrice;
            decimalItemPrice.value = newLineTotal;
            invoiceItem.lineprice = parseFloat(newLineTotal);
            decimalLinePrice.value = newLineTotal;
        })
    }


}

const deleteInnerInvoiceItemForm = () => {

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
    //error checking
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
                const { serialno, itemname_id, ...rest } = invoiceItem;
                updatedInvoiceItem = {...rest, serial_no: serialno.serialno }
                console.log("UPDATED INVOICE ITEM", updatedInvoiceItem)

                invoice.invoice_item.push(updatedInvoiceItem);
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
                                invoice.invoice_item.push(updatedInvoiceItem);
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