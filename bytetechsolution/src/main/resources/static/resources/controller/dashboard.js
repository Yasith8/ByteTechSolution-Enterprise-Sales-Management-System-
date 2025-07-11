const salesTrendCtx = document.getElementById('mainChart').getContext('2d');
const salesTrendChart = new Chart(salesTrendCtx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Sales ($)',
            data: [120, 200, 150, 300, 250, 400, 350],
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

window.addEventListener('load', () => {
    const loggeduser = getServiceAjaxRequest('/loggeduserdetails');
    console.log(loggeduser);

    const greeting = getGreetingByTime();
    dashboardGreetingMsg.textContent = `Hi ${loggeduser.username}, ${greeting} 👋`;


    const loggeduserrole = getServiceAjaxRequest(`/role/rolebyusername/${loggeduser.username}`);
    console.log("loggeduser", loggeduserrole)

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