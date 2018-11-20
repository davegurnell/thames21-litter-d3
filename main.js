
function lng(result) {
  return result.location._wgs84[0];
}

function lat(result) {
  return result.location._wgs84[1];
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
      return result.location != null
        && lng(result) >= lngMin
        && lng(result) <= lngMax
        && lat(result) >= latMin
        && lat(result) <= latMax;
    })
    .sort(function(a, b) {
      return lng(b) - lng(a);
    });
}

function display(canvas, data) {
  $("#root").text(JSON.stringify(data, null, 2));

  canvas
    .selectAll("g")
      .data(data)
      .enter()
        .append("g")
        .attr("transform", function(d, i) {
          return "translate(" + (spacing + spacing * i) + ")";
        })
        .selectAll("circle")
          .data(function(survey) { return survey.quadrats; })
          .enter()
            .append("circle")
            .attr("cx", function(quadrat, j) { return 0; })
            .attr("cy", function(quadrat, j) { return spacing + spacing * j; })
            .attr("r",  function(quadrat) {
              return quantity(quadrat, litterItem);
            });
}

var canvas = d3.select("#canvas")
  .append("svg:svg")
  .attr("width", 500)
  .attr("height", 800);

display(canvas, clean(rawData));
