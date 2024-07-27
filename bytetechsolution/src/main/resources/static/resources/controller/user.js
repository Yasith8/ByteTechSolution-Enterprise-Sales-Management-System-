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

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit')

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

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

    imgUserPhoto.src = "/resources/image/initialprofile.jpg";
    textUserPhoto.textContent = "No Image Selected";


    removeValidationColor([selectFullname, textUsername, textPassword, textRePassword, textEmail])
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
    //same object cant add in same where
    //rowob is object, value eja save wenne heap,ram eke neme
    //olduser=rowOb-->user and olduser variable has same refference
    user = JSON.parse(JSON.stringify(rowOb));
    olduser = rowOb;



    //asign email
    textEmail.value = user.email;

    //asign username
    textUsername.value = user.username;

    //asign password
    textPassword.value = user.password;

    //assign profile picture and name
    if (user.photo == null) {
        imgUserPhoto.src = "/resources/image/initialprofile.jpg";
        textUserPhoto.textContent = "No Image Selected";
    } else {
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

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit')

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
        const userSubmitResponse = confirm("Are you sure to submit?");

        if (userSubmitResponse) {
            //call post service
            //let postResponse = getHTTPBodyAxajRequst("/user", "POST", user);

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


            //if post request done correctly
            if (postResponse == "OK") {
                alert("User Saved Successfully!");
                //hide the model
                $('#userAddModal').modal('hide');
                //reset the employee form
                formUser.reset();
                //refreash employee form
                refreshUserForm();
                //refreash employee table
                refreshUserTable();
            } else {
                alert("Save is not Completed! \n Following Errors Occured...\n" + postResponse)
            }
        }
    } else {
        alert("Form has following errors \n" + errors)
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
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#userAddModel').modal('hide');


        //formEmployee is id of form
        //this will reset all data(refreash)
        formUser.reset();
        divModifyButton.className = 'd-none';

        refreshUserForm();
    }
}

const deleteEmployee = (ob, rowIndex) => {

    //user conformation
    const userConfirm = confirm("Are you sure to delete User " + ob.username + " who Employee Name " + ob.employee_id.name + "?");

    //if ok
    if (userConfirm) {

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

        //response is ok
        if (deleteResponse == "OK") {
            //updation of form,table
            alert("Delete User Successfullly");
            $('#userAddModal').modal('hide');
            refreshUserTable()
        } else {
            console.log("system has following errors:\n" + deleteResponse);
        }

    }



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

    if (user.roles.length != olduser.roles.length) {
        updates = updates + "Roles is changed. \n";
    } else {
        let extcount = 0;
        for (let newrole of user.roles) {
            for (let oldrole of olduser.roles) {
                if (newrole.id == oldrole.id)
                    extcount = extcount + 1;
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