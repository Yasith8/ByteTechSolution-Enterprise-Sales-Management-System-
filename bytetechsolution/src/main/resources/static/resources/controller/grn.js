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
    grn.grn_item = new Array();
    grn.serial_no_list = new Array();

    removeValidationColor([selectPurchaseRequest, selectGRNStatus, decimalTotalAmount, numberDiscountRate, decimalFinalAmount, decimalPaidAmount, textNote, dateRecivedDate, selectCategory, selectPRItemName, numberQuantity, decimalPurchasePrice, decimalLinePrice])


    divGrnInnerContent.classList.remove('elementHide')
    buttonClear.classList.remove('elementHide')
    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.remove('elementHide')
    inputFieldsHandler([selectPurchaseRequest, selectGRNStatus, decimalTotalAmount, numberDiscountRate, decimalFinalAmount, decimalPaidAmount, textNote, dateRecivedDate, selectCategory, selectPRItemName, numberQuantity, decimalPurchasePrice, decimalLinePrice], false)

    currentGrns = getServiceAjaxRequest("/grn/alldata");
    //gatta all the pr that required date not expired
    purchaseRequests = getServiceAjaxRequest("/purchaserequest/prequestbyrequireddate")
    const availablePurchaseRequest = purchaseRequests.filter(innerpr =>
        !currentGrns.some(grn =>
            grn.purchase_request_id.requestcode === innerpr.requestcode
        )
    );

    console.log("FILTERED GRN", availablePurchaseRequest)
    fillMultipleItemOfDataOnSignleSelectRecursion(selectPurchaseRequest, "Select Purchase Request", availablePurchaseRequest, "requestcode", "supplier_id.name");

    //grn eka
    grnstatus = getServiceAjaxRequest("/grnstatus/alldata")
    fillDataIntoSelect(selectGRNStatus, "Select GRN Status", grnstatus, "name")

    //categories = getServiceAjaxRequest("/category/alldata")
    //fillDataIntoSelect(selectCategory, "Select Category", categories, "name")

    decimalTotalAmount.disabled = true;
    let totalAmount = 0;

    // Calculate totalAmount from items
    grn.grn_item.forEach(item => {
        totalAmount += item.lineprice;
    });
    decimalTotalAmount.value = totalAmount;
    textValidator(decimalTotalAmount, '', 'grn', 'totalamount');

    // Disable final amount field initially
    decimalFinalAmount.disabled = true;

    // Initialize discount rate input handler
    numberDiscountRate.addEventListener('input', () => {
        let discountRate = parseFloat(numberDiscountRate.value);
        if (isNaN(discountRate)) discountRate = 0;

        let finalAmount = totalAmount * (1 - discountRate / 100);
        finalAmount = parseFloat(finalAmount.toFixed(2));

        decimalFinalAmount.value = finalAmount.toFixed(2);
        textValidator(decimalFinalAmount, '', 'grn', 'finalamount');
        console.log("FINAL AMOUNT H", finalAmount);

    });


    refeshInnerGrnFormAndTable();
}

