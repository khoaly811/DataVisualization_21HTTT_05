// Load the dataset
d3.csv("Traffic_Accidents.csv").then(function (data) {
  // Define chart dimensions
  const width = innerWidth - 50;
  const height = innerHeight - 100;
  const margin = { top: 50, right: 50, bottom: 100, left: 50 };

  // Preprocess the data
  const collisionTypes = [
    ...new Set(data.map((d) => d["Collision Type Description"])),
  ];
  let injuries = [...new Set(data.map((d) => +d["Number of Injuries"]))];
  injuries = injuries.sort((a, b) => a - b); // Sort the injuries array

  const nestedData = [];

  collisionTypes.forEach((collisionType) => {
    injuries.forEach((injury) => {
      const filteredData = data.filter(
        (d) =>
          d["Collision Type Description"] === collisionType &&
          +d["Number of Injuries"] === injury
      );
      const totalAccidents = d3.sum(filteredData, (d) => +d["Accident Number"]);
      nestedData.push({ collisionType, injury, totalAccidents });
    });
  });

  // Define scales
  const xScale = d3
    .scaleBand()
    .domain(collisionTypes)
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleBand()
    .domain(injuries)
    .range([height - margin.bottom, margin.top])
    .padding(0.1);

  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateReds) // Adjust color scheme as needed
    .domain([
      0,
      d3.quantile(
        nestedData.map((d) => d.totalAccidents),
        0.95
      ),
    ]);

  // Create SVG
  const svgQ3 = d3
    .select("#chart3")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Draw rectangles
  svgQ3
    .selectAll("rect")
    .data(nestedData)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.collisionType))
    .attr("y", (d) => yScale(d.injury))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(d.totalAccidents));

  // Add labels
  svgQ3
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "15px");

  svgQ3
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale))
    .style("font-size", "15px");

  // Add axis titles
  // svgQ3
  //   .append("text")
  //   .attr("x", width / 2)
  //   .attr("y", margin.top / 2)
  //   .style("text-anchor", "middle")
  //   .text("Collision Type Description");

  svgQ3
    .append("text")
    .attr("x", -height / 2)
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Number of Injuries");

  // Add chart title
  svgQ3
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("So sánh tỉ lệ giữa các điều kiện ánh sáng gây ra tai nạn ");
});
