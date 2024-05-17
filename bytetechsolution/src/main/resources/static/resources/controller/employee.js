//define browser's onload event
//way1
/* 
window.onload = ()=>{
      
}
*/
//way2
/* 
 */
window.addEventListener('load', () => {
    console.log("Employee Page Loaded...!")

    //tooltip Enable
    $('[data-bs-toggle="tooltip]').tooltip();

    //call table refreash function
    refreshEmployeeTable()


    refreshEmployeeForm();
    //define new object
    //employee = new Object();


    //staticly define employee status for dropdown menu
    //employeeStatus = [{ id: 1, name: 'Working' }, { id: 2, name: 'Resign' }, { id: 3, name: 'Delete' }];

    // using this code block, when i need it another scope i need to manually created this is every scope
    //because of without wasting time create common function to handle all fillData into select
    //it is on commonfunction.js

    /* 
    //code block explain
    //catch id on dropdown manu called selectStatus 
    const selectStatusElement = document.querySelector('#selectStatus')
    //clear the all static options in dropdown
    selectStatusElement.innerHTML = '';

    //create new option element for use to show message
    const optionMsg = document.createElement('option');
    //add innertext to option
    optionMsg.innerText = 'Select Status';
    //that option need to disabled
    optionMsg.disabled = 'disabled';
    //that option need to already selected
    optionMsg.selected = 'selected';
    //append that option to select
    selectStatusElement.appendChild(optionMsg);
    
    //get each item of employeeStatus and create dynamic elements
    employeeStatus.forEach(element => {
        //create option element 
        const option = document.createElement('option');
        //set innerText attribute with element.name data from array
        option.innerText = element.name;
        //set value attribute with data from array
        option.value = element;
        //and append that option to select
        selectStatusElement.appendChild(option);
    })
    */

    //fill data into dropdown using commonfunction
    //this common function is inside in commonFunction.js

    //dynamicly get data
    /* employeeStatus = getServiceAjaxRequest("/employeestatus/alldata");


    //pass employee statuss data to common function to create dynamic dropdown
    fillDataIntoSelect(selectEmployeeStatus, "Select Status", employeeStatus, 'name')

    //dynamicly get data
    designations = getServiceAjaxRequest("/designation/alldata");


    //pass designation data to common function to create dynamic dropdown
    fillDataIntoSelect(selectDesignation, "Select Designation", designations, "name") */
})


//this is the main function used to fill dynamic data(database data) to table
const refreshEmployeeTable = () => {

    //for store the all data from database
    employees = []

    //get request using jquery
    //jquery ajax get all data function
    //$.ajax("URL,OPTION");
    $.ajax("/employee/alldata", {
        contentType: 'application/json', //this will display data by json format
        type: 'GET', //get request
        async: false,

        //if requested data  recieved successfully then this function called
        //assign response data to employees array
        success: function(data) {
            console.log("Success " + data);
            employees = data;
        },

        //if requested data has error then this function called
        //assign empty array to employees 
        error: function(resData) {
            console.log("Error " + resData)
            employees = [];
        }

    })

    console.log(employees)

    //create propertiy list
    //text: string,int
    //function : boolean, object, array
    const displayPropertyList = [
        { dataType: 'text', propertyName: 'empid' },
        { dataType: 'text', propertyName: 'fullname' },
        { dataType: 'text', propertyName: 'nic' },
        { dataType: 'text', propertyName: 'gender' },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'text', propertyName: 'mobile' },
        /*  { dataType: 'text', propertyName: 'landno' },
         { dataType: 'text', propertyName: 'dob' }, */
        { dataType: 'function', propertyName: getDesignation },
        { dataType: 'function', propertyName: getEmployeeStatus },
    ];


    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    fillDataIntoTable(tableEmployee, employees, displayPropertyList, employeeFormRefill, divModifyButton)
        //table show with dataTable
    $('#tableEmployee').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}


