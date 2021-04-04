// The svg
// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height");

var width = 700,
    height = 450;

var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(100)
    .center([0, 50])
    .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([0, 1, 20, 50, 100, 1000])
    .range(d3.schemeBlues[7]);

// Load external data and boot
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    // .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function (d) {
    .defer(d3.csv, "https://raw.githubusercontent.com/Wrager02/d3-test/master/data/netflix_titles_v2.csv", function (d) {
        d.country.split(", ").forEach(country => {
            data.set(country, data.get(country) ? data.get(country) + 1 : 1);
        })
    })
    .await(ready);

function ready(error, topo) {
    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function(d) {
        tooltip
            .html(d.properties.name + ": " + d.total)
            .style("opacity", 1)
            .style("position", "absolute")
            .style("z-index", 100)
            .style("left", (d3.mouse(this)[0]+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    var mousemove = function(d) {
        tooltip
            .style("left", (d3.mouse(this)[0]+30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
        tooltip
            // .transition()
            // .duration(200)
            .style("opacity", 0)
    }

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            // if (typeof data.get(d.properties.name) === "undefined") {
                // console.log(d.properties.name)
            // }
            d.total = data.get(d.properties.name) || 0;
            console.log(d.properties.name + ": " + d.total)
            return colorScale(d.total);
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
    ;
}