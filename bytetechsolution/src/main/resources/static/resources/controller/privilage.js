window.addEventListener("load", () => {
    console.log("Privilage Page Loaded");

    //call table refreash functions
    refreshPrivilageTable()

    refreshPrivilageForm();
})


const refreshPrivilageTable = () => {

    //get privilage data from db
    privilages = getServiceAjaxRequest("/privilage/alldata");

    //create property list
    //text: string,int
    //function : boolean, object, array
    const displayPropertyList = [
        { dataType: 'function', propertyName: getRole },
        { dataType: 'function', propertyName: getModule },
        { dataType: 'function', propertyName: getInsertPrivilage },
        { dataType: 'function', propertyName: getSelectPrivilage },
        { dataType: 'function', propertyName: getDeletePrivilage },
        { dataType: 'function', propertyName: getUpdatePrivilage },
    ]


    //this is the template of 
    fillDataIntoTable(tablePrivilage, privilages, displayPropertyList, refillPrivilageForm, divModifyButton)
        //table show with dataTable
    $('#tablePrivilage').dataTable();

    //hide button section
    divModifyButton.className = 'd-none';



}

const refreshPrivilageForm = () => {
    employee = new Object();

    roles = getServiceAjaxRequest("/role/listwithoutadmin");

    modules = getServiceAjaxRequest("/module/alldata")

}


const refillPrivilageForm = (rowOb, rowIndex) => {

}

//get roles from object
const getRole = (ob) => {}


//get modules from object
const getModule = (ob) => {}

//get insert privilage
const getInsertPrivilage = (ob) => {}
    //get select privilage
const getSelectPrivilage = (ob) => {}
    //get delete privilage
const getDeletePrivilage = (ob) => {}
    //get update privilage
const getUpdatePrivilage = (ob) => {}


const checkInputErrors = () => {}

const checkPrivilageFormUpdates = () => {}


const deletePrivilage = () => {}
const submitPrivilage = () => {}
const updatePrivilage = () => {}