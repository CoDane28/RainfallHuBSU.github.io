/*------- MAIN -------*/
// Function to show only the dashboard content

function showDashboardContent() {
  // Hide all content sections except dashboardContent
  contentSections.forEach(section => {
    if (section.id === 'dashboardContent') {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });

  // Scroll to the top of the middle container
  const middleContainer = document.querySelector('.middle');
  if (middleContainer) {
    middleContainer.scrollTop = 0;
  }
}

// Show only dashboard content when page reloads
window.addEventListener('load', showDashboardContent);

// Additional JavaScript code...
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const contentSections = document.querySelectorAll('.content-section');

sidebarLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    // Hide all content sections
    contentSections.forEach(section => {
      section.style.display = 'none';
    });

    // Get the target content section
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    // Display the target content section
    if (targetSection) {
      targetSection.style.display = 'block';
    }

    // Scroll to the top of the middle container
    const middleContainer = document.querySelector('.middle');
    if (middleContainer) {
      middleContainer.scrollTop = 0;
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  var sidebarLinks = document.querySelectorAll(".sidebar-link");
  sidebarLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      sidebarLinks.forEach(function (l) {
        l.classList.remove("active");
      });
      link.classList.add("active");
    });
  });
});

/*------- DASHBOARD CONTENT -------*/
  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');
    // Check if the map container exists on the page
    var map = L.map('map').setView([13.75, 120.95], 10); // Set the initial view to cover Batangas
    var batangasBounds = L.latLngBounds([13.2, 119.5], [14.2, 122.0]); // Adjust the bounds to cover a larger area for the entire province
    map.setMaxBounds(batangasBounds);
    map.on('drag', function () {
      map.panInsideBounds(batangasBounds, { animate: false });
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    var marker;
    
    // Event listener for clicking on the map
    map.on('click', function (e) {
      // Remove the existing marker if present
      if (marker) {
        map.removeLayer(marker);
      }
    
      // Add a new marker at the clicked location
      marker = L.marker(e.latlng).addTo(map);
    
      // Update latitude and longitude input fields
      document.getElementById('latitudeInput').value = e.latlng.lat.toFixed(6);
      document.getElementById('longitudeInput').value = e.latlng.lng.toFixed(6);
    
      // Reverse geocoding to get the location name
      reverseGeocode(e.latlng);
    
    
    function reverseGeocode(latlng) {
      // Use a geocoding service to get location details
      // Here you might want to use a specific geocoding API based on your needs
      // For simplicity, this example uses the OpenStreetMap Nominatim API
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
        .then(response => response.json())
        .then(data => {
          // Update the search location input field with the location name
          document.getElementById('locationSearchInput').value = data.display_name;
        })
        .catch(error => console.error('Error fetching location details:', error));
    }
    
    // Add this part to the existing script section
    document.getElementById('searchLocation').addEventListener('click', function () {
      // Check if a marker is present
      if (marker) {
        // Zoom in to the marker's location
        map.setView(marker.getLatLng(), 15); // You can adjust the zoom level (15 is just an example)
      } else {
        alert('Please pin a location first.');
      }
    });
  });

    /*------- ADD BUTTON FUNCTION -------*/
  
    var addButton = document.getElementById('addBtn');
    if (addButton) {
        addButton.addEventListener('click', addData);
    }
    
    function addData() {
        var rainfallData = document.getElementById('rainfallInput').value;
        var locationData = document.getElementById('locationSearchInput').value;
        if (!rainfallData || !locationData) {
            alert('Please fill in all input fields before adding data.');
            return;
        }
       console.log('Rainfall Data Added:',{rainfall:rainfallData, location:locationData})

        saveDataToLocalStorage(rainfallData, locationData);
        
    }

    function saveDataToLocalStorage(rainfallData, locationData) {
      var allUserDataJSON = localStorage.getItem('allUserData');
      var allUserData = allUserDataJSON ? JSON.parse(allUserDataJSON) : [];
  
      var data = {
          rainfall: rainfallData,
          location: locationData
        
      };
  
      allUserData.push(data);
      localStorage.setItem('allUserData', JSON.stringify(allUserData));
  }
});

      document.addEventListener('DOMContentLoaded', function () {
      // Retrieve data from localStorage
       // Retrieve data from localStorage
      var allUserDataJSON = localStorage.getItem('allUserData');
  
      if (allUserDataJSON) {
        var allUserData = JSON.parse(allUserDataJSON);

      // Display the data in the main HTML
      updateMainContent(allUserData); // Pass the retrieved data to the updateMainContent function
      createChart(allUserData); // Pass the retrieved data to the createChart function
  }
});

// Function to update the main content with the latest rainfall and location data
    function updateMainContent(allUserData) {
    // Get the latest data
    var latestData = allUserData.length > 0 ? allUserData[allUserData.length - 1] : null;

    // Check if elements are found before updating content
    if (latestData) {
      // Update text content using innerHTML instead of innerText
      // This allows HTML tags to be rendered if needed
      document.getElementById('rainfallResultText').innerHTML = `${latestData.rainfall} mm`;
      Sdocument.getElementById('locationResultText').innerHTML = `${latestData.location}`;
  } else {
    console.log('No data found');
  }
}
/*------- CHART FUNCTION -------*/
    function createChart() {
      // Access the chart canvas element
      var chartCanvas = document.getElementById('chart');

      // Retrieve data from localStorage
      var allUserDataJSON = localStorage.getItem('allUserData');

      if (allUserDataJSON && window.Chart) {
          var allUserData = JSON.parse(allUserDataJSON);

          // Extract rainfall and location arrays from allUserData
          var rainfallDataArray = allUserData.map(entry => entry.rainfall);
          var locationDataArray = allUserData.map(entry => entry.location );
      
          // Create a chart using Chart.js
          var myChart = new Chart(chartCanvas, {
              type: 'line', // You can change the chart type based on your needs
              data: {
                  labels: locationDataArray, // X-axis labels
                  datasets: [{
                      label: 'Rainfall Data',
                      data: rainfallDataArray, // Y-axis data
                      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Bar color
                      borderColor: 'rgba(0, 0, 0, 1)', // Border color
                      borderWidth: 1 // Border width
                  }]
              },
              options: {
                  scales: {
                      x: {
                      display: false // Hide X-axis labels
                      },
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });

          return myChart; // Return the created chart
      }
    }

    document.addEventListener('DOMContentLoaded', function () {
        var myChart = createChart();
    });


/*------- RIGHT SECTION CONTENT -------*/
var dataListElement = document.getElementById('dataList');

function updateRightContainer() {
    var allUserDataJSON = localStorage.getItem('allUserData');
    var allUserData = allUserDataJSON ? JSON.parse(allUserDataJSON) : [];
 
    dataListElement.innerHTML = '';

    allUserData.forEach(function (userData) {
        var listItem = document.createElement('li');

        // Create and style Rainfall data point
        var rainfallPoint = document.createElement('div');
        rainfallPoint.textContent = `Rainfall : ${userData.rainfall}`;
        rainfallPoint.classList.add('dataPoint');
        listItem.appendChild(rainfallPoint);

        // Create and style Location data point
        var locationPoint = document.createElement('div');
        locationPoint.textContent = `Location: ${userData.location}`;
        locationPoint.classList.add('dataPoint');
        listItem.appendChild(locationPoint);

        dataListElement.appendChild(listItem);
    });
}

updateRightContainer();



/*------- BLOG CONTENT -------*/





