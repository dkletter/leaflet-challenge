// Store our API endpoint
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(url).then((data) => {
    makeFeatures(data.features);
});

// Define colors for markers and legend
function chooseColor(depth) {
    if (depth >= 90) return "#ff0000";
    else if (depth >= 70) return "#fca35d";
    else if (depth >= 50) return "#fdb72a";
    else if (depth >= 30) return "#f7db11";
    else if (depth >= 10) return "#dcf400";
    else return "#a3f600";
}

function makeFeatures(earthquakeData) {
	// Define a function that we want to run once for each feature in the features array
    function onEachFeature(feature, layer) {
  		// Give each feature a popup that describes the place, time, magnitude, and depth of the earthquake
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><ul><li>${new Date(feature.properties.time)}</li><li>Magnitude: ${feature.properties.mag}</li><li>Depth: ${feature.geometry.coordinates[2]}</li></ul>`);
    }

    // Define a function to adjust the circle radius by its magnitude
    function circleRadius(magnitude) {
        return magnitude * 8;      
    }

    // Set the marker characteristics
    function geojsonMarkerOptions(features) {
        return {
            radius: circleRadius(parseInt(features.properties.mag)),
            fillColor: chooseColor(features.geometry.coordinates[2]),
            color: "#B0B5B3",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        };
    }

	// Create a GeoJSON layer that contains the features array on the earthquakeData object
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (features, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions(features));
        },
		// Run the onEachFeature function once for each piece of data in the array
        onEachFeature: onEachFeature
    });

	// Send our earthquakes layer to the createMap function
    makeMap(earthquakes);
}

function makeMap(earthquakes) {
    // Create the base layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Add a legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i] +1) + '"></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}
