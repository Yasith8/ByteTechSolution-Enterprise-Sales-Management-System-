window.addEventListener('load', () => {
    refreshSupplierQuotationForm()
    refreshSupplierQuotationTable()
})


const refreshSupplierQuotationTable = () => {
    supplierquotations = getServiceAjaxRequest("/supplierquotation/alldata");

    const displayMainColumnList = [
        { dataType: 'text', propertyName: 'quotationid' },
        { dataType: 'function', propertyName: getQRcode },
        { dataType: 'function', propertyName: getSupplierName },
        { dataType: 'date', propertyName: 'validdate' },
        { dataType: 'function', propertyName: getQuotationStatus },
    ]

    fillDataIntoTable(tableSupplierQuotation, supplierquotations, displayMainColumnList, refillSupplierForm, divModifyButton)

    $('#tableSupplierQuotation').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';


}

const refreshSupplierQuotationForm = () => {
    supplierQuotation = new Object();
    oldSupplierQuotation = null;

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Supplier Quotation";

    supplierQuotation.supplierItemQuotationList = new Array();

    quotationrequests = getServiceAjaxRequest("/quotationrequest/alldata")
    fillDataIntoSelect(selectQuotationRequest, "Select Quotation Request", quotationrequests, "name");

    suppliers = getServiceAjaxRequest("/quotationrequest/alldata")
    fillDataIntoSelect(selectQuotationRequest, "Select Quotation Request", quotationrequests, "name");

    quotationstatuses = getServiceAjaxRequest("/quotationstatus/alldata")
    fillDataIntoSelect(selectQuotationStatus, "Select Supplier Status", quotationstatuses, "name");


}

const getQRcode = (ob) => {
    return ob.quotation_request_id.quotationrequestcode;
}
const getSupplierName = (ob) => {
    return ob.quotation_request_id.supplier_id.name;
}
const getQuotationStatus = (ob) => {
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

const refillSupplierForm = (ob) => {

}