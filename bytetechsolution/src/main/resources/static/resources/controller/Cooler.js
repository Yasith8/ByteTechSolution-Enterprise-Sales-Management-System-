window.addEventListener('load', () => {
    refreshCoolerTable();
    refreshCoolerForm();
})


const refreshCoolerTable = () => {

    //get cooler data
    coolers = getServiceAjaxRequest('/cooler/alldata')

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getCoolerType },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableCooler, coolers, displayPropertyList, refillCoolerForm, divModifyButton)
        //table show with dataTable
    $('#tableCooler').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}


const refreshCoolerForm = () => {
    cooler = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/brandbycategory/Cooler");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    coolertypes = getServiceAjaxRequest("/coolertype/alldata")
    fillDataIntoSelect(selectCoolerType, "Please Select GPU Type", coolertypes, "name");

    cpusockets = getServiceAjaxRequest("/cpusocket/alldata")
    fillDataIntoSelect(selectCpuSocket, "Please Select Processor Socket", cpusockets, "name");


    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectCoolerType, selectSocketType])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/COOLER");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectCoolerType, selectSocketType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getCpuSocket = (ob) => {
    return ob.cpusocket_id.name;
}

const getCoolerType = (ob) => {
    return ob.coolertype_id.name;
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

const refillCoolerForm = (ob, rowIndex) => {
    $('#coolerAddModal').modal('show');
    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectCoolerType, selectSocketType])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    cooler = JSON.parse(JSON.stringify(ob));
    oldCooler = ob;

    //asign itemcode
    staticBackdropLabel.textContent = cooler.itemcode;

    //assign item name
    textItemName.value = cooler.itemname;
    //assign profit rate
    numberProfitRate.value = cooler.profitrate;
    //assign rop 
    numberROP.value = cooler.rop;
    //assign roq 
    numberROQ.value = cooler.roq;
    //assign warranty
    numberWarranty.value = cooler.warranty;
    //asign description
    textDescription.value = cooler.description;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Cooler");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    coolertypes = getServiceAjaxRequest("/coolertype/alldata")
    fillDataIntoSelect(selectCoolerType, "Please Select Cooler Type", coolertypes, "name", ob.coolertype_id.name);

    cpusockets = getServiceAjaxRequest("/cpucokset/alldata")
    fillDataIntoSelect(selectCpuSocket, "Please Select Interface", cpusockets, "name", ob.cpucokset_id.name);

    inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectCoolerType, selectSocketType], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/STORAGE");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectCoolerType, selectSocketType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;


}

const checkCoolerInputErrors = () => {
    let errors = "";

    if (cooler.itemname == null) {
        errors = errors + "GPU Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (cooler.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (cooler.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (cooler.cpusocket_id == null) {
        errors = errors + "CPU Socket can't be Null...!\n";
        selectCpuSocket.classList.add("is-invalid");
    }
    if (cooler.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (cooler.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (cooler.coolertype_id == null) {
        errors = errors + "Cooler Type can't be Null...!\n";
        selectCoolerType.classList.add("is-invalid");
    }

    return errors;
}

const buttonCoolerSubmit = () => {
    let errors = checkCoolerInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/cooler", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(cooler),
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
                $('#coolerAddModal').modal('hide');
                //reset the Item form
                formCooler.reset();
                //refreash Item form
                refreshCoolerForm();
                //refreash Item table
                refreshCoolerTable();
            } else {
                alert("Fail to submit Cooler form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}

const checkCoolerFormUpdates = () => {
    updates = "";

    if (cooler.itemname != oldCooler.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (cooler.profitrate != oldCooler.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (cooler.warranty != oldCooler.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (cooler.rop != oldCooler.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (cooler.roq != oldCooler.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (cooler.cpusocket_id.name != oldCooler.cpusocket_id.name) {
        updates = updates + "CPU Socket is Changed \n";
    }
    if (cooler.description != oldCooler.description) {
        updates = updates + "Description is Changed \n";
    }
    if (cooler.brand_id.name != oldCooler.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (cooler.coolertype_id.name != oldCooler.coolertype_id.name) {
        updates = updates + "Cooler Type is Changed \n";
    }
    if (cooler.itemstatus_id.name != oldCooler.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonCoolerUpdate = () => {
    //check form error
    let errors = checkCoolerInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkCoolerFormUpdates();

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

                $.ajax("/cooler", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(cooler),


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
                    $('#coolerAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshCoolerTable();
                    //reset the Item form
                    formCooler.reset();
                    //Item form refresh
                    refreshCoolerForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshCoolerForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Cooler Form  has Following Errors..\n" + errors)
    }


}

const deleteCooler = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Cooler? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/cooler", {
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
            $('#coolerAddModal').modal('hide');
            refreshCoolerTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}


const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#coolerAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formCooler.reset();
        divModifyButton.className = 'd-none';

        refreshCoolerForm();
    }
}