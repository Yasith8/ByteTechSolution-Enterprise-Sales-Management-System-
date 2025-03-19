//create function for validate text feild
const textValidator = (inputElement, pattern, object, property) => {

    if (inputElement.value != '') {

        const regPattern = new RegExp(pattern); //
        if (regPattern.test(inputElement.value)) {
            //valid
            window[object][property] = inputElement.value; // data binding
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
        } else {
            //invalid
            window[object][property] = null; // null binding
            inputElement.classList.remove('is-valid');
            inputElement.classList.add('is-invalid');
        }
    } else {
        window[object][property] = null; // null binding
        if (inputElement.required) {
            inputElement.classList.remove('is-valid');
            inputElement.classList.add('is-invalid');
        } else {
            inputElement.classList.remove('is-valid');
            inputElement.classList.remove('is-invalid');
        }
    }
}

const contentValidator = (dataItem, object, property) => {
    console.log(dataItem);
    if (dataItem != null) {
        window[object][property] = dataItem;

    } else {
        window[object][property] = null;
    }
}

//define function for select static element validation
const selectStaticValidator = (selectElement, pattern, object, property) => {
    if (selectElement.value != '') {
        selectElement.classList.add('is-valid')
        window[object][property] = selectElement.value;
    } else {
        selectElement.classList.add('is-invalid')
        window[object][property] = null;
    }
}


const selectDynamicValidator = (selectElement, pattern, object, property) => {
    if (selectElement.value != '') {
        selectElement.classList.add('is-valid')
        window[object][property] = JSON.parse(selectElement.value);
    } else {
        selectElement.classList.add('is-invalid')
        window[object][property] = null;
    }
}

const selectElementConvertIntoMultipleDynamicValueValidator = (selectElement, object, properties) => {
    properties.forEach(property => {
        if (selectElement.value != '') {
            selectElement.classList.add('is-valid')
            window[object][property] = JSON.parse(selectElement.value);
        } else {
            selectElement.classList.add('is-invalid')
            window[object][property] = null;
        }
    });
}

//define function for radio validator

const radioValidator = (radioElement, pattern, object, property, label1Id, label2Id) => {
    if (radioElement.checked) {
        window[object][property] = radioElement.value;

        label1Id.style.color = 'green';
        label2Id.style.color = 'black';
    } else {
        window[object][property] = null;
        label1Id.style.color = 'black';
        label2Id.style.color = 'black';
    }
}

const checkboxValidator = (checkboxId, object, property, labelId, labelContent) => {
    //window[object][property] = checkboxId.checked;
    //labelId.textContent = labelContent + (checkboxId.checked ? ' privilege Granted' : ' privilege Denied');


    if (checkboxId.checked) {
        window[object][property] = true;
    } else {
        window[object][property] = false;
    }
}


const validateFileField = (fieldId, object, photo, photoname, oldObject, displayPhoto, displayPhotoName) => {
    if (fieldId.value != "") {
        let file = fieldId.files[0];
        //displayPhotoName.value = file['name'];
        displayPhotoName.textContent = file['name'];
        window[object][photoname] = file['name'];
        //console.log(file['name']);

        let fileReader = new FileReader();

        fileReader.onload = function(e) {
            displayPhoto.src = e.target.result;
            window[object][photo] = btoa(e.target.result); //encrypt 
            //console.log(e.target.result);

        }
        fileReader.readAsDataURL(file);
        return;
    }
}