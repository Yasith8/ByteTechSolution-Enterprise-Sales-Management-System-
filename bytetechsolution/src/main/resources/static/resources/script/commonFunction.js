//create function for get service ajax request
//url come from function parameters
const getServiceAjaxRequest = (url) => {

    //create empty variable for catch data
    let getServiceResponse;

    //send ajax request to get data from db
    //contentType : 'application/json' - send json format
    //no nees of asyncronus
    $.ajax(url, {
            contentType: 'json',
            type: "GET",
            async: false,
            success: function(data) {
                console.log("Success : " + data);
                getServiceResponse = data;
            },

            error: function(resData) {
                console.log("Error : " + resData);
                getServiceResponse = [];
            }
        })
        //return data back to function called file
    return getServiceResponse;
}

//Create function for POST,PUT,DELETE Mapping
const getHTTPBodyAjaxRequest = (url, method, ob) => {

    let serviceResponse;

    $.ajax(url, {
        async: false,
        type: method,
        data: JSON.stringify(ob),
        contentType: 'application/json',
        success: function(data) {
            console.log("success" + data);
            serviceResponse = data;

        },

        error: function(resData) {
            console.log("Fail" + resData);
            serviceResponse = resData;
        }
    });

    return serviceResponse;
}

//this function used to fill dynamic data come from db to dropdown
const fillDataIntoSelect = (fieldId, message, dataList, propertyName, selectedValue) => {
    //empty static content of dropdown
    fieldId.innerHTML = '';

    //check message is empty or not
    if (message != "") {
        //create option element
        const optionMsg = document.createElement('option');
        //assign message for option
        optionMsg.innerText = message;
        //this option need to be selected & disabled
        optionMsg.selected = 'selected';
        optionMsg.disabled = 'disabled';
        //append the option into select
        fieldId.appendChild(optionMsg);
    }

    //get each element of data in dataList Array
    dataList.forEach(element => {
        //create option element
        const option = document.createElement('option');

        //assign value for option
        //normal string object convert into json format
        //advantage of json is we can found real object
        option.value = JSON.stringify(element);
        //assign text to option that key=propertyName in element object
        //in ex : dataList[i].propertyName or dataLidtI[propertyName]
        //in ex: students[1].name--> studentOb[name]
        option.innerText = element[propertyName];

        //if selectedValue equal with current options value then make it as selected
        if (selectedValue == element[propertyName]) {
            //option is need to selected
            option.selected = true;
        }

        //append the option element into select
        fieldId.appendChild(option);
    });
}

const fillMultipleItemOfDataIntoSingleSelect = (fieldId, message, dataList, propertyName, additionalPropertyName, selectedValue1, selectedValue2) => {
    //empty static content of dropdown
    fieldId.innerHTML = '';

    //check message is empty or not
    if (message != "") {
        //create option element
        const optionMsg = document.createElement('option');
        //assign message for option
        optionMsg.innerText = message;
        //this option need to be selected & disabled
        optionMsg.selected = 'selected';
        optionMsg.disabled = 'disabled';
        //append the option into select
        fieldId.appendChild(optionMsg);
    }

    //get each element of data in dataList Array
    dataList.forEach(element => {
        //create option element
        const option = document.createElement('option');

        //assign value for option
        //normal string object convert into json format
        //advantage of json is we can found real object
        option.value = JSON.stringify(element);
        if (additionalPropertyName) {
            option.innerText = `${element[propertyName]} - ${element[additionalPropertyName]}`
        }
        //assign text to option that key=propertyName in element object
        //in ex : dataList[i].propertyName or dataLidtI[propertyName]
        //in ex: students[1].name--> studentOb[name]
        //option.innerText = element[propertyName];

        //if selectedValue equal with current options value then make it as selected
        if (selectedValue1 == element[propertyName] && selectedValue2 == element[additionalPropertyName]) {
            //option is need to selected
            option.selected = true;
        }

        //append the option element into select
        fieldId.appendChild(option);
    });
}

