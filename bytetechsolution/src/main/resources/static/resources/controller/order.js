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


    //load customer data
    const customers = getServiceAjaxRequest('/customer/alldata')
    $('#selectCustomer').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#selectCustomer').parent(),
        width: '100%'
    })
    fillMultipleItemOfDataIntoSingleSelect(selectCustomer, "Select Customer Details", customers, 'name', 'mobile')

    const seasonalDiscount = getServiceAjaxRequest('/seasonaldiscount/alldata')
    fillDataIntoSelect(selectSeasonalDiscount, "Select the seasonal discounts", seasonalDiscount, 'name')

    const invoicestatus = getServiceAjaxRequest("/invoicestatus/alldata")
    fillDataIntoSelect(selectInvoiceStatus, "Select the Order Status", invoicestatus, 'name')

    refreshInnerOrderTableAndForm()
}

const refreshInnerOrderTableAndForm = () => {
    invoiceItem = new Object();

    buttonInnerSubmit.classList.remove('elementHide')
    buttonInnerUpdate.classList.add('elementHide')

    decimalSalesPrice.disabled = true;
    decimalLinePrice.disabled = true;
    numberWarranty.disabled = true;
    //form
    categories = getServiceAjaxRequest("/category/alldata")
    fillDataIntoSelect(selectCategory, "Select the Category", categories, 'name')

    selectCategory.addEventListener('change', () => {
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

        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Category", uniqueFilteredItems, 'itemcode', 'itemname')


    })

    selectItemName.addEventListener('change', () => {
        const selectedItem = selectValueHandler(selectItemName)
        console.log("SELECR", selectedItem)

        const serialNos = filterAvailableInvoiceItems(filteredCategoryInventoryItems, selectedItem)
        console.log("TEST", serialNos)
        fillDataIntoSelect(selectSerialNo, "Select the Serial Number", serialNos, 'serialno')

        invoiceItem.salesprice = selectedItem.salesprice;
        decimalSalesPrice.value = invoiceItem.salesprice;

        const selectedCategory = selectValueHandler(selectCategory)
        if (selectedCategory.name == "Accessories") {
            numberQuantity.disabled = false;
            numberQuantity.addEventListener('input', () => {
                invoiceItem.quantity = numberQuantity.value;
                invoiceItem.lineprice = invoiceItem.quantity * invoiceItem.salesprice
            })
        } else {
            numberQuantity.disabled = true;
            numberQuantity.value = 1;
            invoiceItem.quantity = numberQuantity.value;
            invoiceItem.lineprice = invoiceItem.quantity * invoiceItem.salesprice
        }

        //get item warranty
        selectedItemData = getServiceAjaxRequest(`/${(selectedCategory.name).toLowerCase()}/filteritem?itemcode=${selectedItem.itemcode}`)
        console.log('selected data', selectedItemData)

        numberWarranty.value = selectedItemData[0].warranty
        invoiceItem.warranty = selectedItemData[0].warranty

    })

    //table
    let displayPropertyList = [
        { dataType: 'text', propertyName: "serialno" },
        { dataType: 'text', propertyName: "itemcode" },
        { dataType: 'text', propertyName: "itemname" },
        { dataType: 'text', propertyName: "unitprice" },
        { dataType: 'text', propertyName: "quantity" },
        { dataType: 'text', propertyName: "linetotal" },
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

const filterAvailableInvoiceItems = (inventories, invoiceItem) => {

    // check the inventory item code is in the existing item codes then filter it 
    const availableInventoryItems = inventories.filter(inventory =>
        invoiceItem.itemcode.includes(inventory.itemcode)
    );

    console.log("Available Inventory Items after filtering:", availableInventoryItems);
    return availableInventoryItems;
};

const refillInnerInvoiceItemForm = () => {

}

const deleteInnerInvoiceItemForm = () => {

}

const innerOrderAdd = () => {
    console.log("Invoice Inner Items", invoiceItem)
}

const innerOrderUpdate = () => {

}