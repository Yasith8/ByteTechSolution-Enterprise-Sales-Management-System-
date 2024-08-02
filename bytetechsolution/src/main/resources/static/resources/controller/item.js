window.addEventListener("load", () => {
    console.log("Item Page Loaded");

    //call table refreash functions
    refreshItemTable()

    refreshItemForm();

})

//dynamic table according to db
const refreshItemTable = () => {
    //get db data using ajax request
    items = getServiceAjaxRequest("/item/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'text', propertyName: 'salesprice' },
        { dataType: 'text', propertyName: 'purchaseprice' },
        { dataType: 'text', propertyName: 'rop' },
        { dataType: 'text', propertyName: 'quentity' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'function', propertyName: getCateogryName },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableItem, items, displayPropertyList, refillItemForm, divModifyButton)
        //table show with dataTable
    $('#tableItem').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}

const refreshItemForm = () => {
    item = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", "");

    categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Please Select Category", categories, "name");

    itemStatuses = getServiceAjaxRequest("/itemstatus/alldata");
    fillDataIntoSelect(selectItemStatus, "Select Item Status", itemStatuses, "name");

    removeValidationColor([textItemName, decimalPurchasePrice, decimalSalesPrice, numberQuentity, numberROP, dateAddedDate, selectBrand, selectCategory, selectItemStatus])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, decimalPurchasePrice, decimalSalesPrice, numberQuentity, numberROP, dateAddedDate, selectBrand, selectCategory, selectItemStatus], true);
        btnClearImage.classList.remove('btn-user-removeImage');
        btnSelectImage.classList.remove('btn-user-selectImage');
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getCateogryName = (ob) => {
    return ob.category_id.name;
}

const getItemStatus = (ob) => {

    if (ob.itemstatus_id.name == 'Available') {
        return '<p  class="status-active">' + ob.itemstatus_id.name + '</p>';
    }

    if (ob.itemstatus_id.name == 'Low-Stock') {
        return '<p  class="status-resign">' + ob.itemstatus_id.name + '</p>'
    }


    if (ob.itemstatus_id.name == 'Unavailable') {
        return '<p  class="status-delete">' + ob.itemstatus_id.name + '</p>'
    } else {
        return '<p  class="status-other">' + ob.itemstatus_id.name + '</p>'
    }
}

const refillItemForm = (ob, rowIndex) => {

    $('#itemAddModal').modal('show');


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    item = JSON.parse(JSON.stringify(ob));
    oldItem = ob;

    //asign itemcode
    staticBackdropLabel.textContent = item.itemcode;

    //assign item name
    textItemName.value = item.itemname;
    //assign purchase price
    decimalPurchasePrice.value = item.purchaseprice;
    //assign sales price
    decimalSalesPrice.value = item.salesprice;
    //assign quentity 
    numberQuentity.value = item.quentity;
    //assign rop 
    numberROP.value = item.rop;
    //assign added date 
    dateAddedDate.value = item.addeddate;


    //assign item picture and name
    if (item.photo == null) {
        imgItemPhoto.src = "/resources/image/initialproduct.png";
        textItemPhoto.textContent = "No Product Image";
    } else {
        imgItemPhoto.src = atob(item.photo);
        textItemPhoto.textContent = item.photoname;
    }


    brands = getServiceAjaxRequest("/brand/alldata")
    fillDataIntoSelect(selectBrand, "Please Select", brands, "name", ob.brand_id.name);

    categories = getServiceAjaxRequest("/category/alldata")
    fillDataIntoSelect(selectCategory, "Please Select", categories, "name", ob.category_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);




}

const checkItemInputErrors = () => {
    let errors = "";

    if (item.itemname == null) {
        errors = errors + "Item Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (item.purchaseprice == null) {
        errors = errors + "Purchase Price can't be Null...!\n";
        decimalPurchasePrice.classList.add("is-invalid");
    }
    if (item.salesprice == null) {
        errors = errors + "Sales Price Price can't be Null...!\n";
        decimalSalesPrice.classList.add("is-invalid");
    }
    if (item.rop == null) {
        errors = errors + "ROP can't be Null...!\n";
        numberROP.classList.add("is-invalid");
    }
    if (item.quentity == null) {
        errors = errors + "Quentity can't be Null...!\n";
        numberQuentity.classList.add("is-invalid");
    }
    if (item.addeddate == null) {
        errors = errors + "Added Date can't be Null...!\n";
        dateAddedDate.classList.add("is-invalid");
    }
    if (item.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (item.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (item.category_id == null) {
        errors = errors + "Category can't be Null...!\n";
        selectCategory.classList.add("is-invalid");
    }

    return errors;
}

const buttonItemSubmit = () => {
    let errors = checkItemInputErrors();

    if (errors == "") {

        //check user response error
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/item", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(item),
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
                $('#itemAddModal').modal('hide');
                //reset the Item form
                formItem.reset();
                //refreash Item form
                refreshItemForm();
                //refreash Item table
                refreshItemTable();
            } else {
                alert("Fail to submit employee form \n" + postServiceResponce);
            }
        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }

}

const buttonItemUpdate = () => {

}

const deleteItem = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following employee? " + ob.fullname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/item", {
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
            $('#itemAddModal').modal('hide');
            refreshItemTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}


const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#itemAddModal').modal('hide');


        //formItem is id of form
        //this will reset all data(refreash)
        formItem.reset();
        divModifyButton.className = 'd-none';

        refreshItemForm();
    }
}


const itemPictureRemove = () => {
    //profile image set to default
    imgItemPhoto.src = "/resources/image/initialproduct.png";
    textItemPhoto.textContent = "No Image Selected";
    FileItemPhoto.value = null;
}