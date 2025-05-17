window.addEventListener('load', () => {
    refreshProcessorTable();
    refreshProcessorForm();
})

const refreshProcessorTable = () => {

    //get data using ajax request
    processors = getServiceAjaxRequest("/processor/alldata");

    const displayPropertyList = [
        { dataType: 'text', propertyName: 'itemcode' },
        { dataType: 'text', propertyName: 'itemname' },
        { dataType: 'function', propertyName: getBrandName },
        { dataType: 'text', propertyName: 'profitrate' },
        { dataType: 'function', propertyName: getCpuSeries },
        { dataType: 'function', propertyName: getCpuGeneration },
        { dataType: 'function', propertyName: getCpuSocket },
        { dataType: 'function', propertyName: getItemStatus },
    ]

    fillDataIntoTable(tableProcessor, processors, displayPropertyList, refillProcessorForm, divModifyButton)
        //table show with dataTable
    $('#tableProcessor').dataTable();
    //hide button section
    divModifyButton.className = 'd-none';

}



const refreshProcessorForm = () => {
    processor = new Object();

    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    buttonUpdate.disabled = true;
    buttonUpdate.classList.remove('modal-btn-update');

    staticBackdropLabel.textContent = "Add New Item";
    //decimalSalesPrice.disabled = true;

    textItemName.disabled = true;


    brands = getServiceAjaxRequest("/brand/brandbycategory/Processor");
    fillDataIntoSelect(selectBrand, "Please Select Brand", brands, "name");

    itemStatuses = getServiceAjaxRequest("/itemstatus/alldata");
    fillDataIntoSelect(selectItemStatus, "Select Item Status", itemStatuses, "name");

    fillDataIntoSelect(selectCpuSocket, "Select Processor Brand First", [], "name")
    fillDataIntoSelect(selectCpuGeneration, "Select Processor Socket First", [], "name");




    selectBrand.addEventListener('change', () => {
        processor.cpuseries_id = null;
        processor.cpusocket_id = null;
        removeValidationColor([selectCpuSeries, selectCpuSocket]);

        const cpuBrand = selectValueHandler(selectBrand);
        cpuSeries = getServiceAjaxRequest("/cpuseries/cpuseriesbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name");

        cpuSocket = getServiceAjaxRequest("/cpusocket/cpusocketbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

    });

    selectCpuSocket.addEventListener('change', () => {
        console.log("cpu function work")
        processor.cpugeneration_id = null;
        removeValidationColor([selectCpuGeneration]);
        const cpuGentoSocket = selectValueHandler(selectCpuSocket);
        console.log("cpu function", cpuGentoSocket)
        cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + cpuGentoSocket.name);
        fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");
    });

    selectCpuSeries.addEventListener('change', () => {
        processor.cpusuffix_id = null;
        removeValidationColor([selectCpuSuffix]);
        const cpuSelectedSeries = selectValueHandler(selectCpuSeries);
        cpuSuffix = getServiceAjaxRequest("/cpusuffix/cpusuffixbycpuseries/" + cpuSelectedSeries.name);
        fillDataIntoSelect(selectCpuSuffix, "Select Processor Suffix", cpuSuffix, "name");
    });
    //cpuSeries = getServiceAjaxRequest("/cpuseries/alldata");
    //fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name");


    //cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    //fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

    /* selectCpuSocket.addEventListener('change', () => {
        const cpuGentoSocket = selectValueHandler(selectCpuSocket);
        console.log(cpuGentoSocket)
        cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + cpuGentoSocket.name);
        fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");
    }); */


    //cpuGeneration = getServiceAjaxRequest("/cpugeneration/alldata");
    //fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");

    //profile image set to default
    imgProcessorPhoto.src = "/resources/image/noitem.jpg";
    textProcessorPhoto.textContent = "No Image Selected";
    FileProcessorPhoto.value = null;



    removeValidationColor([textItemName, numberProfitRate, numberROP, selectCpuSuffix, numberCache, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus])

    let userPrivilages = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");

    if (!userPrivilages.insert) {
        buttonSubmit.disabled = true;
        buttonSubmit.classList.remove('modal-btn-submit');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, selectCpuSuffix, numberCache, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], true);
        buttonClear.classList.remove('modal-btn-clear');
    }

}

