const printReport = () => {
    const tableHTML = document.getElementById("tableSalesList").outerHTML;
    const canvas = document.getElementById("myChart");
    const chartImage = canvas.toDataURL();

    let newWindow = window.open("", "_blank");

    let printView =
        `<head>
            <title>Sales Summary Report</title>
            <link rel='stylesheet' href='../resources/bootstrap-5.2.3/css/bootstrap.min.css' />
        </head>
        <body>
            <h1 class="text-center my-3">Sales Summary Report</h1>
            <div class='row'>
                <div class='col-6'>
                    ${tableHTML}
                </div>
                <div class='col-6 text-center'>
                    <img src='${chartImage}' style='max-width: 100%; height: auto;' />
                </div>
            </div>
        </body>`;

    newWindow.document.write(printView);

    // Give the browser time to render the content before printing
    setTimeout(() => {
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
        newWindow.close();
    }, 500);
};

const generateReport = () => {
    let dateStartDate = document.getElementById('dateStartDate');
    let dateEndDate = document.getElementById('dateEndDate');
    let selectType = document.getElementById('selectType');
    let tableSalesList = document.getElementById('tableSalesList');
    let dataList = getServiceAjaxRequest(`/report/salesdatabygivenrange?startdate=${dateStartDate.value}&enddate=${dateEndDate.value}&type=${JSON.parse(JSON.stringify(selectType.value))}`)

    console.log(dataList)
    let reportDataList = new Array();
    let label = new Array();
    let data = new Array();

    for (const index in dataList) {
        let object = new Object();
        object.month = dataList[index][0];
        object.count = dataList[index][1];
        object.amount = dataList[index][2];
        reportDataList.push(object)

        label.push(dataList[index][0])
        data.push(dataList[index][1])
    }
    //table
    const displayList = [
        { dataType: 'text', propertyName: 'month' },
        { dataType: 'text', propertyName: 'count' },
        { dataType: 'text', propertyName: 'amount' },
    ]
    showOnlyTable(tableSalesList, reportDataList, displayList)


    const ctx = document.getElementById("myChart");
    if (Chart.getChart("myChart") != undefined)

        Chart.getChart("myChart").destroy();
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label,
            datasets: [{
                label: label,
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}