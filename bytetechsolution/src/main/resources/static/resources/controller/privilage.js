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
    //create new object
    privilage = { insprv: false, delprv: false, selprv: false, updprv: false };

    roles = getServiceAjaxRequest("/role/listwithoutadmin");
    //call filldataintoselect function on commonfunction js for  filling select option
    fillDataIntoSelect(selectRole, "Please Select Role", roles, 'name')

    modules = getServiceAjaxRequest("/module/alldata")
    fillDataIntoSelect(selectModule, "Please Select Module", modules, 'name')

    removeValidationColor([selectRole, selectModule])

    selectRole.disabled = false;
    selectModule.disabled = false;

    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.remove('elementHide')
    buttonClear.classList.remove('elementHide')

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit')

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');


    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/PRIVILAGE");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([selectRole, selectModule, checkSelect, checkInsert, checkDelete, checkUpdate, buttonClear], true);
        buttonClear.classList.remove('modal-btn-clear');
    }


}

const genarateModuleList = () => {
    modulesByRole = getServiceAjaxRequest("/module/listbyrole?roleid=" + JSON.parse(selectRole.value).id)
    fillDataIntoSelect(selectModule, "Please Select Module", modulesByRole, 'name');
    selectModule.disabled = false;
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

    selectRole.disabled = true;
    selectModule.disabled = true;

    buttonUpdate.classList.remove('elementHide')
    buttonSubmit.classList.add('elementHide')
    buttonClear.classList.add('elementHide')


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit')

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');


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


    //todo  need to ask if this needed or not
    inputFieldsHandler([selectRole, selectModule, checkSelect, checkInsert, checkDelete, checkUpdate, buttonClear], false);
    buttonClear.classList.add('modal-btn-clear');


    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/PRIVILAGE");

    if (!userPrivilages.insert) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([selectRole, selectModule, checkSelect, checkInsert, checkDelete, checkUpdate, buttonClear], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilages.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }

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


const checkPrivilageInputErrors = () => {
    let errors = "";

    if (privilage.role_id == null) {
        errors = errors + "Role can't be null..! \n";
        selectRole.classList.add("is-invalid")
    }

    if (privilage.module_id == null) {
        errors = errors + "Module can't be null and if there are no options in dropdown menu, that mean you selected privilage already exist..! \n";
        selectModule.classList.add("is-invalid")
    }

    return errors;
}

const checkPrivilageFormUpdates = () => {
    let updates = "";

    if (oldPrivilage.role_id.name != privilage.role_id.name) {
        updates = updates + "Role is Changed \n";
    }

    if (oldPrivilage.module_id.name != privilage.module_id.name) {
        updates = updates + "Module is Changed \n";
    }
    if (oldPrivilage.selprv != privilage.selprv) {
        updates = updates + " Select Privilage is Changed \n";
    }
    if (oldPrivilage.insprv != privilage.insprv) {
        updates = updates + " Insert Privilage is Changed \n";
    }
    if (oldPrivilage.delprv != privilage.delprv) {
        updates = updates + " Delete Privilage is Changed \n";
    }
    if (oldPrivilage.updprv != privilage.updprv) {
        updates = updates + " Update Privilage is Changed \n";
    }

    return updates;
}


const deletePrivilage = (rowOb, rowIdx) => {
    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete the privilege for ${rowOb.role_id.name} Role and ${rowOb.module_id.name} Module?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Delete",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse;

            //ajax delete request
            $.ajax("/privilage", {
                type: "DELETE",
                async: false,
                contentType: "application/json",
                data: JSON.stringify(rowOb),

                success: function(data) {
                    deleteServiceResponse = data
                },

                error: function(errData) {
                    deleteServiceResponse = errData;
                }
            })

            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Success!",
                    text: "Privilege Deleted Successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    $('#privilageAddModal').modal('hide');
                    refreshPrivilageTable()
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Privilege deletion failed due to the following errors:<br>" + deleteServiceResponse,
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: "#F25454"
                });
            }
        }
    })
}



const submitPrivilage = () => {
    console.log(JSON.stringify(privilage))
    console.log(privilage);

    //check errors
    let errors = checkPrivilageInputErrors();

    if (errors == "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to submit this privilege?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, Submit",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                let postServiceResponse;

                $.ajax("/privilage", {
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(privilage),
                    async: false,

                    success: function(data) {
                        console.log("success", data);
                        postServiceResponse = data;
                    },

                    error: function(resData) {
                        console.log("Fail", resData);
                        postServiceResponse = resData;
                    }

                });

                //if ok
                if (postServiceResponse == "OK") {
                    Swal.fire({
                        title: "Success!",
                        text: "New Privilege Saved Successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        //hide the model
                        $('#privilageAddModal').modal('hide');
                        //reset the employee form
                        formPrivilage.reset();
                        //refreash employee form
                        refreshPrivilageForm();
                        //refreash employee table
                        refreshPrivilageTable();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Privilege submission failed due to the following errors:<br>" + postServiceResponse,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonColor: "#F25454"
                    });
                }
            }
        })
    } else {
        Swal.fire({
            title: "Error!",
            html: "Privilege form has the following errors:<br>" + errors,
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}

const updatePrivilage = () => {
    //check form error
    let errors = checkPrivilageInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update
        let updates = checkPrivilageFormUpdates();

        //check there is no updates or any updations
        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated",
                text: "There are no updates in the privilege form",
                icon: "info",
                confirmButtonColor: "#103D45",
                confirmButtonText: "OK",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
        } else {
            //get conformation from user to made updation
            Swal.fire({
                title: "Are you sure?",
                html: "Do you want to update these changes?<br>" + updates,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#103D45",
                cancelButtonColor: "#F25454",
                confirmButtonText: "Yes, Update",
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                    //call put service requestd  -this use for updations
                    let putServiceResponse;

                    $.ajax("/privilage", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(privilage),

                        success: function(successResponseOb) {
                            putServiceResponse = successResponseOb;
                        },

                        error: function(failedResponseOb) {
                            putServiceResponse = failedResponseOb;
                        }
                    });

                    //check put service response
                    if (putServiceResponse == "OK") {
                        Swal.fire({
                            title: "Success!",
                            text: "Privilege Updated Successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            //hide the modal
                            $('#privilageAddModal').modal('hide');
                            //refreash employee table for realtime updation
                            formPrivilage.reset();
                            //reset the employee form
                            refreshPrivilageTable();
                            //employee form refresh
                            refreshPrivilageForm();
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: "Privilege update failed due to the following errors:<br>" + putServiceResponse,
                            icon: "error",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonColor: "#F25454"
                        });
                    }
                }
            })
        }
    } else {
        Swal.fire({
            title: "Error!",
            html: "Privilege form has the following errors:<br>" + errors,
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}
const btnCloseHandler = () => {
    //user conformation
    Swal.fire({
        title: "Are you sure to close the form?",
        text: "If you close this form, filled data will be removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Close",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            $('#privilageAddModal').modal('hide');

            //formPrivilage is id of form
            //this will reset all data(refreash)
            formPrivilage.reset();
            divModifyButton.className = 'd-none';

            refreshPrivilageForm();
        }
    })
}