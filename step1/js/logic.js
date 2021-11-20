// Store our API endpoint
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url).then((data) => {
    makeFeatures(data.features);
})

function makeFeatures(earthquakeData) {
	// Define a function that we want to run once for each feature in the features array.
    function onEachFeature(feature, layer) {
  		// Give each feature a popup that describes the place and time of the earthquake.
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<br>Magnitude ${feature.properties.mag}</p>`);
    }

	// Create a GeoJSON layer that contains the features array on the earthquakeData object.
    var earthquakes = L.geoJSON(earthquakeData, {
		// Run the onEachFeature function once for each piece of data in the array.
        onEachFeature: onEachFeature
    });

	// Send our earthquakes layer to the createMap function/
    makeMap(earthquakes);
}

function makeMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };






    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [37.7749, -122.4194],
        zoom: 5,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
