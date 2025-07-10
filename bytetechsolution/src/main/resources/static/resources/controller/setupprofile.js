window.addEventListener('load', () => {
    setupMccountForm();
})


setupMccountForm = () => {
    buttonSave.classList.add('elementHide')
    buttonEdit.classList.remove('elementHide')

    buttonEdit.addEventListener('click', () => {
        buttonSave.classList.remove('elementHide')
        buttonEdit.classList.add('elementHide')
    })
}