d3.csv("Traffic_Accidents.csv").then(function(data) {
  // Group data by City
  var nestedData = d3.group(data, d => d["City"], d => d["Collision Type Description"]);

  // Flatten nested data
  var flatData = [];
  nestedData.forEach((collisionTypes, city) => {
    var cityData = { city: city };
    
    collisionTypes.forEach((count, collisionType) => {
      cityData[collisionType] = count.length;
    });

    flatData.push(cityData);
  });

  console.log("Corrected Flat Data:", flatData);

  // Sort flatData by total count in descending order
  flatData.sort((a, b) => d3.sum(Object.values(b)) - d3.sum(Object.values(a)));

  // Set up dimensions
  var width = 1600;
  var height = 700;
  var margin = {top: 20, right: 20, bottom: 30, left: 50};

  // Create SVG
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set up scales
  var x = d3.scaleBand()
    .domain(flatData.map(d => d.city))
    .range([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(flatData, d => d3.sum(Object.values(d)))])
    .nice()
    .range([height, 0]);

  var z = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(Object.keys(flatData[0]).slice(1));

  // Create stack generator
  var stack = d3.stack()
    .keys(Object.keys(flatData[0]).slice(1).filter(key => key !== 'total'))
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  var stackedData = stack(flatData);

  // Draw stacked bars
  svg.selectAll(".stack")
    .data(stackedData)
    .enter().append("g")
    .attr("class", "stack")
    .attr("fill", d => z(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", d => x(d.data.city))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .on("mouseover", function(d, event) {
      console.log("Mouseover data:", d); // Debug 
      
      var tooltip = d3.select("#tooltip")
        .style("opacity", 1)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
      
      console.log("d[0]:", d[0]); // Debug 
      console.log("d[1]:", d[1]); // Debug 
      
      var barHeight =d.target.__data__[1] - d.target.__data__[0]; 
      
      console.log("Bar Height:", barHeight); // Debug 
      
      tooltip.html("Accidents: " + Math.abs(barHeight)); // Use Math.abs() to ensure positive value
    })
    
    
    .on("mouseout", function() {
      d3.select("#tooltip")
        .style("opacity", 0);
    });

  // Add labels for total accidents on top of each bar
  svg.selectAll(".total-label")
    .data(flatData)
    .enter().append("text")
    .attr("class", "total-label")
    .attr("x", d => x(d.city) + x.bandwidth() / 2)
    .attr("y", d => y(d3.sum(Object.values(d))) - 5)
    .attr("text-anchor", "middle")
    .text(d => d3.sum(Object.values(d)))
    .attr("font-size", "12px")
    .attr("fill", "black");

  // Draw axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Add legend
  var legend = svg.selectAll(".legend")
    .data(z.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", z);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);

  // Add tooltip
  d3.select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0)
    .attr("class", "tooltip");

}).catch(function(error) {
  console.error("Error loading the data: " + error);
});




// const convertData = (data) => {
//   // Tạo một đối tượng để lưu trữ số lượng sự cố cho từng loại thời tiết
//   var countByWeather = {};

//   // Tính số lượng sự cố cho từng loại thời tiết
//   data.forEach(function(d) {
//     var key = d["City"];
//     countByWeather[key] = (countByWeather[key] || 0) + 1;
//   });

//   // Chuyển đổi đối tượng thành mảng các đối tượng [{weather: key, count: value}]
//   var countData = Object.keys(countByWeather).map(function(key) {
//     return { weather: key, count: countByWeather[key] };
//   });

//   return countData
// }