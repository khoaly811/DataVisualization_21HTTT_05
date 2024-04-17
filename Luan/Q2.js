const widthQ2 = 800;
const heightQ2 = 600;
const radius = Math.min(widthQ2, heightQ2) / 2;

d3.csv("Traffic_Accidents.csv").then(function (data) {
    // Group data by illumination description and count the number of accidents for each description
    const illuminationDescription = d3.rollup(data, v => v.length, d => d["Illumination Description"]);

    const illuminationDescriptionData = Array.from(illuminationDescription, ([illuminationDescription, value]) => ({ illuminationDescription, value }));

    // Get top 3 values to visualize, others will be grouped into "Others"
    const visualizeData = illuminationDescriptionData.sort((a, b) => b.value - a.value).slice(0, 3);
    const others = illuminationDescriptionData.sort((a, b) => b.value - a.value).slice(3);
    const othersValue = others.reduce((acc, cur) => acc + cur.value, 0);
    visualizeData.push({ illuminationDescription: "Others", value: othersValue });

    // Define color scale
    const color = d3.scaleOrdinal()
        .domain(visualizeData.map(d => d.illuminationDescription))
        .range(d3.schemeCategory10);

    // Define arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius * 0.8);

    // Define pie generator
    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    // Draw SVG
    const svg = d3.select("#chart2").append("svg")
        .attr("width", widthQ2)
        .attr("height", heightQ2)
        .append("g")
        .attr("transform", `translate(${widthQ2 / 2},${heightQ2 / 2})`);

    // Draw pie chart
    const g = svg.selectAll(".arc")
        .data(pie(visualizeData))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", d => color(d.data.illuminationDescription))
        .style("stroke", "white")
        .style("stroke-width", 2);

    // Add chart title
    svg.append("text")
        .attr("x", 0)
        .attr("y", -heightQ2 / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Accidents by Illumination Description");

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(visualizeData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${widthQ2 / 2 + 150},${i * 20 - heightQ2 / 2 + 50})`);

    legend.append("rect")
        .attr("x", -18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => color(d.illuminationDescription));

    legend.append("text")
        .attr("x", 0)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d.illuminationDescription);

    // Add tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    g.on("mouseover", function (event, d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`${d.data.illuminationDescription}: ${d.data.value}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});
