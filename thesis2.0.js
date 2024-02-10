let rainfallData = [];
let chart;

// Load data from local storage on page load
window.onload = function () {
    const storedData = localStorage.getItem('rainfallData');
    if (storedData) {
        rainfallData = JSON.parse(storedData);
        updateHistory();
        updateChart();
    }
};

function addRainfall() {
    const input = document.getElementById('rainfallInput');
    const municipalityInput = document.getElementById('municipalityInput');

    const rainfallValue = parseFloat(input.value);

    if (!isNaN(rainfallValue)) {
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString();

        // Check if it's a new day
        if (rainfallData.length > 0 && rainfallData[rainfallData.length - 1].date !== dateString) {
            // If it's a new day, reset the rainfallData array
            rainfallData = [];
        }

        const newData = {
            date: dateString,
            rainfall: rainfallValue,
            municipality: municipalityInput.value
        };

        rainfallData.push(newData);
        input.value = '';
        municipalityInput.value = '';

        // Save data to local storage
        localStorage.setItem('rainfallData', JSON.stringify(rainfallData));

        updateHistory();
        updateChart();
    } else {
        alert('Please enter a valid rainfall value.');
    }
}

function removeLastData() {
    if (rainfallData.length > 0) {
        rainfallData.pop(); // Remove the last element
        localStorage.setItem('rainfallData', JSON.stringify(rainfallData));
        updateHistory();
        updateChart();
    } else {
        alert('No data to remove.');
    }
}

function updateHistory() {
    const historyTable = document.getElementById('historyTable');
    const dateSelector = document.getElementById('dateSelectorHistory');

    // Get the selected date
    const selectedDate = new Date(dateSelector.value);
    const selectedDateString = selectedDate.toLocaleDateString();

    // Filter data based on the selected date
    const filteredData = rainfallData.filter(data => data.date === selectedDateString);

    historyTable.innerHTML = '';

    filteredData.forEach(data => {
        const row = historyTable.insertRow();
        const dateCell = row.insertCell(0);
        const rainfallCell = row.insertCell(1);
        const municipalityCell = row.insertCell(2);

        dateCell.textContent = data.date;
        rainfallCell.textContent = data.rainfall;
        municipalityCell.textContent = data.municipality;
    });
}

function updateChart() {
    // Get the canvas element
    const ctx = document.getElementById('rainfallChart').getContext('2d');

    // If a chart instance exists, destroy it to update with new data
    if (chart) {
        chart.destroy();
    }

    // Create a new Chart.js line chart
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rainfallData.map(data => `${data.date} - ${data.municipality}`),
            datasets: [{
                label: 'Rainfall (mm)',
                borderColor: 'rgb(75, 192, 192)',
                data: rainfallData.map(data => data.rainfall),
                fill: false
            }]
        },
        options: {
            scales: {
                x: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });

    // Show the chart after it's created
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.classList.remove('hidden');
}

function saveGraph() {
    const chartCanvas = document.getElementById('rainfallChart');
    const chartBase64 = chartCanvas.toDataURL('image/png');
    const currentDate = new Date().toLocaleDateString();

    // Save the graph image and date
    const savedGraphs = JSON.parse(localStorage.getItem('savedGraphs')) || [];
    savedGraphs.push({ date: currentDate, graph: chartBase64 });
    localStorage.setItem('savedGraphs', JSON.stringify(savedGraphs));

    // Update the Graph History section
    loadGraphHistory();
}

function loadGraphHistory() {
    const graphHistoryDateSelector = document.getElementById('graphHistoryDateSelector');
    const selectedDate = new Date(graphHistoryDateSelector.value);
    const selectedDateString = selectedDate.toLocaleDateString();

    const graphHistoryContainer = document.getElementById('graphHistoryContainer');
    graphHistoryContainer.innerHTML = '';

    const savedGraphs = JSON.parse(localStorage.getItem('savedGraphs')) || [];

    // Find the saved graph for the selected date
    const selectedGraph = savedGraphs.find(graph => graph.date === selectedDateString);

    if (selectedGraph) {
        // Display the saved graph
        const graphContainer = document.createElement('div');
        graphContainer.classList.add('graph-history-item');

        const graphTitle = document.createElement('h3');
        graphTitle.textContent = selectedGraph.date;

        const graphImage = document.createElement('img');
        graphImage.src = selectedGraph.graph;

        graphContainer.appendChild(graphTitle);
        graphContainer.appendChild(graphImage);

        graphHistoryContainer.appendChild(graphContainer);
    } else {
        // Display "No Data" if there is no saved graph for the selected date
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'No Data';
        graphHistoryContainer.appendChild(noDataMessage);
    }
}

function showContent(contentId) {
    const sections = ['homeContent', 'rainfallAnalyzerContent', 'historyContent', 'graphHistoryContent'];

    sections.forEach(section => {
        const element = document.getElementById(section);
        if (section === contentId) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

// Update clock and date every second
function updateClockDate() {
    const clockDateElement = document.getElementById('clockDate');
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    const currentDateTime = new Date().toLocaleString('en-US', options);
    clockDateElement.textContent = currentDateTime;
}

// Initial call to set the clock and date
updateClockDate();

// Update clock and date every second
setInterval(updateClockDate, 1000);
