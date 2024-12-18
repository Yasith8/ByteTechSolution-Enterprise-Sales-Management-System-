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
        { dataType: 'text', propertyName: 'quantity' },
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

    selectCategory.addEventListener('change', () => {

        const itemCategory = selectValueHandler(selectCategory);
        brands = getServiceAjaxRequest("/brand/brandbycategory/" + itemCategory.name);
        fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

        selectBrand.addEventListener('change', () => {
            const itemBrand = selectValueHandler(selectBrand);
            suppliers = getServiceAjaxRequest("/supplier/suppliergetbybrandcategory?categoryid=" + itemCategory.id + "&brandid=" + itemBrand.id);
            fillDataIntoSelect(selectAvailableSupplier, "", suppliers, "name");
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
    const quotationRequestItem = new Object();
    const oldQuotationRequestItem = null;

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
    categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brand, "name", quotationRequest.brand_id.name);
    fillDataIntoSelect(selectAvailableSupplier, "Can't Update a Request. Create a New One", [], "name");
    fillDataIntoSelect(selectSelectedSupplier, "", quotationRequest.itemSuppliers, "name");

    selectCategory.addEventListener('change', () => {
        const itemCategory = selectValueHandler(selectCategory);
        brands = getServiceAjaxRequest("/brand/brandbycategory/" + itemCategory.name);
        fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", quotationRequest.brand_id.name);

        selectBrand.addEventListener('change', () => {
            const itemBrand = selectValueHandler(selectBrand);
            suppliers = getServiceAjaxRequest("/supplier/suppliergetbybrandcategory?categoryid=" + itemCategory.id + "&brandid=" + itemBrand.id);
            fillDataIntoSelect(selectAvailableSupplier, "", suppliers, "name");
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


    buttonClear.disabled = true;

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


const checkQuotationRequestInputErrors = () => {
    let errors = "";

    if (quotationrequest.brand_id == null) {
        errors += "Brand is empty\n";
    }
    if (quotationrequest.category_id == null) {
        errors += "Category is empty\n";
    }
    if (quotationrequest.quantity == null) {
        errors += "Quantity is empty\n";
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