const refeshInnerGrnFormAndTable = () => {
    //form

    grnItem = new Object();
    oldGrnItem = null;
    serialNumbersData = new Array();
    serialNoWithDetails = new Object();
    serialNoList = new Array();
    numberQuantity.value = null;
    decimalPurchasePrice.value = null;
    decimalLinePrice.value = null;
    removeValidationColor([numberQuantity, decimalPurchasePrice, decimalLinePrice])
        //checkAndToggleButton();
    updateSerialNumberInputs();




    if (selectPurchaseRequest.value == "Select Purchase Request") {

        fillMultipleItemOfDataOnSignleSelectRecursion(selectCategory, "Select Purchase Request First", [], "itemcode", "itemname")
        fillMultipleItemOfDataIntoSingleSelect(selectPRItemName, "Select Purchase Request First", [], "itemcode", "itemname")

        selectPurchaseRequest.addEventListener('change', () => {
            grn.selectItemName_id = null;

            removeValidationColor([selectPRItemName]);
            const purchaseRequestedItem = selectValueHandler(selectPurchaseRequest);

            // Create a new Map to store unique categories using their `name` as the key
            const uniqueCategoriesMap = new Map();

            // Loop through each item in the purchase request
            purchaseRequestedItem.purchase_request_item.forEach((prItem) => {
                const category = prItem.category_id; // Get the category object from the item

                // Check if this category name is not already in the Map
                if (!uniqueCategoriesMap.has(category.name)) {
                    // If it's not in the Map, add it using the name as the key and the full category object as the value
                    uniqueCategoriesMap.set(category.name, category);
                }
            });

            // Convert the values (unique category objects) from the Map into an array
            const categories = Array.from(uniqueCategoriesMap.values());

            fillDataIntoSelect(selectCategory, "Select Category", categories, "name")
            fillMultipleItemOfDataIntoSingleSelect(selectPRItemName, "Select Item", purchaseRequestedItem.purchase_request_item, "itemcode", "itemname")

            selectCategory.addEventListener('change', () => {
                const selectedCategory = selectValueHandler(selectCategory);
                const selectedCategoryItems = purchaseRequestedItem.purchase_request_item.filter(item =>
                    item.category_id.name == selectedCategory.name
                );
                console.log(selectedCategoryItems)
                fillMultipleItemOfDataIntoSingleSelect(selectPRItemName, "Select Item", selectedCategoryItems, "itemcode", "itemname")
            })

        })

    } else {


        const selectedPR = selectValueHandler(selectPurchaseRequest);

        const grnItemCodes = grn.grn_item.map(item => item.itemcode);


        const remainGRNItem = selectedPR.purchase_request_item.filter(
            (qItem) => !grnItemCodes.includes(qItem.itemcode)
        );



        fillMultipleItemOfDataIntoSingleSelect(selectPRItemName, "Select Item", remainGRNItem, "itemcode", "itemname")

        selectPurchaseRequest.addEventListener('change', () => {
            grn.selectItemName_id = null;
            removeValidationColor([selectPRItemName]);
        })
    }

    selectCategory.addEventListener('change', () => {
        const selectedCategory = selectValueHandler(selectCategory);
        if (selectedCategory.name == "Accessories") {
            toggleSerialBtn.disabled = true;
            toggleSerialBtn.classList.add('elementHide')
        }
    })

    numberQuantity.addEventListener('input', () => {
        const newQty = parseInt(numberQuantity.value);
        console.log(newQty)

        if (newQty < serialNumbersData.length) {
            serialNumbersData = serialNumbersData.slice(0, newQty);
        } else {
            while (serialNumbersData.length < newQty) {
                serialNumbersData.push('');
            }
        }

        checkAndToggleButton();
        updateSerialNumberInputs();
    });

    selectPRItemName.addEventListener('change', () => {
        const selectedItemName = selectValueHandler(selectPRItemName);
        grnItem.itemname = selectedItemName.itemname
        grnItem.itemcode = selectedItemName.itemcode


        grnItem.category_id = selectedItemName.category_id;
        numberQuantity.value = selectedItemName.quantity;
        const maxQty = selectedItemName.quantity;
        const qtyPattern = generateRangeRegex(maxQty);
        console.log(qtyPattern.source)
        textValidator(numberQuantity, qtyPattern.source, 'grnItem', 'quantity');

        decimalPurchasePrice.disabled = true;
        decimalPurchasePrice.value = selectedItemName.unitprice;
        textValidator(decimalPurchasePrice, '', 'grnItem', 'purchaseprice');


        decimalLinePrice.value = selectedItemName.linetotal
        decimalLinePrice.disabled = true;
        textValidator(decimalPurchasePrice, '', 'grnItem', 'lineprice');
        numberQuantity.addEventListener('input', () => {
            grnItem.quantity = null;
            numberQuantity.classList.remove('is-valid')
            const newQuantity = numberQuantity.value;
            //code eka validate karanawa pr eke quantity ekata wada ba kiyala
            if (newQuantity > selectedItemName.quantity || newQuantity < 1) {
                numberQuantity.classList.remove('is-valid')
                numberQuantity.classList.add('is-invalid')
                decimalLinePrice.value = 0
                toggleSerialBtn.disabled = true;

            } else {
                numberQuantity.classList.remove('is-invalid')
                numberQuantity.classList.add('is-valid');
                decimalLinePrice.value = newQuantity * selectedItemName.unitprice
                textValidator(decimalLinePrice, '', 'grnItem', 'lineprice');
                toggleSerialBtn.disabled = false;
                grnItem.quantity = newQuantity;

            }
        })

    });

    //table
    //inner table
    let displayPropertyList = [
        { dataType: 'text', propertyName: "itemcode" },
        { dataType: 'text', propertyName: "itemname" },
        { dataType: 'text', propertyName: "purchaseprice" },
        { dataType: 'text', propertyName: "quantity" },
        { dataType: 'text', propertyName: "lineprice" },
    ]

    console.log(grn.grn_item, "dddd")

    fillDataIntoInnerTable(innerGrnTable, grn.grn_item, displayPropertyList, refillInnerGRNItemForm, deleteInnerGRNItemForm)
        //updateAvailableItems()
}

