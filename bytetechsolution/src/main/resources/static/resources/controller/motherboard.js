window.addEventListener('load', () => {
    refreshMotherboardTable();
    refreshMotherboardForm();
})

const refreshMotherboardTable = () => {

    motherboards = getServiceAjaxRequest("/motherboard/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getMotherboardSeries },
        { dataType: 'function', propertyName: getMotherboardType },
        { dataType: 'function', propertyName: getMotherboardFormFactor },
        { dataType: 'function', propertyName: getMemoryType },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableMotherboard, motherboards, displayPropertyList, refillMotherboardForm, divModifyButton)
        //table show with dataTable
    $('#tableMotherboard').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}
const refreshMotherboardForm = () => {
    motherboard = new Object();

    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.remove('elementHide')
    buttonClear.classList.remove('elementHide')

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";

    textItemName.disabled = true;

    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name");

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name");

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Supported Memory Type", memorytypes, "name");

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

    interfaces = getServiceAjaxRequest("/interface/alldata");
    fillDataIntoSelect(selectInterface, "Select Supported Interfaces", interfaces, "name");

    fillDataIntoSelect(selectMotherboardSeries, "Select Processor Socket First", [], "name")
    fillDataIntoSelect(selectMotherboardType, "Select Motherboard Series First", [], "name")



    selectCpuSocket.addEventListener('change', () => {
        motherboard.motherboardseries_id = null;
        removeValidationColor([selectMotherboardSeries]);
        const cpusocket = selectValueHandler(selectCpuSocket);
        motherboardSeries = getServiceAjaxRequest("/motherboardseries/motherboardseriesbycpusocket/" + cpusocket.name);
        fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardSeries, "name");

        selectMotherboardSeries.addEventListener('change', () => {
            motherboard.motherboardtype_id = null;
            removeValidationColor([selectMotherboardType]);
            const motherboardseries = selectValueHandler(selectMotherboardSeries);
            motherboardTypes = getServiceAjaxRequest("/motherboardtype/motherboardtypebymotherboardseries/" + motherboardseries.name);
            fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name");
        })

    })


    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType])

    imgMotherboardPhoto.src = "/resources/image/noitem.jpg";
    textMotherboardPhoto.textContent = "No Image Selected";
    FileMotherboardPhoto.value = null;


    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getMotherboardSeries = (ob) => {
    return ob.motherboardseries_id.name;
}

const getMotherboardType = (ob) => {
    return ob.motherboardtype_id.name;
}

const getMotherboardFormFactor = (ob) => {
    return ob.motherboardformfactor_id.name;
}

const getMemoryType = (ob) => {
    return ob.memorytype_id.name;
}

const getCpuSocket = (ob) => {
    return ob.cpusocket_id.name;
}

const getItemStatus = (ob) => {
    if (ob.itemstatus_id.name == 'Available') {
        return '<p class="item-status-available">' + ob.itemstatus_id.name + '</p>';
    }

    if (ob.itemstatus_id.name == 'Low-Stock') {
        return '<p class="item-status-resign">' + ob.itemstatus_id.name + '</p>'
    }


    if (ob.itemstatus_id.name == 'Unavailable') {
        return '<p class="item-status-delete">' + ob.itemstatus_id.name + '</p>'
    } else {
        return '<p class="item-status-other">' + ob.itemstatus_id.name + '</p>'
    }
}

/* const salePriceCalculator = () => {
    decimalSalesPrice.disabled = true;
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', 'motherboard', 'salesprice')
}
 */
