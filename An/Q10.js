const data = [
    {hour: 0, num_of_acci: 14001},
    {hour: 1, num_of_acci: 2374},
    {hour: 2, num_of_acci: 2184},
    {hour: 3, num_of_acci: 2125},
    {hour: 4, num_of_acci: 1587},
    {hour: 5, num_of_acci: 2780},
    {hour: 6, num_of_acci: 6647},
    {hour: 7, num_of_acci: 12086},
    {hour: 8, num_of_acci: 10755},
    {hour: 9, num_of_acci: 8409},
    {hour: 10, num_of_acci: 8355},
    {hour: 11, num_of_acci: 9741},
    {hour: 12, num_of_acci: 11499},
    {hour: 13, num_of_acci: 11691},
    {hour: 14, num_of_acci: 12425},
    {hour: 15, num_of_acci: 14894},
    {hour: 16, num_of_acci: 16986},
    {hour: 17, num_of_acci: 18142},
    {hour: 18, num_of_acci: 12687},
    {hour: 19, num_of_acci: 7941},
    {hour: 20, num_of_acci: 6323},
    {hour: 21, num_of_acci: 5662},
    {hour: 22, num_of_acci: 4804},
    {hour: 23, num_of_acci: 4227},

];
    
 // Kích thước của biểu đồ và margin
 const margin = { top: 20, right: 20, bottom: 30, left: 50 };
 const width = 1300 - margin.left - margin.right;
 const height = 800 - margin.top - margin.bottom;

 
 // Scale cho trục x (giờ)
 const x = d3.scaleBand()
   .domain(data.map(d => d.hour))
   .range([margin.left/2, width - margin.right])
   
 
 // Scale cho trục y (số lượng vụ tai nạn)
 const y = d3.scaleLinear()
   .domain([0, d3.max(data, d => d.num_of_acci)])
   .nice()
   .range([height - margin.bottom, margin.top]);
 
 // Tạo histogram
 const svgQ9 = d3.select("#chart10")
    .append("svg")
    .attr("width", width + margin.left + margin.right) // Adjusted width to include margins
    .attr("height", height + margin.top + margin.bottom) // Adjusted height to include margins
    .append("g")
    .attr("style", "max-width: 1300; height: 800; height: intrinsic;");
 

 svgQ9.append("g")
   .attr("fill", "steelblue")
   .selectAll()
   .data(data)
   .join("rect")
     .attr("x", d => x(d.hour) + margin.left/2 + 3)
     .attr("y", d => y(d.num_of_acci))
     .attr("width", x.bandwidth() + 1)
     .attr("height", d => y(0) - y(d.num_of_acci))
     .attr("fill", "steelblue");
 
 // Thêm trục x
 svgQ9.append("g")
   .attr("transform", `translate(27,${height - margin.bottom})`)
   .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
   .call((g) => g.append("text")
        .attr("x", width + 30)
        .attr("y", margin.bottom - 12)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text("Giờ →"))
    .selectAll("text") // Increase x-axis label size
    .attr("font-size", "13px");
 
 // Thêm trục y
 svgQ9.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call((g) => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 13)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Số vụ tai nạn"))
    .selectAll("text") // Increase x-axis label size
    .attr("font-size", "13px");

 // Add text to the left of each bar
 svgQ9.selectAll(".bar-label-left")
   .data(data)
   .enter()
   .append("text")
   .attr("class", "bar-label-left")
   .attr("x", d => x(d.hour) + margin.left/2 + 3)
   .attr("y", d => y(d.num_of_acci) + 14) // Adjust vertical position as needed
   .text(d => d.hour)
   .attr("text-anchor", "end")
   .attr("font-size", "12px")
   .attr("fill", "black");
 
 
 // Thêm tiêu đề cho biểu đồ
//  svg.append("text")
//    .attr("x", width / 2)
//    .attr("y", 0 - (margin.top / 2))
//    .attr("text-anchor", "middle")
//    .style("font-size", "16px")
//    .text("Hourly Accident Distribution");

