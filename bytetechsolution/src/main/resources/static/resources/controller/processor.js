window.addEventListener('load', () => {
    refreshProcessorTable();
    refreshProcessorForm();
})

const refreshProcessorTable = () => {

    //get data using ajax request
    processors = getServiceAjaxRequest("/processor/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'quantity' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'text', propertyName: 'purchaseprice' },
        { dataType: 'function', propertyName: getCpuSeries },
        { dataType: 'function', propertyName: getCpuGeneration },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableProcessor, processors, displayPropertyList, refillItemForm, divModifyButton)
        //table show with dataTable
    $('#tableProcessor').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}

const refreshProcessorForm = () => {
    processor = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";


    brands = getServiceAjaxRequest("/brand/brandbycategory/Processor");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemStatuses = getServiceAjaxRequest("/itemstatus/alldata");
    fillDataIntoSelect(selectItemStatus, "Select Item Status", itemStatuses, "name");

    cpuGeneration = getServiceAjaxRequest("/cpugeneration/alldata");
    fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");

    cpuSeries = getServiceAjaxRequest("/cpuseries/alldata");
    fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name");

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberQuantity, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberQuantity, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}


const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getCpuSeries = (ob) => {
    return ob.cpuseries_id.name;
}

const getCpuGeneration = (ob) => {
    return ob.cpugeneration_id.name;
}

const getCpuSocket = (ob) => {
    return ob.cpusocket_id.name;
}

const getItemStatus = (ob) => {
    console.log(ob.itemstatus_id.name)
    if (ob.itemstatus_id.name == 'Available') {
        return '<p class="items-tatus-available">' + ob.itemstatus_id.name + '</p>';
    }

    if (ob.itemstatus_id.name == 'Low-Stock') {
        return '<p class="item-status-resign">' + ob.itemstatus_id.name + '</p>'
    }


    if (ob.itemstatus_id.name == 'Unavailable') {
        return '<p class="item-status-delete">' + ob.itemstatus_id.name + '</p>'
    } else {
        return '<p class="item-status-other">' + ob.itemstatus_id.name + '</p>'
    }
}

const refillItemForm = (ob, rowIndex) => {
    $('#processorAddModal').modal('show');


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    processor = JSON.parse(JSON.stringify(ob));
    oldProcessor = ob;

    //asign itemcode
    staticBackdropLabel.textContent = processor.itemcode;

    //assign item name
    textItemName.value = processor.itemname;
    //assign purchase price
    decimalPurchasePrice.value = processor.purchaseprice;
    //assign profit rate
    numberProfitRate.value = processor.profitrate;
    //assign sales price
    decimalSalesPrice.value = processor.salesprice;
    //assign quentity 
    numberQuantity.value = processor.quantity;
    //assign rop 
    numberROP.value = processor.rop;
    //assign roq 
    numberROQ.value = processor.roq;
    //assign warranty
    numberWarranty.value = processor.warranty;
    //asign description
    textDescription.value = processor.description;
    //assign total core
    numberTotalCore.value = processor.totalcore;



    brands = getServiceAjaxRequest("/brand/brandbycategory/Processor");
    fillDataIntoSelect(selectBrand, "Please Select", brands, "name", ob.brand_id.name);


    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    cpuGeneration = getServiceAjaxRequest("/cpugeneration/alldata");
    fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name", ob.cpugeneration_id.name);

    cpuSeries = getServiceAjaxRequest("/cpuseries/alldata");
    fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name", ob.cpuseries_id.name);

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name", ob.cpusocket_id.name);


    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberQuantity, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], false);
    btnClearImage.classList.add('btn-user-removeImage');
    btnSelectImage.classList.add('btn-user-selectImage');
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberQuantity, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], true);
        btnClearImage.classList.remove('btn-user-removeImage');
        btnSelectImage.classList.remove('btn-user-selectImage');
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;
}