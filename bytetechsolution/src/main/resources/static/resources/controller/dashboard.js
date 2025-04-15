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