d3.csv("Traffic_Accidents.csv")
  .then(function (data) {
    // Parse data
    data.forEach(function (d) {
      d["Number of Injuries"] = +d["Number of Injuries"];
    });

    // Count number of accidents for each combination of Weather and Illumination
    var accidentsData = d3.rollup(
      data,
      (v) => ({
        count: v.length,
        injuries: d3.sum(v, (d) => d["Number of Injuries"]),
      }),
      (d) => d["Weather Description"],
      (d) => d["Illumination Description"]
    );

    // Convert to array for visualization
    var flatData = [];
    accidentsData.forEach((weather, weatherKey) => {
      weather.forEach((value, illuminationKey) => {
        flatData.push({
          "Weather Description": weatherKey,
          "Illumination Description": illuminationKey,
          "Number of Accidents": value.count,
          "Number of Injuries": value.injuries,
        });
      });
    });

    // Set up dimensions
    var width = 1150;
    var height = 500;
    var margin = { top: 0, right: 20, bottom: 120, left: 150 };

    // Create SVG
    var svg = d3
      .select("#chart4")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales
    var x = d3
      .scaleBand()
      .domain(flatData.map((d) => d["Weather Description"]))
      .range([0, width])
      .padding(0.2);

    var y = d3
      .scaleBand()
      .domain(flatData.map((d) => d["Illumination Description"]))
      .range([height, 0])
      .padding(0.2);

    var color = d3.scaleSequential(d3.interpolateRdYlBu).domain([13000, 0]);

    var radius = d3.scaleSqrt().domain([0, 2000]).range([5, 10]); // minimum and maximum radius size

    // Draw bubbles
    svg
      .selectAll("circle")
      .data(flatData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d["Weather Description"]) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d["Illumination Description"]) + y.bandwidth() / 2)
      .attr("r", (d) => radius(d["Number of Accidents"]))
      .attr("fill", (d) => color(d["Number of Injuries"]))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("opacity", 0.7);

    // Draw axes
    svg
      .append("g")
      .call(d3.axisBottom(x))
      .attr("transform", "translate(0," + height + ")")
      .selectAll("text")
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    // Add legend
    // Add legend
    var legend = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + (width - 280) + "," + (height - 350) + ")"
      );

    legend
      .selectAll("rect")
      .data(color.ticks(6).reverse())
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 45)  // Adjusted x position
      .attr("width", 45)  // Adjusted width
      .attr("height", 10)
      .attr("fill", color);

    legend
      .selectAll("text")
      .data(color.ticks(6).reverse())
      .enter()
      .append("text")
      .attr("x", (d, i) => i * 45)  // Adjusted x position
      .attr("y", 20)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text((d) => d);


    // Add labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .attr("text-anchor", "middle")
      .text("Weather Description");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Illumination Description");

    // Create SVG for bubble size legend
    var legendSvg = svg
      .append("g")
      .attr("class", "legendSize")
      .attr(
        "transform",
        "translate(" + (width - 180) + "," + (height - 400) + ")"
      );

    // Define the bubble sizes for the legend
    var sizes = [5, 10, 20, 30, 40];

    // Draw circles for the legend
    legendSvg
      .selectAll("circle")
      .data(sizes)
      .enter()
      .append("circle")
      .attr("cx", 0)
      .attr("cy", (d, i) => -d) // Reverse the y-axis to start from the largest circle
      .attr("r", (d) => d)
      .attr("stroke", "black")
      .attr("fill", "none")
      .data(flatData)

    // Add text labels for the legend
    legendSvg
      .selectAll("text")
      .data(sizes)
      .enter()
      .append("text")
      .attr("x", 50)  // Adjusted x position
      .attr("y", (d) => {
        if (d === 5) {
          return -d + 5;  // Added extra space above the "<100 Accidents" text
        }
        return -d * 2;
      })
      .attr("dy", "0.5em")  // Increased line spacing
      .style("text-anchor", "top")
      .text((d) => {
        if (d === 40) {
          return ">20000 Accidents";
        }
        if (d === 10) {
          return "100-1000 Accidents";
        }
        if (d === 20) {
          return "1000-8000 Accidents";
        }
        if (d === 30) {
          return "8000-20000 Accidents";
        }
        if (d === 5) {
          return "<100 Accidents";
        }
        return d + " Accidents";
      });

  })
  .catch(function (error) {
    console.error("Error loading the data: " + error);
  });


