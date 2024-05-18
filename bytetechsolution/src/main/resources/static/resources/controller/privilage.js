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

    roles = getServiceAjaxRequest("/role/alldata");
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


    roles = getServiceAjaxRequest("/role/alldata");
    fillDataIntoSelect(selectRole, "Please Select Role", roles, 'name', rowOb.role_id.name)


    modules = getServiceAjaxRequest("/module/alldata")
    fillDataIntoSelect(selectModule, "Please Select Module", modules, 'name', rowOb.module_id.name);

    if (rowOb.insprv) {
        checkInsert.checked = "checked";
    } else {
        checkInsert.checked = "";
    }

    if (rowOb.selprv) {
        checkSelect.checked = "checked";
    } else {
        checkSelect.checked = "";
    }

    if (rowOb.updprv) {
        checkUpdate.checked = "checked";
    } else {
        checkUpdate.checked = "";
    }

    if (rowOb.delprv) {
        checkDelete.checked = "checked";
    } else {
        checkDelete.checked = "";
    }

    selectText.textContent = (checkSelect) ? 'Select privilage Granted' : 'Select privilage not Granted';
    insertText.textContent = (checkInsert) ? 'Insert privilage Granted' : 'Insert privilage not Granted';
    updateText.textContent = (checkUpdate) ? 'Update privilage Granted' : 'Update privilage not Granted';
    deleteText.textContent = (checkDelete) ? 'Delete privilage Granted' : 'Delete privilage not Granted';


}


const selectHandler = () => {
    selectText.textContent = (checkSelect === true) ? 'Select privilage Granted' : 'Select privilage not Granted';

}

const insertHandler = () => {
    insertText.textContent = (checkInsert === true) ? 'Insert privilage Granted' : 'Insert privilage not Granted';

}

const updateHandler = () => {
    updateText.textContent = (checkUpdate === true) ? 'Update privilage Granted' : 'Update privilage not Granted';
}

const deleteHandler = () => {
    deleteText.textContent = (checkDelete === true) ? 'Delete privilage Granted' : 'Delete privilage not Granted';
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
const submitPrivilage = () => {}
const updatePrivilage = () => {}