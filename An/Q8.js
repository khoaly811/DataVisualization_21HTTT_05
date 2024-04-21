const data = [
  { quarter_year: '1-2015', hitAndRun: 1430, notHitAndRun: 5768 },
  { quarter_year: '2-2015', hitAndRun: 1515, notHitAndRun: 6020 },
  { quarter_year: '3-2015', hitAndRun: 1705, notHitAndRun: 6241 },
  { quarter_year: '4-2015', hitAndRun: 1812, notHitAndRun: 6859 },
  { quarter_year: '1-2016', hitAndRun: 1676, notHitAndRun: 6103 },
  { quarter_year: '2-2016', hitAndRun: 1799, notHitAndRun: 6548 },
  { quarter_year: '3-2016', hitAndRun: 1851, notHitAndRun: 6742 },
  { quarter_year: '4-2016', hitAndRun: 1668, notHitAndRun: 5898 },
  { quarter_year: '1-2017', hitAndRun: 1254, notHitAndRun: 4552 },
  { quarter_year: '2-2017', hitAndRun: 1094, notHitAndRun: 3754 },
  { quarter_year: '3-2017', hitAndRun: 1730, notHitAndRun: 6512 },
  { quarter_year: '4-2017', hitAndRun: 1927, notHitAndRun: 7153 },
  { quarter_year: '1-2018', hitAndRun: 1896, notHitAndRun: 6361 },
  { quarter_year: '2-2018', hitAndRun: 2021, notHitAndRun: 6388 },
  { quarter_year: '3-2018', hitAndRun: 1969, notHitAndRun: 6396 },
  { quarter_year: '4-2018', hitAndRun: 2082, notHitAndRun: 6889 },
  { quarter_year: '1-2019', hitAndRun: 1969, notHitAndRun: 6210 },
  { quarter_year: '2-2019', hitAndRun: 2173, notHitAndRun: 6730 },
  { quarter_year: '3-2019', hitAndRun: 2087, notHitAndRun: 6726 },
  { quarter_year: '4-2019', hitAndRun: 2086, notHitAndRun: 6751 },
  { quarter_year: '1-2020', hitAndRun: 1889, notHitAndRun: 5464 },
  { quarter_year: '2-2020', hitAndRun: 1239, notHitAndRun: 3017 },
  { quarter_year: '3-2020', hitAndRun: 867, notHitAndRun: 3107 },
  { quarter_year: '4-2020', hitAndRun: 397, notHitAndRun: 1625 },
  { quarter_year: '1-2021', hitAndRun: 699, notHitAndRun: 2411 },
  { quarter_year: '2-2021', hitAndRun: 959, notHitAndRun: 3333 },
  { quarter_year: '3-2021', hitAndRun: 940, notHitAndRun: 3504 },
  { quarter_year: '4-2021', hitAndRun: 979, notHitAndRun: 3739 },
  { quarter_year: '1-2022', hitAndRun: 1444, notHitAndRun: 5927 },
  ];

const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const width = 1240 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;


const svgQ8 = d3.select("#chart8")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .append("g")
  .attr("style", "max-width: 100%; height: fixed; height: intrinsic;");

const x = d3.scaleBand()
  .domain(data.map(d => d.quarter_year))
  .range([margin.left, width - margin.right])
  .padding(0.5);

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
      .attr("x", margin.right + 1160)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("Quar-Year"));
  

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
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Num of case"));

svgQ8.append("text")
  .attr("x", width - 100)
  .attr("y", y(data[data.length - 1].notHitAndRun) - 10)
  .attr("text-anchor", "middle")
  .style("fill", "green")
  .text("Not Hit-and-Run");

svgQ8.append("text")
  .attr("x", width - 100)
  .attr("y", y(data[data.length - 1].hitAndRun) + 20)
  .attr("text-anchor", "middle")
  .style("fill", "blue")
  .text("Hit-and-Run");