const fillMultipleItemOfDataOnSignleSelectRecursion = (fieldId, message, dataList, propertyName, additionalPropertyName, selectedValue1, selectedValue2) => {
    fieldId.innerHTML = '';

    // Add message option if provided
    if (message !== "") {
        const optionMsg = document.createElement('option');
        optionMsg.innerText = message;
        optionMsg.selected = true;
        optionMsg.disabled = true;
        fieldId.appendChild(optionMsg);
    }

    dataList.forEach(element => {
        const option = document.createElement('option');
        option.value = JSON.stringify(element);

        let propertyValue = propertyRecursion(element, propertyName);
        let additionalValue = additionalPropertyName ? propertyRecursion(element, additionalPropertyName) : "";

        option.innerText = additionalValue ? `${propertyValue} - ${additionalValue}` : propertyValue;

        // If values match, set selected
        if (selectedValue1 == propertyValue && selectedValue2 == additionalValue) {
            option.selected = true;
        }

        fieldId.appendChild(option);
    });
};


/* const propertyRecursion = (obj, properties) => { //supplier_id, quotation_id.supplier_id.name
    const splitedProperties = properties.split("."); //[quotation_id,supplier_id,name]

    if (typeof(obj[splitedProperties[0]]) == Object) {
        let newProperties = splitedProperties.slice(1).join(".")
        propertyRecursion(obj[splitedProperties[0]], newProperties)
    } else {
        return obj.splitedProperties[0]
    }
}
 */

const propertyRecursion = (obj, properties) => {
    const splitedProperties = properties.split("."); // Split property path

    if (!obj || typeof obj !== "object") return ""; // Base case: if obj is null or not an object

    const currentProperty = splitedProperties[0]; // Get the first property in the path

    if (splitedProperties.length === 1) {
        return obj[currentProperty] !== undefined ? obj[currentProperty] : ""; // return final property
    }

    return propertyRecursion(obj[currentProperty], splitedProperties.slice(1).join(".")); // Recursive call the function
};

const removeValidationColor = (fieldIds) => {
    fieldIds.forEach((fieldId) => {
        fieldId.classList.remove('is-invalid')
        fieldId.classList.remove('is-valid')
    })
}

const addValidationColor = (fieldId) => {
    fieldId.classList.add('is-invalid')
}

const inputFieldsHandler = (fieldIds, isDisabled) => {
    fieldIds.forEach((fieldId) => {
        fieldId.disabled = isDisabled;
    })
}


const printModuleTable = (id) => {
    let printWindow = window.open('', '_blank');
    let tableContent = document.getElementById(id).outerHTML;
    printWindow.document.write(tableContent);
    printWindow.document.close();
    printWindow.print();
}


const selectValueHandler = (filedId) => {
    if (filedId != "") {
        return JSON.parse(filedId.value);
    }
}
const selectComplexValueHandler = (fieldId) => {
    const value = fieldId ? fieldId.value : null;

    // Skip if value is empty, null, or not JSON-like
    if (!value || value.startsWith("Select ")) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch (e) {
        console.warn("Invalid JSON value in select:", value);
        return null;
    }
};
const elementHides = (elements, need) => {
    elements.forEach((element) => {
        if (need) {
            element.classList.remove("elementHide");
        } else {
            element.classList.add("elementHide");
        }
    })

}


const salePriceCalculator = (object) => {
    decimalSalesPrice.disabled = true;
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', object, 'salesprice')
}


/* const textFullNameValidator = (feildId) => {
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
} */


const getCurrentDate = (givendate) => {
    let nowDate = new Date(givendate);
    // retrive 0 to 11
    let month = nowDate.getMonth() + 1; //return 0-jan-11-Dec  //currently do jan=0+1=1
    //retrive 1-31
    let date = nowDate.getDate(); //return 1-31
    //year
    let year = nowDate.getFullYear();

    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }


    return year + "-" + month + "-" + date;
}


const getDateAndMonth = (dateob, format) => {
    let month = dateob.getMonth() + 1;
    let date = dateob.getDate();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;

    if (format === "MMDD") return "-" + month + "-" + date;
    if (format === "MM") return month;
    if (format === "DD") return date;
};


const setDateLimits = (elementId, min, max) => {

    if (min) {
        elementId.min = min;
    } else {
        elementId.removeAttribute("min");
    }

    if (max) {
        elementId.max = max;
    } else {
        elementId.removeAttribute("max");
    }
}