window.addEventListener('load', () => {
    refreshCustomerTable();
    refreshCustomerForm();
})


const refreshCustomerTable = () => {
    customers = getServiceAjaxRequest('/customer/alldata');

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'text', propertyName: 'email' },
        { dataType: 'text', propertyName: 'totalpurchase' },
    ]

    fillDataIntoTable(tableCustomer, customers, displayPropertyList, refillCustomerForm, divModifyButton)
        //table show with dataTable
    $('#tableCustomer').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
}
const refreshCustomerForm = () => {
    customer = new Object();


    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Customer";

    decimalTotalPurchase.disabled = true;


    removeValidationColor([textName, textMobile, decimalTotalPurchase, textEmail, textAddress])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/CUSTOMER");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textName, textMobile, decimalTotalPurchase, textEmail, textAddress], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
}



const refillCustomerForm = (ob, rowIndex) => {
    $('#customerAddModal').modal('show');

    decimalTotalPurchase.disabled = true;
    removeValidationColor([textName, textMobile, decimalTotalPurchase, textEmail, textAddress])

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    customer = JSON.parse(JSON.stringify(ob));
    oldCustomer = ob;

    //asign itemcode
    staticBackdropLabel.textContent = customer.customerid;
    textName.value = customer.name;
    textMobile.value = customer.mobile;
    decimalTotalPurchase.value = customer.totalpurchase;
    textEmail.value = customer.email;
    textAddress.value = customer.address;



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/CUSTOMER");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textName, textMobile, decimalTotalPurchase, textEmail, textAddress], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }
}

const checkCustomerInputErrors = () => {
    let errors = "";

    if (customer.name == null) {
        errors = errors + "Customer Name can't be Null...!\n";
        textName.classList.add("is-invalid");
    }
    if (customer.mobile == null) {
        errors = errors + "Mobile No can't be Null...!\n";
        textMobile.classList.add("is-invalid");
    }

    if (customer.email == null) {
        errors = errors + "Email can't be Null...!\n";
        textEmail.classList.add("is-invalid");
    }

    if (customer.address == null) {
        errors = errors + "Address can't be Null...!\n";
        textAddress.classList.add("is-invalid");
    }
    if (customer.totalpurchase == null) {
        errors = errors + "Total Purchase can't be Null...!\n";
        decimalTotalPurchase.classList.add("is-invalid");
    }

    return errors;
}

const submitCustomer = () => {
    let errors = checkCustomerInputErrors();

    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Add this details to customer?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#103D45",
            cancelButtonColor: "#F25454",
            confirmButtonText: "Yes, Add it!",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                let postServiceResponce;

                $.ajax("/customer", {
                    type: "POST",
                    data: JSON.stringify(customer),
                    contentType: "application/json",
                    async: false,

                    success: function(data) {
                        console.log("success", data);
                        postServiceResponce = data;
                    },

                    error: function(resData) {
                        console.log("Fail", resData);
                        postServiceResponce = resData;
                    }
                })

                if (postServiceResponce == "OK") {
                    Swal.fire({
                        title: "Success!",
                        text: "Customer Added Successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        $('#customerAddModal').modal('hide');
                        //reset the Item form
                        formCustomer.reset();
                        refreshCustomerTable();
                        refreshCustomerForm();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Adding Customer failed due to the following errors:<br>" + postServiceResponce,
                        icon: "error",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        confirmButtonColor: "#F25454"
                    });
                }
            }
        });
    } else {
        Swal.fire({
            title: "Error!",
            html: "Adding Customer failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}

const checkCustomerFormUpdates = () => {
    updates = "";

    if (customer.name != oldCustomer.name) {
        updates = updates + "Customer Name is Changed \n";
    }
    if (customer.mobile != oldCustomer.mobile) {
        updates = updates + "Mobile No Rate is Changed \n";
    }
    if (customer.email != oldCustomer.email) {
        updates = updates + "Email is Changed \n";
    }
    if (customer.address != oldCustomer.address) {
        updates = updates + "Address is Changed \n";
    }
    if (customer.totalpurchase != oldCustomer.totalpurchase) {
        updates = updates + "Total Purchase is Changed \n";
    }

    return updates;
}


const updatecustomer = () => {
    //check form error
    let errors = checkCustomerInputErrors();

    if (errors === "") {

        let updates = checkCustomerFormUpdates();

        //check there is no updates or any updations
        console.log("any updates", updates)
        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated",
                text: "There are no any updates in Customer Form",
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
                text: "Do you want to update Customer Details?",
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

                    $.ajax("/customer", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(customer),


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
                            text: "Customer update successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            $('#customerAddModal').modal('hide');
                            //reset the Item form
                            formCustomer.reset();
                            //refreash Item form
                            refreshCustomerForm();
                            //refreash Item table
                            refreshCustomerTable();
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: "Customer Details updation failed due to the following errors:<br>" + putServiceResponse,
                            icon: "error",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonColor: "#F25454"
                        });
                    }

                }
            })
        }


    } else {
        Swal.fire({
            title: "Error!",
            html: "Customer Details Updation failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }
}


const deleteCustomer = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete following Customer? "  ${ob.name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Delete",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            let deleteServiceResponse;
            //ajax request fot delete data
            $.ajax("/customr", {
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

            if (deleteServiceResponse == "OK") {
                Swal.fire({
                    title: "Success!",
                    text: "Customer Deleted Successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    $('#customerAddModal').modal('hide');
                    refreshCustomerTable();
                    refreshCustomerForm();
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Customer Deletion failed due to the following errors:<br>" + deleteServiceResponse,
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: "#F25454"
                });
            }
        }
    })
}

const buttonModalClose = () => {
    Swal.fire({
        title: "Are you sure to close the form?",
        text: "If you close this form, filled data will be removed.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Close",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {

        if (result.isConfirmed) {
            $('#customerAddModal').modal('hide');
            formCustomer.reset();
            divModifyButton.className = 'd-none';
            refreshCustomerForm();
            refreshCustomerTable();
        }
    });
}