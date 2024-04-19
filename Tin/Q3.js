// Define chart dimensions
const widthQ3 = 800;
const heightQ3 = 600;
const marginQ3 = { top: 50, right: 50, bottom: 50, left: 50 };

// Load the dataset
d3.csv("Traffic_Accidents.csv").then(function(data) {
    // Preprocess the data
    const collisionTypes = [...new Set(data.map(d => d["Collision Type Description"]))];
    const injuries = [...new Set(data.map(d => +d["Number of Injuries"]))];
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

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(injuries)])
        .range([heightQ3 - marginQ3.bottom, marginQ3.top]);

    const bubbleScale = d3.scaleSqrt()
        .domain([0, d3.max(nestedData, d => d.totalAccidents)])
        .range([2, 20]); // Adjust the range for bubble size

    // Create SVG
    const svg = d3.select("#chart3")
        .append("svg")
        .attr("width", widthQ3)
        .attr("height", heightQ3);

    // Draw bubbles
    svg.selectAll("circle")
        .data(nestedData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.collisionType))
        .attr("cy", d => yScale(d.injury))
        .attr("r", d => bubbleScale(d.totalAccidents))
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);

    // Add labels
    svg.append("g")
        .attr("transform", `translate(0, ${heightQ3 - marginQ3.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(${marginQ3.left}, 0)`)
        .call(d3.axisLeft(yScale));

    // Add axis titles
    svg.append("text")
        .attr("x", widthQ3 / 2)
        .attr("y", heightQ3 - 10)
        .style("text-anchor", "middle")
        .text("Collision Type Description");

    svg.append("text")
        .attr("x", -heightQ3 / 2)
        .attr("y", 10)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Injuries");
});
