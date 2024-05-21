window.addEventListener("load", () => {
    console.log("Privilage Page Loaded");

    //call table refreash functions
    refreshPrivilageTable()

    refreshPrivilageForm();
})


const refreshPrivilageTable = () => {

    //create nw array
    privilages = [];

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
    privilage = new Object();

    roles = getServiceAjaxRequest("/role/listwithoutadmin");
    //call filldataintoselect function on commonfunction js for  filling select option
    fillDataIntoSelect(selectRole, "Please Select Role", roles, 'name')

    modules = getServiceAjaxRequest("/module/alldata")
    fillDataIntoSelect(selectModule, "Please Select Module", modules, 'name')


}


const refillPrivilageForm = (rowOb, rowIndex) => {
    //when click the row
    $('#privilageAddModal').modal('show');
    //same object cant add in same where
    //rowob is object, value eja save wenne heap,ram eke neme
    //oldprivilage=rowOb-->privilage and olduser variable has same refference
    privilage = JSON.parse(JSON.stringify(rowOb));
    oldPrivilage = rowOb;



    roles = getServiceAjaxRequest("/role/listwithoutadmin");
    fillDataIntoSelect(selectRole, "Please Select Role", roles, 'name', privilage.role_id.name)


    modules = getServiceAjaxRequest("/module/alldata")
    fillDataIntoSelect(selectModule, "Please Select Module", modules, 'name', privilage.module_id.name);

    if (privilage.insprv) {
        checkInsert.checked = "checked";
    } else {
        checkInsert.checked = "";
    }

    if (privilage.selprv) {
        checkSelect.checked = "checked";
    } else {
        checkSelect.checked = "";
    }

    if (privilage.updprv) {
        checkUpdate.checked = "checked";
    } else {
        checkUpdate.checked = "";
    }

    if (privilage.delprv) {
        checkDelete.checked = "checked";
    } else {
        checkDelete.checked = "";
    }

    selectText.textContent = (checkSelect.checked) ? 'Select privilage Granted' : 'Select privilage not Granted';
    insertText.textContent = (checkInsert.checked) ? 'Insert privilage Granted' : 'Insert privilage not Granted';
    updateText.textContent = (checkUpdate.checked) ? 'Update privilage Granted' : 'Update privilage not Granted';
    deleteText.textContent = (checkDelete.checked) ? 'Delete privilage Granted' : 'Delete privilage not Granted';


}


const selectHandler = () => {

    selectText.textContent = (checkSelect.checked) ? 'Select privilage Granted' : 'Select privilage not Granted';

}

const insertHandler = () => {
    insertText.textContent = (checkInsert.checked) ? 'Insert privilage Granted' : 'Insert privilage not Granted';

}

const updateHandler = () => {
    updateText.textContent = (checkUpdate.checked) ? 'Update privilage Granted' : 'Update privilage not Granted';
}

const deleteHandler = () => {
    deleteText.textContent = (checkDelete.checked) ? 'Delete privilage Granted' : 'Delete privilage not Granted';
}




//get roles from object
const getRole = (ob) => {
    return ob.role_id.name;
}


//get modules from object
const getModule = (ob) => {
    return ob.module_id.name;
}

//get insert privilage
const getInsertPrivilage = (ob) => {
        if (ob.selprv) {
            return "<div class='text-success fw-bold'>Granted</div>";
        } else {
            return "<div class='text-danger fw-bold'>Denied</div>";
        }
    }
    //get select privilage
const getSelectPrivilage = (ob) => {
        if (ob.insprv) {
            return "<div class='text-success fw-bold'>Granted</div>";
        } else {
            return "<div class='text-danger fw-bold'>Denied</div>";
        }
    }
    //get delete privilage
const getDeletePrivilage = (ob) => {
        if (ob.delprv) {
            return "<div class='text-success fw-bold'>Granted</div>";
        } else {
            return "<div class='text-danger fw-bold'>Denied</div>";
        }
    }
    //get update privilage
const getUpdatePrivilage = (ob) => {
    if (ob.updprv) {
        return "<div class='text-success fw-bold'>Granted</div>";
    } else {
        return "<div class='text-danger fw-bold'>Denied</div>";
    }
}


const checkInputErrors = () => {}

const checkPrivilageFormUpdates = () => {}


const deletePrivilage = () => {}
const submitPrivilage = () => { console.log(JSON.stringify(privilage)) }
const updatePrivilage = () => {}