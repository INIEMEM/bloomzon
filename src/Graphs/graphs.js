
export const sellerChartData = {
  labels: ['Jan',
    'Feb',
    'Mar',
    'Apr',
  'May', 
'Jun'],
  datasets: [{
   
    data: [30000, 19000, 70000, 5000, 40000,10000 ],
    backgroundColor: 'rgba(65, 204, 199, 1)',
    borderColor: 'rgba(65, 204, 199, 1)',
    borderWidth: 1,
    borderRadius: 9
  }]
};

export const sellerChartOptions = {
  plugins: {
    legend: {
      display: false, // Hide the legend
    },
    tooltip: {
      callbacks: {
        label: (context) => `$${context.raw.toLocaleString()}`, // Add dollar sign
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Hide grid lines on x-axis
      },
    },
    y: {
      grid: {
        color: '#e5e5e5', // Light grey grid lines
        drawBorder: false,
      },
      ticks: {
        callback: (value) => `$${value / 1000}K`, // Format ticks as "$10K"
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false, // Allow height customization
};

export const Elitedata = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Subscriptions',
      data: [15000, 18000, 22000, 25000, 28000, 30000],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Videos',
      data: [10000, 12000, 15000, 18000, 20000, 22000],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    },
    {
      label: 'Music',
      data: [8000, 9000, 11000, 13000, 14000, 16000],
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
    },
    {
      label: 'Podcast',
      data: [5000, 6000, 7000, 8000, 9000, 10000],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
    {
      label: 'Books',
      data: [3000, 3500, 4000, 4500, 5000, 5500],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
    },
  ],
};

export const Eliteoptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Elite Services Revenue by Month',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};