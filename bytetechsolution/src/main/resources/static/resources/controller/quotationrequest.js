window.addEventListener('load', () => {
    refreshQuotationRequestTable();
    refreshQuotationRequestForm();
})

const refreshQuotationRequestTable = () => {
    quotationrequests = getServiceAjaxRequest("/quotationrequest/alldata");

    const displayColumnList = [
        { dataType: 'text', propertyName: 'quotationrequestcode' },
        { dataType: 'function', propertyName: getCategoryName },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'requireddate' },
        { dataType: 'function', propertyName: getQRequestStatus },
    ];

    fillDataIntoTable(tableQRequest, quotationrequests, displayColumnList, refillQuotationRequestForm, divModifyButton);

    $('#tableQRequest').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';


}
const refreshQuotationRequestForm = () => {
    quotationrequest = new Object();

    quotationrequest.itemSuppliers = [];

    quotationrequest.quotation_request_item = new Array();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    staticBackdropLabel.textContent = "Add New Quotation Request";

    //load category
    const categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Please Select Category", categories, "name");

    //pass instruction to user for select category first
    fillDataIntoSelect(selectBrand, "Please Select Category First", [], "name");
    fillDataIntoSelect(selectAvailableSupplier, "", [], "name");
    fillDataIntoSelect(selectAvailableSupplier, "", [], "name");
    fillDataIntoSelect(selectItemName, "Please Category and Brand First", [], "name");

    selectCategory.addEventListener('change', () => {

        const itemCategory = selectValueHandler(selectCategory);
        brands = getServiceAjaxRequest("/brand/brandbycategory/" + itemCategory.name);
        fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");



        selectBrand.addEventListener('change', () => {
            const itemBrand = selectValueHandler(selectBrand);
            suppliers = getServiceAjaxRequest("/supplier/suppliergetbybrandcategory?categoryid=" + itemCategory.id + "&brandid=" + itemBrand.id);
            fillDataIntoSelect(selectAvailableSupplier, "", suppliers, "name");

            //all item list array
            innerItemList = getServiceAjaxRequest(`/${(itemCategory.name).toLowerCase()}/${itemBrand.id}/itemlist`)
            const availableItems = innerItemList.filter(innerItem =>
                !quotationrequest.quotation_request_item.some(quotationItem =>
                    quotationItem.itemcode === innerItem.itemcode
                )
            );

            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Please Select Item", availableItems, "itemcode", 'itemname');
        })
    });

    //load request status
    const qrequeststatuses = getServiceAjaxRequest("/quotationstatus/alldata");
    fillDataIntoSelect(selectRequestStatus, "Please Select Request Status", qrequeststatuses, "name", qrequeststatuses[0].name);
    //fillDataIntoSelect(selectRequestStatus, "Please Select Request Status", qrequeststatuses, "name");
    quotationrequest.quotationstatus_id = qrequeststatuses[0];
    selectRequestStatus.disabled = true;

    removeValidationColor([selectCategory, selectRequestStatus, selectBrand, numberQuantity, dateRequiredDate])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/QUOTATION");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([selectCategory, selectRequestStatus, selectBrand, numberQuantity, dateRequiredDate], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

    refreshInnerQuotationRequestItemFormAndTable()

}

