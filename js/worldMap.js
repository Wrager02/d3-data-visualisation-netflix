var width = 1050,
    height = 675;

var svg = d3.select("#world-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(150)
    .center([0, 50])
    .translate([width / 2, height / 2]);

var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([0, 1, 20, 50, 100, 1000])
    .range(d3.schemeReds[7]);

d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/Wrager02/d3-test/master/data/netflix_titles_v2.csv", function (d) {
        d.country.split(", ").forEach(country => {
            data.set(country, data.get(country) ? data.get(country) + 1 : 1);
        })
    })
    .await(drawWorldMap);

function drawWorldMap(error, topo) {
    var tooltip = d3.select("#world-map")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("position", "absolute")
        .style("z-index", 100)

    var legend = d3.legendColor()
        .scale(colorScale)
        .labels(["Keine Daten", "0", "1+", "20+", "50+", "100+", "1000+"]);

    svg.append("g").call(legend)

    var mouseover = function(d) {
        tooltip
            .html(d.properties.name + ": " + d.total)
            .style("opacity", 1)
            .style("left", (d3.mouse(this)[0]+30) + "px")
            .style("top", (d3.mouse(this)[1]-15) + "px")
        d3.select(this)
            .transition()
            .duration(100)
            .style("stroke", "black")
    }

    var mousemove = function(d) {
        tooltip
            .style("left", (d3.mouse(this)[0]+30) + "px")
            .style("top", (d3.mouse(this)[1]-15) + "px")
    }

    var mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .transition()
            .duration(100)
            .style("stroke", "transparent")
    }

    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", function (d) {
            d.total = data.get(d.properties.name) || 0;
            return colorScale(d.total);
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
    ;
}