const refillMotherboardForm = (ob, rowIndex) => {
    $('#motherboardAddModal').modal('show');
    removeValidationColor([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType, selectInterface, selectMotherboardType, numberMaxCapacity])



    buttonUpdate.classList.remove('elementHide')
    buttonSubmit.classList.add('elementHide')
    buttonClear.classList.add('elementHide')

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    textItemName.disabled = true;

    motherboard = JSON.parse(JSON.stringify(ob));
    oldMotherboard = ob;

    //asign itemcode
    staticBackdropLabel.textContent = motherboard.itemcode;

    //assign item name
    textItemName.value = motherboard.itemname;

    //assign profit rate
    numberProfitRate.value = motherboard.profitrate;

    //assign rop 
    numberROP.value = motherboard.rop;
    //assign roq 
    numberROQ.value = motherboard.roq;
    //assign warranty
    numberWarranty.value = motherboard.warranty;
    //asign description
    textDescription.value = motherboard.description;
    //assign max capacity
    numberMaxCapacity.value = motherboard.maxcapacity


    //get brands of motherboard
    brands = getServiceAjaxRequest("/brand/brandbycategory/Motherboard");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name", ob.brand_id.name);

    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    motherboardformfactors = getServiceAjaxRequest("/motherboardformfactor/alldata")
    fillDataIntoSelect(selectMotherboardFormFactor, "Please Select Motherboard Form Factor", motherboardformfactors, "name", ob.motherboardformfactor_id.name);

    memorytypes = getServiceAjaxRequest("/memorytype/alldata")
    fillDataIntoSelect(selectMemoryType, "Please Supported Memory Type", memorytypes, "name", ob.memorytype_id.name);

    cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name", ob.cpusocket_id.name);

    motherboardseries = getServiceAjaxRequest("/motherboardseries/alldata");
    fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardseries, "name", ob.motherboardseries_id.name)

    motherboardTypes = getServiceAjaxRequest("/motherboardtype/alldata");
    fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name", ob.motherboardtype_id.name)

    interfaces = getServiceAjaxRequest("/interface/alldata");
    fillDataIntoSelect(selectInterface, "Select Supported Interfaces", interfaces, "name", ob.interface_id.name);



    selectCpuSocket.addEventListener('change', () => {
        motherboard.motherboardseries_id = null;
        removeValidationColor([selectMotherboardSeries]);
        const cpusocket = selectValueHandler(selectCpuSocket);
        motherboardSeries = getServiceAjaxRequest("/motherboardseries/motherboardseriesbycpusocket/" + cpusocket.name);
        fillDataIntoSelect(selectMotherboardSeries, "Select Motherboard Series", motherboardSeries, "name");

        selectMotherboardSeries.addEventListener('change', () => {
            motherboard.motherboardtype_id = null;
            removeValidationColor([selectMotherboardType]);
            const motherboardseries = selectValueHandler(selectMotherboardSeries);
            motherboardTypes = getServiceAjaxRequest("/motherboardtype/motherboardtypebymotherboardseries/" + motherboardseries.name);
            fillDataIntoSelect(selectMotherboardType, "Select Motherboard Type", motherboardTypes, "name");
        })

    })

    //assign profile picture and name
    if (motherboard.photo == null) {
        imgMotherboardPhoto.src = "/resources/image/noitem.jpg";
        textMotherboardPhoto.textContent = "No Item Image";
    } else {
        imgMotherboardPhoto.src = atob(motherboard.photo);
        textMotherboardPhoto.textContent = motherboard.photoname;
    }

    if (motherboard.itemstatus_id.name == 'Deleted') {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }

    selectItemStatus.addEventListener('change', () => {
        if (motherboard.itemstatus_id.name == "Deleted") {
            buttonDelete.disabled = true;
            buttonDelete.classList.remove('modal-btn-delete');
        } else {
            buttonDelete.disabled = false;
            buttonDelete.classList.add('modal-btn-delete');
        }
    })


    inputFieldsHandler([numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberWarranty, textDescription, selectMotherboardSeries, selectMotherboardFormFactor, selectCpuSocket, selectBrand, selectItemStatus, selectMemoryType], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;

}

