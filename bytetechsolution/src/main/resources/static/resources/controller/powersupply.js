window.addEventListener('load', () => {
    refreshPowerSupplyTable();
    refreshPowerSupplyForm();
})


const refreshPowerSupplyTable = () => {

    //get powersupply data
    powersupplys = getServiceAjaxRequest('/powersupply/alldata')

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getModularity },
        { dataType: 'function', propertyName: getEfficiency },
        { dataType: 'function', propertyName: getPowerSupplyFormFactor },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tablePowerSupply, powersupplys, displayPropertyList, refillPowerSupplyForm, divModifyButton)
        //table show with dataTable
    $('#tablePowerSupply').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}


const refreshPowerSupplyForm = () => {
    powersupply = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/brandbycategory/PowerSupply");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    powersupplyformfactors = getServiceAjaxRequest("/powersupplyformfactor/alldata")
    fillDataIntoSelect(selectPowerSupplyFormFactor, "Please Select Power Supply Form Factor", powersupplyformfactors, "name");

    efficiency = getServiceAjaxRequest("/efficiency/alldata")
    fillDataIntoSelect(selectEfficiency, "Please Select Efficiency", efficiency, "name");

    modularity = getServiceAjaxRequest("/modularity/alldata")
    fillDataIntoSelect(selectModularity, "Please Select Modularity", modularity, "name");

    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectPowerSupplyFormFactor, selectBrand, selectItemStatus, selectModularity, selectEfficiency, numberWattage])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/POWERSUPPLY");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectPowerSupplyFormFactor, selectBrand, selectItemStatus, selectModularity, selectEfficiency, numberWattage], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getModularity = (ob) => {
    return ob.modularity_id.name;
}

const getEfficiency = (ob) => {
    return ob.efficiency_id.name;
}

const getPowerSupplyFormFactor = (ob) => {
    return ob.powersupplyformfactor_id.name;
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

const refillPowerSupplyForm = (ob, rowIndex) => {
    $('#powersupplyAddModal').modal('show');
    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectPowerSupplyFormFactor, selectBrand, selectItemStatus, selectModularity, selectEfficiency, numberWattage])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    powersupply = JSON.parse(JSON.stringify(ob));
    oldPowerSupply = ob;

    //asign itemcode
    staticBackdropLabel.textContent = powersupply.itemcode;

    //assign item name
    textItemName.value = powersupply.itemname;
    //assign purchase price
    decimalPurchasePrice.value = powersupply.purchaseprice;
    //assign profit rate
    numberProfitRate.value = powersupply.profitrate;
    //assign sales price
    decimalSalesPrice.value = powersupply.salesprice;
    //assign rop 
    numberROP.value = powersupply.rop;
    //assign roq 
    numberROQ.value = powersupply.roq;
    //assign warranty
    numberWarranty.value = powersupply.warranty;
    //asign description
    textDescription.value = powersupply.description;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/GPU");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name", ob.motherboardformfactor_id.name);

    powersupplytypes = getServiceAjaxRequest("/powersupplytype/alldata")
    fillDataIntoSelect(selectPowerSupplyType, "Please Select GPU Type", powersupplytypes, "name", ob.powersupplytype_id.name);

    interfaces = getServiceAjaxRequest("/interface/alldata")
    fillDataIntoSelect(selectInterface, "Please Select Interface", interfaces, "name", ob.interface_id.name);

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name", ob.capacity_id.name);

    powersupplychipsets = getServiceAjaxRequest("/powersupplychipset/alldata")
    fillDataIntoSelect(selectPowerSupplyChipset, "Please Select GPU Chipset", powersupplychipsets, "name", ob.powersupplychipset_id.name);

    fillDataIntoSelect(selectPowerSupplySeries, "Select GPU Series", [], "name", ob.powersupplyseries_id.name);

    selectPowerSupplyChipset.addEventListener('change', () => {
        const powersupplychipset = selectValueHandler(selectPowerSupplyChipset);
        powersupplyseries = getServiceAjaxRequest("/powersupplyseries/powersupplyseriesbypowersupplychipset/" + powersupplychipset.name);
        fillDataIntoSelect(selectPowerSupplySeries, "Select GPU Series", powersupplyseries, "name");
    })



    inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectPowerSupplyFormFactor, selectBrand, selectItemStatus, selectModularity, selectEfficiency, numberWattage], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/GPU");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectPowerSupplyFormFactor, selectBrand, selectItemStatus, selectModularity, selectEfficiency, numberWattage], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;


}

