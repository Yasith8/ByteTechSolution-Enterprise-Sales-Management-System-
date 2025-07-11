window.addEventListener('load', () => {
    setupMccountForm();
})


setupMccountForm = () => {
    lguser = getServiceAjaxRequest('/loggeduserdetails');
    oldLguser = getServiceAjaxRequest('/loggeduserdetails');
    buttonSave.classList.add('elementHide')
    buttonEdit.classList.remove('elementHide')

    textUsername.value = lguser.username;
    textEmail.value = lguser.email
    if (lguser.photo != null) {
        imgUserSetupPhoto.src = atob(lguser.photo);
    } else {
        imgUserSetupPhoto.src = "/resources/image/initialprofile.jpg";
    }

    inputFieldsHandler([textUsername, textEmail, passwordCurrentPassword, passwordNewPassword, passwordNewRePassword, btnSelectImage, btnClearImage], true)

    buttonEdit.addEventListener('click', () => {
        buttonSave.classList.remove('elementHide')
        buttonEdit.classList.add('elementHide')
        inputFieldsHandler([textUsername, textEmail, passwordCurrentPassword, passwordNewPassword, passwordNewRePassword, btnSelectImage, btnClearImage], false)
    })

}

const passwordRetypeValidator = () => {
    //console.log("textPassword : " + textPassword.value + "---- textRePassword : " + textRePassword.value)

    //check password and retyped password values matched or not
    if (passwordNewPassword.value == passwordNewRePassword.value) {
        //console.log("Matched");
        lguser.newpassword = passwordNewPassword.value;
        passwordNewRePassword.classList.remove('is-invalid');
        passwordNewRePassword.classList.add('is-valid');
    } else {

        lguser.newpassword = null;
        passwordNewRePassword.classList.remove('is-valid');
        passwordNewRePassword.classList.add('is-invalid');
    }
}

const checkChanges = () => {
    let changes = "";

    if (lguser.photo != oldLguser.photo) {
        changes += "User's Photo is Changed."
    }

    if (lguser.username != oldLguser.username) {
        changes += "User's Photo is Changed."
    }

    if (lguser.oldpassword != oldLguser.newpassword) {
        changes += "Password is Changed."
    }

    if (lguser.email != oldLguser.email) {
        changes += "Email is Changed."
    }

    return changes;
}
const saveChangers = () => {

    changes = checkChanges();

    if (changes == "") {
        Swal.fire({
            title: "Nothing Updated",
            text: "There are no any updates in User Setup Form",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            confirmButtonText: "OK",
            allowOutsideClick: false,
            allowEscapeKey: false
        })
    } else {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to update Your Profile Details?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                //call put service requestd  -this use for updations
                let putServiceResponse;

                $.ajax("/loggeduserdetails/insert", {
                    type: "POST",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(lguser),


                    success: function(successResponseOb) {
                        putServiceResponse = successResponseOb;
                    },

                    error: function(failedResponseOb) {
                        putServiceResponse = failedResponseOb;
                    }

                });

                if (putServiceResponse == "OK") {
                    Swal.fire({
                        title: "Success!",
                        text: "Your Profile update successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        setupMccountForm()
                        window.location.replace('/logout')
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "User Details updation failed due to the following errors:<br>" + putServiceResponse,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonColor: "#F25454"
                    });
                }

            }
        })
    }

}