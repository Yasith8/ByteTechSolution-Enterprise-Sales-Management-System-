window.addEventListener('load', () => {
    refreshGrnForm();
    refreshGrnTable();
})

const refreshGrnTable = () => {
    grns = getServiceAjaxRequest("/grn/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'grncode' },
        { dataType: 'function', propertyName: getPurchaseRequest },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'text', propertyName: 'discountrate' },
        { dataType: 'text', propertyName: 'finalamount' },
        { dataType: 'text', propertyName: 'reciveddate' },
        { dataType: 'function', propertyName: getGRNStatus },
    ];


    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    fillDataIntoTable(tableGRN, grns, displayPropertyList, refillGrnForm, divModifyButton)
        //table show with dataTable
    $('#tableGRN').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshGrnForm = () => {

    grn = new Object();
    serialNumbersVisible = false;


    purchaseRequests = getServiceAjaxRequest("/purchaserequests/prequestbyrequireddate")
    fillMultipleItemOfDataOnSignleSelectRecursion(selectPurchaseRequest, "Select Puchase Request", purchaseRequests, "requestcode", "supplier_id.name");


    checkAndToggleButton()
    numberQuantity.addEventListener('keyup', () => {
        checkAndToggleButton()
        updateSerialNumberInputs()
    });

    selectItemName.addEventListener('input', () => {
        updateItemNameDisplay()
    });
}

const refillGrnForm = () => {

}

// Function to check and toggle the button
const checkAndToggleButton = () => {
    const value = numberQuantity.value.trim();
    toggleSerialBtn.disabled = value === '' || Number(value) === 0;
}


//open the serial no container card
const toggleSerialNoContent = () => {
    // once a button was clicked, card content changes
    serialNumbersVisible = !serialNumbersVisible;
    serialNumbersSection.style.display = serialNumbersVisible ? 'block' : 'none';
    toggleSerialBtn.textContent = serialNumbersVisible ? 'Hide Serial Numbers' : 'Add Serial Numbers';
    numberQuantity.disabled = serialNumbersVisible ? true : false;

    if (serialNumbersVisible) {
        updateSerialNumberInputs();
        updateItemNameDisplay();
    }
}

const updateItemNameDisplay = () => {
    const name = selectItemName.value.trim() || 'Item';
    selectItemName.textContent = name;
}

const updateSerialNumberInputs = () => {
    serialNumbersContainer.innerHTML = '';
    const quantity = parseInt(numberQuantity.value) || 0;

    for (let i = 0; i < quantity; i++) {
        // Create a new row for every two inputs
        if (i % 2 === 0) {
            var row = document.createElement('div');
            row.className = 'row mb-2';
            serialNumbersContainer.appendChild(row);
        }

        const col = document.createElement('div');
        col.className = 'col-md-6 mb-2';
        col.innerHTML = `
            <label class="form-label">Serial #${i + 1}</label>
            <input type="text" class="form-control serial-input" placeholder="Enter serial number ${i + 1}">
        `;
        row.appendChild(col);
    }
}