const generateItemName = () => {
    console.log(selectCpuSuffix.value != "" && numberCache.value != "" && numberTotalCore.value != "" && selectCpuSeries.value != "" && selectCpuGeneration.value != "" && selectCpuSocket.value != "" && selectBrand.value != "")
    if (selectCpuSuffix.value != "" && numberCache.value != "" && numberTotalCore.value != "" && selectCpuSeries.value != "" && selectCpuGeneration.value != "" && selectCpuSocket.value != "" && selectBrand.value != "") {
        textItemName.value = `${JSON.parse(selectBrand.value).name} ${JSON.parse(selectCpuSeries.value).name} ${JSON.parse(selectCpuGeneration.value).name} ${JSON.parse(selectCpuSocket.value).name} ${JSON.parse(selectCpuSuffix.value).name} (${numberCache.value}MB L3 Cache ${numberTotalCore.value} Cores)`;
        processor.itemname = textItemName.value;
        console.log(processor.itemname)
        textItemName.classList.add("is-valid");
    } else {
        textItemName.classList.add("is-invavlid");
        processor.itemname = "Need to Select All the Fields";
    }

}

const getBrandName = (ob) => {
    return ob.brand_id.name;
}

const getCpuSeries = (ob) => {
    return ob.cpuseries_id.name;
}

const getCpuGeneration = (ob) => {
    return ob.cpugeneration_id.name;
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
        return '<p class="item-status-unavailble">' + ob.itemstatus_id.name + '</p>'
    }
    if (ob.itemstatus_id.name == 'Deleted') {
        return '<p class="item-status-delete">' + ob.itemstatus_id.name + '</p>'
    } else {
        return '<p class="item-status-other">' + ob.itemstatus_id.name + '</p>'
    }
}

const refillProcessorForm = (ob, rowIndex) => {
    $('#processorAddModal').modal('show');
    removeValidationColor([textItemName, numberProfitRate, numberROP, selectCpuSuffix, numberCache, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus])


    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    processor = JSON.parse(JSON.stringify(ob));
    oldProcessor = ob;

    //asign itemcode
    staticBackdropLabel.textContent = processor.itemcode;

    //assign item name
    textItemName.value = processor.itemname;
    //assign sales price
    numberProfitRate.value = processor.profitrate;
    //assign rop 
    numberROP.value = processor.rop;
    //assign roq 
    numberROQ.value = processor.roq;
    //assign warranty
    numberWarranty.value = processor.warranty;
    //asign description
    textDescription.value = processor.description;
    //assign total core
    numberTotalCore.value = processor.totalcore;
    numberCache.value = processor.cache;



    //get the brand that made processors
    brands = getServiceAjaxRequest("/brand/brandbycategory/Processor");
    fillDataIntoSelect(selectBrand, "Please Select", brands, "name", ob.brand_id.name);


    itemstatuses = getServiceAjaxRequest("/itemstatus/alldata")
    fillDataIntoSelect(selectItemStatus, "Please Select", itemstatuses, "name", ob.itemstatus_id.name);

    //cpuSeries = getServiceAjaxRequest("/cpuseries/alldata");
    cpuSeries = getServiceAjaxRequest("/cpuseries/cpuseriesbybrand/" + ob.brand_id.name);
    fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name", ob.cpuseries_id.name);

    //cpuSocket = getServiceAjaxRequest("/cpusocket/alldata");
    cpuSocket = getServiceAjaxRequest("/cpusocket/cpusocketbybrand/" + ob.brand_id.name);
    fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name", ob.cpusocket_id.name);

    //cpuGeneration = getServiceAjaxRequest("/cpugeneration/alldata");
    cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + ob.cpusocket_id.name);
    fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name", ob.cpugeneration_id.name);

    cpuSuffix = getServiceAjaxRequest("/cpusuffix/cpusuffixbycpuseries/" + ob.cpuseries_id.name);
    fillDataIntoSelect(selectCpuSuffix, "Select Processor Suffix", cpuSuffix, "name", ob.cpusuffix_id.name);




    //when user change brand all the data need to change
    selectBrand.addEventListener('change', () => {
        removeValidationColor([selectCpuSeries, selectCpuSocket]);

        const cpuBrand = selectValueHandler(selectBrand);
        cpuSeries = getServiceAjaxRequest("/cpuseries/cpuseriesbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSeries, "Select Processor Series", cpuSeries, "name");

        selectCpuSeries.addEventListener('change', () => {
            const cpuSelectedSeries = selectValueHandler(selectCpuSeries);
            cpuSuffix = getServiceAjaxRequest("/cpusuffix/cpusuffixbycpuseries/" + cpuSelectedSeries.name);
            fillDataIntoSelect(selectCpuSuffix, "Select Processor Suffix", cpuSuffix, "name");
        });

        cpuSocket = getServiceAjaxRequest("/cpusocket/cpusocketbybrand/" + cpuBrand.name);
        fillDataIntoSelect(selectCpuSocket, "Select Processor Socket", cpuSocket, "name");

        selectCpuSocket.addEventListener('change', () => {
            processor.cpugeneration_id = null;
            removeValidationColor([selectCpuGeneration]);

            const cpuGentoSocket = selectValueHandler(selectCpuSocket);
            cpuGeneration = getServiceAjaxRequest("/cpugeneration/cpugenerationbycpusocket/" + cpuGentoSocket.name);
            fillDataIntoSelect(selectCpuGeneration, "Select Processor Generation", cpuGeneration, "name");
        });

    });


    //assign profile picture and name
    if (processor.photo == null) {
        imgProcessorPhoto.src = "/resources/image/noitem.jpg";
        textProcessorPhoto.textContent = "No Item Image";
    } else {
        imgProcessorPhoto.src = atob(processor.photo);
        textProcessorPhoto.textContent = processor.photoname;
    }

    if (processor.itemstatus_id.name == 'Deleted') {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }

    selectItemStatus.addEventListener('change', () => {
        if (prequest.purchasestatus_id.name == "Deleted") {
            buttonDelete.disabled = true;
            buttonDelete.classList.remove('modal-btn-delete');
        } else {
            buttonDelete.disabled = false;
            buttonDelete.classList.add('modal-btn-delete');
        }
    })


    inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, buttonDelete, numberTotalCore, numberWarranty, selectCpuSuffix, numberCache, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], false);
    buttonClear.classList.add('modal-btn-clear');



    let userPrivilage = getServiceAjaxRequest("/privilage/byloggeduser/ITEM");
    //console.log(userPrivilage);


    if (!userPrivilage.update) {
        buttonUpdate.disabled = true;
        buttonUpdate.classList.remove('modal-btn-update');

        inputFieldsHandler([textItemName, numberProfitRate, numberROP, numberROQ, numberTotalCore, numberWarranty, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus, selectCpuSuffix, numberCache], true);
        buttonClear.classList.remove('modal-btn-clear');
    }
    if (!userPrivilage.delete) {
        buttonDelete.disabled = true;
        buttonDelete.classList.remove('modal-btn-delete');
    }


    buttonClear.disabled = true;
}


