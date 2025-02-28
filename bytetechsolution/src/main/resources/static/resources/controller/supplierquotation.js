window.addEventListener('load', () => {
    refreshSupplierQuotationForm()
    refreshSupplierQuotationTable()
})


const refreshSupplierQuotationTable = () => {
    supplierquotations = getServiceAjaxRequest("/supplierquotation/alldata");

    if (!supplierquotations) {
        alert("Failed to load supplier quotations");
        return;
    }

    const displayMainColumnList = [
        { dataType: 'text', propertyName: 'quotationid' },
        { dataType: 'function', propertyName: getQRcode },
        { dataType: 'function', propertyName: getSupplierName },
        { dataType: 'text', propertyName: 'addeddate' },
        { dataType: 'text', propertyName: 'validdate' },
    ]

    fillDataIntoTable(tableSupplierQuotation, supplierquotations, displayMainColumnList, refillSupplierForm, divModifyButton)

    $('#tableSupplierQuotation').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';


}

const refreshSupplierQuotationForm = () => {
    supplierQuotation = new Object();
    oldSupplierQuotation = null;

    supplierQuotationItemList = new Array();

    totalAmount.innerHTML = 'Rs.0.00';
    dateValidDate.disabled = false;
    selectQuotationRequest.disabled = false;
    selectSupplier.disabled = false;

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    staticBackdropLabel.textContent = "Add New Supplier Quotation";

    quotationrequests = getServiceAjaxRequest("/quotationrequest/withoutexpiredrequest")
    fillMultipleItemOfDataIntoSingleSelect(selectQuotationRequest, "Select Quotation Request", quotationrequests, "quotationrequestcode", "requireddate");

    fillDataIntoSelect(selectSupplier, "Select Quotation Request First", [], "name");

    selectQuotationRequest.addEventListener('change', () => {
        suppliers = getServiceAjaxRequest("/supplier/alldata")
        fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "name");

        let selectedRequest = JSON.parse(selectQuotationRequest.value)

        editableTableHandler(selectedRequest.quotation_request_item)

        document.querySelectorAll('.unit-price').forEach(input => {
            input.addEventListener('input', updateTotals);
        });

    })

    //made security privilages
    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/QUOTATION");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([dateValidDate, selectQuotationRequest, selectSupplier], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getQRcode = (ob) => {
    return ob.quotation_request_id.quotationrequestcode;
}
const getSupplierName = (ob) => {
    return ob.supplier_id.name;
}

const refillSupplierForm = (ob) => {
    $('#supplierQuotationAddModal').modal('show');

    removeValidationColor([selectQuotationRequest, selectSupplier, dateValidDate])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit')

    supplierQuotation = JSON.parse(JSON.stringify(ob));
    olfSupplierQuotation = ob;

    staticBackdropLabel.textContent = supplierQuotation.quotationid;

    dateValidDate.disabled = true;
    dateValidDate.value = supplierQuotation.validdate;

    quotationrequests = getServiceAjaxRequest("/quotationrequest/withoutexpiredrequest")
    fillMultipleItemOfDataIntoSingleSelect(selectQuotationRequest, "Select Quotation Request", quotationrequests, "quotationrequestcode", "requireddate", supplierQuotation.quotation_request_id.quotationrequestcode, supplierQuotation.quotation_request_id.requireddate);
    selectQuotationRequest.disabled = true;

    suppliers = getServiceAjaxRequest("/supplier/alldata")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "name", supplierQuotation.supplier_id.name);
    selectSupplier.disabled = true;

    console.log(supplierQuotation);
    editableTableHandler(supplierQuotation.quotation_item)

    document.querySelectorAll('.unit-price').forEach(input => {
        input.addEventListener('input', updateTotals);
    });

    updateTotals()
}


