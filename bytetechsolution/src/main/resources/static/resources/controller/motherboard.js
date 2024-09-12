window.addEventListener('load', () => {
    refreshMotherboardTable();
    refreshMotherboardForm();
})

const refreshMotherboardTable = () => {

    motherboards = getServiceAjaxRequest("/motherboard/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'text', propertyName: 'purchaseprice' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'function', propertyName: getMotherboardSeries },
        { dataType: 'function', propertyName: getMotherboardType },
        { dataType: 'function', propertyName: getMotherboardFormFactor },
        { dataType: 'function', propertyName: getMemoryType },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableMotherboard, motherboards, displayPropertyList, refillMotherboardForm, divModifyButton)
        //table show with dataTable
    $('#tableMotherboard').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}
const refreshMotherboardForm = () => {
    motherboard = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name");

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name");

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Supported Memory Type", memorytypes, "name");

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

    fillDataIntoSelect(selectMotherboardSeries, "Select Processor Socket First", [], "name")
    fillDataIntoSelect(selectMotherboardType, "Select Motherboard Series First", [], "name")



    selectCpuSocket.addEventListener('change', () => {
        const cpusocket = selectValueHandler(selectCpuSocket);
        motherboardSeries = getServiceAjaxRequest("/motherboardseries/motherboardseriesbycpusocket/" + cpusocket.name);
        fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardSeries, "name");

        selectMotherboardSeries.addEventListener('change', () => {
            const motherboardseries = selectValueHandler(selectMotherboardSeries);
            motherboardTypes = getServiceAjaxRequest("/motherboardtype/motherboardtypebymotherboardseries/" + motherboardseries.name);
            fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name");
        })

    })


    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/MOTHERBOARD");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getMotherboardSeries = (ob) => {
    return ob.motherboardseries_id.name;
}

const getMotherboardType = (ob) => {
    return ob.motherboardtype_id.name;
}

const getMotherboardFormFactor = (ob) => {
    return ob.motherboardformfactor_id.name;
}

const getMemoryType = (ob) => {
    return ob.memorytype_id.name;
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

const salePriceCalculator = () => {
    decimalSalesPrice.disabled = true;
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', 'motherboard', 'salesprice')
}

const refillMotherboardForm = (ob, rowIndex) => {
    $('#motherboardAddModal').modal('show');
    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    motherboard = JSON.parse(JSON.stringify(ob));
    oldMotherboard = ob;

    //asign itemcode
    staticBackdropLabel.textContent = motherboard.itemcode;

    //assign item name
    textItemName.value = motherboard.itemname;
    //assign purchase price
    decimalPurchasePrice.value = motherboard.purchaseprice;
    //assign profit rate
    numberProfitRate.value = motherboard.profitrate;
    //assign sales price
    decimalSalesPrice.value = motherboard.salesprice;
    //assign rop 
    numberROP.value = motherboard.rop;
    //assign roq 
    numberROQ.value = motherboard.roq;
    //assign warranty
    numberWarranty.value = motherboard.warranty;
    //asign description
    textDescription.value = motherboard.description;
    //assign max capacity
    numberMaxCapacity.value = motherboard.maxcapacity


    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name", ob.motherboardformfactor_id.name);

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Supported Memory Type", memorytypes, "name", ob.memorytype_id.name);

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name", ob.cpusocket_id.name);

    motherboardseries = getServiceAjaxRequest("/motherboardseries/alldata");
    fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardseries, "name", ob.motherboardseries_id.name)

    motherboardTypes = getServiceAjaxRequest("/motherboardtype/alldata");
    fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name", ob.motherboardtype_id.name)



    selectCpuSocket.addEventListener('change', () => {
        const cpusocket = selectValueHandler(selectCpuSocket);
        motherboardSeries = getServiceAjaxRequest("/motherboardseries/motherboardseriesbycpusocket/" + cpusocket.name);
        fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardSeries, "name");

        selectMotherboardSeries.addEventListener('change', () => {
            const motherboardseries = selectValueHandler(selectMotherboardSeries);
            motherboardTypes = getServiceAjaxRequest("/motherboardtype/motherboardtypebymotherboardseries/" + motherboardseries.name);
            fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name");
        })

    })


    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/MOTHERBOARD");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;

}

