// Define constants
const duration = 1500; // Changed to 3 seconds
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

  // Filter data for the year 2015
  const data2015 = data.filter(d => d.Year === 2015);

  // Group data by Precinct and count the number of accidents in 2015
  const groupedData2015 = d3.rollup(data2015, v => v.length, d => d.PrecinctName);

  // Convert grouped data to array of objects
  const nestedData2015 = Array.from(groupedData2015, ([key, value]) => ({ Precinct: key, Accidents: value }));

  // Sort nestedData by total accidents in each precinct
  nestedData2015.sort((a, b) => b.Accidents - a.Accidents);

  // Define scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(nestedData2015, d => d.Accidents)])
    .range([0, widthQ5 - 150]);

  const yScale = d3.scaleBand()
    .domain(d3.range(n))
    .range([marginTop + 40, heightQ5 - marginTop])
    .padding(0.1);

  // Define initial bars
  let bars = svgQ5.selectAll(".bar")
    .data(nestedData2015)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d, i) => `translate(${marginTop},${yScale(i)})`);

  bars.append("rect")
    .attr("y", 0)
    .attr("height", yScale.bandwidth())
    .attr("width", d => xScale(d.Accidents))
    .attr("fill", "steelblue");

  bars.append("text")
    .attr("class", "label")
    .attr("x", d => xScale(d.Accidents) + 10)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("fill", "black") // Set text color to black
    .text(d => `${d.Precinct}: ${d.Accidents}`);

  // Define function to update bars and labels
  function update(yearIndex) {
    // Update year display
    yearDisplay.text(`Year: ${2016 + yearIndex}`);

    // Filter data for the corresponding year
    const dataYear = data.filter(d => d.Year === 2016 + yearIndex);

    // Group data by Precinct and count the number of accidents
    const groupedDataYear = d3.rollup(dataYear, v => v.length, d => d.PrecinctName);

    // Convert grouped data to array of objects
    const nestedDataYear = Array.from(groupedDataYear, ([key, value]) => ({ Precinct: key, Accidents: value }));

    // Sort nestedData by total accidents in each precinct
    nestedDataYear.sort((a, b) => b.Accidents - a.Accidents);

    // Update bars
    bars.data(nestedDataYear)
      .select("rect")
      .transition()
      .duration(duration)
      .attr("width", d => xScale(d.Accidents));

    // Update labels
    bars.data(nestedDataYear)
      .select(".label")
      .transition()
      .duration(duration)
      .attr("x", d => xScale(d.Accidents) + 10)
      .text(d => `${d.Precinct}: ${d.Accidents}`);
  }

  // Initialize race
  let yearIndex = 0;
  update(yearIndex);

  // Define function to start race
  function startRace() {
    d3.interval(() => {
      yearIndex = (yearIndex + 1) % (new Date().getFullYear() - 2016);
      update(yearIndex);
    }, duration);
  }

  // Start race
  startRace();
});