/* 
 document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const itemNameInput = document.getElementById('itemName');
            const quantityInput = document.getElementById('quantity');
            const toggleSerialBtn = document.getElementById('toggleSerialBtn');
            const serialNumbersSection = document.getElementById('serialNumbersSection');
            const serialNumbersContainer = document.getElementById('serialNumbersContainer');
            const itemNameDisplay = document.getElementById('itemNameDisplay');
            const addItemBtn = document.getElementById('addItemBtn');
            const itemsList = document.getElementById('itemsList');
            const itemsListCard = document.getElementById('itemsListCard');
            const saveGrnBtn = document.getElementById('saveGrnBtn');
            const toastContainer = document.querySelector('.toast-container');
            
            // State
            let items = [];
            let serialNumbersVisible = false;
            
            // Event Listeners
            toggleSerialBtn.addEventListener('click', toggleSerialNumbers);
            quantityInput.addEventListener('change', updateSerialNumberInputs);
            itemNameInput.addEventListener('input', updateItemNameDisplay);
            addItemBtn.addEventListener('click', addItem);
            saveGrnBtn.addEventListener('click', saveGrn);
            
            // Functions
            function toggleSerialNumbers() {
                serialNumbersVisible = !serialNumbersVisible;
                serialNumbersSection.style.display = serialNumbersVisible ? 'block' : 'none';
                toggleSerialBtn.textContent = serialNumbersVisible ? 'Hide Serial Numbers' : 'Add Serial Numbers';
                
                if (serialNumbersVisible) {
                    updateSerialNumberInputs();
                    updateItemNameDisplay();
                }
            }
            
            function updateItemNameDisplay() {
                const name = itemNameInput.value.trim() || 'Item';
                itemNameDisplay.textContent = name;
            }
            
            function updateSerialNumberInputs() {
                serialNumbersContainer.innerHTML = '';
                const quantity = parseInt(quantityInput.value) || 1;
                
                for (let i = 0; i < quantity; i++) {
                    const row = document.createElement('div');
                    row.className = 'mb-2 d-flex align-items-center';
                    row.innerHTML = `
                        <label class="form-label me-2 mb-0 flex-shrink-0" style="width: 100px;">Serial #${i + 1}</label>
                        <input type="text" class="form-control serial-input" placeholder="Enter serial number ${i + 1}">
                    `;
                    serialNumbersContainer.appendChild(row);
                }
            }
            
            function addItem() {
                const name = itemNameInput.value.trim();
                const quantity = parseInt(quantityInput.value) || 1;
                
                if (!name) {
                    showToast('Error', 'Please enter an item name', 'danger');
                    return;
                }
                
                let serialNumbers = [];
                
                if (serialNumbersVisible) {
                    const serialInputs = document.querySelectorAll('.serial-input');
                    serialNumbers = Array.from(serialInputs).map(input => input.value);
                    
                    // Check if all serial numbers are filled
                    const emptySerialIndex = serialNumbers.findIndex(sn => !sn.trim());
                    if (emptySerialIndex !== -1) {
                        showToast('Error', `Please enter serial number ${emptySerialIndex + 1}`, 'danger');
                        return;
                    }
                }
                
                const newItem = {
                    id: Date.now().toString(),
                    name,
                    quantity,
                    serialNumbers: serialNumbersVisible ? serialNumbers : []
                };
                
                items.push(newItem);
                renderItems();
                resetForm();
                showToast('Success', 'Item added successfully', 'success');
            }
            
            function renderItems() {
                itemsListCard.style.display = items.length > 0 ? 'block' : 'none';
                itemsList.innerHTML = '';
                
                items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'list-group-item';
                    
                    let serialNumbersHtml = '';
                    if (item.serialNumbers.length > 0) {
                        const serialNumbersGrid = item.serialNumbers.map((sn, index) => 
                            `<div class="col-md-4 col-lg-3 mb-1"><small><strong>${index + 1}:</strong> ${sn}</small></div>`
                        ).join('');
                        
                        serialNumbersHtml = `
                            <hr>
                            <div class="mt-2">
                                <h6 class="mb-2">Serial Numbers:</h6>
                                <div class="row">
                                    ${serialNumbersGrid}
                                </div>
                            </div>
                        `;
                    }
                    
                    itemElement.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <h5 class="mb-0">${item.name}</h5>
                                <small class="text-muted">Quantity: ${item.quantity}</small>
                            </div>
                            <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                        ${serialNumbersHtml}
                    `;
                    
                    itemsList.appendChild(itemElement);
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        removeItem(id);
                    });
                });
            }
            
            function removeItem(id) {
                items = items.filter(item => item.id !== id);
                renderItems();
            }
            
            function resetForm() {
                itemNameInput.value = '';
                quantityInput.value = '1';
                serialNumbersVisible = false;
                serialNumbersSection.style.display = 'none';
                toggleSerialBtn.textContent = 'Add Serial Numbers';
                updateSerialNumberInputs();
            }
            
            function saveGrn() {
                if (items.length === 0) {
                    showToast('Error', 'Please add at least one item', 'danger');
                    return;
                }
                
                // Here you would typically send the data to your backend
                console.log('Saving GRN:', items);
                
                showToast('Success', 'GRN saved successfully', 'success');
                
                // Reset everything
                items = [];
                renderItems();
                resetForm();
            }
            
            function showToast(title, message, type) {
                const toastId = 'toast-' + Date.now();
                const toastHtml = `
                    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body">
                                <strong>${title}:</strong> ${message}
                            </div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                `;
                
                toastContainer.insertAdjacentHTML('beforeend', toastHtml);
                const toastElement = document.getElementById(toastId);
                const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
                toast.show();
                
                // Remove toast from DOM after it's hidden
                toastElement.addEventListener('hidden.bs.toast', function() {
                    toastElement.remove();
                });
            }
            
            // Initialize
            updateSerialNumberInputs();
        });
*/