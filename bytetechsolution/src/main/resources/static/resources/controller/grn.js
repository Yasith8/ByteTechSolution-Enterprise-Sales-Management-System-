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
    grn.grn_item = new Array();
    grn.serial_no_list = new Array();



    //gatta all the pr that required date not expired
    purchaseRequests = getServiceAjaxRequest("/purchaserequest/prequestbyrequireddate")
    fillMultipleItemOfDataOnSignleSelectRecursion(selectPurchaseRequest, "Select Puchase Request", purchaseRequests, "requestcode", "supplier_id.name");

    //grn eka
    grnstatus = getServiceAjaxRequest("/grnstatus/alldata")
    fillDataIntoSelect(selectGRNStatus, "Select GRN Status", grnstatus, "name")


    //auto generate karanawa total amount eka
    decimalTotalAmount.disabled = true;
    let totalAmount = 0
    grn.grn_item.forEach(item => {
        totalAmount += item.linetotal
    });
    decimalTotalAmount.value = totalAmount;
    textValidator(decimalTotalAmount, '', 'grn', 'totalamount')

    decimalTotalAmount.add





    refeshInnerGrnFormAndTable();
}

const refeshInnerGrnFormAndTable = () => {
    //form

    grnItem = new Object();
    oldGrnItem = null;
    serialNumbersData = new Array();
    serialNoWithDetails = new Object();
    serialNoList = new Array();

    numberQuantity.addEventListener('input', () => {
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

    fillMultipleItemOfDataIntoSingleSelect(selectPRItemName, "Select Purchase Request First", [], "itemcode", "itemname")
    selectPurchaseRequest.addEventListener('change', () => {
        //grn.selectItemName_id = null;
        removeValidationColor([selectPRItemName]);
        const purchaseRequestedItem = selectValueHandler(selectPurchaseRequest);
        fillMultipleItemOfDataIntoSingleSelect(selectPRItemName, "Select Item", purchaseRequestedItem.purchase_request_item, "itemcode", "itemname")


    })

    selectPRItemName.addEventListener('change', () => {
        const selectedItemName = selectValueHandler(selectPRItemName);
        grnItem.itemname = selectedItemName.itemname
        grnItem.itemcode = selectedItemName.itemcode


        grnItem.category_id = selectedItemName.category_id;
        numberQuantity.value = selectedItemName.quantity;
        const maxQty = selectedItemName.quantity;
        const qtyPattern = generateRangeRegex(maxQty);
        console.log(qtyPattern.source)
        textValidator(numberQuantity, qtyPattern.source, 'grnItem', 'quantity');

        decimalPurchasePrice.disabled = true;
        decimalPurchasePrice.value = selectedItemName.unitprice;
        textValidator(decimalPurchasePrice, '', 'grnItem', 'purchaseprice');


        decimalLinePrice.value = selectedItemName.linetotal
        decimalLinePrice.disabled = true;
        textValidator(decimalPurchasePrice, '', 'grnItem', 'lineprice');
        numberQuantity.addEventListener('keyup', () => {
            grnItem.quantity = null;
            numberQuantity.classList.remove('is-valid')
            const newQuantity = numberQuantity.value;
            //code eka validate karanawa pr eke quantity ekata wada ba kiyala
            if (newQuantity > selectedItemName.quantity || newQuantity < 1) {
                numberQuantity.classList.remove('is-valid')
                numberQuantity.classList.add('is-invalid')
                decimalLinePrice.value = 0
                toggleSerialBtn.disabled = true;

            } else {
                numberQuantity.classList.remove('is-invalid')
                numberQuantity.classList.add('is-valid');
                decimalLinePrice.value = newQuantity * selectedItemName.unitprice
                textValidator(decimalLinePrice, '', 'grnItem', 'lineprice');
                toggleSerialBtn.disabled = false;
                grnItem.quantity = newQuantity;

            }
        })

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
    }
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

const checkInnerItemFormErrors = () => {
    let errors = ""

    if (grnItem.itemname_id == null) {
        errors += "Item selection is required.\n"
    }
    if (grnItem.quantity == null) {
        errors += "Quantity is required.\n"
    }

    return errors;
}

const innerSupplierProductAdd = () => {
    //destructure the pr irem code for remove itemname_id
    const { itemname_id, ...rest } = grnItem;
    updatedGRNItem = rest;
    serialNumbersData.forEach(seialNo => {
        const { category_id, itemcode, itemname, purchaseprice, ...rest } = updatedGRNItem;
        serialNoWithDetails = { category_id: category_id, itemcode: itemcode, itemname: itemname, status: true, serialno: seialNo }
        serialNoList.push(serialNoWithDetails)
    })
    console.log("GRN", grn)
    console.log("GRN ITEM", updatedGRNItem)
    console.log("SERIAL NO LIST", serialNoList)
}