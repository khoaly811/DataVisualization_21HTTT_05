// Define constants
const duration = 1000; // Changed to 3 seconds
const barSize = 48;
const marginTop = 30;
const marginRight = 150;
const widthQ5 = 800; // Define the width of the SVG
const heightQ5 = 600; // Define the height of the SVG
const n = 8; // Number of precincts

let data; // Define data variable globally
let yearIndex = 0; // Declare yearIndex globally
let raceInterval; // Declare raceInterval globally
let yearDisplay; // Declare yearDisplay globally
let xScale; // Declare xScale globally
let yScale;
let bars; // Declare bars globally

// Function to update bars and labels
function update(yearIndex) {
  // Update year display
  yearDisplay.text(`Year: ${2015 + yearIndex}`);

  // Filter data for the corresponding year
  const dataYear = data.filter((d) => d.Year === 2015 + yearIndex);

  // Group data by Precinct and count the number of accidents
  const groupedDataYear = d3.rollup(
    dataYear,
    (v) => v.length,
    (d) => d.PrecinctName
  );

  // Convert grouped data to array of objects
  const nestedDataYear = Array.from(groupedDataYear, ([key, value]) => ({
    Precinct: key,
    Accidents: value,
  }));

  // Sort nestedData by total accidents in each precinct
  nestedDataYear.sort((a, b) => b.Accidents - a.Accidents);

  // Update bars
  bars
    .data(nestedDataYear)
    .select("rect")
    .transition()
    .duration(duration)
    .attr("width", (d) => xScale(d.Accidents));

  // Update labels
  bars
    .data(nestedDataYear)
    .select(".label")
    .transition()
    .duration(duration)
    .attr("x", (d) => xScale(d.Accidents) + 10)
    .text((d) => `${d.Precinct}: ${d.Accidents}`);
}

// Function to load data and initialize race
function loadDataAndInitializeRace() {
  // Load data
  d3.csv("Traffic_Accidents.csv").then((csvData) => {
    data = csvData; // Assign csvData to the global data variable

    // Convert Date and Time to Year and Precinct names
    data.forEach((d) => {
      d.Year = new Date(d["Date and Time"]).getFullYear();
      d.PrecinctName = d.Precinct;
    });

    // Filter data for the year 2015
    const data2015 = data.filter((d) => d.Year === 2015);

    // Group data by Precinct and count the number of accidents in 2015
    const groupedData2015 = d3.rollup(
      data2015,
      (v) => v.length,
      (d) => d.PrecinctName
    );

    // Convert grouped data to array of objects
    const nestedData2015 = Array.from(groupedData2015, ([key, value]) => ({
      Precinct: key,
      Accidents: value,
    }));

    // Sort nestedData by total accidents in each precinct
    nestedData2015.sort((a, b) => b.Accidents - a.Accidents);
    const colorScale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(nestedData2015.map((d) => d.Precinct));
    // Define scales

    xScale = d3
      .scaleLinear()
      .domain([0, d3.max(nestedData2015, (d) => d.Accidents)])
      .range([0, widthQ5 - marginRight - 250]);

    yScale = d3
      .scaleBand()
      .domain(d3.range(n))
      .range([marginTop + 40, heightQ5 - marginTop])
      .padding(0.3);
    const xAxis = d3.axisBottom(xScale).ticks(5).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(30);
    // Create SVG
    const svgQ5 = d3
      .select("#chart5")
      .append("svg")
      .attr("width", widthQ5)
      .attr("height", heightQ5);

    // Add year display
    yearDisplay = svgQ5
      .append("text")
      .attr("class", "year-display")
      .attr("x", (widthQ5 - marginRight) / 2)
      .attr("y", marginTop)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .attr("font-size", "24px")
      .text("");
    // Define initial bars
    bars = svgQ5
      .selectAll(".bar")
      .data(nestedData2015)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", (d, i) => `translate(${marginTop},${yScale(i)})`);

    bars
      .append("rect")
      .attr("y", 0)
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d.Accidents))
      .attr("fill", (d) => colorScale(d.Precinct));

    bars
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.Accidents) + 10)
      .attr("y", yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", "darkgrey") // Set text color to black
      .text((d) => `${d.Precinct}: ${d.Accidents}`);

    svgQ5
      .selectAll("line.vertical-grid")
      .data(xScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "vertical-grid")
      .attr("x1", (d) => xScale(d) + marginTop) // Adjust x-position by adding marginTop
      .attr("y1", marginTop + 40)
      .attr("x2", (d) => xScale(d) + marginTop) // Adjust x-position by adding marginTop
      .attr("y2", heightQ5 - marginTop)
      .style("stroke", "lightgray")
      .style("stroke-width", 0.5)
      .style("stroke-dasharray", "3 3");
    svgQ5
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(${marginTop}, ${heightQ5 - marginTop})`)
      .call(xAxis)
      .call((g) => g.select(".domain").remove());
    svgQ5
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${marginTop}, 0)`) // Adjust translation to fit right at the 0 y-axis
      .call(yAxis)
      .selectAll("path")
      .style("stroke-width", "1.75px")
      .attr("y1", marginTop) // Adjust y1 to fit right at the 0 y-axis
      .attr("y2", heightQ5 - marginTop);
    svgQ5.selectAll(".yAxis.axis .tick text").text(function (d) {
      return d.toUpperCase();
    });
    update(0);

    // Start race
    startRace();
  });
}

// Function to start the race
function startRace() {
  raceInterval = setInterval(() => {
    yearIndex = (yearIndex + 1) % (d3.max(data, (d) => d.Year) - 2015 + 1); // Calculate total years dynamically
    update(yearIndex);
  }, duration * 2);
}

// Call the function to load data and initialize the race
loadDataAndInitializeRace();

// Function to replay the race
function replayRace() {
  clearInterval(raceInterval); // Clear the interval
  yearIndex = 0; // Reset year index
  update(yearIndex); // Update to display data of 2015
  startRace(); // Restart the race
}
