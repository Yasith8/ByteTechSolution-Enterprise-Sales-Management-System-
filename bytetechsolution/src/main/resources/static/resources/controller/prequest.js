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

    supplierNames = getServiceAjaxRequest("/supplier/alldata")
    fillDataIntoSelect(selectSupplierName, "Select Supplier Name", supplierNames, "name");

    decimalTotalAmount.disabled = true;
    decimalTotalAmount.value = 0;

    removeValidationColor([decimalTtoalAmount, dateRequiredDate, textNote, selectSupplierName, selectPurchaseStatus, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal, selectCategory])


    //made security privilages
    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/PREQUEST");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([decimalTtoalAmount, dateRequiredDate, textNote, selectSupplierName, selectPurchaseStatus, selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal, selectCategory], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

    refreshPurchaseRequestHasItemInnerFormAndTable();
}

const refreshPurchaseRequestHasItemInnerFormAndTable = () => {
    //inner form
    purchaseRequestItem = new Object();
    oldPurchaseRequestItem = null;

    inputFieldsHandler([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal, selectCategory], false)
    removeValidationColor([selectItemName, decimalItemPrice, numberQuantity, decimalLineTotal, selectCategory])

    buttonInnerSubmit.disabled = false;
    buttonInnerSubmit.classList.add('inner-add-btn');

    buttonInnerUpdate.disabled = true;
    buttonInnerUpdate.classList.remove('inner-update-btn');

    //get category
    categories = getServiceAjaxRequest('/category/alldata')
    fillDataIntoSelect(selectCategory, "Please Select Category", categories, "name");

    //item name
    fillDataIntoSelect(selectItemName, "Please Select Category First", [], "name");

    //auto add item code when item select

    //item price need to get from grn list

    //when adding the quantity line total need to auto calculate, also total amount
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

const innerPurchaseRequestItemUpdate = () => {

}
const innerPurchaseRequestItemAdd = () => {

}