window.addEventListener('load', () => {
    refreshPurchaseRequestTable();
    refreshPurchaseRequestForm();
})


const refreshPurchaseRequestTable = () => {
    //get prequest data from db
    prequests = getServiceAjaxRequest("/purchaserequest/alldata")

    const displayColumnList = [
        { dataType: 'text', propertyName: 'requestcode' },
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

    supplierQuotations = getServiceAjaxRequest("/supplierquotation/quotationbyvaliddate")
    fillMultipleItemOfDataIntoSingleSelect(selectSupplierQuotation, "Select Supplier Quotation", supplierQuotations, "quotationid", "supplier_id.name"); //bug fix the issue




    decimalTotalAmount.disabled = true;
    decimalTotalAmount.value = 0;


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
            numberQuantity.value = selectedItemName.quantity;
            decimalItemPrice.value = selectedItemName.unitprice;

            decimalLineTotal.value = selectedItemName.lineprice
            numberQuantity.addEventListener('keyup', () => {
                const newQuantity = numberQuantity.value;
                decimalLineTotal.value = newQuantity * selectedItemName.unitprice
            })
        })



    })

    //inner table

}


const getPurchaseRequestStatus = (ob) => {
    if (ob.purchasestatus.name == 'Recived') {
        return '<p class="supplier-status-available">' + ob.purchasestatus.name + '</p>';
    }

    if (ob.purchasestatus.name == 'Requested') {
        return '<p class="supplier-status-resign">' + ob.purchasestatus.name + '</p>'
    }

    if (ob.purchasestatus.name == 'Rejected') {
        return '<p class="supplier-status-reject">' + ob.purchasestatus.name + '</p>'
    }
    if (ob.purchasestatus.name == 'Deleted') {
        return '<p class="supplier-status-delete">' + ob.purchasestatus.name + '</p>'
    } else {
        return '<p class="supplier-status-other">' + ob.purchasestatus.name + '</p>'
    }
}

const refillPurchaseRequestForm = (ob, rowIndex) => {

}

const checkInnerItemFormErrors = () => {
    let errors = ""


    return errors;
}
const innerPurchaseRequestItemAdd = () => {

}

const innerPurchaseRequestItemUpdate = () => {

}