const checkMotherboardInputErrors = () => {
    let errors = "";

    if (motherboard.itemname == null) {
        errors = errors + "Motherboard Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (motherboard.purchaseprice == null) {
        errors = errors + "Purchase Price can't be Null...!\n";
        decimalPurchasePrice.classList.add("is-invalid");
    }
    if (motherboard.salesprice == null) {
        errors = errors + "Sales Price can't be Null...!\n";
        decimalSalesPrice.classList.add("is-invalid");
    }

    if (motherboard.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (motherboard.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (motherboard.maxcapacity == null) {
        errors = errors + "Total Cores can't be Null...!\n";
        numberMaxCapacity.classList.add("is-invalid");
    }
    if (motherboard.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (motherboard.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (motherboard.cpusocket_id == null) {
        errors = errors + "Processor Socket can't be Null...!\n";
        selectCpuSocket.classList.add("is-invalid");
    }
    if (motherboard.motherboardseries_id == null) {
        errors = errors + "Motherboard Series can't be Null...!\n";
        selectMotherboardSeries.classList.add("is-invalid");
    }
    if (motherboard.motherboardtype_id == null) {
        errors = errors + "Motherboard Type can't be Null...!\n";
        selectMotherboardType.classList.add("is-invalid");
    }
    if (motherboard.motherboardformfactor_id == null) {
        errors = errors + "Motherboard Form Factor can't be Null...!\n";
        selectMotherboardFormFactor.classList.add("is-invalid");
    }
    if (motherboard.memorytype_id == null) {
        errors = errors + "Memory Type can't be Null...!\n";
        selectMemoryType.classList.add("is-invalid");
    }

    return errors;
}

const buttonMotherboardSubmit = () => {
    let errors = checkMotherboardInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/motherboard", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(motherboard),
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
                $('#motherboardAddModal').modal('hide');
                //reset the Item form
                formMotherboard.reset();
                //refreash Item form
                refreshMotherboardForm();
                //refreash Item table
                refreshMotherboardTable();
            } else {
                alert("Fail to submit Motherboard form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}

const checkMotherboardFormUpdates = () => {
    updates = "";

    if (motherboard.itemname != oldMotherboard.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (motherboard.purchaseprice != oldMotherboard.purchaseprice) {
        updates = updates + "Purchase Price is Changed \n";
    }
    if (motherboard.profitrate != oldMotherboard.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (motherboard.warranty != oldMotherboard.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (motherboard.rop != oldMotherboard.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (motherboard.roq != oldMotherboard.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (motherboard.maxcapacity != oldMotherboard.maxcapacity) {
        updates = updates + "Max Capacity is Changed \n";
    }
    if (motherboard.description != oldMotherboard.description) {
        updates = updates + "Description is Changed \n";
    }
    if (motherboard.brand_id.name != oldMotherboard.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (motherboard.cpusocket_id.name != oldMotherboard.cpusocket_id.name) {
        updates = updates + "Processor Socket is Changed \n";
    }
    if (motherboard.motherboardtype_id.name != oldMotherboard.motherboardtype_id.name) {
        updates = updates + "Motherboard Type is Changed \n";
    }
    if (motherboard.motherboardseries_id.name != oldMotherboard.motherboardseries_id.name) {
        updates = updates + "Motherboard Series is Changed \n";
    }
    if (motherboard.motherboardformfactor_id.name != oldMotherboard.motherboardformfactor_id.name) {
        updates = updates + "Motherboard Form Factor is Changed \n";
    }
    if (motherboard.memorytype_id.name != oldMotherboard.memorytype_id.name) {
        updates = updates + "Memory Type is Changed \n";
    }
    if (motherboard.itemstatus_id.name != oldMotherboard.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonMotherboardUpdate = () => {
    //check form error
    let errors = checkMotherboardInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkMotherboardFormUpdates();

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

                $.ajax("/motherboard", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(motherboard),


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
                    $('#motherboardAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshMotherboardTable();
                    //reset the Item form
                    formMotherboard.reset();
                    //Item form refresh
                    refreshMotherboardForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshMotherboardForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Motherboard Form  has Following Errors..\n" + errors)
    }


}


const deleteMotherboard = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Motherboard? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/mmotherboard", {
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
            $('#motherboardAddModal').modal('hide');
            refreshMotherboardTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}


const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#motherboardAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formMotherboard.reset();
        divModifyButton.className = 'd-none';

        refreshMotherboardForm();
    }
}