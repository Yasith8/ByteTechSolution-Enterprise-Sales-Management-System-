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

const fillMultipleItemOfDataIntoSingleSelect = (fieldId, message, dataList, propertyName, additionalPropertyName, selectedValue) => {
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
        if (additionalPropertyName) { option.innerText = `${element[propertyName]} - ${element[additionalPropertyName]}` }
        //assign text to option that key=propertyName in element object
        //in ex : dataList[i].propertyName or dataLidtI[propertyName]
        //in ex: students[1].name--> studentOb[name]
        //option.innerText = element[propertyName];

        //if selectedValue equal with current options value then make it as selected
        if (selectedValue == element[propertyName]) {
            //option is need to selected
            option.selected = true;
        }

        //append the option element into select
        fieldId.appendChild(option);
    });
}


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


const salePriceCalculator = (object) => {
    decimalSalesPrice.disabled = true;
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', object, 'salesprice')
}