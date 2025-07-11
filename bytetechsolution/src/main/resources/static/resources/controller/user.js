/* document.getElementById('fileInput').addEventListener('change', function() {
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('uploadedImage').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}); */


window.addEventListener("load", () => {
    console.log("User Page Loaded...!")

    //everytime windows loading table need to refresh
    refreshUserTable();
    //everytime windows loading form need to refresh
    refreshUserForm();
})


const refreshUserTable = () => {

    //get user data array
    users = getServiceAjaxRequest("/user/alldata");

    //create property list
    //text: string,int
    //function : boolean, object, array
    const displayPropertyList = [
        { dataType: 'function', propertyName: getEmployeeName },
        { dataType: 'text', propertyName: 'username' },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'function', propertyName: getRoleName },
        { dataType: 'function', propertyName: getStatus },
    ]

    fillDataIntoTable(tableUser, users, displayPropertyList, refillUserForm, divModifyButton)
        //table show with dataTable
    $('#tableUser').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}

const refreshUserForm = () => {
    user = new Object();
    olduser = null;

    user.roles = new Array();

    selectFullname.disabled = false;
    textPassword.disabled = false;
    textRePassword.disabled = false;

    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.remove('elementHide')
    buttonClear.classList.remove('elementHide')
    passwordRow.classList.remove('elementHide')

    userPictureRemove()
        //to get employee without user accounts
    employeeWithoutUserAccount = getServiceAjaxRequest("/employee/listwithoutuseraccount");
    //fill that employee data without user account to the dropdown menu
    fillDataIntoSelect(selectFullname, "Select Employee", employeeWithoutUserAccount, "fullname");
    console.log(employeeWithoutUserAccount)

    //get role list without admin
    roles = getServiceAjaxRequest("/role/listwithoutadmin");
    divRoles.innerHTML = "";

    roles.forEach(role => {
        div = document.createElement('div');
        div.className = "form-check form-check-inline";
        inputCHK = document.createElement('input');
        inputCHK.type = "checkbox";
        inputCHK.className = "form-check-input";
        label = document.createElement('label');
        label.className = "form-check-label fw-bold ms-2";
        label.innerText = role.name;

        inputCHK.onchange = function() {
            if (this.checked) {
                user.roles.push(role);
            } else {
                let extIndex = user.roles.map(element => element.name);

                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1)
                }
            }
        }
        div.appendChild(inputCHK)
        div.appendChild(label)

        divRoles.appendChild(div);
    })

    user.status = false;
    labelUserStatus.innerText = "User Account Not Active";


    //used for select employee image according to the employeeWithoutUserAccount
    selectFullname.addEventListener('change', (event) => {
        const selectedEmployee = JSON.parse(event.target.value);
        console.log("SELECTED EMPLYEE::::", selectedEmployee)

        if (selectedEmployee.photo != null) {
            user.photo = selectedEmployee.photo;
            user.photoname = selectedEmployee.photoname;
            imgUserPhoto.src = atob(selectedEmployee.photo);
            textUserPhoto.textContent = selectedEmployee.photoname;
        } else {
            imgUserPhoto.src = "/resources/image/initialprofile.jpg";
            textUserPhoto.textContent = "No Image Selected";
            FileUserPhoto.value = null;
        }
    })



    removeValidationColor([selectFullname, textUsername, textPassword, textRePassword, textEmail])


    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/USER");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([selectFullname, textUsername, textPassword, textRePassword, textEmail, checkStatus, buttonClear], true);
        btnClearImage.classList.remove('btn-user-removeImage');
        btnSelectImage.classList.remove('btn-user-selectImage');
        buttonClear.classList.remove('modal-btn-clear');
    }

}

//get employee fullname using object of employee_id
const getEmployeeName = (ob) => {
    return ob.employee_id.fullname;
}

//get user role
const getRoleName = (ob) => {
    let userRoles = "";

    //foreach loop for role array
    ob.roles.forEach((element, index) => {
        //todo ask about this
        //if role array has one object
        if (index == ob.roles.length - 1) {
            userRoles = userRoles + element.name;
        } else {
            //if role array has more than one object
            userRoles = userRoles + element.name + ",";
        }
    })

    return userRoles;
}

//get user status 
const getStatus = (ob) => {
    if (ob.status) {
        return `<p class='user-active'>Active</p>`
    } else {
        return `<p class='user-inactive'>InActive</p>`
    }

}

//todo ask about this
const setUserStatus = () => {
    if (checkStatus.checked) {
        user.status = true;
        labelUserStatus.innerText = "User Account is active";
    } else {
        // If checkbox is unchecked, set user status to false
        user.status = false;
        labelUserStatus.innerText = "User Account is not active";
    }
}