function editableTableHandler(requestedItems) {
    const tbody = document.getElementById('itemsTableBody');
    if (requestedItems.length == 0) {
        tbody.innerHTML = '';
    } else {
        requestedItems.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'item-row';
            console.log("item", item);
            const isEditable = item.lineprice === undefined;
            row.innerHTML = `
            <td>${item.itemcode}</td>
            <td>${item.itemname}</td>
            <td>${item.quantity}</td>
            <td>
                <input type="number" class="item-input form-control unit-price" 
                       step="0.01" min="0" required
                       data-item-code="${item.itemcode}"
                        value="${isEditable ? '' : item.unitprice}"
                       ${isEditable ? '' : 'disabled'}>
            </td>
            <td class="line-total">Rs.${item.lineprice !== undefined ? item.lineprice.toFixed(2) : '0.00'}</td>
        `;
            tbody.appendChild(row);
        })
    };
}

// Calculate line total
function calculateLineTotal(unitPrice, quantity) {
    return (unitPrice * quantity).toFixed(2);
}

// Update totals
function updateTotals() {
    const rows = document.querySelectorAll('.item-row');
    let total = 0;

    rows.forEach(row => {
        const unitprice = parseFloat(row.querySelector('.unit-price').value) || 0;
        const quantity = parseInt(row.querySelector('td:nth-child(3)').textContent);
        const lineprice = calculateLineTotal(unitprice, quantity);

        row.querySelector('.line-total').textContent = `Rs.${lineprice}`;
        total += parseFloat(lineprice);
    });

    document.getElementById('totalAmount').textContent = `Rs.${total.toFixed(2)}`;
}

const supplierQuotationSubmitError = () => {
    let errors = "";

    if (supplierQuotation.quotation_item.length == 0) {
        errors += "This Quotation has no items\n";
    }
    if (supplierQuotation.validdate == null) {
        errors += "Please select a valid date\n";
    }
    if (supplierQuotation.quotation_request_id == null) {
        errors += "Please select a quotation request\n";
    }
    if (supplierQuotation.supplier_id == null) {
        errors += "Please select a supplier\n";
    }
    document.querySelectorAll('.unit-price').forEach(input => {
        if (input.value.trim() === "") {
            errors += "Please enter the unit price for all items\n";
        }
    });

    return errors;
}

const submitSupplierQuotation = () => {
    document.querySelectorAll('.item-row').forEach(row => {
        const itemcode = row.querySelector('.unit-price').dataset.itemCode;
        const unitprice = row.querySelector('.unit-price').value;
        const quantity = row.querySelector('td:nth-child(3)').textContent;
        const lineprice = row.querySelector('.line-total').textContent.replace('Rs.', '');

        let selectedRequest = JSON.parse(selectQuotationRequest.value)
        console.log("Selected Request Item", selectedRequest.quotation_request_item);

        supplierQuotationItemList.push({
            itemcode,
            itemname: selectedRequest.quotation_request_item.find(item => item.itemcode === itemcode).itemname,
            unitprice: parseFloat(unitprice),
            quantity: parseInt(quantity),
            lineprice: parseFloat(lineprice)
        });
    });

    supplierQuotation.quotation_item = (supplierQuotationItemList);


    let errors = supplierQuotationSubmitError();

    if (errors == "") {
        const supplierResponse = confirm("Do you want to submit the Quotation?");

        if (supplierResponse) {
            let postServiceResponce;

            $.ajax("/supplierquotation", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(supplierQuotation),
                async: false,

                success: function(data) {
                    console.log("success", data);
                    postServiceResponce = data;
                },

                error: function(resData) {
                    console.log("Fail", resData);
                    postServiceResponce = resData;
                }

            });

            if (postServiceResponce == "OK") {
                alert("Your quotation submission has been successfully completed...!");
                $('#supplierQuotationAddModal').modal('hide');
                //reset the Item form
                formSupplierQuotation.reset();
                //refreash Item form
                refreshSupplierQuotationForm()
                refreshSupplierQuotationTable()

            } else {
                alert("Your quotation submission has been failed...!");
            }

        }


    } else {
        alert("Your quotation submisson has following errors...!\n" + errors);
    }





}


const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#supplierQuotationAddModal').modal('hide');

        refreshSupplierQuotationForm()

        //formItem is id of form
        //this will reset all data(refreash)
        formSupplierQuotation.reset();
        editableTableHandler([])
        divModifyButton.className = 'd-none';

    }
}