/* const salePriceCalculator = () => {
    decimalSalesPrice.disabled = true;
    let salesPrice = Number(decimalPurchasePrice.value) + (Number(numberProfitRate.value / 100) * Number(decimalPurchasePrice.value));
    decimalSalesPrice.value = salesPrice;
    textValidator(decimalSalesPrice, '^[0-9]+(\\.[0-9]{1,2})?$', 'processor', 'salesprice')
} */


const checkProcessorInputErrors = () => {
    let errors = "";

    if (processor.itemname == null) {
        errors = errors + "Processor Name can't be Null...!\n";
        textItemName.classList.add("is-invalid");
    }

    if (processor.profitrate == null) {
        errors = errors + "Profit Rate can't be Null...!\n";
        numberProfitRate.classList.add("is-invalid");
    }

    if (processor.warranty == null) {
        errors = errors + "Warranty can't be Null...!\n";
        numberWarranty.classList.add("is-invalid");
    }

    if (processor.totalcore == null) {
        errors = errors + "Total Cores can't be Null...!\n";
        numberTotalCore.classList.add("is-invalid");
    }
    if (processor.cache == null) {
        errors = errors + "L3 Cache can't be Null...!\n";
        numberCache.classList.add("is-invalid");
    }
    if (processor.itemstatus_id == null) {
        errors = errors + "Item Status can't be Null...!\n";
        selectItemStatus.classList.add("is-invalid");
    }
    if (processor.brand_id == null) {
        errors = errors + "Brand can't be Null...!\n";
        selectBrand.classList.add("is-invalid");
    }
    if (processor.cpusocket_id == null) {
        errors = errors + "Processor Socket can't be Null...!\n";
        selectCpuSocket.classList.add("is-invalid");
    }
    if (processor.cpuseries_id == null) {
        errors = errors + "Processor Series can't be Null...!\n";
        selectCpuSeries.classList.add("is-invalid");
    }
    if (processor.cpugeneration_id == null) {
        errors = errors + "Processor Generation can't be Null...!\n";
        selectCpuGeneration.classList.add("is-invalid");
    }
    if (processor.cpusuffix_id == null) {
        errors = errors + "Processor Suffix can't be Null...!\n";
        selectCpuSuffix.classList.add("is-invalid");
    }

    return errors;
}


