// Define constants
const duration = 1000; // Changed to 3 seconds
const barSize = 48;
const marginTop = 16;
const widthQ5 = 800; // Define the width of the SVG
const heightQ5 = 600; // Define the height of the SVG
const n = 8; // Number of precincts

// Create SVG
const svgQ5 = d3.select("#chart5")
  .append("svg")
  .attr("width", widthQ5)
  .attr("height", heightQ5);

// Add year display
const yearDisplay = svgQ5.append("text")
  .attr("class", "year-display")
  .attr("x", widthQ5 / 2)
  .attr("y", marginTop)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "hanging")
  .attr("font-size", "24px")
  .text("");

// Load data
d3.csv('Traffic_Accidents.csv').then(data => {
  // Convert Date and Time to Year and Precinct names
  data.forEach(d => {
    d.Year = new Date(d['Date and Time']).getFullYear();
    d.PrecinctName = d.Precinct;
  });

  // Group data by Precinct and Year and count the number of accidents
  const groupedData = d3.rollup(data, v => v.length, d => d.PrecinctName, d => d.Year);

  // Convert grouped data to array of objects
  const nestedData = Array.from(groupedData, ([key, value]) => ({ Precinct: key, Years: Array.from(value.entries()) }));

  // Sort nestedData by total accidents in each precinct
  nestedData.sort((a, b) => d3.sum(b.Years, d => d[1]) - d3.sum(a.Years, d => d[1]));

  // Define scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(nestedData, d => d3.max(d.Years, d => d[1]))])
    .range([0, widthQ5 - 150]);

  const yScale = d3.scaleBand()
    .domain(d3.range(n))
    .range([marginTop + 40, heightQ5 - marginTop])
    .padding(0.1);

  // Define initial bars
  let bars = svgQ5.selectAll(".bar")
    .data(nestedData[0].Years)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d, i) => `translate(${marginTop},${yScale(i)})`);

  bars.append("rect")
    .attr("y", 0)
    .attr("height", yScale.bandwidth())
    .attr("width", d => xScale(d[1]))
    .attr("fill", "steelblue");

  bars.append("text")
    .attr("class", "label")
    .attr("x", d => xScale(d[1]) + 10)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("fill", "white")
    .text(d => `${d[0]}: ${d[1]}`);

  // Define function to update bars and labels
  function update(yearIndex) {
    // Update year display
    yearDisplay.text(nestedData[yearIndex].Years[0][0]);

    // Update bars
    bars.data(nestedData[yearIndex].Years)
      .select("rect")
      .transition()
      .duration(duration)
      .attr("width", d => xScale(d[1]));

    // Update labels
    bars.data(nestedData[yearIndex].Years)
      .select(".label")
      .transition()
      .duration(duration)
      .attr("x", d => xScale(d[1]) + 10)
      .text(d => `${d[0]}: ${d[1]}`);
  }

  // Initialize race
  let yearIndex = 0;
  update(yearIndex);

  // Define function to start race
  function startRace() {
    d3.interval(() => {
      yearIndex = (yearIndex + 1) % nestedData.length;
      update(yearIndex);
    }, duration);
  }

  // Start race
  startRace();
});
