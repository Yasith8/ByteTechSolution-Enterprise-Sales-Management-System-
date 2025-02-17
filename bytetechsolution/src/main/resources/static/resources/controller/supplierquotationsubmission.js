window.addEventListener('load', () => {
    refreshSubmissionSupplierQuotationForm();
})

const refreshSubmissionSupplierQuotationForm = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quotationReqest = urlParams.get('quotationreqestid');
    const supplier = urlParams.get('supplierid')

    currentQuotationRequest = getServiceAjaxRequest("/quotationrequest/" + quotationReqest)
    currentSuppliers = getServiceAjaxRequest("/quotationrequest/" + supplier)




}