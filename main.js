
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
  attr("width", 500).
  attr("height", 800);

var SPACING = 20;
var litterItem = "sewageMixedWetWipesOrBabyWipes";

canvas
  .selectAll("g")
    .data(surveys)
    .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(" + (SPACING + SPACING * i) + ")";
      })
      .selectAll("circle")
        .data(function(survey) { return survey.quadrats; })
        .enter()
          .append("circle")
          .attr("cx", function(quadrat, j) { return 0; })
          .attr("cy", function(quadrat, j) { return SPACING + SPACING * j; })
          .attr("r",  function(quadrat) {
            return quadrat.collected
              .filter(function(coll) { return coll.item === litterItem })
              .map(function(coll) { return Math.log(coll.quantity); })
              .reduce(function(a, b) { return a + b; }, 0);
          });
