d3.csv("Traffic_Accidents.csv").then(function(data) {
  // Group data by Collision Type Description and City
  var nestedData = d3.nest()
    .key(function(d) { return d["Collision Type Description"]; })
    .key(function(d) { return d["City"]; })
    .rollup(function(leaves) { return leaves.length; })
    .entries(data);

  // Flatten nested data
  var flatData = [];
  nestedData.forEach(function(d) {
    d.values.forEach(function(v) {
      flatData.push({
        collisionType: d.key,
        city: v.key,
        count: v.value
      });
    });
  });

  // Set up dimensions
  var width = 1600;
  var height = 400;
  var margin = {top: 20, right: 20, bottom: 30, left: 40};

  // Create SVG
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set up scales
  var x = d3.scaleBand()
    .domain(flatData.map(function(d) { return d.city; }))
    .range([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(flatData, function(d) { return d.count; })])
    .nice()
    .range([height, 0]);

  var z = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(flatData.map(function(d) { return d.collisionType; }));

  // Draw bars
  svg.selectAll(".bar")
    .data(flatData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.city); })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", function(d) { return z(d.collisionType); });

  // Add labels
  svg.selectAll(".label")
    .data(flatData)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", function(d) { return x(d.city) + x.bandwidth() / 2; })
    .attr("y", function(d) { return y(d.count) - 5; })
    .text(function(d) { return d.count; })
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black");

  // Draw axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Add legend
  var legend = svg.selectAll(".legend")
    .data(z.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", z);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

}).catch(function(error) {
  console.error("Error loading the data: " + error);
});