const refillUserForm = (rowOb, rowIndex) => {

    //when click the row
    $('#userAddModal').modal('show');

    buttonUpdate.classList.remove('elementHide')
    buttonSubmit.classList.add('elementHide')
    buttonClear.classList.add('elementHide')
        //same object cant add in same where
        //rowob is object, value eja save wenne heap,ram eke neme
        //olduser=rowOb-->user and olduser variable has same refference
    user = JSON.parse(JSON.stringify(rowOb));
    olduser = rowOb;


    console.log("USER::::", user)

    //asign email
    textEmail.value = user.email;

    //asign username
    textUsername.value = user.username;

    passwordRow.classList.add('elementHide')


    //assign profile picture and name
    imgUserPhoto.src = "/resources/image/initialprofile.jpg";
    textUserPhoto.textContent = "No Profile Image";
    if (user.photo != null) {

        imgUserPhoto.src = atob(user.photo);
        textUserPhoto.textContent = user.photoname;
    }




    //bug to chaging
    //checkStatus.checked = user.status;
    //asign dynamic changing checkbox for user status
    if (user.status) {
        checkStatus.checked = "checked";
        labelUserStatus.innerText = "user account is active"
    } else {
        checkStatus.checked = "";
        labelUserStatus.innerText = "user account is not active"
    }

    employeeListWithoutUserAccount = getServiceAjaxRequest("/employee/listwithoutuseraccount");
    employeeListWithoutUserAccount.push(user.employee_id);
    fillDataIntoSelect(selectFullname, "Select Employee", employeeListWithoutUserAccount, "fullname", user.employee_id.fullname);

    //adding roles for form from db

    //clear the divRole div
    divRoles.innerHTML = "";
    //use forEach for looping array of containing roles objects
    roles.forEach(role => {
        //create div element called div
        div = document.createElement('div');
        //add classes for bootstrap
        div.className = "form-check form-check-inline";
        //create new input field
        inputCHK = document.createElement('input');
        //add type checkbox to newly created element
        inputCHK.type = "checkbox";
        //add classes for input
        inputCHK.className = "form-check-input";
        //add id fot checkbox
        inputCHK.id = "checkbox" + role.id;
        //create label for identifying the checkbox
        label = document.createElement('label');
        //set classes for label
        label.className = "form-check-label fw-bold ms-2";
        //set attribute for label when clicked the label automatically check/unchecked checkbox
        label.setAttribute('for', 'checkbox' + role.id);

        //add value to label
        label.innerText = role.name;

        //any changes happen in checkboxes this function work
        inputCHK.onchange = function() {
            //if checked a item
            if (this.checked) {
                //push to the role array
                user.roles.push(role);
            } else {
                //user.roles.pop(role);
                //todo ask about this
                //check existance of checkbox in db
                let extIndex = user.roles.map(element => element.name).indexOf(role.name);

                //if it not esixt
                if (extIndex != -1) {
                    user.roles.splice(extIndex, 1)
                }

            }
        }

        let extIndex = user.roles.map(element => element.name).indexOf(role.name);

        if (extIndex != -1) {
            inputCHK.checked = "checked";
        }




        div.appendChild(inputCHK)
        div.appendChild(label)

        divRoles.appendChild(div);
    })


    selectFullname.disabled = true;
    textPassword.disabled = true;
    textRePassword.disabled = true;



    inputFieldsHandler([selectFullname, textUsername, textPassword, textRePassword, textEmail, checkStatus, buttonClear], false);
    btnClearImage.classList.add('btn-user-removeImage');
    btnSelectImage.classList.add('btn-user-selectImage');
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/USER");

    if (!userPrivilages.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([selectFullname, textUsername, textPassword, textRePassword, textEmail, checkStatus, buttonClear], true);
        btnClearImage.classList.remove('btn-user-removeImage');
        btnSelectImage.classList.remove('btn-user-selectImage');
        buttonClear.classList.remove('modal-btn-clear');
    }

    if (!userPrivilages.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }




}

//check User Input Errors
const checkInputFormErrors = () => {
    //create empty string
    let errors = "";

    //if ot select the employee from dropdown
    if (user.employee_id == null) {
        errors = errors + "Select Employee from Dropdown !\n";
    }

    //if username not added
    if (textUsername == null) {
        errors = errors + "Enter your username !\n";
    }

    //if old object is empty
    if (olduser == null) {
        if (textPassword == null) {
            errors = errors + "Should Provide a Password !\n";
        }

        if (textRePassword.value == "") {
            errors = errors + "Should Provide the Password again  !\n";
        }
    }

    if (textEmail == null) {
        errors = errors + "Enter Email  !\n";
    }
    if (user.roles.length == 0) {
        errors = errors + " Please select roles !"
    }


    return errors;
}

//submit button function

