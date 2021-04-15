// Define width and height of svg
let width = 1050,
    height = 675;

// Append new svg to #map
let mapSvg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")

// Create new geo projection
let path = d3.geoPath();
let projection = d3.geoMercator()
    .scale(150)
    .center([0, 50])
    .translate([width / 2, height / 2]);

// Prepare data variables
let countryOccurrence = d3.map();
let wordOccurrence = d3.map();


// Define color scale for map
let colorScale = d3.scaleThreshold()
    .domain([0, 1, 20, 50, 100, 1000])
    .range(d3.schemeReds[7]);

// Load data
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/Wrager02/d3-data-visualisation-netflix/master/data/netflix_titles_v2.csv", function (d) {
        d.country.split(", ").forEach(country => {
            countryOccurrence.set(country, countryOccurrence.get(country) ? countryOccurrence.get(country) + 1 : 1);
        })

        d.title.split(' ').forEach(word => {
            wordOccurrence.set(word, wordOccurrence.get(word) ? wordOccurrence.get(word) + 1 : 1);
        })
    })
    .await(drawMap);

function drawMap(error, topo) {
    let tooltip = d3.select("#map")
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

    let legend = d3.legendColor()
        .scale(colorScale)
        .labels(["No data", "0", "1+", "20+", "50+", "100+", "1000+"]);

    mapSvg.append("g").call(legend)

    let mouseover = function(d) {
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

    let mousemove = function() {
        tooltip
            .style("left", (d3.mouse(this)[0]+30) + "px")
            .style("top", (d3.mouse(this)[1]-15) + "px")
    }

    let mouseleave = function() {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .transition()
            .duration(100)
            .style("stroke", "transparent")
    }

    mapSvg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", function (d) {
            d.total = countryOccurrence.get(d.properties.name) || 0;
            return colorScale(d.total);
        })
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
    ;
}

console.log(wordOccurrence.values())

let wordCloudSvg = d3.select("#word-cloud")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var layout = d3.layout.cloud()
    .size([width, height])
    .words(wordOccurrence)
    .padding(10)
    .fontSize(60)
    .on("end", drawWordCloud);
layout.start();

function drawWordCloud(words) {
    wordCloudSvg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}