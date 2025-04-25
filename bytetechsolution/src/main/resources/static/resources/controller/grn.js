window.addEventListener('load', () => {
    refreshGrnForm();
    refreshGrnTable();
})

const refreshGrnTable = () => {
    grns = getServiceAjaxRequest("/grn/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'grncode' },
        { dataType: 'function', propertyName: getPurchaseRequest },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'text', propertyName: 'discountrate' },
        { dataType: 'text', propertyName: 'finalamount' },
        { dataType: 'text', propertyName: 'reciveddate' },
        { dataType: 'function', propertyName: getGRNStatus },
    ];


    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    fillDataIntoTable(tableGRN, grns, displayPropertyList, refillGrnForm, divModifyButton)
        //table show with dataTable
    $('#tableGRN').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshGrnForm = () => {

    grn = new Object();
    serialNumbersVisible = false;
    serialNumbersData = new Array();

    purchaseRequests = getServiceAjaxRequest("/purchaserequest/prequestbyrequireddate")
    fillMultipleItemOfDataOnSignleSelectRecursion(selectPurchaseRequest, "Select Puchase Request", purchaseRequests, "requestcode", "supplier_id.name");

    grnstatus = getServiceAjaxRequest("/grnstatus/alldata")
    fillDataIntoSelect(selectGRNStatus, "Select GRN Status", grnstatus, "name")


    checkAndToggleButton()
    numberQuantity.addEventListener('keyup', () => {
        const newQty = parseInt(numberQuantity.value);
        console.log(newQty)

        if (newQty < serialNumbersData.length) {
            serialNumbersData = serialNumbersData.slice(0, newQty);
        } else {
            while (serialNumbersData.length < newQty) {
                serialNumbersData.push('');
            }
        }

        checkAndToggleButton();
        updateSerialNumberInputs();
    });

    selectItemName.addEventListener('input', () => {
        updateItemNameDisplay()
    });

    refeshInnerGrnFormAndTable();
}

const refeshInnerGrnFormAndTable = () => {
    //form

    grnItem = new Object();
    oldGrnItem = null;

    fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Purchase Request First", [], "itemcode", "itemname")
    selectPurchaseRequest.addEventListener('change', () => {
        const purchaseRequestedItem = selectValueHandler(selectPurchaseRequest);
        console.log("grn", purchaseRequestedItem)
        fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Select Item", purchaseRequestedItem.purchase_request_item, "itemcode", "itemname")

    })
    selectItemName.addEventListener('change', () => {
        const selectedItemName = selectValueHandler(selectItemName);
        grnItem.itemname = selectedItemName.itemname
        grnItem.itemcode = selectedItemName.itemcode

        numberQuantity.value = selectedItemName.quantity;
        decimalItemPrice.value = selectedItemName.unitprice;
        textValidator(numberQuantity, '^(100|[1-9][0-9]?)$', 'grnItem', 'quantity');
        textValidator(decimalItemPrice, '', 'grnItems', 'unitprice');


        decimalLineTotal.value = selectedItemName.lineprice
        numberQuantity.addEventListener('keyup', () => {
            const newQuantity = numberQuantity.value;
            decimalLineTotal.value = newQuantity * selectedItemName.unitprice
        })
        textValidator(decimalPurchasePrice, '', 'grnItem', 'lineprice');

    });
    //table
}

const refillGrnForm = () => {

}

// Function to check and toggle the button
const checkAndToggleButton = () => {
    const value = numberQuantity.value.trim();
    toggleSerialBtn.disabled = value === '' || Number(value) === 0;
}


//open the serial no container card
const toggleSerialNoContent = () => {
    // once a button was clicked, card content changes
    serialNumbersVisible = !serialNumbersVisible;
    serialNumbersSection.style.display = serialNumbersVisible ? 'block' : 'none';
    toggleSerialBtn.textContent = serialNumbersVisible ? 'Hide Serial Numbers' : 'Add Serial Numbers';
    numberQuantity.disabled = serialNumbersVisible ? true : false;

    if (serialNumbersVisible) {
        updateSerialNumberInputs();
        updateItemNameDisplay();
    }
}

const updateItemNameDisplay = () => {
    const name = selectItemName.value.trim() || 'Item';
    selectItemName.textContent = name;
}

const updateSerialNumberInputs = () => {
    serialNumbersContainer.innerHTML = '';
    const quantity = parseInt(numberQuantity.value) || 0;

    for (let i = 0; i < quantity; i++) {
        // Create a new row for every two inputs
        if (i % 2 === 0) {
            var row = document.createElement('div');
            row.className = 'row mb-2';
            serialNumbersContainer.appendChild(row);
        }

        const col = document.createElement('div');
        col.className = 'col-md-6 mb-2';
        col.innerHTML = `
            <label class="form-label">Serial #${i + 1}</label>
            <input type="text" class="form-control serial-input" 
                placeholder="Enter serial number ${i + 1}" 
                value="${serialNumbersData[i] || ''}">
        `;
        row.appendChild(col);
    }

    document.querySelectorAll('.serial-input').forEach((input, index) => {
        input.addEventListener('input', () => {
            serialNumbersData[index] = input.value;
        });
    });
}

const getPurchaseRequest = (ob) => {

}

const getGRNStatus = (ob) => {

}