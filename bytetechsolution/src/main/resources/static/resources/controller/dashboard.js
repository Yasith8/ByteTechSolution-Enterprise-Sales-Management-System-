window.addEventListener('load', () => {
    const loggeduser = getServiceAjaxRequest('/loggeduserdetails');
    console.log(loggeduser);

    const greeting = getGreetingByTime();
    dashboardGreetingMsg.textContent = `Hi ${loggeduser.username}, ${greeting} 👋`;


    const loggeduserrole = getServiceAjaxRequest(`/role/rolebyusername/${loggeduser.username}`);
    console.log("loggeduser", loggeduserrole)

    const last30CompletedOrders = getServiceAjaxRequest('/report/getlast30daycompletedorders')
    const last30PendingOrders = getServiceAjaxRequest('/report/getlast30daypendingorders')
    const TotalSales = getServiceAjaxRequest('/report/salesbythirtydays')
    const last30totalCustomers = getServiceAjaxRequest('/report/totalcustomer')

    console.log("1", last30CompletedOrders)
    console.log("2", last30PendingOrders)
    console.log("3", last30totalCustomers)
    console.log("4", TotalSales)

    statCardOneMainContent.textContent = last30CompletedOrders.length
    statCardTwoMainContent.textContent = last30PendingOrders.length;
    statCardThreeMainContent.textContent = last30totalCustomers;
    statCardFourMainContent.textContent = `Rs. ${TotalSales[0]}`

    last30CompletedOrders.length

    if (loggeduserrole[0].name == "Manager") {
        ManagerDashboardSection1.classList.remove('elementHide')
        ManagerDashboardSection2.classList.remove('elementHide')
        otherusers.classList.add('elementHide')


        btnQuotationRequest.classList.add('elementHide')
        btnSupplierQuotation.classList.add('elementHide')
        btnSupplier.classList.add('elementHide')
        btnSupplierPayment.classList.add('elementHide')
        btnPurchaseRequest.classList.add('elementHide')
        btnGoodsReceivedNote.classList.add('elementHide')
        btnOrder.classList.add('elementHide')
        btnPreOrder.classList.add('elementHide')
        btnCustomerPayment.classList.add('elementHide')
        btnCustomer.classList.add('elementHide')
    }
    if (loggeduserrole[0].name == "Cashier") {
        ManagerDashboardSection1.classList.add('elementHide')
        ManagerDashboardSection1.classList.add('elementHide')
        ManagerDashboardSection2.classList.add('elementHide')
        otherusers.classList.remove('elementHide')


        btnQuotationRequest.classList.add('elementHide')
        btnSupplierQuotation.classList.add('elementHide')
        btnSupplier.classList.add('elementHide')
        btnSupplierPayment.classList.add('elementHide')
        btnPurchaseRequest.classList.add('elementHide')
        btnGoodsReceivedNote.classList.add('elementHide')
        btnOrder.classList.remove('elementHide')
        btnPreOrder.classList.remove('elementHide')
        btnCustomerPayment.classList.remove('elementHide')
        btnCustomer.classList.remove('elementHide')
    }
    if (loggeduserrole[0].name == "Assistant Manager") {
        ManagerDashboardSection1.classList.add('elementHide')
        ManagerDashboardSection2.classList.add('elementHide')
        otherusers.classList.remove('elementHide')

        btnQuotationRequest.classList.add('elementHide')
        btnSupplierQuotation.classList.add('elementHide')
        btnSupplier.classList.remove('elementHide')
        btnSupplierPayment.classList.add('elementHide')
        btnPurchaseRequest.classList.add('elementHide')
        btnGoodsReceivedNote.classList.add('elementHide')
        btnOrder.classList.remove('elementHide')
        btnPreOrder.classList.remove('elementHide')
        btnCustomerPayment.classList.remove('elementHide')
        btnCustomer.classList.remove('elementHide')
    }
    if (loggeduserrole[0].name == "Stock Manager") {
        ManagerDashboardSection1.classList.add('elementHide')
        ManagerDashboardSection2.classList.add('elementHide')
        otherusers.classList.remove('elementHide')

        btnQuotationRequest.classList.remove('elementHide')
        btnSupplierQuotation.classList.remove('elementHide')
        btnSupplier.classList.add('elementHide')
        btnSupplierPayment.classList.remove('elementHide')
        btnPurchaseRequest.classList.remove('elementHide')
        btnGoodsReceivedNote.classList.remove('elementHide')
        btnOrder.classList.add('elementHide')
        btnPreOrder.classList.add('elementHide')
        btnCustomerPayment.classList.add('elementHide')
        btnCustomer.classList.add('elementHide')
    }
    if (loggeduserrole[0].name == "Store Assistant") {
        ManagerDashboardSection1.classList.add('elementHide')
        ManagerDashboardSection2.classList.add('elementHide')
        otherusers.classList.remove('elementHide')

        btnQuotationRequest.classList.add('elementHide')
        btnSupplierQuotation.classList.add('elementHide')
        btnSupplier.classList.add('elementHide')
        btnSupplierPayment.classList.remove('elementHide')
        btnPurchaseRequest.classList.remove('elementHide')
        btnGoodsReceivedNote.classList.remove('elementHide')
        btnOrder.classList.add('elementHide')
        btnPreOrder.classList.add('elementHide')
        btnCustomerPayment.classList.add('elementHide')
        btnCustomer.classList.add('elementHide')
    }

    let prs = getServiceAjaxRequest('/purchaserequest/alldata');
    prs = prs.slice(0, 5);
    const displayList = [
        { dataType: 'text', propertyName: 'requestcode' },
        { dataType: 'function', propertyName: getSupplier },
        { dataType: 'text', propertyName: 'totalamount' },
        { dataType: 'function', propertyName: getPRStatus },
    ]
    showOnlyTable(dashboardTable, prs, displayList)

    let lastSevenDaysSales = getServiceAjaxRequest('/report/lastsevendayssales');
    console.groupEnd("lassss", lastSevenDaysSales)
    let ReportDataList = new Array();
    let label = new Array();
    let data = new Array();

    for (const index in lastSevenDaysSales) {
        let object = new Object();
        object.date = lastSevenDaysSales[index][0];
        object.count = lastSevenDaysSales[index][1];
        ReportDataList.push(object)

        label.push(lastSevenDaysSales[index][0])
        data.push(lastSevenDaysSales[index][1])
    }



    const salesTrendCtx = document.getElementById('mainChart').getContext('2d');
    if (Chart.getChart("mainChart") != undefined)
        Chart.getChart("mainChart").destroy();
    new Chart(salesTrendCtx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Sales (Rs)',
                data: data,
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
                        stepSize: 50
                    }
                }
            }
        }
    });




});

/**
 * Returns a greeting based on the current hour.
 */
function getGreetingByTime() {
    const now = new Date();
    const hour = now.getHours(); // 0–23

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "Good Evening";
    } else {
        return "Good Night";
    }
}


const getSupplier = (ob) => {
    return ob.supplier_id.name;
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