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

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    staticBackdropLabel.textContent = "Add New Supplier Quotation";

    supplierQuotation.supplierItemQuotationList = new Array();

    quotationrequests = getServiceAjaxRequest("/quotationrequest/withoutexpiredrequest")
    fillMultipleItemOfDataIntoSingleSelect(selectQuotationRequest, "Select Quotation Request", quotationrequests, "quotationrequestcode", "requireddate");

    suppliers = getServiceAjaxRequest("/supplier/alldata")
    fillDataIntoSelect(selectSupplier, "Select Supplier", suppliers, "name");


}

const getQRcode = (ob) => {
    return ob.quotation_request_id.quotationrequestcode;
}
const getSupplierName = (ob) => {
    return ob.supplier_id.name;
}

const refillSupplierForm = (ob) => {

}