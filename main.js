
function lng(location) {
  return location._wgs84[0];
}

function lat(location) {
  return location._wgs84[1];
}

var lngMin = -0.236270;
var lngMax = -0.233588;
var latMin = 51.488654;
var latMax = 51.489636;

var spacing = 20;
var filename = "thames21_litter.json";
var litterItem = "sewageMixedWetWipesOrBabyWipes";

function quantity(quadrat, item) {
  return quadrat.collected
    .filter(function(coll) { return coll.item === item })
    .map(function(coll) { return Math.log(coll.quantity); })
    .reduce(function(a, b) { return a + b; }, 0);
}

function clean(data) {
  return data
    .results
    .filter(function(result) {
      return result.location != null;
        // && lng(result.location) >= lngMin
        // && lng(result.location) <= lngMax
        // && lat(result.location) >= latMin
        // && lat(result.location) <= latMax;
    })
    .sort(function(a, b) {
      return lng(b.location) - lng(a.location);
    });
}

function projectPoint(map) {
  return function(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  };
}

function display(canvas, data) {
  $("#root").text(JSON.stringify(data, null, 2));

  canvas
    .selectAll("g")
      .data(data)
      .enter()
        .append("g")
        .selectAll("path")
          .data(function(survey) {
            return survey.quadrats.map(function(quadrat) {
              return {
                quadrat: quadrat,
                location: survey.location
              };
            })
          })
          .enter()
            .append("path")
            .attr("transform", function(quadratAndLocation, j) {
              return "translate(0, " + (5 * j) + ")";
            })
            .style("fill", function(quadratAndLocation, j) {
              return "hsl(" + 10*j + ", 100%, 50%)";
            })
            .attr("d", function(quadratAndLocation, j) {
              var quadrat  = quadratAndLocation.quadrat;
              var location = quadratAndLocation.location;

              return path({
                type: "Point",
                coordinates: [
                  lng(location),
                  lat(location)
                ]
              }, quantity(quadrat, litterItem));
            });
}

var map = L.map('map')
  .setView([
    51.488822902622644,
    -0.22859930992126462
  ], 15)
  .addLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }));

var svg = d3.select(map.getPanes().overlayPane)
  .append("svg:svg")
  .attr("width", 500)
  .attr("height", 800);

var canvas = svg.append("g")
  .attr("class", "leaflet-zoom-hide")
  ;

var transform = d3
  .geoTransform({point: projectPoint(map) });

var path = d3.geoPath()
  // geometry and value are the same arguments
  // passed to path() below
  .pointRadius(function(geometry, value) {
    return 5 * Math.log(value);
  })
  .projection(transform);

display(canvas, clean(rawData));
