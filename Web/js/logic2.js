// Creating map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Assemble API query URL
var url = baseURL;

// Grab the data with d3
d3.json(url, function(response) {
    
  // Loop through data
  for (var i = 0; i < response.features.length; i++) {

    var location = response.features[i].geometry;
    var magnitude = response.features[i].properties.mag * 15000;

    if (magnitude > 50000) {
        var color_val = 'purple';
    } else if (magnitude < 50000 && magnitude > 30000) {
        var color_val = 'red';
    } else if (magnitude < 30000 && magnitude < 10000) {
        var color_val = 'yellow';
    } else if (magnitude < 10000){
        var color_val = 'green'; 
    };
    
    var circle = new L.circle([location.coordinates[1], location.coordinates[0]], 
        {radius: magnitude, 
        color: color_val,
        stroke: color_val,
        opacity: .7,
        }
    );

    circle.addTo(myMap);

    };


  // Add legend (don't forget to add the CSS from index.html)
  var legend = L.control({ position: 'bottomright' })
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = ['1-2','2-3','3-4','4-5','5+']
    var colors = ['green','yellow','orange','red','purple']
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  legend.addTo(myMap);

});