const refreshEmployeeForm = () => {
    //define new object
    employee = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit')

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    employeeStatus = getServiceAjaxRequest("/employeestatus/alldata")


    //call filldataintoselect function on commonfunction js for  filling select option
    fillDataIntoSelect(selectEmployeeStatus, "Please Select", employeeStatus, 'name')

    //dynamicly get data
    designations = getServiceAjaxRequest("/designation/alldata");


    //pass designation data to common function to create dynamic dropdown
    fillDataIntoSelect(selectDesignation, "Select Designation", designations, "name")


    //remove all validation colors in user inputs
    removeValidationColor([textFullName, textNIC, textCallingName, textEmail, textMobileNo, textAddress, textNote, dateDateOfBirth, selectDesignation, selectEmployeeStatus])

    /* textCallingName.style.border = '1px solid #ced4da'
    textEmail.style.border = '1px solid #ced4da' */

}

//get designation function to return designation name
const getDesignation = (ob) => {
    return ob.designation_id.name;
}

//get employee status function to return employee status
//compair object's key=name
const getEmployeeStatus = (ob) => {
    if (ob.employeestatus_id.name == 'Active') {
        return '<p  class="status-active">' + ob.employeestatus_id.name + '</p>';
    }

    if (ob.employeestatus_id.name == 'Resign') {
        return '<p  class="status-resign">' + ob.employeestatus_id.name + '</p>'
    }


    if (ob.employeestatus_id.name == 'Delete') {
        return '<p  class="status-delete">' + ob.employeestatus_id.name + '</p>'
    } else {
        return '<p  class="status-other">' + ob.employeestatus_id.name + '</p>'
    }
}

//employee print function
const printEmployee = (ob, rowIndex) => {

    const newTab = window.open();
    newTab.document.write(
        printEmployeeContent.outerHTML
    );
}

//print whole





const employeeFormRefill = (ob, rowIndex) => {
    $('#employeeAddModal').modal('show');

    /* 
    employee & oldEmployee used to  keep the value of current and previous records of employee
    while updated data changed on employee variable, oldEmployee still remain prev value
    this can used to check if there is any change or not
    */


    employee = JSON.parse(JSON.stringify(ob))
    oldemployee = JSON.parse(JSON.stringify(ob)) //for checking updates


    //bind input fields with ob.properties
    textFullName.value = ob.fullname;
    textCallingName.value = ob.callingname
    textNIC.value = ob.nic;

    if (ob.gender == "male") {
        radioMale.checked = true;
    } else if (ob.gender == "female") {
        radioFemale.checked = true;
    }

    textEmail.value = ob.email;
    textAddress.value = ob.address;
    textMobileNo.value = ob.mobile;
    textLandNo.value = ob.landno;
    dateDateOfBirth.value = ob.dob;

    //define new object
    employeeStatus = getServiceAjaxRequest("/employeestatus/alldata")

    //call filldataintoselect function on commonfunction js for  filling select option
    fillDataIntoSelect(selectEmployeeStatus, "Please Select", employeeStatus, "name", ob.employeestatus_id.name)

    //dynamicly get data
    designations = getServiceAjaxRequest("/designation/alldata");

    //pass designation data to common function to create dynamic dropdown
    fillDataIntoSelect(selectDesignation, "Select Designation", designations, "name", ob.designation_id.name)


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit')

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');





}




//delete function for  deleting record from table
const deleteEmployee = (ob, rowIndex) => {
    //user conformation
    let userConform = confirm("Are you sure  to delete following employee? " + ob.fullname);

    //if ok
    if (userConform) {
        let deleteServiceResponse;

        //ajax request fot delete data
        $.ajax("/employee", {
            type: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(ob),
            async: false,

            success: function(data) {
                deleteServiceResponse = data
            },

            error: function(errData) {
                deleteServiceResponse = errData;
            }
        })

        //if delete response ok alert the success message and close the modal and refreash employee table
        //so because of that we can see realtime update
        if (deleteServiceResponse == "OK") {
            alert("Delete Successfullly");
            $('#employeeAddModal').modal('hide');
            refreshEmployeeTable()
        } else {
            console.log("system has following errors:\n" + deleteServiceResponse);
        }
    }
}

