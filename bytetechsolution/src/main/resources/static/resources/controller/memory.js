window.addEventListener('load', () => {
    refreshMemoryTable();
    refreshMemoryForm();
})

const refreshMemoryTable = () => {
    memories = getServiceAjaxRequest('/memory/alldata');

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'text', propertyName: 'speed' },
        { dataType: 'function', propertyName: getMemoryType },
        { dataType: 'function', propertyName: getMemoryFormFactor },
        { dataType: 'function', propertyName: getMemoryCapacity },
        { dataType: 'function', propertyName: getItemStatus },
    ]
    fillDataIntoTable(tableMemory, memories, displayPropertyList, refillMemoryForm, divModifyButton)
        //table show with dataTable
    $('#tableMemory').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}

const refreshMemoryForm = () => {
    memory = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Memory";

    brands = getServiceAjaxRequest("/brand/brandbycategory/Memory");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    memoryformfactors = getServiceAjaxRequest("/memoryformfactor/alldata")
    fillDataIntoSelect(selectMemoryFormFactor, "Please Select Memory Form Factor", memoryformfactors, "name");

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Select Memory Type", memorytypes, "name");

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name");

    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
}



const getBrandName = (ob) => {
    return ob.brand_id.name
}
const getMemoryType = (ob) => {
    return ob.memorytype_id.name
}
const getMemoryFormFactor = (ob) => {
    return ob.memoryformfactor_id.name
}
const getMemoryCapacity = (ob) => {
    return ob.capacity_id.name
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


const refillMemoryForm = (ob, rowIndex) => {
    $('#memoryAddModal').modal('show');
    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    memory = JSON.parse(JSON.stringify(ob));
    oldMemory = ob;

    //asign itemcode
    staticBackdropLabel.textContent = memory.itemcode;

    //assign item name
    textItemName.value = memory.itemname;

    //assign profit rate
    numberProfitRate.value = memory.profitrate;

    //assign rop 
    numberROP.value = memory.rop;
    //assign roq 
    numberROQ.value = memory.roq;
    //assign warranty
    numberWarranty.value = memory.warranty;
    //asign description
    textDescription.value = memory.description;

    numberSpeed.value = memory.speed;

    brands = getServiceAjaxRequest("/brand/brandbycategory/Memory");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name", ob.itemstatus_id.name);

    memoryformfactors = getServiceAjaxRequest("/memoryformfactor/alldata")
    fillDataIntoSelect(selectMemoryFormFactor, "Please Select Memory Form Factor", memoryformfactors, "name", ob.memoryformfactor_id.name);

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Select Memory Type", memorytypes, "name", ob.memorytype_id.name);

    capacities = getServiceAjaxRequest("/capacity/alldata")
    fillDataIntoSelect(selectCapacity, "Please Select Capacity", capacities, "name", ob.capacity_id.name);


    inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, , numberSpeed, selectMemoryFormFactor, selectBrand, selectItemStatus, selectCapacity, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;


}


const checkMemoryInputErrors = () => {
    let errors = "";

    if (memory.itemname == null) {
        errors = errors + "GPU Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (memory.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (memory.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (memory.speed == null) {
        errors = errors + "Memory Speed can't be Null...!\n";
        numberSpeed.classList.add("is-invalid");
    }

    if (memory.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (memory.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (memory.memorytype_id == null) {
        errors = errors + "Memory Type can't be Null...!\n";
        selectMemoryType.classList.add("is-invalid");
    }
    if (memory.memoryformfactor_id == null) {
        errors = errors + "Memory Form Factor can't be Null...!\n";
        selectMemoryFormFactor.classList.add("is-invalid");
    }
    if (memory.capacity_id == null) {
        errors = errors + "Memory Capacity can't be Null...!\n";
        selectCapacity.classList.add("is-invalid");
    }

    return errors;
}

const buttonMemorySubmit = () => {
    let errors = checkMemoryInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/memory", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(memory),
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
                $('#memoryAddModal').modal('hide');
                //reset the Item form
                formMemory.reset();
                //refreash Item form
                refreshMemoryForm();
                //refreash Item table
                refreshMemoryTable();
            } else {
                alert("Fail to submit Memory form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}

const checkMemoryFormUpdates = () => {
    updates = "";

    if (memory.itemname != oldMemory.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (memory.profitrate != oldMemory.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (memory.warranty != oldMemory.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (memory.rop != oldMemory.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (memory.roq != oldMemory.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (memory.description != oldMemory.description) {
        updates = updates + "Description is Changed \n";
    }
    if (memory.speed != oldMemory.speed) {
        updates = updates + "Memory Speed is Changed \n";
    }
    if (memory.brand_id.name != oldMemory.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (memory.memorytype_id.name != oldMemory.memorytype_id.name) {
        updates = updates + "Memory Type is Changed \n";
    }
    if (memory.memoryformfactor_id.name != oldMemory.memoryformfactor_id.name) {
        updates = updates + "Memory Form Factor is Changed \n";
    }
    if (memory.capacity_id.name != oldMemory.capacity_id.name) {
        updates = updates + "Capacity is Changed \n";
    }
    if (memory.itemstatus_id.name != oldMemory.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonGpuUpdate = () => {
    //check form error
    let errors = checkMemoryInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkMemoryFormUpdates();

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

                $.ajax("/memory", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(memory),


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
                    $('#memoryAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshMemoryTable();
                    //reset the Item form
                    formMemory.reset();
                    //Item form refresh
                    refreshMemoryForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshMemoryForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Memory Form  has Following Errors..\n" + errors)
    }


}


const deleteMemory = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Memory? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/memory", {
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
            $('#memoryAddModal').modal('hide');
            refreshMemoryTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}

const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#memoryAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formMemory.reset();
        divModifyButton.className = 'd-none';

        refreshMemoryForm();
    }
}