const refreshInnerQuotationRequestItemFormAndTable = () => {
    quotationRequestItem = new Object();
    oldQuotationRequestItem = null;


    /*  selectCategory.addEventListener('change', () => {

         const itemCategory = selectValueHandler(selectCategory);

         selectBrand.addEventListener('change', () => {
             const itemBrand = selectValueHandler(selectBrand);
             console.log(itemBrand, itemCategory);

             //all item list array
             innerItemList = getServiceAjaxRequest(`/${(itemCategory.name).toLowerCase()}/${itemBrand.id}/itemlist`)
             const availableItems = innerItemList.filter(innerItem =>
                 !quotationrequest.quotation_request_item.some(quotationItem =>
                     quotationItem.itemcode === innerItem.itemcode
                 )
             );

             fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Please Select Item", availableItems, "itemcode", 'itemname');
         })
     }); */


    inputFieldsHandler([selectItemName, numberQuantity], false)
    removeValidationColor([selectItemName, numberQuantity])

    buttonInnerSubmit.disabled = false;
    buttonInnerSubmit.classList.add('inner-add-btn');

    buttonInnerUpdate.disabled = true;
    buttonInnerUpdate.classList.remove('inner-update-btn');




    //inner table
    let displayPropertyList = [
        { dataType: 'text', propertyName: "itemcode" },
        { dataType: 'text', propertyName: "itemname" },
        { dataType: 'text', propertyName: "quantity" },
    ]

    console.log("QREQUEST", quotationrequest.quotation_request_item);

    fillDataIntoInnerTable(innerItemTable, quotationrequest.quotation_request_item, displayPropertyList, refillInnerQuotationRequestForm, deleteInnerQuotationRequestForm)
    updateAvailableItems()

}

const updateAvailableItems = () => {
    // Filter out items that are already in the quotation request
    const itemCategory = selectValueHandler(selectCategory);
    const itemBrand = selectValueHandler(selectBrand);

    innerItemList = getServiceAjaxRequest(`/${(itemCategory.name).toLowerCase()}/${itemBrand.id}/itemlist`)
    const availableItems = innerItemList.filter(innerItem =>
        !quotationrequest.quotation_request_item.some(quotationItem =>
            quotationItem.itemcode === innerItem.itemcode
        )
    );

    console.log(availableItems);
    console.log(quotationrequest.quotation_request_item);

    // Update the select dropdown with available items
    fillMultipleItemOfDataIntoSingleSelect(
        selectItemName,
        "Please Select Item",
        availableItems,
        "itemcode",
        'itemname'
    );
}


const getInnerFormItemCode = (ob) => {
    return ob.quotation_request_item.itemcode;
}

const getInnerFormItemName = (ob) => {
    return ob.quotation_request_item.itemname
}

const getInnerQuantity = () => {
    return ob.quotation_request_item.quantity;
}

const innerQuotationItemFormErrors = () => {
    let errors = "";

    if (quotationRequestItem.quotation_request_item == null) {
        errors += "Quotation Item not Selected"
    }
    if (quotationRequestItem.quantity == null) {
        errors += "Quantity not Added"
    }
    return errors;
}

const innerQuotationRequestProductAdd = () => {
    console.log(quotationRequestItem);
    let { itemcode, itemname } = quotationRequestItem.quotation_request_item_id
    let formattedQuotationRequestItem = { itemcode, itemname, quantity: quotationRequestItem.quantity }

    errors = innerQuotationItemFormErrors();
    if (errors == "") {
        let userConfirm = confirm("Are you sure for add this product to Quotation Request?")

        if (userConfirm) {
            quotationrequest.quotation_request_item.push(formattedQuotationRequestItem);
            console.log("Passed Item: ", quotationrequest.quotation_request_item);
            alert("Item Added Successfully");
            refreshInnerQuotationRequestItemFormAndTable();
            //quotationRequestInnerItemForm.reset();
        }
    } else {
        alert("Item add fail because of following errors!\n", errors)
    }
}


const refillInnerQuotationRequestForm = (ob, rowIndex) => {

}

const deleteInnerQuotationRequestForm = (ob, rowIndex) => {

}


const getCategoryName = (ob) => {
    return ob.category_id.name
}

const getBrandName = (ob) => {
    return ob.brand_id.name
}
const getQRequestStatus = (ob) => {
    if (ob.quotationstatus_id.name == 'Requested') {
        return '<p class="quotation-requested">' + ob.quotationstatus_id.name + '</p>';
    }

    if (ob.quotationstatus_id.name == 'Canceled') {
        return '<p class="quotation-canceled">' + ob.quotationstatus_id.name + '</p>'
    }
    if (ob.quotationstatus_id.name == 'Deleted') {
        return '<p class="quotation-deleted">' + ob.quotationstatus_id.name + '</p>'
    }
    if (ob.quotationstatus_id.name == 'Accepted') {
        return '<p class="quotation-accepted">' + ob.quotationstatus_id.name + '</p>'
    }
    if (ob.quotationstatus_id.name == 'Denied') {
        return '<p class="quotation-denied">' + ob.quotationstatus_id.name + '</p>'
    } else {
        return '<p class="quotation-other">' + ob.quotationstatus_id.name + '</p>'
    }
}


