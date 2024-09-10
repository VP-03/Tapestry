// Initialize Leaflet map
var map = L.map('map').setView([20, 0], 2);  // Set initial location and zoom

// Add tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  opacity: 0.35
}).addTo(map);

// Load country GeoJSON data
fetch('/data/custom.geojson')  // Assuming you download and place the geoJSON file in the root directory
  .then(response => response.json())
  .then(data => {
    // Function to style each country based on your preference
    function style(feature) {
      return {
        fillColor: '#98e6c6', // Default color for countries
        weight: 1, // Border thickness
        opacity: 1,
        color: 'white', // Border color
        dashArray: '3',
        fillOpacity: 0.7 // Opacity of the fill color
      };
    }

    // Highlight the country when hovered over
    function highlightFeature(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });
    }

    // Reset highlight after hover ends
    function resetHighlight(e) {
      geojson.resetStyle(e.target);
    }

    // Function for on-click redirection and adding labels to specific countries
    function onEachFeature(feature, layer) {
      // Only show labels for United States and United Kingdom
      if (feature.properties.name === "United States of America" || feature.properties.name === "United Kingdom") {
        // Add a tooltip for these specific countries
        layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center', className: 'country-label' });
      }

      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: function (e) {
          // Redirect to specific page based on country
          if (feature.properties.name === "United States of America") {
            window.location.href = "/data/usa-events.html";
          } else if (feature.properties.name === "United Kingdom") {
            window.location.href = "/data/uk-events.html";
          }
          // Add more country cases here if needed
        }
      });
    }

    // Add geoJSON layer to map with custom style and event listeners
    var geojson = L.geoJson(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  });