//create function for validate full name name generate callingname data list
const textFullNameValidator = (feildId) => {
    //assign fullname inputField value to fullnamevalue
    const fullNameValue = feildId.value;
    //pattern for name validate
    //in here 1st letter need to be capital
    //1st name can be 2-20 that mean add morethan 1 and  less than or equal to 20 letters
    //[\\s] match any white space characters
    //+ mean it will match one or more pattern of inside 1st ()
    //* mean it can happen multiple time
    // 2nd() is last part
    const regPettern = new RegExp('^([A-Z][a-z]{2,20}[\\s])+([A-Z][a-z]{2,20}[\\s]*)$');

    //check full name is not empty
    if (fullNameValue != '') {
        //if there is no error in fullname pattern
        if (regPettern.test(fullNameValue)) {
            //valid value 
            //add success color for border
            feildId.classList.remove('is-invalid');
            feildId.classList.add('is-valid');
            employee.fullname = fullNameValue;

            //process to automatic genarating of calling name using fullname
            // cleared added static values 
            dlFullNameParts.innerHTML = '';
            //split the fullname and store as a array
            //in here splitting criteria is " " and store it in array
            callingnameList = fullNameValue.split(' ');
            //loop through callingnameList and create option
            callingnameList.forEach(element => {
                //create option element
                const option = document.createElement('option');
                //add  value to option tag
                option.value = element;
                //append option to dlfullnamepart datalist
                //data list is a elements that can do both text and dropdown
                dlFullNameParts.appendChild(option);
            });

        }
        //if regex patten has error
        //that mean inputed content not in right criteria
        else {
            //color that border with error color
            feildId.classList.remove('is-valid');
            feildId.classList.add('is-invalid');
            //empty datalist
            dlFullNameParts.innerHTML = '';
            //empty the fullname
            employee.fullname = '';
            //assign callingname null
            employee.callingname = null;

        }
    }
    //if user leave the empty input field
    else {
        //clear the datalist
        dlFullNameParts.innerHTML = '';
        //clear the fullname
        employee.fullname = '';
        //clear the callingname
        employee.callingname = null;
        //color that border with error color
        feildId.classList.remove('is-invalid');
        feildId.classList.remove('is-valid');
    }
}

//check if any input errors has in user form
const checkEmployeeInputError = () => {
    let errors = '';
    if (employee.fullname == null) {
        errors = errors + 'Full Name can not be null..! \n';
        textFullName.classList.add("is-invalid")
    }
    if (employee.callingname == null) {
        errors = errors + 'Please enter calling name..! \n';
        textCallingName.classList.add('is-invalid')
    }
    if (employee.designation_id == null) {
        selectDesignation.classList.add('is-invalid')
        errors = errors + 'designation can not be null..! \n';
    }
    if (employee.employeestatus_id == null) {
        selectEmployeeStatus.classList.add('is-invalid')
        errors = errors + 'please select employee status..! \n';
    }
    if (employee.mobile == null) {
        textMobileNo.classList.add('is-invalid')
        errors = errors + 'please enter mobile number..! \n';
    }
    if (employee.email == null) {
        textEmail.classList.add('is-invalid')
        errors = errors + 'please enter your email..! \n';
    }
    if (employee.address == null) {
        textAddress.classList.add('is-invalid')
        errors = errors + 'please enter your Address..! \n';
    }
    if (employee.dob == null) {
        dateDateOfBirth.classList.add('is-invalid')
        errors = errors + 'please enter your Date of Bikrth..! \n';
    }


    return errors;
}

//function for submit
const buttonEmployeeSubmit = () => {
    //console.log('on submit');
    console.log(employee);
    //need to check errors -- required field value valid or not

    //can check optional field
    const errors = checkEmployeeInputError();
    if (errors == '') {
        //not ext need to get user confirmation
        //call post servise
        //check post service responce
        const userSubmitResponse = confirm('Are you sure to submit...?\n');


        if (userSubmitResponse) {
            //call post service

            let postServiceResponce;

            $.ajax("/employee", {
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(employee),
                async: false,

                success: function(data) {
                    console.log("success", data);
                    postServiceResponce = data;
                },

                error: function(resData) {
                    console.log("Fail", resData);
                    postServiceResponce = resData;
                }

            });

            //if response is success
            if (postServiceResponce == "OK") {
                alert("Save successfully...!");
                //hide the model
                $('#employeeAddModal').modal('hide');
                //reset the employee form
                formEmployee.reset();
                //refreash employee form
                refreshEmployeeForm();
                //refreash employee table
                refreshEmployeeTable();
            } else {
                alert("Fail to submit employee form \n" + postServiceResponce);
            }

        }
    } else {
        //if error ext then set alert
        alert('form has following error...\n' + errors);
    }
}

