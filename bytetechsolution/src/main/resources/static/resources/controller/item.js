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


const buttonItemSubmit = () => {
    console.log(item)
}