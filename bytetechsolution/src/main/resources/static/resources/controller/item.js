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

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getCateogryName = (ob) => {
    return ob.category_id.name;
}

const getitemStatus = (ob) => {
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

const refillItemForm = () => {

}