const buttonUserFormSubmit = () => {
    console.log("Submitted User Object: " + JSON.stringify(user))
        //check user form errors
    const errors = checkInputFormErrors();

    if (errors == "") {

        //get user conformation
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to send the purchase request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, send it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                let postResponse;

                $.ajax("/user", {
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(user),
                    async: false,

                    success: function(data) {
                        console.log("success", data);
                        postResponse = data;
                    },

                    error: function(resData) {
                        console.log("Fail", resData);
                        postResponse = resData;
                    }

                });

                if (postResponse == "OK") {
                    Swal.fire({
                        title: "Success!",
                        text: "purchase request submit successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        //hide the model
                        $('#userAddModal').modal('hide');
                        //reset the employee form
                        formUser.reset();
                        //refreash employee form
                        refreshUserForm();
                        //refreash employee table
                        refreshUserTable();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Save is not Completed! Following Errors Occured..:<br>" + postResponse,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonColor: "#F25454"
                    });
                }

            } else {
                Swal.fire({
                    title: "Error!",
                    html: "User Addition failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: "#F25454"
                });
            }
        })


    }
}


//password retype validator
const passwordRetypeValidator = () => {
    //console.log("textPassword : " + textPassword.value + "---- textRePassword : " + textRePassword.value)

    //check password and retyped password values matched or not
    if (textPassword.value == textRePassword.value) {
        //console.log("Matched");
        user.password = textPassword.value;
        textRePassword.classList.remove('is-invalid');
        textRePassword.classList.add('is-valid');
    } else {

        user.password = null;
        textRePassword.classList.remove('is-valid');
        textRePassword.classList.add('is-invalid');
    }
}

//function for close the modal and refresh the table
const buttonModalClose = () => {
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
            $('#userAddModal').modal('hide');


            //formEmployee is id of form
            //this will reset all data(refreash)
            formUser.reset();
            divModifyButton.className = 'd-none';

            refreshUserForm();
        }
    });
}

const deleteUser = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete following User? "  ${ob.username}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Delete",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            let deleteResponse;
            //delete request
            $.ajax("/user", {
                type: "DELETE",
                contentType: "application/json",
                data: JSON.stringify(user),
                async: false,

                success: function(data) {
                    console.log("success", data);
                    deleteResponse = data;
                },

                error: function(resData) {
                    console.log("Fail", resData);
                    deleteResponse = resData;
                }

            });

            if (deleteResponse == "OK") {
                Swal.fire({
                    title: "Success!",
                    text: "User Deleted Successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    $('#userAddModal').modal('hide');
                    refreshUserTable()
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "User Deletion failed due to the following errors:<br>" + deleteResponse,
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: "#F25454"
                });
            }
        }
    })



}

//check any updates
const checkUserformUpdates = () => {
    let updates = ""

    if (user.username != olduser.username) {
        updates = updates + " Username is changed \n";
    }

    if (user.password != olduser.password) {
        updates = updates + " Password is changed \n";
    }

    if (user.status != olduser.status) {
        updates = updates + " Status is changed \n";
    }

    if (user.email != olduser.email) {
        updates = updates + " email is changed \n";

    }
    if (user.photo != olduser.photo) {
        updates = updates + " Photo is changed \n";

    }

    if (user.photoname != olduser.photoname) {
        updates = updates + " photoname is changed \n";

    }

    if (user.roles.length != olduser.roles.length) {
        updates = updates + "Roles is changed. \n";
    } else {
        /* let extcount = 0;
        for (let newrole of user.roles) {
            for (let oldrole of olduser.roles) {
                if (newrole.id == oldrole.id)
                    extcount = extcount + 1;
            }
        } */
        for (let newRole of user.roles) {
            let matchOldRole = olduser.roles.find(oldRole => oldRole.id === newRole.id);

            if (!matchOldRole) {
                updates = updates + "Role is changed. \n";
            }
        }

    }

    return updates
}

const buttonUserUpdate = () => {
    //need to check form error
    let errors = checkInputFormErrors()

    if (errors == "") {
        //need to check updates
        let updates = checkUserformUpdates()
        if (updates == "") {
            alert("Nothing Updated data")
        } else {
            let userConform = confirm("Are you sure to update following changes?\n" + updates);

            if (userConform) {
                let putResponse;

                $.ajax("/user", {
                    type: "PUT",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(user),


                    success: function(successResponseOb) {
                        putResponse = successResponseOb;
                    },

                    error: function(failedResponseOb) {
                        putResponse = failedResponseOb;
                    }

                });

                if (putResponse == "OK") {
                    alert("Update Successfully..!")
                    $('#userAddModal').modal('hide');
                    refreshUserTable()
                    userform.reset();
                    refreshUserForm()
                } else {
                    alert("Update not Successfully..! \n" + putResponse);
                    $('#userAddModal').modal('hide');
                    refreshUserForm()
                }
            }
        }
    } else {
        alert("Form has following errors :\n" + errors)
    }
}

const userPictureRemove = () => {
    //profile image set to default
    imgUserPhoto.src = "/resources/image/initialprofile.jpg";
    textUserPhoto.textContent = "No Image Selected";
    FileUserPhoto.value = null;
}

const buttonRefresh = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the User Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refreshUserForm();

            Swal.fire({
                title: "Success!",
                text: "User Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })
        }
    })
}