// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([0, 1, 10, 20, 50, 100])
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
        });
}