window.addEventListener('load', () => {
    refreshQuotationRequestTable();
    refreshQuotationRequestForm();
})

const refreshQuotationRequestTable = () => {
    quotationrequests = getServiceAjaxRequest("/quotationrequest/alldata");

    const displayColumnList = [
        { dataType: 'text', propertyName: 'quotationrequestcode' },
        { dataType: 'function', propertyName: getCategoryName },
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

    //pass instruction to user for select category first
    fillDataIntoSelect(selectBrand, "Please Select Category First", [], "name");

    selectCategory.addEventListener('change', () => {
        quotationrequest.brand_id = null;
        removeValidationColor([selectBrand]);

        const itemCategory = selectValueHandler(selectCategory);
        brands = getServiceAjaxRequest("/brand/brandbycategory/" + itemCategory.name);
        fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");
    });

    //load request status
    const qrequeststatuses = getServiceAjaxRequest("/quotationstatus/alldata");
    fillDataIntoSelect(selectRequestStatus, "Please Select Request Status", qrequeststatuses, "name", qrequeststatuses[1].name);
    selectRequestStatus.disabled = true;

    removeValidationColor([selectCategory, selectRequestStatus, selectBrand, numberQuantity, dateRequiredDate])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/QUOTATION");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([selectCategory, selectRequestStatus, selectBrand, numberQuantity, dateRequiredDate], true);
        buttonClear.classList.remove('modal-btn-clear');
    }


}


const getCategoryName = (ob) => {
    return ob.category_id.name
}
const getQRequestStatus = (ob) => {

}
const refillQuotationRequestForm = () => {

    selectRequestStatus.disabled = false;
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