const purchaseTrends = document.getElementById('mySupplierChrt1').getContext('2d');
const prtrendsChart = new Chart(purchaseTrends, {
    type: 'bar',
    data: {
        labels: ['Jul', 'Aug', 'sap', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Recived GRNs',
            data: [1, 1, 1, 1, 1, 2, 3, 5, 2, 1, 4, 5],
            backgroundColor: 'hsla(157, 81.90%, 56.70%, 0.20)',
            borderColor: '#103D45',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#103D45'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});

const prStatus = document.getElementById('mySupplierChrt2').getContext('2d');
const prStatusChart = new Chart(prStatus, {
    type: 'pie',
    data: {
        labels: ['Recived', 'Requested', 'Rejected', 'Deleted'],
        datasets: [{
            label: 'Count',
            data: [4, 7, 2, 1],
            backgroundColor: [
                '#103d45',
                '#f7ce00',
                '#f70067',
                '#f70000',
            ],
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#103D45'
        }]
    },
});



window.addEventListener('load', () => {
    tableSupplierQuotation = document.getElementById('tableSupplierQuotation')
    tablePrequest = document.getElementById('tableSupplierPurchaseRequest')
    tableGrn = document.getElementById('tableGRN')

    const supplierQuotations = [
        { id: 1, supplierQuotation: 'SQC0003', qrequest: 'QRC0002', category: 'Processor', brand: 'Intel', validDate: '2025-07-05' },
        { id: 2, supplierQuotation: 'SQC0004', qrequest: 'QRC0003', category: 'Processor', brand: 'AMD', validDate: '2025-06-31' },
        { id: 3, supplierQuotation: 'SQC0006', qrequest: 'QRC0005', category: 'Motherboard', brand: 'Asus', validDate: '2025-07-30' },
        { id: 4, supplierQuotation: 'SQC0009', qrequest: 'QRC0008', category: 'Motherboard', brand: 'MSI', validDate: '2025-07-30' },
        { id: 5, supplierQuotation: 'SQC0008', qrequest: 'QRC0007', category: 'GPU', brand: 'MSI', validDate: '2025-06-30' },
    ]

    const purchaseRequest = [
        { id: 1, pr: 'PRC0001', requiredDate: '2025-07-12', status: 'Recived', totalAmount: '309000' },
        { id: 2, pr: 'PRC0004', requiredDate: '2025-08-23', status: 'Requested', totalAmount: '290000' },
        { id: 3, pr: 'PRC0007', requiredDate: '2025-08-19', status: 'Recived', totalAmount: '1569000' },
        { id: 4, pr: 'PRC0009', requiredDate: '2025-08-16', status: 'Recived', totalAmount: '1210000' },
        { id: 5, pr: 'PRC0010', requiredDate: '2025-08-01', status: 'Requested', totalAmount: '2240000' },
    ]

    const grnData = [
        { id: 1, grn: 'GRN0008', recivedDate: '2025-06-29', status: 'Recived', totalAmount: '309000' },
        { id: 2, grn: 'GRN0009', recivedDate: '2025-06-29', status: 'Recived', totalAmount: '1569000' },
        { id: 3, grn: 'GRN0010', recivedDate: '2025-06-29', status: 'Recived', totalAmount: '1210000' },
    ]

    const displaySupplierQuotatinList = [
        { dataType: 'text', propertyName: 'supplierQuotation' },
        { dataType: 'text', propertyName: 'qrequest' },
        { dataType: 'text', propertyName: 'category' },
        { dataType: 'text', propertyName: 'brand' },
        { dataType: 'text', propertyName: 'validDate' },
    ];

    const displayPurchaseRequestList = [
        { dataType: 'text', propertyName: 'pr' },
        { dataType: 'text', propertyName: 'requiredDate' },
        { dataType: 'text', propertyName: 'totalAmount' },
        { dataType: 'text', propertyName: 'status' },

    ]
    const displayGrnList = [
        { dataType: 'text', propertyName: 'grn' },
        { dataType: 'text', propertyName: 'recivedDate' },
        { dataType: 'text', propertyName: 'totalAmount' },
        { dataType: 'text', propertyName: 'status' },

    ]

    divModifyButton = document.getElementById('divModifyButton')

    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    fillDataIntoTable(tableSupplierQuotation, supplierQuotations, displaySupplierQuotatinList, refillGrnForm, divModifyButton)
    fillDataIntoTable(tablePrequest, purchaseRequest, displayPurchaseRequestList, refillGrnForm, divModifyButton)
    fillDataIntoTable(tableGrn, grnData, displayGrnList, refillGrnForm, divModifyButton)
        //table show with dataTable
    tableSupplierQuotation.dataTable();
    tablePrequest.dataTable();
    tableGrn.dataTable();
    //hide button section
    divModifyButton.className = 'd-none';
})

const refillGrnForm = () => {

}