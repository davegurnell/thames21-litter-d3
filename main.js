
function lng(result) {
  return result.location._wgs84[0];
}

function lat(result) {
  return result.location._wgs84[1];
}

var lngMin = -0.236;
var lngMax = -0.234;
var latMin = 51.48875;
var latMax = 51.48900;

var json =
  data.results.filter(function(result) {
    return result.location != null
        && lng(result) >= lngMin
        && lng(result) <= lngMax
        && lat(result) >= latMin
        && lat(result) <= latMax;
  });

var text =
  JSON.stringify([ json.length, json ], null, 2);

$("#root").text(text);

var rectDemo = d3.select("#canvas").
  append("svg:svg").
  attr("width", 400).
  attr("height", 300);

rectDemo.append("svg:rect").
  attr("x", 100).
  attr("y", 100).
  attr("height", 100).
  attr("width", 200);
