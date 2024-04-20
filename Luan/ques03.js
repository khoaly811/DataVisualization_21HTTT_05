// Define chart dimensions
const widthQ3 = 800;
const heightQ3 = 1000;
const marginQ3 = { top: 50, right: 50, bottom: 50, left: 50 };

// Load the dataset
d3.csv("Traffic_Accidents.csv").then(function(data) {
    // Preprocess the data
    const collisionTypes = [...new Set(data.map(d => d["Collision Type Description"]))];
    let injuries = [...new Set(data.map(d => +d["Number of Injuries"]))];
    injuries = injuries.sort((a, b) => a - b); // Sort the injuries array

    const nestedData = [];

    collisionTypes.forEach(collisionType => {
        injuries.forEach(injury => {
            const filteredData = data.filter(d => d["Collision Type Description"] === collisionType && +d["Number of Injuries"] === injury);
            const totalAccidents = d3.sum(filteredData, d => +d["Accident Number"]);
            nestedData.push({ collisionType, injury, totalAccidents });
        });
    });

    // Define scales
    const xScale = d3.scaleBand()
        .domain(collisionTypes)
        .range([marginQ3.left, widthQ3 - marginQ3.right])
        .padding(0.1);

    const yScale = d3.scaleBand()
        .domain(injuries)
        .range([heightQ3 - marginQ3.bottom, marginQ3.top])
        .padding(0.1);

    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateReds) // Adjust color scheme as needed
        .domain([0, d3.quantile(nestedData.map(d => d.totalAccidents), 0.95)]); 

    // Create SVG
    const svgQ3 = d3.select("#chart3")
        .append("svg")
        .attr("width", widthQ3)
        .attr("height", heightQ3);

    // Draw rectangles
    svgQ3.selectAll("rect")
        .data(nestedData)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.collisionType))
        .attr("y", d => yScale(d.injury))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(d.totalAccidents));

    // Add labels
    svgQ3.append("g")
        .attr("transform", `translate(0, ${heightQ3 - marginQ3.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svgQ3.append("g")
        .attr("transform", `translate(${marginQ3.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Add axis titles
    svgQ3.append("text")
        .attr("x", widthQ3 / 2)
        .attr("y", marginQ3.top/2)
        .style("text-anchor", "middle")
        .text("Collision Type Description");

    svgQ3.append("text")
        .attr("x", -heightQ3 / 2)
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Injuries");
});