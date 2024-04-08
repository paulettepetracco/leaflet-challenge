
// Create the CreateMap Function
function createMap (markers){
    // Create a tileLayer
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Create a baseMaps Object to hold the lightmap layer
    let baseMaps = {
        "Street Map": streetmap
    };

    // Create an overlayMap object to hold the earthquake markers layer
    let overlayMaps = {
        "Earthquake Markers": markers
    };

  // Create the map object with options.
    let map = L.map("map-id", {
        center: [34.209913, -118.781210],
        zoom: 5,
        layers:[streetmap,markers]
    });
// Create the map legend 
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<div><div class="legend-color" style="background: #B1F14B"></div><span>- 10-10 </span><br></div>';
    div.innerHTML += '<div><div class="legend-color" style="background: #E1F14D"></div><span>10-30 </span><br></div>';
    div.innerHTML += '<div><div class="legend-color" style="background: #F7B94A""></div><span>30-50 </span><br></div>';
    div.innerHTML += '<div><div class="legend-color" style="background: #F5A669"></div><span>50-70 </span><br></div>';
    div.innerHTML += '<div><div class="legend-color" style="background: #F36B69"></div><span>70-90 </span><br></div>';
    div.innerHTML += '<div><div class="legend-color" style="background: #FF3300"></div><span>90+ </span><br></div>';
        return div;
};

legend.addTo(map);
}

// Create the color palette for the data points
function chooseColor(depth) {
    if (depth < 10) return "#B1F14B";
    else if (depth < 30) return "#E1F14D";
    else if (depth < 50) return "#F7B94A"; 	
    else if (depth < 70) return "#F5A669"; 
    else if (depth < 90) return "#F36B69";
    else return "#FF3300";
}


// Create the createMarkers function
function createMarkers (response) {

    // Loop through response
    let earthquake_features = response.features;

    // Get coordinates from data for each earthquake
    let earthquakeMarkers = earthquake_features.map((feature)=>{

        // Return the coordinates as an array
        let circleColor = chooseColor(feature.geometry.coordinates[2]);

        // Return the markers for the coordinates
        return L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], 
            {
                fillOpacity:feature.properties.mag,
                radius:feature.properties.mag*5,
                stroke:false,
                color: circleColor
            })
            .bindPopup("<h3>" + feature.properties.place + "<h3><h3>Magnitude: " + feature.properties.mag + "</h3>")
    });

    // perform the API call to the Earthquake API to get the earthquake information
    createMap(L.layerGroup(earthquakeMarkers));    
}

// Bring back the geoJSON data with API call
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(createMarkers);
