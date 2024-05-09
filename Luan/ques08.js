d3.csv("Traffic_Accidents.csv")
  .then(function (data) {
    // Parse dates and extract years
    var parseDate = d3.timeParse("%m/%d/%Y %H:%M");
    data.forEach(function (d) {
      var date = parseDate(d["Date and Time"]);
      d.date = date ? date : null;
      d.year = date ? date.getFullYear() : null;
    });

    // Filter out entries with null dates
    data = data.filter((d) => d.date !== null);

    // Extract unique years for dropdown
    var years = Array.from(new Set(data.map((d) => d.year)));

    // Sort years
    years.sort();

    // Create dropdown
    var dropdown = d3
      .select("#chart8")
      .append("select")
      .attr("id", "yearDropdown")
      .on("change", updateChart);

    dropdown
      .selectAll("option")
      .data(years)
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d)
      .property("selected", function (d) {
        return d === 2015;
      });
    updateChart();

    function updateChart() {
      var selectedYear = d3.select("#yearDropdown").property("value");

      // Filter data based on selected year
      var filteredData = data.filter((d) => d.year == selectedYear);

      // Group data by City
      var nestedData = d3.group(
        filteredData,
        (d) => d["City"],
        (d) => d["Collision Type Description"]
      );

      // Flatten nested data
      var flatData = [];
      nestedData.forEach((collisionTypes, city) => {
        var cityData = { city: city };

        collisionTypes.forEach((count, collisionType) => {
          console.log(cityData);
          cityData[collisionType] = count.length;
        });

        cityData.total = d3.sum(
          Object.values(cityData).filter((d) => typeof d === "number")
        );

        collisionTypes.forEach((count, collisionType) => {
          cityData[collisionType] = (count.length / cityData.total) * 100;
        });
        flatData.push(cityData);
      });

      // Sort flatData by total count in descending order
      flatData.sort((a, b) => b.total - a.total);

      // Set up dimensions
      var width = innerWidth - 250;
      var height = innerHeight - 250;
      var margin = { top: 300, right: 200, bottom: 30, left: 50 };

      // Remove existing SVG if any
      d3.select("#chart8 svg").remove();

      // Create SVG
      var svg = d3
        .select("#chart8")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set up scales
      var x = d3
        .scaleBand()
        .domain(flatData.map((d) => d.city))
        .range([0, width])
        .padding(0.1);

      var y = d3
        .scaleLinear()
        .domain([0, 100])

        .range([height, 0]);

      var z = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(Object.keys(flatData[0]).slice(1));

      // Create stack generator
      var stack = d3
        .stack()
        .keys(
          Object.keys(flatData[0])
            .slice(1)
            .filter((key) => key !== "total")
        )
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

      var stackedData = stack(flatData);

      // Draw stacked bars
      svg
        .selectAll(".stack")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "stack")
        .attr("fill", (d) => z(d.key))
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.data.city))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", function (d, event) {
          var [x, y] = d3.pointer(event);

          var tooltip = d3
            .select("#tooltip")
            .style("opacity", 1)
            .style("left", x + 10 + "px") // Add 10 pixels offset to avoid covering the mouse
            .style("top", y - 10 + "px"); // Subtract 10 pixels to position above the mouse

          var barHeight = d.target.__data__[1] - d.target.__data__[0];

          tooltip.html("Accidents: " + Math.abs(barHeight));
        })

        .on("mouseout", function () {
          d3.select("#tooltip").style("opacity", 0);
        });

      // Add labels for total accidents

      // Draw axes
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .style("font-size", "15px");

      svg.append("g").call(d3.axisLeft(y)).style("font-size", "15px");

      // Add legend
      var legend = svg
        .selectAll(".legend")
        .data(z.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(100," + i * 20 + ")");

      legend
        .append("rect")
        .attr("x", function (d, i) {
          if (i === 10) return;
          console.log(i); // Skip appending the rectangle if i equals 11
          return width - 50;
        })
        .attr("y", function (d, i) {
          if (i === 10) return; // Skip appending the rectangle if i equals 11
          return height - 1000;
        })
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) {
          if (i === 10) return "none"; // Set fill to "none" to make it invisible
          return z(d);
        });

      legend
        .append("text")
        .attr("x", function (d, i) {
          if (i === 10) return; // Skip appending the text if i equals 11
          return width - 60;
        })
        .attr("y", function (d, i) {
          if (i === 10) return; // Skip appending the text if i equals 11
          return height - 990;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d, i) {
          if (i === 10) return; // Skip setting text if i equals 11
          return d;
        });

      // Add tooltip
      d3.select("#chart8")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)
        .attr("class", "tooltip");
    }
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
