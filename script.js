// Set up SVG dimensions and margins
const margin = { top: 60, right: 100, bottom: 150, left: 100 };
const width = innerWidth - margin.left - margin.right;
const height = innerHeight - margin.top - margin.bottom;
console.log(width, height)

// Append SVG to the #chart div
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right - 100)
    .attr("height", height + margin.top + margin.bottom - 40)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load data from CSV file
d3.csv("Traffic_Accidents.csv").then(function (data) {

    // Group data by city and count the number of accidents for each city
    const accidentsByCity = d3.rollup(data, v => v.length, d => d.City);

    // Convert the map to an array of objects
    const accidentsData = Array.from(accidentsByCity, ([city, count]) => ({ city, count }));

    // Get top 5 value to visualize
    const visualizeData = accidentsData.sort((a, b) => b.count - a.count).slice(0, 5)

    // Define x and y scales
    const x = d3.scaleBand()
        .domain(visualizeData.map(d => d.city))
        .range([0, width])
        .padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, d3.max(visualizeData, d => d.count)])
        .nice()
        .range([height, 0]);

    // Draw bars
    svg.selectAll(".bar")
        .data(visualizeData)
        .enter().append("rect")
        .attr("class", "bar").style("fill", "steelblue")
        .attr("x", d => x(d.city))
        .attr("width", x.bandwidth())
        .attr("y", height).attr("height", 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count));

    // Draw x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end").style("font-size", "20px");

    // Draw y-axis
    svg.append("g")
        .attr("class", "y-axis").style("font-size", "20px")
        .call(d3.axisLeft(y));

    // Add chart title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "35px").style("font-weight", "bold")
        .text("Top 5 thành có số lượng tai nạn nhiều nhất");

    //transition
});