const checkMotherboardInputErrors = () => {
    let errors = "";

    if (motherboard.itemname == null) {
        errors = errors + "Motherboard Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }
    if (motherboard.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (motherboard.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (motherboard.maxcapacity == null) {
        errors = errors + "Max Capacity can't be Null...!\n";
        numberMaxCapacity.classList.add("is-invalid");
    }
    if (motherboard.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (motherboard.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (motherboard.cpusocket_id == null) {
        errors = errors + "Processor Socket can't be Null...!\n";
        selectCpuSocket.classList.add("is-invalid");
    }
    if (motherboard.motherboardseries_id == null) {
        errors = errors + "Motherboard Series can't be Null...!\n";
        selectMotherboardSeries.classList.add("is-invalid");
    }
    if (motherboard.motherboardtype_id == null) {
        errors = errors + "Motherboard Type can't be Null...!\n";
        selectMotherboardType.classList.add("is-invalid");
    }
    if (motherboard.motherboardformfactor_id == null) {
        errors = errors + "Motherboard Form Factor can't be Null...!\n";
        selectMotherboardFormFactor.classList.add("is-invalid");
    }
    if (motherboard.memorytype_id == null) {
        errors = errors + "Memory Type can't be Null...!\n";
        selectMemoryType.classList.add("is-invalid");
    }
    if (motherboard.interface_id == null) {
        errors = errors + "Interface can't be Null...!\n";
        selectInterface.classList.add("is-invalid");
    }

    return errors;
}

const buttonMotherboardSubmit = () => {
    let errors = checkMotherboardInputErrors();

    if (errors == "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Add this Motherboard?",
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

                $.ajax("/motherboard", {
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(motherboard),
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


                if (postServiceResponce == "OK") {
                    Swal.fire({
                        title: "Success!",
                        text: "Motherboard Add Successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        //hide the model
                        $('#motherboardAddModal').modal('hide');
                        //reset the Item form
                        formMotherboard.reset();
                        //refreash Item form
                        refreshMotherboardForm();
                        //refreash Item table
                        refreshMotherboardTable();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Adding Motherboard to the system failed due to the following errors:<br>" + postServiceResponce,
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
            html: "Adding Motherboard to the system failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }

}

const checkMotherboardFormUpdates = () => {
    updates = "";

    if (motherboard.itemname != oldMotherboard.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (motherboard.profitrate != oldMotherboard.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (motherboard.warranty != oldMotherboard.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (motherboard.rop != oldMotherboard.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (motherboard.roq != oldMotherboard.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (motherboard.maxcapacity != oldMotherboard.maxcapacity) {
        updates = updates + "Max Capacity is Changed \n";
    }
    if (motherboard.description != oldMotherboard.description) {
        updates = updates + "Description is Changed \n";
    }
    if (motherboard.brand_id.name != oldMotherboard.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (motherboard.cpusocket_id.name != oldMotherboard.cpusocket_id.name) {
        updates = updates + "Processor Socket is Changed \n";
    }
    if (motherboard.motherboardtype_id.name != oldMotherboard.motherboardtype_id.name) {
        updates = updates + "Motherboard Type is Changed \n";
    }
    if (motherboard.motherboardseries_id.name != oldMotherboard.motherboardseries_id.name) {
        updates = updates + "Motherboard Series is Changed \n";
    }
    if (motherboard.motherboardformfactor_id.name != oldMotherboard.motherboardformfactor_id.name) {
        updates = updates + "Motherboard Form Factor is Changed \n";
    }
    if (motherboard.memorytype_id.name != oldMotherboard.memorytype_id.name) {
        updates = updates + "Memory Type is Changed \n";
    }
    if (motherboard.itemstatus_id.name != oldMotherboard.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }
    if (motherboard.interface_id.name != oldMotherboard.interface_id.name) {
        updates = updates + "Interface is Changed \n";
    }
    if (motherboard.photo != oldMotherboard.photo) {
        updates = updates + "Photo is Changed \n";
    }
    if (motherboard.photoname != oldMotherboard.photoname) {
        updates = updates + "Photo Name is Changed \n";
    }

    return updates;
}

const buttonMotherboardUpdate = () => {
    //check form error
    let errors = checkMotherboardInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkMotherboardFormUpdates();

        //check there is no updates or any updations
        if (updates == "") {
            Swal.fire({
                title: "Nothing Updated",
                text: "There are no any updates in Processor Form",
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
                text: "Do you want to update Processor Details?",
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

                    $.ajax("/motherboard", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(motherboard),


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
                            text: "Motherboard update successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            //hide the moadel
                            $('#motherboardAddModal').modal('hide');
                            //refreash Item table for realtime updation
                            refreshMotherboardTable();
                            //reset the Item form
                            formMotherboard.reset();
                            //Item form refresh
                            refreshMotherboardForm();
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: "Motherboard Information updation failed due to the following errors:<br>" + putServiceResponse,
                            icon: "error",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonColor: "#F25454"
                        });
                        //refreash the employee form
                        refreshMotherboardForm();

                    }

                }
            })
        }
    } else {
        //show user to what errors happen
        Swal.fire({
            title: "Error!",
            html: "Motherboard Details Updation failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }


}


const deleteMotherboard = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        html: `Do you want to delete following Motherboard? <br><br>  <b>${ob.itemname}</b>`,
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
            $.ajax("/mmotherboard", {
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
                    text: "Motherboard Information Deleted Successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    $('#motherboardAddModal').modal('hide');
                    refreshMotherboardTable()
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Motherboard Deletion failed due to the following errors:<br>" + deleteServiceResponse,
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
            $('#motherboardAddModal').modal('hide');


            //formItem is id of form
            //this will reset all data(refreash)
            formMotherboard.reset();
            divModifyButton.className = 'd-none';

            refreshMotherboardForm();
        }
    });
}

const processorPictureRemove = () => {
    //profile image set to default
    imgMotherboardPhoto.src = "/resources/image/noitem.jpg";
    textMotherboardPhoto.textContent = "No Image Selected";
    FileMotherboardPhoto.value = null;
}

const generateItemName = () => {
    if (selectBrand.value != "" && numberMaxCapacity.value != "" && selectCpuSocket.value != "" && selectMotherboardSeries.value != "" && selectMotherboardType.value != "" && selectMotherboardFormFactor.value != "" && selectMemoryType.value != "" && selectInterface.value != "") {
        textItemName.value = `${JSON.parse(selectBrand.value).name} ${JSON.parse(selectMotherboardType.value).name} ${JSON.parse(selectMotherboardFormFactor.value).name} (Socket ${JSON.parse(selectCpuSocket.value).name}) ${JSON.parse(selectMemoryType.value).name} ${JSON.parse(selectMotherboardSeries.value).name} ${numberMaxCapacity.value}GB ${JSON.parse(selectInterface.value).name}`;
        motherboard.itemname = textItemName.value;
        console.log(motherboard.itemname)
        textItemName.classList.add("is-valid");
    } else {
        textItemName.classList.add("is-invavlid");
        motherboard.itemname = "Need to Select All the Fields";
    }

}