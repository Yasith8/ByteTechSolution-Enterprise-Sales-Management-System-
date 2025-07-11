const selectSupplier = document.getElementById('selectSupplier');
let suppliers = [];
let tableSupplierQuotation, tablePrequest, tableGrn;
let prtrendsChart, prStatusChart;
let currentSupplierId = null;

// Initialize page
window.addEventListener('load', () => {
    try {
        // Load suppliers
        suppliers = getServiceAjaxRequest('/supplier/activesupplier');
        fillMultipleItemOfDataIntoSingleSelect(selectSupplier, "Select Supplier", suppliers, "supplierid", "name");

        // Initialize table elements
        tableSupplierQuotation = document.getElementById('tableSupplierQuotation');
        tablePrequest = document.getElementById('tableSupplierPurchaseRequest');
        tableGrn = document.getElementById('tableGRN');

    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

// Supplier selection change handler
selectSupplier.addEventListener('change', () => {
    let selectedSupplier = selectValueHandler(selectSupplier);

    grns = getServiceAjaxRequest(`/grn/allgrnbysupplier/${selectedSupplier.id}`)
    supplierQuotations = getServiceAjaxRequest(`/supplierquotation/findBySupplier/${selectedSupplier.id}`)
    purchaseRequests = getServiceAjaxRequest(`/purchaserequest/bysuppplier/${selectedSupplier.id}`)

    console.log("data", grns)
    console.log("data", purchaseRequests)
    console.log("data", supplierQuotations)

    const displaySupplierQuotatinList = [
        { dataType: 'text', propertyName: 'quotationid' },
        { dataType: 'text', propertyName: 'validdate' },
        { dataType: 'function', propertyName: geQRId },
    ];

    const displayPurchaseRequestList = [
        { dataType: 'text', propertyName: 'requestcode' },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'text', propertyName: 'requireddate' },
        { dataType: 'function', propertyName: getPRStatus },
    ]

    const displayGrnList = [
        { dataType: 'text', propertyName: 'grncode' },
        { dataType: 'text', propertyName: 'reciveddate' },
        { dataType: 'text', propertyName: 'finalamount' },
        { dataType: 'function', propertyName: getGrntatus },
    ]

    //call fillDataIntoTable Function
    //(tableid,dataArray variable name, displayproperty list, refill function,button)
    showOnlyTable(tableSupplierQuotation, supplierQuotations, displaySupplierQuotatinList)
    showOnlyTable(tablePrequest, purchaseRequests, displayPurchaseRequestList)
    showOnlyTable(tableGrn, grns, displayGrnList)

    // DESTROY EXISTING CHARTS BEFORE CREATING NEW ONES
    if (prtrendsChart) {
        prtrendsChart.destroy();
    }
    if (prStatusChart) {
        prStatusChart.destroy();
    }

    // Utility to get Month name from Date
    const getMonthName = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('default', { month: 'short' }); // "Jul", "Aug", etc.
    };

    // Group GRNs by month
    const grnCountsByMonth = {};
    grns.forEach(grn => {
        const month = getMonthName(grn.reciveddate);
        grnCountsByMonth[month] = (grnCountsByMonth[month] || 0) + 1;
    });

    // Extract labels and data dynamically (sorted by month order if needed)
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = monthOrder.filter(m => grnCountsByMonth[m]); // Only months with data
    const data = labels.map(month => grnCountsByMonth[month]);

    // Create Chart (assign to global variable, not local)
    const purchaseTrends = document.getElementById('mySupplierChrt1').getContext('2d');
    prtrendsChart = new Chart(purchaseTrends, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Received GRNs',
                data: data,
                backgroundColor: 'hsla(157, 81.90%, 56.70%, 0.20)',
                borderColor: '#103D45',
                borderWidth: 2,
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

    // Process purchase request status data
    const prStatusCount = {};
    purchaseRequests.forEach(pr => {
        const status = pr.purchasestatus_id.name;
        prStatusCount[status] = (prStatusCount[status] || 0) + 1;
    })

    const statusLabels = ['Recived', 'Requested', 'Rejected', 'Deleted'];
    const statusData = statusLabels.map(status => prStatusCount[status] || 0);

    // Create pie chart (assign to global variable, not local)
    const prStatus = document.getElementById('mySupplierChrt2').getContext('2d');
    prStatusChart = new Chart(prStatus, {
        type: 'pie',
        data: {
            labels: statusLabels,
            datasets: [{
                label: 'Count',
                data: statusData,
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
    })
});

const getGrnStatus = (ob) => {
    return ob.grnstatus_id.name;
}

const geQRId = (ob) => {
    return ob.quotation_request_id.quotationrequestcode;
}

const getPRStatus = (ob) => {
    if (ob.purchasestatus_id.name == 'Recived') {
        return '<p class="common-status-available">' + ob.purchasestatus_id.name + '</p>';
    }

    if (ob.purchasestatus_id.name == 'Requested') {
        return '<p class="common-status-resign">' + ob.purchasestatus_id.name + '</p>'
    }

    if (ob.purchasestatus_id.name == 'Rejected') {
        return '<p class="common-status-reject">' + ob.purchasestatus_id.name + '</p>'
    }
    if (ob.purchasestatus_id.name == 'Deleted') {
        return '<p class="common-status-delete">' + ob.purchasestatus_id.name + '</p>'
    } else {
        return '<p class="common-status-other">' + ob.purchasestatus_id.name + '</p>'
    }
}

const getGrntatus = (ob) => {
    if (ob.grnstatus_id.name == 'Approved') {
        return '<p class="common-status-available">' + ob.grnstatus_id.name + '</p>';
    }

    if (ob.grnstatus_id.name == 'Pending Approval') {
        return '<p class="common-status-resign">' + ob.grnstatus_id.name + '</p>'
    }

    if (ob.grnstatus_id.name == 'Rejected') {
        return '<p class="common-status-reject">' + ob.grnstatus_id.name + '</p>'
    }
    if (ob.grnstatus_id.name == 'Deleted') {
        return '<p class="common-status-delete">' + ob.grnstatus_id.name + '</p>'
    } else {
        return '<p class="common-status-other">' + ob.grnstatus_id.name + '</p>'
    }
}