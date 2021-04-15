"use-strict";

var wordOccurrence = {};


    d3.csv("https://raw.githubusercontent.com/Wrager02/d3-test/master/data/netflix_titles_v2.csv", function (d) {
    d.forEach(entry => {
        const regEx = /[^A-Za-z ]/g;
        let title = entry.title.replaceAll(regEx, "").toUpperCase();
        title.split(/\s+/).forEach(word => {

            wordOccurrence[word] = wordOccurrence[word] ? wordOccurrence[word] + 1 : 1;
            //wordOccurrence.set(word, wordOccurrence.get(word) ? wordOccurrence.get(word) + 1 : 1);
        })
    })
    })

console.log(wordOccurrence)
console.log(Array.from(wordOccurrence))

var values = [];

setTimeout(function () {
    values = Object.entries(wordOccurrence);
    values.filter(element => element[1] > 5)
    console.log(values);
     }, 1000);



setTimeout(function () {
    
// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#wordcloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout.cloud()
    .size([width, height])
    .words(values.map(function(d) { return {text: d[0], size:d[1]}; }))
    .padding(5)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
    svg
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) { return d.text; });
    
    toggleLoader();
}

}, 2000);
     



// List of words
var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

function toggleLoader() {
  var x = document.getElementById("loader");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
