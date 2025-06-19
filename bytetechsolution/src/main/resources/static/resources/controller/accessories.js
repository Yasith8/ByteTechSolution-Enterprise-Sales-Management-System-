window.addEventListener('load', () => {
    refreshAccessoriesTable();
    refreshAccessoriesForm();
})


const refreshAccessoriesTable = () => {
    //get accessories data
    accessoriess = getServiceAjaxRequest('/accessories/alldata')

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableAccessories, accessoriess, displayPropertyList, refillAccessoriesForm, divModifyButton)
        //table show with dataTable
    $('#tableAccessories').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}

const refreshAccessoriesForm = () => {
    accessories = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/brandbycategory/Accessories");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name");

    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

    imgProcessorPhoto.src = "/resources/image/noitem.jpg";
    textProcessorPhoto.textContent = "No Image Selected";
    FileProcessorPhoto.value = null;

}

const getBrandName = (ob) => {
    return ob.brand_id.name
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

const refillAccessoriesForm = (ob, rowIndex) => {
    $('#accessoriesAddModal').modal('show');

    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    accessories = JSON.parse(JSON.stringify(ob))
    oldAccessories = ob;


    //asign itemcode
    staticBackdropLabel.textContent = accessories.itemcode;

    //assign item name
    textItemName.value = accessories.itemname;
    //assign profit rate
    numberProfitRate.value = accessories.profitrate;
    //assign rop 
    numberROP.value = accessories.rop;
    //assign roq 
    numberROQ.value = accessories.roq;
    //assign warranty
    numberWarranty.value = accessories.warranty;
    //asign description
    textDescription.value = accessories.description;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select Item Status", itemstatuses, "name", ob.itemstatus_id.name);

    inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectBrand, selectItemStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;

    //assign profile picture and name
    if (processor.photo == null) {
        imgProcessorPhoto.src = "/resources/image/noitem.jpg";
        textProcessorPhoto.textContent = "No Item Image";
    } else {
        imgProcessorPhoto.src = atob(processor.photo);
        textProcessorPhoto.textContent = processor.photoname;
    }

    if (processor.itemstatus_id.name == 'Deleted') {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }

    selectItemStatus.addEventListener('change', () => {
        if (processor.itemstatus_id.name == "Deleted") {
            buttonDelete.disabled = true;
            buttonDelete.classList.remove('modal-btn-delete');
        } else {
            buttonDelete.disabled = false;
            buttonDelete.classList.add('modal-btn-delete');
        }
    })

}

const checkAccessoriesInputErrors = () => {
    let errors = "";

    if (accessories.itemname == null) {
        errors = errors + "Accessories Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (accessories.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (accessories.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (accessories.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (accessories.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    return errors;
}

const buttonAccessoriesSubmit = () => {
    let errors = checkAccessoriesInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/accessories", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(accessories),
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
                $('#accessoriesAddModal').modal('hide');
                //refreash Item table
                refreshAccessoriesTable();
                //reset the Item form
                formAccessories.reset();
                //refreash Item form
                refreshAccessoriesForm();
            } else {
                alert("Fail to submit Accessories form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}


const checkAccessoriesFormUpdates = () => {
    updates = "";

    if (accessories.itemname != oldAccessories.itemname) {
        updates = updates + "Accessories Name is Changed \n";
    }
    if (accessories.purchaseprice != oldAccessories.purchaseprice) {
        updates = updates + "Purchase Price is Changed \n";
    }
    if (accessories.profitrate != oldAccessories.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (accessories.warranty != oldAccessories.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (accessories.rop != oldAccessories.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (accessories.roq != oldAccessories.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (accessories.brand_id.name != oldAccessories.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (accessories.itemstatus_id.name != oldAccessories.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }

    return updates;
}

const buttonAccessoriesUpdate = () => {
    //check form error
    let errors = checkAccessoriesInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkAccessoriesFormUpdates();

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

                $.ajax("/accessories", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(accessories),


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
                    $('#accessoriesAddModal').modal('hide');
                    //refreash Item table for realtime updation
                    refreshAccessoriesTable();
                    //reset the Item form
                    formAccessories.reset();
                    //Item form refresh
                    refreshAccessoriesForm();
                } else {
                    //handling errors
                    alert("Update not Completed :\n" + putServiceResponse);
                    //refreash the employee form
                    refreshAccessoriesForm();
                }
            }
        }
    } else {
        //show user to what errors happen
        alert("Accessories Form  has Following Errors..\n" + errors)
    }


}

const deleteAccessories = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following Accessories? " + ob.itemname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/accessories", {
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
            $('#accessoriesAddModal').modal('hide');
            refreshAccessoriesTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}

const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#accessoriesAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formAccessories.reset();
        divModifyButton.className = 'd-none';

        refreshAccessoriesForm();
    }
}

const accessoriesPictureRemove = () => {
    //profile image set to default
    imgAccessoriesPhoto.src = "/resources/image/noitem.jpg";
    textAccessoriesPhoto.textContent = "No Image Selected";
    FileAccessoriesPhoto.value = null;
}