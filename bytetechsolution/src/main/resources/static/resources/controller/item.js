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

    brands = getServiceAjaxRequest("/brand/alldata");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", "");

    categories = getServiceAjaxRequest("/category/alldata");
    fillDataIntoSelect(selectCategory, "Please Select Category", categories, "name");

    itemStatuses = getServiceAjaxRequest("/itemstatus/alldata");
    fillDataIntoSelect(selectItemStatus, "Select Item Status", itemStatuses, "name");

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



    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');
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

}

const buttonItemUpdate = () => {

}

const deleteItem = (ob, rowIndex) => {

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