const checkPowerSupplyInputErrors = () => {
    let errors = "";

    if (powersupply.itemname == null) {
        errors = errors + "GPU Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (powersupply.purchaseprice == null) {
        errors = errors + "Purchase Price can't be Null...!\n";
        decimalPurchasePrice.classList.add("is-invalid");
    }
    if (powersupply.salesprice == null) {
        errors = errors + "Sales Price can't be Null...!\n";
        decimalSalesPrice.classList.add("is-invalid");
    }

    if (powersupply.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (powersupply.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (powersupply.interface_id == null) {
        errors = errors + "Interface can't be Null...!\n";
        selectInterface.classList.add("is-invalid");
    }
    if (powersupply.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (powersupply.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (powersupply.powersupplychipset_id == null) {
        errors = errors + "GPU Chipset can't be Null...!\n";
        selectPowerSupplyChipset.classList.add("is-invalid");
    }
    if (powersupply.powersupplyseries_id == null) {
        errors = errors + "GPU Series can't be Null...!\n";
        selectPowerSupplySeries.classList.add("is-invalid");
    }
    if (powersupply.powersupplytype_id == null) {
        errors = errors + "GPU Type can't be Null...!\n";
        selectPowerSupplyType.classList.add("is-invalid");
    }
    if (powersupply.motherboardformfactor_id == null) {
        errors = errors + "Motherboard Form Factor can't be Null...!\n";
        selectMotherboardFormFactor.classList.add("is-invalid");
    }
    if (powersupply.capacity_id == null) {
        errors = errors + "GPU Capacity can't be Null...!\n";
        selectCapacity.classList.add("is-invalid");
    }

    return errors;
}

const buttonPowerSupplySubmit = () => {
    let errors = checkPowerSupplyInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/powersupply", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(powersupply),
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
                $('#powersupplyAddModal').modal('hide');
                //reset the Item form
                formPowerSupply.reset();
                //refreash Item form
                refreshPowerSupplyForm();
                //refreash Item table
                refreshPowerSupplyTable();
            } else {
                alert("Fail to submit GPU form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}

const checkPowerSupplyFormUpdates = () => {
    updates = "";

    if (powersupply.itemname != oldPowerSupply.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (powersupply.purchaseprice != oldPowerSupply.purchaseprice) {
        updates = updates + "Purchase Price is Changed \n";
    }
    if (powersupply.profitrate != oldPowerSupply.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (powersupply.warranty != oldPowerSupply.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (powersupply.rop != oldPowerSupply.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (powersupply.roq != oldPowerSupply.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (powersupply.interface_id.name != oldPowerSupply.interface_id.name) {
        updates = updates + "Interface is Changed \n";
    }
    if (powersupply.description != oldPowerSupply.description) {
        updates = updates + "Description is Changed \n";
    }
    if (powersupply.brand_id.name != oldPowerSupply.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (powersupply.powersupplychipset_id.name != oldPowerSupply.powersupplychipset_id.name) {
        updates = updates + "GPU Chipset is Changed \n";
    }
    if (powersupply.powersupplytype_id.name != oldPowerSupply.powersupplytype_id.name) {
        updates = updates + "GPU Type is Changed \n";
    }
    if (powersupply.powersupplyseries_id.name != oldPowerSupply.powersupplyseries_id.name) {
        updates = updates + "GPU Series is Changed \n";
    }
    if (powersupply.motherboardformfactor_id.name != oldPowerSupply.motherboardformfactor_id.name) {
        updates = updates + "Motherboard Form Factor is Changed \n";
    }
    if (powersupply.capacity_id.name != oldPowerSupply.capacity_id.name) {
        updates = updates + "Capacity is Changed \n";
    }
    if (powersupply.itemstatus_id.name != oldPowerSupply.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonPowerSupplyUpdate = () => {
    //check form error
    let errors = checkPowerSupplyInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkPowerSupplyFormUpdates();

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

                $.ajax("/powersupply", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(powersupply),


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
                    $('#powersupplyAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshPowerSupplyTable();
                    //reset the Item form
                    formPowerSupply.reset();
                    //Item form refresh
                    refreshPowerSupplyForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshPowerSupplyForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("PowerSupply Form  has Following Errors..\n" + errors)
    }


}

const deletePowerSupply = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following PowerSupply? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/powersupply", {
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
            $('#powersupplyAddModal').modal('hide');
            refreshPowerSupplyTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}


const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#powersupplyAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formPowerSupply.reset();
        divModifyButton.className = 'd-none';

        refreshPowerSupplyForm();
    }
}