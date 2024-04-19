d3.csv("Traffic_Accidents.csv")
  .then(function (data) {
    var parseDate = d3.timeParse("%m/%d/%Y %H:%M");
    data.forEach(function (d) {
      var date = parseDate(d["Date and Time"]);
      d.date = date ? date : null;
      d.month = date ? date.getMonth() : null;
      d.year = date ? date.getFullYear() : null;
    });

    var nestedData = d3.group(
      data,
      (d) => d.year,
      (d) => Math.floor(d.month / 3),
      (d) => d["Collision Type Description"]
    );

    var flatData = [];

    nestedData.forEach((quarters, year) => {
      quarters.forEach((collisionTypes, quarter) => {
        var quarterData = { year: +year, quarter: +quarter * 3 };

        collisionTypes.forEach((accidents, collisionType) => {
          quarterData[collisionType] = accidents.length;
        });

        flatData.push(quarterData);
      });
    });

    // Sort data by year and quarter
    flatData.sort((a, b) => a.year - b.year || a.quarter - b.quarter);

    // Set up dimensions
    var width = 1300;
    var height = 600;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };

    // Create SVG
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales
    var x = d3
      .scaleTime()
      .domain(d3.extent(flatData, (d) => new Date(d.year, d.quarter, 1)))
      .range([0, width]);

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(flatData, (d) => d3.sum(Object.values(d)) - d.year - d.quarter),
      ])
      .nice()
      .range([height, 0]);

    var z = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(Object.keys(flatData[0]).slice(2)); // Slice to exclude year and quarter

    var stack = d3
      .stack()
      .keys(Object.keys(flatData[0]).slice(2))
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    var stackedData = stack(flatData);

    // Draw stacked area
    // Draw stacked area
    svg
      .selectAll(".area")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", "area")
      .attr("fill", (d) => z(d.key))
      .attr(
        "d",
        d3
          .area()
          .x((d) => x(new Date(d.data.year, d.data.quarter, 1)))
          .y0((d) => y(d[0])) // Adjusted y0
          .y1((d) => y(d[1])) // Adjusted y1
      )
      .on("mouseover", function (d, event) {
        var tooltip = d3
          .select("#tooltip")
          .style("opacity", 1)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
        console.log(d);
        tooltip.html(
          "Year: " +
            d +
            "<br>Hit and Run Accidents: " +
            (d3.sum(Object.values(d.srcElement.__data__)) -
              d.srcElement.__data__.year)
        );
      })
      .on("mouseout", function () {
        d3.select("#tooltip").style("opacity", 0);
      });

    // Draw axes
    svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3
        .axisBottom(x)
        .ticks(d3.timeMonth.every(3))
        .tickFormat(function (date) {
          if (date.getMonth() === 0) {
            return d3.timeFormat("%Y")(date);
          }
          return d3.timeFormat("%m")(date);
        })
    ).attr("font-size", "13px")  // Set font size
    .attr("font-weight", "400"); // Set font weight
  

    svg.append("g").call(d3.axisLeft(y));

    // Add legend
    var legend = svg
      .selectAll(".legend")
      .data(z.domain().reverse())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", z);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d);

    // Draw dashed lines from each quarter on x-axis
    svg
      .selectAll(".quarter-line")
      .data(x.ticks(3))
      .enter()
      .append("line")
      .attr("class", "quarter-line")
      .attr("x1", (d) => x(d) + x.bandwidth() / 2)
      .attr("y1", height)
      .attr("x2", (d) => x(d) + x.bandwidth() / 2)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-dasharray", "3");
  })
  .catch(function (error) {
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
