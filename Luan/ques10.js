const dataQues10 = [
  { hour: 0, num_of_acci: 14001 },
  { hour: 1, num_of_acci: 2374 },
  { hour: 2, num_of_acci: 2184 },
  { hour: 3, num_of_acci: 2125 },
  { hour: 4, num_of_acci: 1587 },
  { hour: 5, num_of_acci: 2780 },
  { hour: 6, num_of_acci: 6647 },
  { hour: 7, num_of_acci: 12086 },
  { hour: 8, num_of_acci: 10755 },
  { hour: 9, num_of_acci: 8409 },
  { hour: 10, num_of_acci: 8355 },
  { hour: 11, num_of_acci: 9741 },
  { hour: 12, num_of_acci: 11499 },
  { hour: 13, num_of_acci: 11691 },
  { hour: 14, num_of_acci: 12425 },
  { hour: 15, num_of_acci: 14894 },
  { hour: 16, num_of_acci: 16986 },
  { hour: 17, num_of_acci: 18142 },
  { hour: 18, num_of_acci: 12687 },
  { hour: 19, num_of_acci: 7941 },
  { hour: 20, num_of_acci: 6323 },
  { hour: 21, num_of_acci: 5662 },
  { hour: 22, num_of_acci: 4804 },
  { hour: 23, num_of_acci: 4227 },
  { hour: 24, num_of_acci: 0 },
];

// Kích thước của biểu đồ và margin
const margin = { top: 20, right: 20, bottom: 30, left: 60 };
const width = innerWidth - margin.left - margin.right - 100;
const height = innerHeight - margin.top - margin.bottom - 120;

// Scale cho trục x (giờ)
const xQues10 = d3
  .scaleBand()
  .domain(dataQues10.map((d) => d.hour))
  .range([margin.left - 10, width - margin.right]);

// Scale cho trục y (số lượng vụ tai nạn)
const yQues10 = d3
  .scaleLinear()
  .domain([0, d3.max(dataQues10, (d) => d.num_of_acci)])
  .nice()
  .range([height - margin.bottom, margin.top]);

// Tạo histogram
const svgQues10 = d3
  .select("#chart10")
  .append("svg")
  .attr("width", width + margin.left + margin.right + 50) // Adjusted width to include margins
  .attr("height", height + margin.top + margin.bottom) // Adjusted height to include margins
  .append("g")
  .attr("style", "max-width: 1400; height: 800; height: intrinsic;");

svgQues10
  .append("g")
  .attr("fill", "steelblue")
  .selectAll()
  .data(dataQues10)
  .join("rect")
  .attr("x", (d) => xQues10(d.hour) + margin.left / 2 + 3)
  .attr("y", (d) => yQues10(d.num_of_acci))
  .attr("width", xQues10.bandwidth() + 1)
  .attr("height", (d) => yQues10(0) - yQues10(d.num_of_acci))
  .attr("fill", "steelblue");

// Thêm trục x
svgQues10
  .append("g")
  .attr("transform", `translate(3,${height - margin.bottom})`)
  .call(
    d3
      .axisBottom(xQues10)
      .ticks(width / 80)
      .tickSizeOuter(0)
  )
  .call((g) =>
    g
      .append("text")
      .attr("x", width + 30)
      .attr("y", margin.bottom - 12)
      .attr("fill", "currentColor")
      .attr("text-anchor", "end")
      .text("Giờ →")
  )
  .selectAll("text") // Increase x-axis label size
  .attr("font-size", "15px");

// Thêm trục y
svgQues10
  .append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yQues10).ticks(height / 40))
  .call((g) =>
    g
      .append("text")
      .attr("x", -margin.left)
      .attr("y", 13)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Số vụ tai nạn")
  )
  .selectAll("text") // Increase x-axis label size
  .attr("font-size", "15px");

// Thêm tiêu đề cho biểu đồ
//  svg.append("text")
//    .attr("x", width / 2)
//    .attr("y", 0 - (margin.top / 2))
//    .attr("text-anchor", "middle")
//    .style("font-size", "16px")
//    .text("Hourly Accident Distribution");
