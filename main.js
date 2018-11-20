
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

var surveys =
  rawData.results
    .filter(function(result) {
      return result.location != null
        && lng(result) >= lngMin
        && lng(result) <= lngMax
        && lat(result) >= latMin
        && lat(result) <= latMax;
    })
    .sort(function(a, b) {
      return lng(a) - lng(b);
    });

$("#root").text(JSON.stringify(surveys, null, 2));

var canvas = d3.select("#canvas").
  append("svg:svg").
  attr("width", 400).
  attr("height", 300);

canvas
  .selectAll("g")
  .data(function() {
    console.log('AAAA', surveys);
    return surveys;
  })
  .selectAll("circle")
  .data(function(survey, i) {
    console.log('BBBB', survey, i);
    return survey.quadrats;
  })
  .enter()
    .append("circle")
    .attr("cx", function(d, i, j) { return 50 + 50 * i; })
    .attr("cy", function(d, i, j) { return 50 + 50 * j; })
    .attr("r", 2.5);
