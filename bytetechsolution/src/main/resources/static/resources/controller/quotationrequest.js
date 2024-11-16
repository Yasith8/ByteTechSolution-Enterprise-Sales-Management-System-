window.addEventListener('load', () => {
    refreshQuotationRequestTable();
    refreshQuotationRequestForm();
})

const refreshQuotationRequestTable = () => {
    quotationrequests = getServiceAjaxRequest("/quotationrequest/alldata");

    const displayColumnList = [
        { dataType: 'text', propertyName: 'quotationrequestcode' },
        { dataType: 'function', propertyName: getCategoryName },
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
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

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    staticBackdropLabel.textContent = "Add New Quotation Request";

    //load category
    const categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Please Select Category", categories, "name");


    //load request status
    const qrequeststatuses = getServiceAjaxRequest("/quotationstatus/alldata");
    fillDataIntoSelect(selectRequestStatus, "Please Select Request Status", qrequeststatuses, "name", qrequeststatuses[1].name);
    selectRequestStatus.disabled = true;

}


const getCategoryName = (ob) => {
    return ob.category_id.name
}
const getQRequestStatus = (ob) => {

}
const refillQuotationRequestForm = () => {

}

const btnAddOneSupplier = () => {

}
const btnAddAllSupplier = () => {

}

const btnRemoveOneSupplier = () => {

}


const btnRemoveAllSupplier = () => {

}


const checkQuotationRequestInputErrors = () => {

}

const QuotationRequestHandler = () => {

}

const deleteQuotationRequest = () => {

}

const closeQRequestModal = () => {

}