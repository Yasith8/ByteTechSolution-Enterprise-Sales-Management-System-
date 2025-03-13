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
            textValidator(numberQuantity, '^(100|[1-9][0-9]?)$', 'purchaseRequestItem', 'quantity');
            textValidator(decimalItemPrice, '', 'purchaseRequestItem', 'unitprice');


            decimalLineTotal.value = selectedItemName.lineprice
            numberQuantity.addEventListener('keyup', () => {
                const newQuantity = numberQuantity.value;
                decimalLineTotal.value = newQuantity * selectedItemName.unitprice
            })
            textValidator(decimalLineTotal, '', 'purchaseRequestItem', 'linetotal');
        })



    })

    console.log(purchaseRequestItem);

    //inner table
    let displayPropertyList = [
        { dataType: 'function', propertyName: getItemCode },
        { dataType: 'function', propertyName: getItemName },
        { dataType: 'text', propertyName: "unitprice" },
        { dataType: 'text', propertyName: "quantity" },
        { dataType: 'text', propertyName: "linetotal" },
    ]

    fillDataIntoInnerTable(tableInnerPrequestItem, prequest.purchase_request_item, displayPropertyList, refillInnerPurchaseItemForm, deleteInnerPurchaseItemForm)

}

const getItemCode = (ob) => {
    return ob.itemname_id.itemcode;
}

const getItemName = (ob) => {
    return ob.itemname_id.itemname;
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

const refillInnerPurchaseItemForm = () => {

}

const deleteInnerPurchaseItemForm = () => {

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
                prequest.purchase_request_item.push(purchaseRequestItem);
                console.log(prequest.purchase_request_item);

                Swal.fire({
                    title: "Success!",
                    text: "Items assigned to the purchase request successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    refreshPurchaseRequestHasItemInnerFormAndTable();
                    purchaseItemForm.reset();
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

}