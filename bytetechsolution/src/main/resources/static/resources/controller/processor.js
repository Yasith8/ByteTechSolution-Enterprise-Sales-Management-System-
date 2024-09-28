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
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getCpuSeries },
        { dataType: 'function', propertyName: getCpuGeneration },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableProcessor, processors, displayPropertyList, refillProcessorForm, divModifyButton)
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
    //decimalSalesPrice.disabled = true;


    brands = getServiceAjaxRequest("/brand/brandbycategory/Processor");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemStatuses = getServiceAjaxRequest("/itemstatus/alldata");
    fillDataIntoSelect(selectItemStatus, "Select Item Status", itemStatuses, "name");


    fillDataIntoSelect(selectCpuSeries, "Select Processor Brand First", [], "name")
    fillDataIntoSelect(selectCpuSocket, "Select Processor Brand First", [], "name")
    fillDataIntoSelect(selectCpuGeneration, "Select Processor Socket First", [], "name");




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


    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/PROCESSOR");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], true);
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
    if (ob.itemstatus_id.name == 'Available') {
        return '<p class="item-status-available">' + ob.itemstatus_id.name + '</p>';
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

const refillProcessorForm = (ob, rowIndex) => {
    $('#processorAddModal').modal('show');
    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus])


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
    //assign sales price
    numberProfitRate.value = processor.profitrate;
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



    inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/PROCESSOR");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;
}


/* const salePriceCalculator = () => {
    decimalSalesPrice.disabled = true;
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', 'processor', 'salesprice')
} */

//print table
const printProcessorTable = () => {
    const newTab = window.open();
    newTab.document.write(
        '<link rel="stylesheet" href="resources/bootstrap-5.2.3/css/bootstrap.min.css">' +
        '<link rel="stylesheet" href="resources/style/processor.css">' +
        '<style>#tableProcessor{background-color:white;}</style>' +
        '<script>document.getElementById("tableEmployee").classList.remove("table-hover")</script>' +
        tableProcessor.outerHTML
    );

    setTimeout(
        function() {
            newTab.print();
        }, 1000
    )
}

//print processor data
const printProcessorDetails = (ob, rowIndex) => {}

const checkProcessorInputErrors = () => {
    let errors = "";

    if (processor.itemname == null) {
        errors = errors + "Processor Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
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

const checkProcessorFormUpdates = () => {
    updates = "";

    if (processor.itemname != oldProcessor.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (processor.profitrate != oldProcessor.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (processor.warranty != oldProcessor.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (processor.rop != oldProcessor.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (processor.roq != oldProcessor.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (processor.totalcore != oldProcessor.totalcore) {
        updates = updates + "Total Core is Changed \n";
    }
    if (processor.description != oldProcessor.description) {
        updates = updates + "Description is Changed \n";
    }
    if (processor.brand_id.name != oldProcessor.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (processor.cpusocket_id.name != oldProcessor.cpusocket_id.name) {
        updates = updates + "Processor Socket is Changed \n";
    }
    if (processor.cpugeneration_id.name != oldProcessor.cpugeneration_id.name) {
        updates = updates + "Processor Generation is Changed \n";
    }
    if (processor.cpuseries_id.name != oldProcessor.cpuseries_id.name) {
        updates = updates + "Processor Series is Changed \n";
    }
    if (processor.itemstatus_id.name != oldProcessor.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonProcessorUpdate = () => {
    //check form error
    let errors = checkProcessorInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkProcessorFormUpdates();

        //check there is no updates or any updations
        if (updates == "") {
            alert("Nothing Updates")
        } else {

            //get conformation from user to made updation
            let userConfirm = confirm("Are You Sure to Update this Changes? \n" + updates);

            //if user conform
            if (userConfirm) {
                //call put service requestd  -this use for updations
                let putServiceResponse;

                $.ajax("/processor", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(processor),


                    success: function(successResponseOb) {
                        putServiceResponse = successResponseOb;
                    },

                    error: function(failedResponseOb) {
                        putServiceResponse = failedResponseOb;
                    }

                });
                //check put service response
                if (putServiceResponse == "OK") {
                    alert("Updated Successfully");

                    //hide the moadel
                    $('#processorAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshProcessorTable();
                    //reset the Item form
                    formProcessor.reset();
                    //Item form refresh
                    refreshProcessorForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshProcessorForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Processor Form  has Following Errors..\n" + errors)
    }


}


const deletePocessor = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Prcessor? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/processor", {
            type: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(ob),
            async: false,

            success: function(data) {
                deleteServiceResponse = data
            },

            error: function(errData) {
                deleteServiceResponse = errData;
            }
        })

        //if delete response ok alert the success message and close the modal and refreash item table
        //so because of that we can see realtime update
        if (deleteServiceResponse == "OK") {
            alert("Delete Successfullly");
            $('#processorAddModal').modal('hide');
            refreshProcessorTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
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