const updateAvailableItems = () => {
    // Filter out items that are already in the pr request
    const selectedPR = selectValueHandler(selectPurchaseRequest);


    //ajax request to get data aout itrems
    fillMultipleItemOfDataIntoSingleSelect(selectPRItemName, "Select Item", selectedPR.purchase_request_item, "itemcode", "itemname")

    //fiter items that not in the tagbke
    const availableItems = selectedPR.filter(innerItem =>
        !grn.grn_item.some(grn =>
            grn.itemcode === innerItem.itemcode
        )
    );

    console.log(availableItems);
    console.log(purchaserequest.purchase_request_item);

    // Update the select dropdown with available items
    fillMultipleItemOfDataIntoSingleSelect(
        selectItemName,
        "Please Select Item",
        availableItems,
        "itemcode",
        'itemname'
    );
}



const refillGrnForm = (ob, rowIndex) => {
    $('#grnAddModal').modal('show');
    grn = ob;
    removeValidationColor([selectPurchaseRequest, selectGRNStatus, decimalTotalAmount, numberDiscountRate, decimalFinalAmount, decimalPaidAmount, textNote, dateRecivedDate, selectCategory, selectPRItemName, numberQuantity, decimalPurchasePrice, decimalLinePrice])

    divGrnInnerContent.classList.add('elementHide')
    buttonClear.classList.add('elementHide')
    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.add('elementHide')

    grnstatus = getServiceAjaxRequest("/grnstatus/alldata")
    fillDataIntoSelect(selectGRNStatus, "Select GRN Status", grnstatus, "name", grn.grnstatus_id.name);

    purchaserequests = getServiceAjaxRequest("/purchaserequest/alldata")
    fillMultipleItemOfDataOnSignleSelectRecursion(selectPurchaseRequest, "Select Purchase Request", purchaserequests, "requestcode", "supplier_id.name", grn.purchase_request_id.requestcode, grn.purchase_request_id.supplier_id.name);


    decimalTotalAmount.value = grn.totalamount;
    numberDiscountRate.value = grn.discountrate;
    decimalFinalAmount.value = grn.finalamount;
    decimalPaidAmount.value = grn.paidamount;
    textNote.value = grn.note;
    dateRecivedDate.value = grn.reciveddate;
    inputFieldsHandler([selectPurchaseRequest, selectGRNStatus, decimalTotalAmount, numberDiscountRate, decimalFinalAmount, decimalPaidAmount, textNote, dateRecivedDate, selectCategory, selectPRItemName, numberQuantity, decimalPurchasePrice, decimalLinePrice], true)

    if (grn.grnstatus_id.name == "Deleted") {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');

        selectGrnStatus.addEventListener('change', () => {
            if (grn.grnstatus_id.name == "Deleted") {
                buttonDelete.disabled = true;
                buttonDelete.classList.remove('modal-btn-delete');
            } else {
                buttonDelete.disabled = false;
                buttonDelete.classList.add('modal-btn-delete');
            }
        })
    }

    refeshInnerGrnFormAndTable()
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
    }
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
            <input type="text" class="form-control serial-input" 
                placeholder="Enter serial number ${i + 1}" 
                value="${serialNumbersData[i] || ''}">
        `;
        row.appendChild(col);
    }

    document.querySelectorAll('.serial-input').forEach((input, index) => {
        input.addEventListener('input', () => {
            serialNumbersData[index] = input.value;
        });
    });
}

const getPurchaseRequest = (ob) => {
    return ob.purchase_request_id.requestcode;
}

const getGRNStatus = (ob) => {
    if (ob.grnstatus_id.name == 'Approved') {
        return '<p class="common-status-available">' + ob.grnstatus_id.name + '</p>';
    }

    if (ob.grnstatus_id.name == 'Pending Approval') {
        return '<p class="common-status-resign">' + ob.grnstatus_id.name + '</p>'
    }

    if (ob.grnstatus_id.name == 'Rejected') {
        return '<p class="common-status-reject">' + ob.grnstatus_id.name + '</p>'
    }
    if (ob.grnstatus_id.name == 'Deleted') {
        return '<p class="common-status-delete">' + ob.grnstatus_id.name + '</p>'
    } else {
        return '<p class="common-status-other">' + ob.grnstatus_id.name + '</p>'
    }
}

const refillInnerGRNItemForm = (ob, rowIndex) => {

}
const deleteInnerGRNItemForm = (ob, rowIndex) => {

}

const checkInnerItemFormErrors = () => {
    let errors = ""

    if (grnItem.itemname_id == null) {
        errors += "Item selection is required.\n"
    }
    if (grnItem.quantity == null) {
        errors += "Quantity is required.\n"
    }
    if (grnItem.category_id.name != "Accessories") {
        if (serialNoList.length != grnItem.quantity) {
            errors += "All the Serial Numbers filling is required.\n"
        }
    }

    return errors;
}

const innerSupplierProductAdd = () => {
    //itemdata
    //destructure the pr irem code for remove itemname_id
    const { itemname_id, ...rest } = grnItem;
    updatedGRNItem = rest;


    if (updatedGRNItem.category_id.name === "Accessories") {
        const { category_id, itemcode, itemname, purchaseprice, quantity, ...rest } = updatedGRNItem;
        let currentItem = getServiceAjaxRequest(`/${(category_id.name).toLowerCase()}/filteritem?itemcode=${itemcode}`);
        console.log("Current Item DATA", currentItem[0].profitrate)
        let purchasePrice = parseFloat(purchaseprice);
        let profitRate = currentItem[0].profitrate;
        let salesprice = (profitRate / 100) * purchasePrice + purchasePrice;
        console.log(quantity, "ddkddk")

        serialNoWithDetails = {
            category_id: category_id,
            itemcode: itemcode,
            itemname: itemname,
            status: true,
            salesprice: salesprice,
            quantity: quantity
        }
        serialNoList.push(serialNoWithDetails);
    } else {
        serialNumbersData.forEach(seialNo => {
            const { category_id, itemcode, itemname, purchaseprice, ...rest } = updatedGRNItem;
            let currentItem = getServiceAjaxRequest(`/${(category_id.name).toLowerCase()}/filteritem?itemcode=${itemcode}`);
            console.log("Current Item DATA", currentItem[0].profitrate)
            let purchasePrice = parseFloat(purchaseprice);
            let profitRate = currentItem[0].profitrate;
            let salesprice = (profitRate / 100) * purchasePrice + purchasePrice;
            let itemQuantity = 1



            serialNoWithDetails = { category_id: category_id, itemcode: itemcode, itemname: itemname, status: true, serialno: seialNo, salesprice: salesprice, quantity: itemQuantity }
            serialNoList.push(serialNoWithDetails);
        })

    }
    console.log("GRN", grn)
    console.log("GRN ITEM", updatedGRNItem)
    console.log("SERIAL NO LIST", grn.serial_no_list)

    let errors = checkInnerItemFormErrors();

    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to assign this product to the GRN?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, assign it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                grn.grn_item.push(updatedGRNItem);
                console.log("GRN--->GRN Items", grn.grn_item);

                serialNoList.forEach(item => {
                    grn.serial_no_list.push(item);
                })
                console.log("GRN--->sERIAL NO List", grn.serial_no_list);

                let totalAmount = 0;
                grn.grn_item.forEach(item => {
                    totalAmount += parseFloat(item.lineprice);
                });
                decimalTotalAmount.value = totalAmount;
                grn.totalamount = totalAmount;

                let discountRate = parseFloat(numberDiscountRate.value);
                if (isNaN(discountRate)) discountRate = 0;

                let finalAmount = totalAmount * (1 - discountRate / 100);
                finalAmount = parseFloat(finalAmount.toFixed(2));

                decimalFinalAmount.value = finalAmount.toFixed(2);
                textValidator(decimalFinalAmount, '', 'grn', 'finalamount');

                Swal.fire({
                    title: "Success!",
                    text: "Items assigned to the GRN successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    refeshInnerGrnFormAndTable();

                    let totalAmount = 0;
                    grn.grn_item.forEach(item => {
                        totalAmount += parseFloat(item.lineprice);
                    });

                    decimalTotalAmount.value = totalAmount;
                    grn.totalamount = totalAmount;
                    toggleSerialNoContent();
                    //purchaseItemForm.reset();
                    /*  document.querySelectorAll('.inner-delete-btn').forEach((btn) => {
                         btn.classList.remove('custom-disabled');
                     });

                     document.querySelectorAll('.inner-edit-button').forEach((btn) => {
                         btn.classList.remove('custom-disabled');
                     }); */
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

const formGrnInputErrors = () => {
    let errors = "";
    if (grn.purchase_request_id == null) {
        errors += "Purchase Request need to be selected.\n";
        selectPurchaseRequest.classList.add("is-invalid");
    }
    if (grn.grnstatus_id == null) {
        errors += "GRN Status need to be selected.\n";
        selectGRNStatus.classList.add("is-invalid");
    }
    if (grn.discountrate == null) {
        errors += "Discount Rate should be filled.\n";
        numberDiscountRate.classList.add("is-invalid");
    }
    if (grn.reciveddate == null) {
        errors += "Recived Date should be filled.\n";
        dateRecivedDate.classList.add("is-invalid");
    }
    if (grn.grn_item.length == 0) {
        errors += "Atleaset add one item to table.\n";
    }

    return errors;
}

const submitGRN = () => {
    console.log(grn);
    let errors = formGrnInputErrors();

    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Add this GRN?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, Add it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                let postServiceResponce;

                $.ajax("/grn", {
                    type: "POST",
                    data: JSON.stringify(grn),
                    contentType: "application/json",
                    async: false,

                    success: function(data) {
                        console.log("success", data);
                        postServiceResponce = data;
                    },

                    error: function(resData) {
                        console.log("Fail", resData);
                        postServiceResponce = resData;
                    }
                })

                if (postServiceResponce == "OK") {
                    Swal.fire({
                        title: "Success!",
                        text: "GRN Added Successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        $('#grnAddModal').modal('hide');
                        //reset the Item form
                        refreshGrnTable();
                        refreshGrnForm();
                        //formGRN.reset();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Adding GRN failed due to the following errors:<br>" + postServiceResponce,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonColor: "#F25454"
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: "Error!",
            html: "Adding GRN failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}


const buttonModalClose = () => {
    Swal.fire({
        title: "Are you sure to close the form?",
        text: "If you close this form, filled data will be removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Close",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {

        if (result.isConfirmed) {
            $('#grnAddModal').modal('hide');
            divModifyButton.className = 'd-none';
            refreshGrnForm();
            grnItemForm.reset();
        }
    });
}

const innerClearButton = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Item Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refeshInnerGrnFormAndTable();

            Swal.fire({
                title: "Success!",
                text: "Item Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
}

const refreshGRN = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Purchase Request Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refeshInnerGrnFormAndTable();
            refreshGrnForm();
            grnItemForm.reset();

            Swal.fire({
                title: "Success!",
                text: "Purchase Request Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
}