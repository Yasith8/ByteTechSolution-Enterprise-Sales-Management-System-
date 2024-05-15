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

/* const checkboxValidator = (filedId,) => {

} */