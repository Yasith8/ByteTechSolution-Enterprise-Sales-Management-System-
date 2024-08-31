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



console.log(selectValueHandler)

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




    selectBrand.addEventListener('change', () => {
        const cpuBrand = selectValueHandler(selectBrand);
        cpuSeries = getServiceAjaxRequest("/cpuseries/cpuseriesbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name");

        cpuSocket = getServiceAjaxRequest("/cpusocket/cpusocketbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

        selectCpuSocket.addEventListener('change', () => {
            const cpuGentoSocket = selectValueHandler(selectCpuSocket);
            cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + cpuGentoSocket.name);
            fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");
        });

    });

    //cpuSeries = getServiceAjaxRequest("/cpuseries/alldata");
    //fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name");


    //cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    //fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

    /* selectCpuSocket.addEventListener('change', () => {
        const cpuGentoSocket = selectValueHandler(selectCpuSocket);
        console.log(cpuGentoSocket)
        cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + cpuGentoSocket.name);
        fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");
    }); */


    //cpuGeneration = getServiceAjaxRequest("/cpugeneration/alldata");
    //fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");


    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], true);
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



    //get the brand that made processors
    brands = getServiceAjaxRequest("/brand/brandbycategory/Processor");
    fillDataIntoSelect(selectBrand, "Please Select", brands, "name", ob.brand_id.name);


    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    //cpuSeries = getServiceAjaxRequest("/cpuseries/alldata");
    cpuSeries = getServiceAjaxRequest("/cpuseries/cpuseriesbybrand/" + ob.brand_id.name);
    fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name", ob.cpuseries_id.name);

    //cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    cpuSocket = getServiceAjaxRequest("/cpusocket/cpusocketbybrand/" + ob.brand_id.name);
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name", ob.cpusocket_id.name);

    //cpuGeneration = getServiceAjaxRequest("/cpugeneration/alldata");
    cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + ob.cpusocket_id.name);
    fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name", ob.cpugeneration_id.name);




    //when user change brand all the data need to change
    selectBrand.addEventListener('change', () => {
        const cpuBrand = selectValueHandler(selectBrand);
        cpuSeries = getServiceAjaxRequest("/cpuseries/cpuseriesbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name");

        cpuSocket = getServiceAjaxRequest("/cpusocket/cpusocketbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

        selectCpuSocket.addEventListener('change', () => {
            const cpuGentoSocket = selectValueHandler(selectCpuSocket);
            console.log(cpuGentoSocket)
            cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + cpuGentoSocket.name);
            fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");
        });

    });



    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], false);
    btnClearImage.classList.add('btn-user-removeImage');
    btnSelectImage.classList.add('btn-user-selectImage');
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], true);
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


const salePriceCalculator = () => {
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', 'processor', 'salesprice')
}

//print table
const printProcessorTable = () => {

}

//print processor data
const buttonProcessorDetailPrint = () => {}

const checkProcessorInputErrors = () => {
    let errors = "";

    if (processor.itemname == null) {
        errors = errors + "Processor Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (processor.purchaseprice == null) {
        errors = errors + "Purchase Price can't be Null...!\n";
        decimalPurchasePrice.classList.add("is-invalid");
    }
    if (processor.salesprice == null) {
        errors = errors + "Sales Price can't be Null...!\n";
        decimalSalesPrice.classList.add("is-invalid");
    }

    if (processor.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (processor.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (processor.totalcore == null) {
        errors = errors + "Total Cores can't be Null...!\n";
        numberTotalCore.classList.add("is-invalid");
    }
    if (processor.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (processor.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (processor.cpusocket_id == null) {
        errors = errors + "Processor Socket can't be Null...!\n";
        selectCpuSocket.classList.add("is-invalid");
    }
    if (processor.cpuseries_id == null) {
        errors = errors + "Processor Series can't be Null...!\n";
        selectCpuSeries.classList.add("is-invalid");
    }
    if (processor.cpugeneration_id == null) {
        errors = errors + "Processor Generation can't be Null...!\n";
        selectCpuGeneration.classList.add("is-invalid");
    }

    return errors;
}


const buttonProcessorSubmit = () => {
    let errors = checkProcessorInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/processor", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(processor),
                async: false,

                success: function(data) {
                    console.log("success", data);
                    postServiceResponce = data;
                },

                error: function(resData) {
                    console.log("Fail", resData);
                    postServiceResponce = resData;
                }

            });

            //if response is success
            if (postServiceResponce == "OK") {
                alert("Save successfully...!");
                //hide the model
                $('#processorAddModal').modal('hide');
                //reset the Item form
                formProcessor.reset();
                //refreash Item form
                refreshProcessorForm();
                //refreash Item table
                refreshProcessorTable();
            } else {
                alert("Fail to submit Processor form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}


const buttonProcessorUpdate = () => {

}


const buttonProcessorDelete = () => {

}

const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#processorAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formProcessor.reset();
        divModifyButton.className = 'd-none';

        refreshProcessorForm();
    }
}