const btnAddOneSupplier = () => {
    let selectedSupplier = JSON.parse(selectAvailableSupplier.value);

    quotationrequest.itemSuppliers.push(selectedSupplier);

    fillDataIntoSelect(selectSelectedSupplier, "", quotationrequest.itemSuppliers, "name");

    let extIdx = suppliers.map((supplier) => supplier.id).indexOf(selectedSupplier.id);

    //check if index is existed
    if (extIdx != -1) {
        //remove supplier from avablelist
        suppliers.splice(extIdx, 1);
    }

    //refill Available Supplier
    fillDataIntoSelect(selectAvailableSupplier, "", suppliers, "name");
}

const btnAddAllSupplier = () => {

    for (const supplier of suppliers) {
        quotationrequest.itemSuppliers.push(supplier);
    }


    fillDataIntoSelect(selectSelectedSupplier, "", quotationrequest.itemSuppliers, "name");

    suppliers = [];
    fillDataIntoSelect(selectAvailableSupplier, suppliers, "", "name")


}

const btnRemoveOneSupplier = () => {
    let selectedPullSupplier = JSON.parse(selectSelectedSupplier.value);


    suppliers.push(selectedPullSupplier);


    fillDataIntoSelect(selectAvailableSupplier, "", suppliers, "name");

    let extIdx = quotationrequest.itemSuppliers.map((supplier) => supplier.id).indexOf(selectedPullSupplier.id);


    //check if index is existed
    if (extIdx != -1) {
        //remove supplier from avablelist
        quotationrequest.itemSuppliers.splice(extIdx, 1);
    }

    //refill Available Supplier

    fillDataIntoSelect(selectSelectedSupplier, "", quotationrequest.itemSuppliers, "name");
}


const btnRemoveAllSupplier = () => {
    for (const itemSupplier of quotationrequest.itemSuppliers) {
        suppliers.push(itemSupplier)
    }

    fillDataIntoSelect(selectAvailableSupplier, "", suppliers, "name")

    quotationrequest.itemSuppliers = [];
    fillDataIntoSelect(selectSelectedSupplier, "", quotationrequest.itemSuppliers, "name")

}

