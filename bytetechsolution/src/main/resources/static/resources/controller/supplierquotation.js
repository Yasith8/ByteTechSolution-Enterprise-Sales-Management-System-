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

}

const getQRcode = (ob) => {
    return ob.quotation_request_id.quotationrequestcode;
}
const getSupplierName = (ob) => {
    return ob.quotation_request_id.supplier_id.name;
}
const getQuotationStatus = (ob) => {

}

const refillSupplierForm = (ob) => {

}