<template>
  <div ref="chartContainer" class="chartContainer"></div>
</template>
<script setup>
import { stringToColour } from "@/utils/languages";
import * as d3 from "d3";
import { onMounted, ref } from "vue";

const chartContainer = ref(null);
const props = defineProps(["data"]);

onMounted(() => {
  createPieChart(chartContainer.value, props.data);
});

const createPieChart = (container, data) => {
  const width = 350;
  const height = 350;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const pie = d3.pie();
  const colorScale = d3.scaleOrdinal().range(data.map((item) => stringToColour(item.language)));

  const arcs = pie(data.map((item) => item.value));

  const arcGenerator = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width - 50, height - 50) / 2);

  // Create a tooltip element
  const tooltip = d3
    .select(container)
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "rgba(0, 0, 0, 0.7)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "5px");

  svg
    .selectAll("path")
    .data(arcs)
    .enter()
    .append("path")
    .attr("fill", (d, i) => colorScale(i))
    .attr("d", arcGenerator)
    .on("mouseover", function (event, d) {
      // Show tooltip on mouseover
      d3.select(this)
        .transition()
        .duration(100)
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(0)
            .outerRadius(Math.min(width - 50, height - 50) / 2 + 10),
        );

      const [x, y] = d3.pointer(event);

      tooltip
        .style("visibility", "visible")
        .html(`${d.value}%`)
        .style("left", x + "px")
        .style("top", y + "px");
    })
    .on("mousemove", function (event) {
      // Update tooltip position on mousemove
      const [x, y] = d3.pointer(event);

      tooltip.style("left", x + width / 2 + 20 + "px").style("top", y + height / 2 + 20 + "px");
    })
    .on("mouseout", function () {
      // Hide tooltip on mouseout
      d3.select(this).transition().duration(100).attr("d", arcGenerator);

      tooltip.style("visibility", "hidden");
    });
};
</script>

<style scoped>
.chartContainer {
  position: relative;
}
.tooltip {
  position: absolute;
  visibility: hidden;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  border-radius: 5px;
}
</style>
