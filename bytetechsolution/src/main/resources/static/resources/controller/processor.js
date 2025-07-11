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

    buttonUpdate.classList.add('elementHide')
    buttonSubmit.classList.remove('elementHide')
    buttonClear.classList.remove('elementHide')

    //active submit button
    buttonSubmit.disabled = false;
    buttonSubmit.classList.add('modal-btn-submit');

    //disable update button
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

    buttonUpdate.classList.remove('elementHide')
    buttonSubmit.classList.add('elementHide')
    buttonClear.classList.add('elementHide')

    buttonSubmit.disabled = true;
    buttonSubmit.classList.remove('modal-btn-submit');

    buttonUpdate.disabled = false;
    buttonUpdate.classList.add('modal-btn-update');

    processor = JSON.parse(JSON.stringify(ob));
    oldProcessor = ob;
    textItemName.disabled = true;

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
        if (processor.itemstatus_id.name == "Deleted") {
            buttonDelete.disabled = true;
            buttonDelete.classList.remove('modal-btn-delete');
        } else {
            buttonDelete.disabled = false;
            buttonDelete.classList.add('modal-btn-delete');
        }
    })


    inputFieldsHandler([numberProfitRate, numberROP, numberROQ, buttonDelete, numberTotalCore, numberWarranty, selectCpuSuffix, numberCache, textDescription, selectCpuSeries, selectCpuGeneration, selectCpuSocket, selectBrand, selectItemStatus], false);
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
    //check errors in user inputs
    let errors = checkProcessorInputErrors();

    //if there is no errors open sweet alert to get a confomation
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
            //if user conformed called post request
            if (result.isConfirmed) {

                let postServiceResponce;
                //ajax request
                $.ajax("/processor", {
                    type: "POST", //method
                    contentType: "application/json",
                    data: JSON.stringify(processor),
                    async: false,

                    //if success
                    success: function(data) {
                        console.log("success", data);
                        postServiceResponce = data;
                    },

                    //if not success
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
                            text: "Processor update successfully!",
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
            html: "Processor Details Updation failed due to the following errors:<br>" + errors.replace(/\n/g, "<br>"),
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
        html: `Do you want to delete following Processor? <br><br>  <b>${ob.itemname}<b>`,
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

const printProcessorDetails = (ob, rowIndex) => {
    // Create the complete HTML content for printing
    const printContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Processor Details - ${ob.itemcode}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: white;
                    padding: 20px;
                }
                
                .record-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                }
                
                .record-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid #103d45;
                }
                
                .company-info {
                    display: flex;
                    align-items: flex-start;
                    gap: 20px;
                }
                
                .logo-container {
                    flex-shrink: 0;
                }
                
                .company-logo {
                    max-width: 120px;
                    height: auto;
                }
                
                .company-details {
                    color: #666;
                    font-size: 14px;
                    line-height: 1.4;
                }
                
                .record-title {
                    font-size: 32px;
                    font-weight: bold;
                    color: #103d45;
                    margin-bottom: 15px;
                    text-align: right;
                }
                
                .record-details {
                    text-align: right;
                    font-size: 14px;
                }
                
                .record-details > div {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    min-width: 200px;
                }
                
                .record-details span:first-child {
                    font-weight: bold;
                    color: #666;
                }
                
                .record-details span:last-child {
                    color: #333;
                    font-weight: 600;
                }
                
                .processor-image-section {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 8px;
                    border-left: 4px solid #103d45;
                }
                
                .processor-image {
                    max-width: 200px;
                    max-height: 200px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    border: 2px solid #e5e7eb;
                }
                
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .detail-card {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #103d45;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .detail-section {
                    margin-bottom: 20px;
                }
                
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #103d45;
                    margin-bottom: 15px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #e5e7eb;
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .detail-row:last-child {
                    border-bottom: none;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: #666;
                    min-width: 120px;
                }
                
                .detail-value {
                    color: #333;
                    font-weight: 500;
                    text-align: right;
                    flex: 1;
                }
                
                .specifications-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .specifications-table thead {
                    background: linear-gradient(135deg, #103d45 0%, #0d3239 100%);
                    color: white;
                }
                
                .specifications-table th {
                    padding: 15px 12px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .specifications-table td {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                    font-size: 14px;
                }
                
                .specifications-table tbody tr:nth-child(even) {
                    background: #f8fafc;
                }
                
                .specifications-table tbody tr:hover {
                    background: #b9f8c5;
                }
                
                .specifications-table tbody tr:last-child td {
                    border-bottom: none;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .status-active {
                    background: #10b981;
                    color: white;
                }
                
                .status-inactive {
                    background: #ef4444;
                    color: white;
                }
                
                .status-deleted {
                    background: #6b7280;
                    color: white;
                }
                
                .description-section {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    border-left: 4px solid #10b981;
                }
                
                .description-header {
                    font-weight: bold;
                    color: #374151;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .description-content {
                    color: #6b7280;
                    font-size: 14px;
                    line-height: 1.6;
                }
                
                .record-footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    color: #6b7280;
                    font-size: 14px;
                }
                
                .record-footer p {
                    margin: 5px 0;
                }
                
                /* Print styles */
                @media print {
                    body {
                        padding: 0;
                        background: white;
                    }
                    
                    .record-container {
                        box-shadow: none;
                        padding: 20px;
                        max-width: none;
                    }
                    
                    .specifications-table {
                        box-shadow: none;
                    }
                    
                    .details-grid {
                        break-inside: avoid;
                    }
                    
                    .specifications-table {
                        break-inside: avoid;
                    }
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    .record-header {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .record-title {
                        text-align: left;
                    }
                    
                    .record-details {
                        text-align: left;
                    }
                    
                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .specifications-table {
                        font-size: 12px;
                    }
                    
                    .specifications-table th,
                    .specifications-table td {
                        padding: 8px 6px;
                    }
                    
                    .detail-row {
                        flex-direction: column;
                        gap: 5px;
                    }
                    
                    .detail-value {
                        text-align: left;
                    }
                }
            </style>
        </head>
        <body>
            <div class="record-container">
                <!-- Header Section -->
                <div class="record-header">
                    <div class="company-info">
                        <div class="logo-container">
                            <div class="logo">
                                <div class="logo-icon">
                                    <img src="resources/image/logo/onlylogo.png" class="company-logo" alt="Company Logo" />
                                </div>
                            </div>
                        </div>
                        <div class="company-details">
                            <div><strong>No 72, Peoples Road</strong></div>
                            <div>Panadura, 12560</div>
                            <div>Phone: (038) 229-5555</div>
                            <div>Email: info@company.com</div>
                        </div>
                    </div>
                    <div>
                        <div class="record-title">PROCESSOR RECORD</div>
                        <div class="record-details">
                            <div><span>ITEM CODE:</span><span>${ob.itemcode || 'N/A'}</span></div>
                            <div><span>DATE:</span><span>${formatDate(new Date())}</span></div>
                        </div>
                    </div>
                </div>

                <!-- Processor Image Section -->
                <div class="processor-image-section">
                    <img src="${getProcessorImage(ob.photo)}" alt="Processor Image" class="processor-image" />
                </div>

                <!-- Basic Details Grid -->
                <div class="details-grid">
                    <div class="detail-card">
                        <div class="section-title">Basic Information</div>
                        <div class="detail-row">
                            <span class="detail-label">Item Name:</span>
                            <span class="detail-value">${ob.itemname || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Brand:</span>
                            <span class="detail-value">${ob.brand_id?.name || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value">
                                <span class="status-badge ${getStatusClass(ob.itemstatus_id?.name)}">
                                    ${ob.itemstatus_id?.name || 'N/A'}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div class="detail-card">
                        <div class="section-title">Pricing & Inventory</div>
                        <div class="detail-row">
                            <span class="detail-label">Profit Rate:</span>
                            <span class="detail-value">${ob.profitrate || 0}%</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">ROP:</span>
                            <span class="detail-value">${ob.rop || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">ROQ:</span>
                            <span class="detail-value">${ob.roq || 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Warranty:</span>
                            <span class="detail-value">${ob.warranty || 'N/A'} Months</span>
                        </div>
                    </div>
                </div>

                <!-- Technical Specifications Table -->
                <div class="detail-section">
                    <div class="section-title">Technical Specifications</div>
                    <table class="specifications-table">
                        <thead>
                            <tr>
                                <th style="width: 30%;">Specification</th>
                                <th style="width: 70%;">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>CPU Series</strong></td>
                                <td>${ob.cpuseries_id?.name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>CPU Generation</strong></td>
                                <td>${ob.cpugeneration_id?.name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>CPU Socket</strong></td>
                                <td>${ob.cpusocket_id?.name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>CPU Suffix</strong></td>
                                <td>${ob.cpusuffix_id?.name || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>Total Cores</strong></td>
                                <td>${ob.totalcore || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td><strong>L3 Cache</strong></td>
                                <td>${ob.cache || 'N/A'} MB</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Description Section -->
                <div class="description-section">
                    <div class="description-header">DESCRIPTION</div>
                    <div class="description-content">
                        <p>${ob.description || 'No description provided for this processor.'}</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="record-footer">
                    <p>This is a system generated processor record document</p>
                    <p><strong>Generated on:</strong> ${formatDateTime(new Date())}</p>
                    <p><strong>Contact:</strong> spinfo@bytetechsolution.gmail.com</p>
                </div>
            </div>
        </body>
        </html>
    `;

    // Open new tab and write content
    const newTab = window.open('', '_blank');
    newTab.document.write(printContent);
    newTab.document.close();

    // Auto-print when page loads
    newTab.onload = function() {
        newTab.print();
    };
};

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Helper function to format date and time
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper function to get processor image
const getProcessorImage = (photo) => {
    if (!photo) {
        return '/resources/image/noitem.jpg';
    }
    return atob(photo);
};

// Helper function to get status class for styling
const getStatusClass = (status) => {
    if (!status) return 'status-inactive';

    switch (status.toLowerCase()) {
        case 'active':
            return 'status-active';
        case 'deleted':
            return 'status-deleted';
        default:
            return 'status-inactive';
    }
};