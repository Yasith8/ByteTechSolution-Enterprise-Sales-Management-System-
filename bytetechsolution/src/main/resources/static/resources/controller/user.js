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
    oldUser = null;

    user.roles = new Array();

    employeeWithoutUserAccount = getServiceAjaxRequest("/employee/listwithoutuseraccount");
    fillDataIntoSelect(employee, "Select Employee", employeeWithoutUserAccount, "fullname");

    //get role list
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


const refillUserForm = (rowOb, rowIndex) => {
    //same object cant add in same where
    //rowob is object, value eja save wenne heap,ram eke neme
    //olduser=rowOb-->user and olduser variable has same refference
    user = JSON.parse(JSON.stringify(rowOb));
    olduser = rowOb

    email.value = user.email;
    username.value = user.username;

    textPassword.value = user.password;

    if (user.status) {
        activeBtn.checked = "checked";
        labelUserStatus.innerText = "user account is active"
    } else {
        activeBtn.checked = "";
        labelUserStatus.innerText = "user account is not active"
    }

    employeeListWithoutUserAccount = getServiceAjaxRequest("/employee/listwithoutuseraccount");
    employeeListWithoutUserAccount.push(user.employee_id);
    fillDataIntoSelect(employee, "Select Employee", employeeListWithoutUserAccount, "fullname", user.employee_id.fullname);

    //
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
                //user.roles.pop(role);
                let extIndex = user.roles.map(element => element.name).indexOf(role.name);


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

}