const refillQuotationRequestForm = (ob, rowIndex) => {
    $('#qRequestAddModal').modal('show');
    removeValidationColor([selectCategory, selectRequestStatus, selectBrand, numberQuantity, dateRequiredDate])


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    //buttonUpdate.disabled = false;
    //buttonUpdate.classList.add('modal-btn-update');

    quotationRequest = JSON.parse(JSON.stringify(ob));
    oldQuotationRequest = ob;

    staticBackdropLabel.textContent = quotationRequest.quotationrequestcode;

    numberQuantity.value = quotationRequest.quantity;

    dateRequiredDate.value = quotationRequest.requireddate;

    requestStatuses = getServiceAjaxRequest("/quotationstatus/alldata");
    fillDataIntoSelect(selectRequestStatus, "Please Select Quotation Status", requestStatuses, "name", quotationRequest.quotationstatus_id.name);
    selectRequestStatus.disabled = false;

    categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Please Select Category", categories, "name", quotationRequest.category_id.name);
    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", quotationRequest.brand_id.name);

    //fill quotation request items
    console.log(quotationRequest);
    fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Please Select Item", quotationRequest.quotation_request_item, "itemcode", 'itemname', ob.quotation_request_item.itemcode, ob.quotation_request_item.itemname);
    fillDataIntoInnerTable()

    fillDataIntoSelect(selectSelectedSupplier, "Please Select Item", quotationRequest.itemSuppliers, "name");
    //fillDataIntoSelect(selectAvailableSupplier, "Can't Update a Request. Create a New One", [], "name");

    selectCategory.addEventListener('change', () => {
        const itemCategory = selectValueHandler(selectCategory);
        brands = getServiceAjaxRequest("/brand/brandbycategory/" + itemCategory.name);
        fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", quotationrequest.brand_id.name);

        selectBrand.addEventListener('change', () => {
            const itemBrand = selectValueHandler(selectBrand);
            suppliers = getServiceAjaxRequest("/supplier/suppliergetbybrandcategory?categoryid=" + itemCategory.id + "&brandid=" + itemBrand.id);
            fillDataIntoSelect(selectAvailableSupplier, "", suppliers, "name");

            //all item list array
            innerItemList = getServiceAjaxRequest(`/${(itemCategory.name).toLowerCase()}/${itemBrand.id}/itemlist`)
            const availableItems = innerItemList.filter(innerItem =>
                !quotationrequest.quotation_request_item.some(quotationItem =>
                    quotationItem.itemcode === innerItem.itemcode
                )
            );

            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Please Select Item", availableItems, "itemcode", 'itemname');
        })
    })


    inputFieldsHandler([selectCategory, selectRequestStatus, selectBrand, numberQuantity, dateRequiredDate], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/QUOTATION");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([selectCategory, selectRequestStatus, selectBrand, numberQuantity, dateRequiredDate], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    refreshInnerQuotationRequestItemFormAndTable()
    buttonClear.disabled = true;

}

const checkQuotationRequestInputErrors = () => {
    let errors = "";

    if (quotationrequest.brand_id == null) {
        errors += "Brand is empty\n";
    }
    if (quotationrequest.category_id == null) {
        errors += "Category is empty\n";
    }
    if (quotationrequest.requireddate == null) {
        errors += "Required Date is empty\n";
    }
    if (quotationrequest.itemSuppliers.length == 0) {
        errors += "At leaset one supplier is required\n"
    }
    if (quotationrequest.quotationstatus_id == null) {
        errors += "Quotation Status is empty\n";
    }
    if (quotationrequest.quotation_request_item.length == 0) {
        errors += "At least one item need to assign into the quotation request\n";
    }

    return errors;
}

const QuotationRequestHandler = () => {
    console.log(quotationrequest);
    let errors = checkQuotationRequestInputErrors();

    if (errors == "") {
        const userConfirm = confirm("Are you sure to send request to suppliers?");

        if (userConfirm) {
            let postServiceResponce;

            $.ajax('/quotationrequest', {
                type: 'POST',
                data: JSON.stringify(quotationrequest),
                contentType: 'application/json',
                async: false,

                success: function(data) {
                    console.log("success ", data);
                    postServiceResponce = data;
                },

                error: function(resData) {
                    console.log("Fail ", resData);
                    postServiceResponce = resData;
                }
            });

            //if service is success
            if (postServiceResponce == "OK") {
                alert("Quotation Request Sent Successfully");
                //hide the model
                $('#qRequestAddModal').modal('hide');
                //reset the Item form
                formQuotationRequest.reset();
                //refreash Item form
                refreshQuotationRequestForm();
                //refreash Item table
                refreshQuotationRequestTable()
            } else {
                alert("Failed to send Quotation Request\n" + postServiceResponce);
            }
        }
    } else {
        alert("Form has following errors...\n" + errors);
    }
}

const deleteQuotationRequest = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete this Quotation Request? ");

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/quotationrequest", {
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

        //if delete response ok alert the success message and close the modal and refreash item table
        //so because of that we can see realtime update
        if (deleteServiceResponse == "OK") {
            alert("Delete Successfullly");
            $('#qRequestAddModal').modal('hide');
            refreshQuotationRequestTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}

const closeQRequestModal = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#qRequestAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formQuotationRequest.reset();
        divModifyButton.className = 'd-none';

        refreshQuotationRequestForm();
    }
}