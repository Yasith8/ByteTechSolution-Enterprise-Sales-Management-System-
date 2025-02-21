window.addEventListener('load', () => {
    refreshSubmissionSupplierQuotationForm();
})

const refreshSubmissionSupplierQuotationForm = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quotationReqest = urlParams.get('quotationreqestid');
    const supplier = urlParams.get('supplierid')

    supplierSubmitQuotation = new Object();
    supplierSubmitQuotation.quotation_item = new Object();

    supplierQuotationItemList = new Array();


    currentQuotationRequest = getServiceAjaxRequest("/quotationrequest/requestbyid?id=" + quotationReqest)
    currentSupplier = getServiceAjaxRequest("/supplier/supplierbyid?id=" + supplier)

    textQuotationReqest.value = currentQuotationRequest.quotationrequestcode;
    textSupplier.value = currentSupplier.name;

    textQuotationReqest.disabled = true;
    textSupplier.disabled = true;

    console.log(currentQuotationRequest.quotation_request_item);

    editableTableHandler(currentQuotationRequest.quotation_request_item);

    document.querySelectorAll('.unit-price').forEach(input => {
        input.addEventListener('input', updateTotals);
    });


    supplierSubmitQuotation.quotationrequest_id = currentQuotationRequest;
    supplierSubmitQuotation.supplier_id = currentSupplier;





}

// Initialize the table
function editableTableHandler(requestedItems) {
    const tbody = document.getElementById('itemsTableBody');
    requestedItems.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'item-row';
        row.innerHTML = `
            <td>${item.itemcode}</td>
            <td>${item.itemname}</td>
            <td>${item.quantity}</td>
            <td>
                <input type="number" class="item-input form-control unit-price" 
                       step="0.01" min="0" required
                       data-item-code="${item.itemcode}">
            </td>
            <td class="line-total">Rs.0.00</td>
        `;
        tbody.appendChild(row);
    });
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
        const linetotal = calculateLineTotal(unitprice, quantity);

        row.querySelector('.line-total').textContent = `Rs.${linetotal}`;
        total += parseFloat(linetotal);
    });

    document.getElementById('totalAmount').textContent = `Rs.${total.toFixed(2)}`;
}

// Handle form submission
function supplierSubmitQuotationQuotationHandler() {
    const quotationItems = [];

    document.querySelectorAll('.item-row').forEach(row => {
        const itemCode = row.querySelector('.unit-price').dataset.itemCode;
        const unitPrice = row.querySelector('.unit-price').value;
        const quantity = row.querySelector('td:nth-child(3)').textContent;
        const lineTotal = row.querySelector('.line-total').textContent.replace('$', '');

        quotationItems.push({
            itemCode,
            itemName: requestedItems.find(item => item.itemCode === itemCode).itemName,
            unitPrice: parseFloat(unitPrice),
            quantity: parseInt(quantity),
            lineTotal: parseFloat(lineTotal)
        });
    });

    const quotationData = {
        supplierInfo: {
            companyName: formData.get('companyName'),
            contactPerson: formData.get('contactPerson'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        items: quotationItems,
        additionalInfo: {
            paymentTerms: formData.get('paymentTerms'),
            deliveryTime: formData.get('deliveryTime'),
            notes: formData.get('notes')
        },
        totalAmount: document.getElementById('totalAmount').textContent
    };

    console.log('Quotation Data:', quotationData);
    // Here you would typically send this data to your server
}

// Initialize the form
/* document.addEventListener('DOMContentLoaded', () => {
    initializeTable();

    // Add event listeners
    document.querySelectorAll('.unit-price').forEach(input => {
        input.addEventListener('input', updateTotals);
    });

    document.getElementById('quotationForm').addEventListener('submit', handleSubmit);
}); */

const submitSupplierQuotation = () => {
    document.querySelectorAll('.item-row').forEach(row => {
        const itemcode = row.querySelector('.unit-price').dataset.itemCode;
        const unitprice = row.querySelector('.unit-price').value;
        const quantity = row.querySelector('td:nth-child(3)').textContent;
        const linetotal = row.querySelector('.line-total').textContent.replace('Rs.', '');

        supplierQuotationItemList.push({
            itemcode,
            itemname: currentQuotationRequest.quotation_request_item.find(item => item.itemcode === itemcode).itemname,
            unitprice: parseFloat(unitprice),
            quantity: parseInt(quantity),
            linetotal: parseFloat(linetotal)
        });
    });

    supplierSubmitQuotation.quotation_item = (supplierQuotationItemList);

    console.log("Supplier Submitted Quotation : " + supplierSubmitQuotation);





}