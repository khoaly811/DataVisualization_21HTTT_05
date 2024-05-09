d3.csv("Traffic_Accidents.csv")
  .then(function (data) {
    var parseDate = d3.timeParse("%m/%d/%Y %H:%M");
    data.forEach(function (d) {
      var date = parseDate(d["Date and Time"]);
      d.date = date ? date : null;
      d.year = date ? date.getFullYear() : null;
    });

    var hitAndRunData = data.filter(
      (d) => d.date !== null && d["Hit and Run"] === "TRUE"
    );

    var nestedHitAndRunData = d3.group(hitAndRunData, (d) => d.year);

    var flatHitAndRunData = Array.from(
      nestedHitAndRunData,
      ([year, entries]) => {
        var cityData = { year: year };
        entries.forEach((d) => {
          var key = d["City"];
          cityData[key] = (cityData[key] || 0) + 1;
        });
        return cityData;
      }
    );

    var injuriesData = data.filter(
      (d) => d.date !== null && !isNaN(d["Number of Injuries"])
    );

    var nestedInjuriesData = d3.group(injuriesData, (d) => d.year);

    var flatInjuriesData = Array.from(nestedInjuriesData, ([year, entries]) => {
      return {
        year: year,
        injuries: d3.sum(entries, (d) => +d["Number of Injuries"]),
      };
    });

    // Sort data by year
    flatHitAndRunData.sort((a, b) => a.year - b.year);
    flatInjuriesData.sort((a, b) => a.year - b.year);

    // Set up dimensions
    var width = innerWidth - 200;
    var height = innerHeight - 200;
    var margin = { top: 20, right: 60, bottom: 30, left: 60 };

    // Create SVG
    var svg = d3
      .select("#chart7")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up scales
    var x = d3
      .scaleBand()
      .domain(flatHitAndRunData.map((d) => d.year))
      .range([0, width])
      .padding(0.1);

    var y1 = d3.scaleLinear().domain([0, 14000]).nice().range([height, 0]);

    var y2 = d3
      .scaleLinear()
      .domain([0, d3.max(flatInjuriesData, (d) => d.injuries)])
      .nice()
      .range([height, 0]);

    svg
      .selectAll(".bar")
      .data(flatHitAndRunData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.year))
      .attr("y", (d) => y1(d3.sum(Object.values(d)) - d.year))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y1(d3.sum(Object.values(d)) - d.year))
      .attr("fill", "steelblue")
      .on("mouseover", function (d, event) {
        var [x, y] = d3.pointer(event);
        var tooltip = d3
          .select("#tooltip")
          .style("opacity", 1)
          .style("left", x + 10 + "px") // Add 10 pixels offset to avoid covering the mouse
          .style("top", y - 10 + "px"); // Subtract 10 pixels to position above the mouse // Adjust the top position to place the tooltip right below the chart
        console.log(d);
        tooltip.html(
          "Year: " +
            d.srcElement.__data__.year +
            "<br>Hit and Run Accidents: " +
            (d3.sum(Object.values(d.srcElement.__data__)) -
              d.srcElement.__data__.year)
        );
      })

      .on("mouseout", function () {
        d3.select("#tooltip").style("opacity", 0);
      });

    // Draw line for Number of Injuries data
    var line = d3
      .line()
      .x((d) => x(d.year) + x.bandwidth() / 2)
      .y((d) => y2(d.injuries));

    svg
      .append("path")
      .datum(flatInjuriesData)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Draw axes
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .style("font-size", "15px");

    svg
      .append("g")
      .call(d3.axisLeft(y1))
      .attr("class", "axisSteelBlue")
      .style("font-size", "15px");

    svg
      .append("g")
      .call(d3.axisRight(y2))
      .attr("class", "axisRed")
      .attr("transform", "translate(" + width + ",0)")
      .style("font-size", "15px");

    // Add tooltip
    d3.select("#chart")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .attr("class", "tooltip");

    svg
      .selectAll(".label")
      .data(flatInjuriesData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("y", (d) => y2(d.injuries) - 23)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text((d) => d.injuries);

    svg
      .selectAll(".dot")
      .data(flatInjuriesData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("cy", (d) => y2(d.injuries))
      .attr("r", 5)
      .attr("fill", "red");
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
