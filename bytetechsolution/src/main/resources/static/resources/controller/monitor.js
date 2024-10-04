window.addEventListener('load', () => {
    refreshMonitorTable();
    refreshMonitorForm();
})


const refreshMonitorTable = () => {

    //get monitor data
    monitors = getServiceAjaxRequest('/monitor/alldata')

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getMonitorType },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableMonitor, monitors, displayPropertyList, refillMonitorForm, divModifyButton)
        //table show with dataTable
    $('#tableMonitor').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}


const refreshMonitorForm = () => {
    monitor = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/brandbycategory/Monitor");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    monitortypes = getServiceAjaxRequest("/monitortype/alldata")
    fillDataIntoSelect(selectMonitorType, "Please Select GPU Type", monitortypes, "name");

    cpusockets = getServiceAjaxRequest("/cpusocket/alldata")
    fillDataIntoSelect(selectCpuSocket, "Please Select Processor Socket", cpusockets, "name");


    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMonitorType, selectSocketType])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMonitorType, selectSocketType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getCpuSocket = (ob) => {
    return ob.cpusocket_id.name;
}

const getMonitorType = (ob) => {
    return ob.monitortype_id.name;
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

const refillMonitorForm = (ob, rowIndex) => {
    $('#monitorAddModal').modal('show');
    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMonitorType, selectSocketType])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    monitor = JSON.parse(JSON.stringify(ob));
    oldMonitor = ob;

    //asign itemcode
    staticBackdropLabel.textContent = monitor.itemcode;

    //assign item name
    textItemName.value = monitor.itemname;
    //assign profit rate
    numberProfitRate.value = monitor.profitrate;
    //assign rop 
    numberROP.value = monitor.rop;
    //assign roq 
    numberROQ.value = monitor.roq;
    //assign warranty
    numberWarranty.value = monitor.warranty;
    //asign description
    textDescription.value = monitor.description;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Monitor");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    monitortypes = getServiceAjaxRequest("/monitortype/alldata")
    fillDataIntoSelect(selectMonitorType, "Please Select Monitor Type", monitortypes, "name", ob.monitortype_id.name);

    cpusockets = getServiceAjaxRequest("/cpucokset/alldata")
    fillDataIntoSelect(selectCpuSocket, "Please Select Interface", cpusockets, "name", ob.cpucokset_id.name);

    inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMonitorType, selectSocketType], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus, selectMonitorType, selectSocketType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;


}

const checkMonitorInputErrors = () => {
    let errors = "";

    if (monitor.itemname == null) {
        errors = errors + "GPU Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (monitor.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (monitor.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (monitor.cpusocket_id == null) {
        errors = errors + "CPU Socket can't be Null...!\n";
        selectCpuSocket.classList.add("is-invalid");
    }
    if (monitor.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (monitor.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (monitor.monitortype_id == null) {
        errors = errors + "Monitor Type can't be Null...!\n";
        selectMonitorType.classList.add("is-invalid");
    }

    return errors;
}

const buttonMonitorSubmit = () => {
    let errors = checkMonitorInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/monitor", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(monitor),
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
                $('#monitorAddModal').modal('hide');
                //reset the Item form
                formMonitor.reset();
                //refreash Item form
                refreshMonitorForm();
                //refreash Item table
                refreshMonitorTable();
            } else {
                alert("Fail to submit Monitor form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}

const checkMonitorFormUpdates = () => {
    updates = "";

    if (monitor.itemname != oldMonitor.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (monitor.profitrate != oldMonitor.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (monitor.warranty != oldMonitor.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (monitor.rop != oldMonitor.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (monitor.roq != oldMonitor.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (monitor.cpusocket_id.name != oldMonitor.cpusocket_id.name) {
        updates = updates + "CPU Socket is Changed \n";
    }
    if (monitor.description != oldMonitor.description) {
        updates = updates + "Description is Changed \n";
    }
    if (monitor.brand_id.name != oldMonitor.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (monitor.monitortype_id.name != oldMonitor.monitortype_id.name) {
        updates = updates + "Monitor Type is Changed \n";
    }
    if (monitor.itemstatus_id.name != oldMonitor.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonMonitorUpdate = () => {
    //check form error
    let errors = checkMonitorInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkMonitorFormUpdates();

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

                $.ajax("/monitor", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(monitor),


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
                    $('#monitorAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshMonitorTable();
                    //reset the Item form
                    formMonitor.reset();
                    //Item form refresh
                    refreshMonitorForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshMonitorForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Monitor Form  has Following Errors..\n" + errors)
    }


}

const deleteMonitor = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Monitor? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/monitor", {
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
            $('#monitorAddModal').modal('hide');
            refreshMonitorTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}


const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#monitorAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formMonitor.reset();
        divModifyButton.className = 'd-none';

        refreshMonitorForm();
    }
}