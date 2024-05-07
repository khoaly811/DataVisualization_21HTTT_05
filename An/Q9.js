const data = [
  { quarter_year: '1-15', hitAndRun: 1430, notHitAndRun: 5768 },
  { quarter_year: '2-15', hitAndRun: 1515, notHitAndRun: 6020 },
  { quarter_year: '3-15', hitAndRun: 1705, notHitAndRun: 6241 },
  { quarter_year: '4-15', hitAndRun: 1812, notHitAndRun: 6859 },
  { quarter_year: '1-16', hitAndRun: 1676, notHitAndRun: 6103 },
  { quarter_year: '2-16', hitAndRun: 1799, notHitAndRun: 6548 },
  { quarter_year: '3-16', hitAndRun: 1851, notHitAndRun: 6742 },
  { quarter_year: '4-16', hitAndRun: 1668, notHitAndRun: 5898 },
  { quarter_year: '1-17', hitAndRun: 1254, notHitAndRun: 4552 },
  { quarter_year: '2-17', hitAndRun: 1094, notHitAndRun: 3754 },
  { quarter_year: '3-17', hitAndRun: 1730, notHitAndRun: 6512 },
  { quarter_year: '4-17', hitAndRun: 1927, notHitAndRun: 7153 },
  { quarter_year: '1-18', hitAndRun: 1896, notHitAndRun: 6361 },
  { quarter_year: '2-18', hitAndRun: 2021, notHitAndRun: 6388 },
  { quarter_year: '3-18', hitAndRun: 1969, notHitAndRun: 6396 },
  { quarter_year: '4-18', hitAndRun: 2082, notHitAndRun: 6889 },
  { quarter_year: '1-19', hitAndRun: 1969, notHitAndRun: 6210 },
  { quarter_year: '2-19', hitAndRun: 2173, notHitAndRun: 6730 },
  { quarter_year: '3-19', hitAndRun: 2087, notHitAndRun: 6726 },
  { quarter_year: '4-19', hitAndRun: 2086, notHitAndRun: 6751 },
  { quarter_year: '1-20', hitAndRun: 1889, notHitAndRun: 5464 },
  { quarter_year: '2-20', hitAndRun: 1239, notHitAndRun: 3017 },
  { quarter_year: '3-20', hitAndRun: 867, notHitAndRun: 3107 },
  { quarter_year: '4-20', hitAndRun: 397, notHitAndRun: 1625 },
  { quarter_year: '1-21', hitAndRun: 699, notHitAndRun: 2411 },
  { quarter_year: '2-21', hitAndRun: 959, notHitAndRun: 3333 },
  { quarter_year: '3-21', hitAndRun: 940, notHitAndRun: 3504 },
  { quarter_year: '4-21', hitAndRun: 979, notHitAndRun: 3739 },
  { quarter_year: '1-22', hitAndRun: 1444, notHitAndRun: 5927 },
  ];

const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const width = 1560 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;


const svgQ8 = d3.select("#chart9")
  .append("svg")
  .attr("width", width + margin.left + margin.right) // Adjusted width to include margins
  .attr("height", height + margin.top + margin.bottom) // Adjusted height to include margins
  .append("g")
  .attr("style", "max-width: 1560; height: 800; height: intrinsic;");

const x = d3.scaleBand()
  .domain(data.map(d => d.quarter_year))
  .range([margin.left, width - margin.right])
  .padding(0.6);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => Math.max(d.hitAndRun, d.notHitAndRun))])
  .nice()
  .range([height - margin.bottom, margin.top]);

const lineHitAndRun = d3.line()
  .x(d => x(d.quarter_year) + x.bandwidth() / 2)
  .y(d => y(d.hitAndRun))

const lineNotHitAndRun = d3.line()
  .x(d => x(d.quarter_year) + x.bandwidth() / 2)
  .y(d => y(d.notHitAndRun))

svgQ8.selectAll(".line-hit-and-run")
  .data([data])
  .join("path")
  .attr("class", "line-hit-and-run")
  .attr("fill", "none")
  .attr("stroke", "blue")
  .attr("stroke-width", 2)
  .attr("d", lineHitAndRun);

svgQ8.selectAll(".line-not-hit-and-run")
  .data([data])
  .join("path")
  .attr("class", "line-not-hit-and-run")
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 2)
  .attr("d", lineNotHitAndRun);

// Append x-axis
svgQ8.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
  .call(g => g.append("text")
      .attr("x", margin.right + 1410)
      .attr("y", 15)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("Quý-Năm →"))
  .selectAll("text") // Increase x-axis label size
  .attr("font-size", "13px");


// Add the y-axis, remove the domain line, add grid lines and a label.
svgQ8.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(height / 40))
  .call(g => g.select(".domain").remove())
  .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - margin.left - margin.right)
      .attr("stroke-opacity", 0.1))
  .call(g => g.append("text")
      .attr("x", -margin.left)
      .attr("y", 15)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Số lượng trường hợp"))
  .selectAll("text") // Increase x-axis label size
  .attr("font-size", "13px");

svgQ8.append("text")
  .attr("x", width - 100)
  .attr("y", y(data[data.length - 1].notHitAndRun) - 10)
  .attr("text-anchor", "middle")
  .style("fill", "green")
  .text("Không bỏ trốn");

svgQ8.append("text")
  .attr("x", width - 100)
  .attr("y", y(data[data.length - 1].hitAndRun) + 20)
  .attr("text-anchor", "middle")
  .style("fill", "blue")
  .text("Bỏ trốn");