//check if employeeform has any updates
const checkEmployeeFormUpdates = () => {
    let updates = "";

    if (employee.fullname != oldemployee.fullname) {
        updates = updates + " Employee Fullname is Changed \n";
    }

    if (employee.callingname != oldemployee.callingname) {
        updates = updates + " Employee callingname is Changed \n";
    }

    if (employee.dob != oldemployee.dob) {
        updates = updates + " Employee Date of Birth is Changed \n";
    }

    if (employee.address != oldemployee.address) {
        updates = updates + " Employee Address is Changed \n";
    }

    if (employee.email != oldemployee.email) {
        updates = updates + " Employee Email is Changed \n";
    }


    if (employee.nic != oldemployee.nic) {
        updates = updates + " Employee nic is Changed \n";
    }

    if (employee.gender != oldemployee.gender) {
        updates = updates + " Employee gender is Changed \n";
    }

    if (employee.mobile != oldemployee.mobile) {
        updates = updates + " Employee mobile is Changed \n";
    }

    if (employee.landno != oldemployee.landno) {
        updates = updates + " Employee Land No is Changed \n";
    }
    if (employee.designation_id.name != oldemployee.designation_id.name) {
        updates = updates + " Employee Designation is Changed \n";
    }

    if (employee.employeestatus_id.name != oldemployee.employeestatus_id.name) {
        updates = updates + " Employee Status is Changed \n";
    }




    return updates;



}


//function for when click update
const buttonEmployeeUpdate = () => {
        console.log("clicked")

        //check form error
        let errors = checkEmployeeInputError();

        //check code has error, if code doesn't have  any errors
        if (errors == "") {

            //check form update

            let updates = checkEmployeeFormUpdates();

            //check there is no updates or any updations
            if (updates == "") {
                alert("Nothing Updates")
            } else {

                //get conformation from user to made updation
                let userConfirm = confirm("Are You Sure to Update this Changes? \n" + updates);

                //if user conform
                if (userConfirm) {
                    //call put service requestd  -this use for updations
                    let putServiceResponse;

                    $.ajax("/employee", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(employee),


                        success: function(successResponseOb) {
                            putServiceResponse = successResponseOb;
                        },

                        error: function(failedResponseOb) {
                            putServiceResponse = failedResponseOb;
                        }

                    });
                    //check put service response
                    if (putServiceResponse == "OK") {
                        alert("Updated Successfully");

                        //hide the moadel
                        $('#employeeAddModal').modal('hide');
                        //refreash employee table for realtime updation
                        refreshEmployeeTable();
                        //reset the employee form
                        formEmployee.reset();
                        //employee form refresh
                        refreshEmployeeForm();
                    } else {
                        //handling errors
                        alert("Update not Completed :\n" + putServiceResponse);
                        //refreash the employee form
                        refreshEmployeeForm();
                    }
                }
            }
        } else {
            //show user to what errors happen
            alert("Employee Form  has Following Errors..\n" + errors)
        }


    }
    //define function callingname validation
const textCallingNameValidator = (field) => {
    const fieldValue = field.value;

    const index = callingnameList.map(element => element).indexOf(fieldValue);
    if (index != -1) {
        //valid
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        employee.callingname = fieldValue;
    } else {
        //invalid
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        employee.callingname = null;
    }
}

//function for close the modal and refresh the table
const buttonModalClose = () => {
    const closeResponse = confirm('Are you sure to close the modal?')

    //check closeResponse is true or false
    if (closeResponse) {
        $('#employeeAddModel').modal('hide');


        //formEmployee is id of form
        //this will reset all data(refreash)
        formEmployee.reset();
        divModifyButton.className = 'd-none';

        refreshEmployeeForm();
    }
}