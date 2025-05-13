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

    supplierWarningContainer.classList.add('elementHide')
    supplierErrorContainer.classList.remove('elementHide');

    buttonInnerSubmit.classList.remove('elementHide')
    buttonInnerUpdate.classList.add('elementHide')

    quotationrequest.quotation_request_item = new Array();
    quotationrequest.quotation_request_has_supplier = new Array();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    staticBackdropLabel.textContent = "Add New Quotation Request";



    //load category
    const categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Please Select Category", categories, "name");

    //pass instruction to user for select category first
    fillDataIntoSelect(selectBrand, "Please Select Category First", [], "name");
    fillDataIntoSelect(selectItemName, "Please Category and Brand First", [], "name");

    supplierCheckboxContainer.innerHTML = "";
    selectCategory.addEventListener('change', () => {
        quotationrequest.brand_id = null;
        removeValidationColor([selectBrand])
        supplierCheckboxContainer.innerHTML = "";
        supplierErrorContainer.classList.remove('elementHide');
        //refreshInnerQuotationRequestItemFormAndTable();


        const itemCategory = selectValueHandler(selectCategory);
        brands = getServiceAjaxRequest("/brand/brandbycategory/" + itemCategory.name);
        fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");



        selectBrand.addEventListener('change', () => {
            const itemBrand = selectValueHandler(selectBrand);
            //refreshInnerQuotationRequestItemFormAndTable();

            const suppliers = getServiceAjaxRequest(`/supplier/suppliergetbybrandcategory?categoryid=${itemCategory.id}&brandid=${itemBrand.id}`);

            //BUG THIS NOT WORK TO SHOW
            console.log(suppliers.length)
            if (suppliers.length === 0) {
                console.log("THIS WORK........................")
                supplierCheckboxContainer.innerHTML = "";
                supplierErrorContainer.classList.remove('elementHide');

            }

            supplierErrorContainer.classList.add('elementHide')

            console.log("Suppliers for Category", suppliers)

            supplierCheckboxContainer.innerHTML = "";

            suppliers.forEach((supplier, index) => {
                const colDiv = document.createElement('div');
                colDiv.className = "col-6";

                const supplierCard = document.createElement('div');
                supplierCard.className = "supplier-card";

                // Label with left checkbox and text
                const customCheckBox = document.createElement('label');
                customCheckBox.className = "custom-checkbox";

                const inputLeftCHK = document.createElement('input');
                inputLeftCHK.type = "checkbox";
                inputLeftCHK.className = "left-checkbox";

                const checkSpan = document.createElement('span');
                checkSpan.className = "checkmark";

                const contentSpan = document.createElement('span');
                contentSpan.className = "supplier-text";
                contentSpan.innerText = `${supplier.supplierid} - ${supplier.name}`;

                inputLeftCHK.onchange = function() {
                    if (this.checked) {
                        let updatedQRequestSupplier = {
                            supplier_id: supplier,
                            status: true
                        }
                        quotationrequest.quotation_request_has_supplier.push(updatedQRequestSupplier);
                    } else {
                        let extIndex = quotationrequest.quotation_request_has_supplier.map(element => element.supplier_id.id);

                        if (extIndex != -1) {
                            quotationrequest.quotation_request_has_supplier.splice(extIndex, 1)
                        }
                    }
                }

                // Append left checkbox and text to label
                customCheckBox.appendChild(inputLeftCHK);
                customCheckBox.appendChild(checkSpan);
                customCheckBox.appendChild(contentSpan);

                // Right hidden checkbox
                //const inputRightCHK = document.createElement('input');
                //inputRightCHK.type = "checkbox";
                //inputRightCHK.className = "hidden right-checkbox";
                //inputRightCHK.id = `rightCheck${index}`;
                //inputRightCHK.setAttribute("data-bs-toggle", "tooltip");
                //inputRightCHK.setAttribute("data-bs-placement", "top");
                //inputRightCHK.setAttribute("data-bs-title", "Checked for the Sending Email to Supplier");

                //SVG icon with onclick event
                //const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                //svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                //svgIcon.setAttribute("fill", "none");
                //svgIcon.setAttribute("viewBox", "0 0 24 24");
                //svgIcon.setAttribute("stroke-width", "1.5");
                //svgIcon.setAttribute("stroke", "currentColor");
                //svgIcon.setAttribute("class", "right-svg");
                //svgIcon.setAttribute("onclick", "toggleRightCheckbox(this)");

                //const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                //svgPath.setAttribute("stroke-linecap", "round");
                //svgPath.setAttribute("stroke-linejoin", "round");
                //svgPath.setAttribute("d", "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");

                //svgIcon.appendChild(svgPath);

                // Append everything into supplierCard
                supplierCard.appendChild(customCheckBox);
                //supplierCard.appendChild(inputRightCHK);
                //supplierCard.appendChild(svgIcon);

                // Append supplierCard to colDiv
                colDiv.appendChild(supplierCard);

                // Append colDiv to container
                supplierCheckboxContainer.appendChild(colDiv);
            });

            // (Re)initialize Bootstrap tooltip
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
        });
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

    numberQuantity.value = null;
    removeValidationColor([numberQuantity, selectItemName])



    selectCategory.addEventListener('change', () => {

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
            )

            fillMultipleItemOfDataIntoSingleSelect(selectItemName, "Please Select Item", availableItems, "itemcode", 'itemname');
        })
    });


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
        //when the table refresh availble item show
    updateAvailableItems()

}

const toggleRightCheckbox = (svgEl) => {
    const container = svgEl.closest('.supplier-card');
    const rightCheckbox = container.querySelector('.right-checkbox');
    rightCheckbox.checked = !rightCheckbox.checked;
    svgEl.classList.toggle('checked', rightCheckbox.checked);
}

const updateAvailableItems = () => {
    // Filter out items that are already in the quotation request
    const itemCategory = selectValueHandler(selectCategory);
    const itemBrand = selectValueHandler(selectBrand);

    //ajax request to get data aout itrems
    innerItemList = getServiceAjaxRequest(`/${(itemCategory.name).toLowerCase()}/${itemBrand.id}/itemlist`)
        //fiter items that not in the tagbke
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

    if (quotationRequestItem.quotation_request_item_id == null) {
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
    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Assign this product to the Quotation Request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, assign it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                quotationrequest.quotation_request_item.push(formattedQuotationRequestItem);
                console.log("Passed Item: ", quotationrequest.quotation_request_item);

                Swal.fire({
                    title: "Success!",
                    text: "Item assigned to the Quotation request successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    refreshInnerQuotationRequestItemFormAndTable();
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
        const itemCategory = selectValueHandler(selectCategory); //selectCategory.value
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
    console.log("Supplier Details", quotationrequest.quotation_request_has_supplier)
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