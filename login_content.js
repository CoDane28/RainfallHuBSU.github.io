// document.addEventListener('DOMContentLoaded', function () {
//   console.log('DOMContentLoaded event fired');

//   // Check if the map container exists on the page
//   var map = L.map('map').setView([13.75, 120.95], 10); // Set the initial view to cover Batangas
//   var batangasBounds = L.latLngBounds([13.2, 119.5], [14.2, 122.0]); // Adjust the bounds to cover a larger area for the entire province
//   map.setMaxBounds(batangasBounds);
//   map.on('drag', function () {
//     map.panInsideBounds(batangasBounds, { animate: false });
//   });
//   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
//   var marker;
  
//   // Event listener for clicking on the map
//   map.on('click', function (e) {
//     // Remove the existing marker if present
//     if (marker) {
//       map.removeLayer(marker);
//     }
  
//     // Add a new marker at the clicked location
//     marker = L.marker(e.latlng).addTo(map);
  
//     // Update latitude and longitude input fields
//     document.getElementById('latitudeInput').value = e.latlng.lat.toFixed(6);
//     document.getElementById('longitudeInput').value = e.latlng.lng.toFixed(6);
  
//     // Reverse geocoding to get the location name
//     reverseGeocode(e.latlng);
//   });
  
//   function reverseGeocode(latlng) {
//     // Use a geocoding service to get location details
//     // Here you might want to use a specific geocoding API based on your needs
//     // For simplicity, this example uses the OpenStreetMap Nominatim API
//     fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
//       .then(response => response.json())
//       .then(data => {
//         // Update the search location input field with the location name
//         document.getElementById('locationSearchInput').value = data.display_name;
//       })
//       .catch(error => console.error('Error fetching location details:', error));
//   }
  
//   // Add this part to the existing script section
//   document.getElementById('searchLocation').addEventListener('click', function () {
//     // Check if a marker is present
//     if (marker) {
//       // Zoom in to the marker's location
//       map.setView(marker.getLatLng(), 15); // You can adjust the zoom level (15 is just an example)
//     } else {
//       alert('Please pin a location first.');
//     }
//   });

//   var addButton = document.getElementById('addBtn');
//   if (addButton) {
//       addButton.addEventListener('click', addData);
//   }

//   function addData() {
//       var rainfallData = document.getElementById('rainfallInput').value;
//       var locationData = document.getElementById('locationSearchInput').value;

//       if (!rainfallData || !locationData) {
//           alert('Please fill in all input fields before adding data.');
//           return;
//       }

//       console.log("Rainfall Data added:", { rainfall: rainfallData, location: locationData });

//       saveDataToLocalStorage(rainfallData, locationData);
//       dispatchRainfallDataEvent({ location: locationData, rainfall: parseInt(rainfallData) });
//   }

//   function saveDataToLocalStorage(rainfallData, locationData) {
//       var data = {
//           rainfall: rainfallData,
//           location: locationData
//       };

//       localStorage.setItem('userData', JSON.stringify(data));
//   }

//   // Function to dispatch rainfall data to the main chart
//   function dispatchRainfallDataEvent(rainfallData) {
//       var event = new CustomEvent('updateChart', { detail: [rainfallData] });
//       document.dispatchEvent(event);
//   }

// });