const buttonProcessorSubmit = () => {
    let errors = checkProcessorInputErrors();

    if (errors === "") {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Add this Processor?",
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

                $.ajax("/processor", {
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(processor),
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
                        text: "processor Add Successfully!",
                        icon: "success",
                        confirmButtonColor: "#B3C41C",
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then(() => {
                        //hide the model
                        $('#processorAddModal').modal('hide');
                        //reset the Item form
                        formProcessor.reset();
                        //refreash Item form
                        refreshProcessorForm();
                        //refreash Item table
                        refreshProcessorTable();
                    })
                } else {
                    Swal.fire({
                        title: "Error!",
                        html: "Adding Processor to the system failed due to the following errors:<br>" + postServiceResponce,
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
            html: "Adding Processor to the system failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }

}

const checkProcessorFormUpdates = () => {
    updates = "";

    if (processor.itemname != oldProcessor.itemname) {
        updates = updates + "Processor Name is Changed \n";
    }
    if (processor.profitrate != oldProcessor.profitrate) {
        updates = updates + "Profit Rate is Changed \n";
    }
    if (processor.warranty != oldProcessor.warranty) {
        updates = updates + "Warranty is Changed \n";
    }
    if (processor.rop != oldProcessor.rop) {
        updates = updates + "ROP is Changed \n";
    }
    if (processor.roq != oldProcessor.roq) {
        updates = updates + "ROQ is Changed \n";
    }
    if (processor.totalcore != oldProcessor.totalcore) {
        updates = updates + "Total Core is Changed \n";
    }
    if (processor.description != oldProcessor.description) {
        updates = updates + "Description is Changed \n";
    }
    if (processor.brand_id.name != oldProcessor.brand_id.name) {
        updates = updates + "Brand is Changed \n";
    }
    if (processor.cpusocket_id.name != oldProcessor.cpusocket_id.name) {
        updates = updates + "Processor Socket is Changed \n";
    }
    if (processor.cpugeneration_id.name != oldProcessor.cpugeneration_id.name) {
        updates = updates + "Processor Generation is Changed \n";
    }
    if (processor.cpuseries_id.name != oldProcessor.cpuseries_id.name) {
        updates = updates + "Processor Series is Changed \n";
    }
    if (processor.itemstatus_id.name != oldProcessor.itemstatus_id.name) {
        updates = updates + "Item Status is Changed \n";
    }
    if (processor.cpusuffix_id.name != oldProcessor.cpusuffix_id.name) {
        updates = updates + "Procesor Suffix is Changed \n";
    }
    if ((processor.photo != oldProcessor.photo) || (processor.photoname != oldProcessor.photoname)) {
        updates = updates + "Item Photo is Changed <br>";
    }

    return updates;
}

const buttonProcessorUpdate = () => {
    //check form error
    let errors = checkProcessorInputErrors();

    //check code has error, if code doesn't have  any errors
    if (errors == "") {

        //check form update

        let updates = checkProcessorFormUpdates();

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
                    //call put service requestd  -this use for updations
                    let putServiceResponse;

                    $.ajax("/processor", {
                        type: "PUT",
                        async: false,
                        contentType: "application/json",
                        data: JSON.stringify(processor),


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
                            text: "purchase request update successfully!",
                            icon: "success",
                            confirmButtonColor: "#B3C41C",
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(() => {
                            //hide the moadel
                            $('#processorAddModal').modal('hide');
                            //refreash Item table for realtime updation
                            refreshProcessorTable();
                            //reset the Item form
                            formProcessor.reset();
                            //Item form refresh
                            refreshProcessorForm();
                        })
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: "Processor Information updation failed due to the following errors:<br>" + putServiceResponse,
                            icon: "error",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            confirmButtonColor: "#F25454"
                        });
                        //refreash the employee form
                        refreshProcessorForm();

                    }

                }
            })

        }
    } else {
        //show user to what errors happen
        Swal.fire({
            title: "Error!",
            html: "Purchase Request Updation failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
            icon: "error",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#F25454"
        });
    }


}


const deletePocessor = (ob, rowIndex) => {
    Swal.fire({
        title: "Are you sure?",
        text: `Do you want to delete following Processor? "  ${ob.itemcode}`,
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
            $.ajax("/processor", {
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
                    text: "Processor Information Deleted Successfully!",
                    icon: "success",
                    confirmButtonColor: "#B3C41C",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => {
                    $('#processorAddModal').modal('hide');
                    refreshProcessorTable()
                })
            } else {
                Swal.fire({
                    title: "Error!",
                    html: "Processor Deletion failed due to the following errors:<br>" + deleteServiceResponse,
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
            $('#processorAddModal').modal('hide');


            //formItem is id of form
            //this will reset all data(refreash)
            formProcessor.reset();
            divModifyButton.className = 'd-none';

            refreshProcessorForm();
        }
    });
}

const processorPictureRemove = () => {
    //profile image set to default
    imgProcessorPhoto.src = "/resources/image/noitem.jpg";
    textProcessorPhoto.textContent = "No Image Selected";
    FileProcesorPhoto.value = null;
}

const refreshProcessor = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to refresh the Processor Form? ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#103D45",
        cancelButtonColor: "#F25454",
        confirmButtonText: "Yes, Refresh",
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            refreshProcessorForm()

            Swal.fire({
                title: "Success!",
                text: "Processor Form Refreshed Successfully!",
                icon: "success",
                confirmButtonColor: "#B3C41C",
                allowOutsideClick: false,
                allowEscapeKey: false
            })


        }
    })
}