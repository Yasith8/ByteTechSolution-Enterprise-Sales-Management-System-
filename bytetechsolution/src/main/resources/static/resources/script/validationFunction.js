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


const profileSetupValidateFileField = (fieldId, object, photo, displayPhoto) => {
    if (fieldId.value != "") {
        let file = fieldId.files[0];
        //displayPhotoName.value = file['name'];
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

const generateRangeRegex = (max) => {
    //0 or ota wada adu unoth
    //^(?!.*)$ - negetive lockhead
    //.* mean not contain any character 
    //not validate the reqex -? not validate - abc,"""," "","123" fail bcuz ot wada adu nisa 
    if (max <= 0) return /^(?!.*)$/;
    if (max === 1) return /^1$/; //max number eka 1 unoth 

    //1ta wada wadi unoth loop karala pattern eka hadaganna yanawa
    //pattern string eka start kala
    let pattern = '^(';
    //loop kala anthima number eka wenakan
    //if max=5 ---> meka yanawa ^(1|2|3|4|5)$
    for (let i = 1; i <= max; i++) {
        //i eka max number nam finish karanwa finish string eka dala nattam aye loop
        pattern += i + (i === max ? ')$' : '|');
    }
    return new RegExp(pattern);
}