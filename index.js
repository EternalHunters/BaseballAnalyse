var draw = function(index, data){
var items = [
    ["handedness", ["B","R","L"], "不同惯用手的击运动员球率和全垒得分情况"],
    ["height_range", ["[65-70)","[70-75)","[75-80]"], "不同身高的运动员击球率和全垒得分情况"],
    ["weight_range", ["[140-160)","[160-180)","[180-200)", "[200-220)", "[220-250]"], "不同体重的运动员击球率和全垒得分情况"],
    ["BMI", ["过轻","正常","过重", "肥胖", "非常肥胖"], "不同身体质量的运动员击球率和全垒得分情况"],
    ]

var category = items[Number(index)][0]
var category_list = items[Number(index)][1]
var title = items[Number(index)][2]

var svg = dimple.newSvg("#chartContainer", 1500, 800);
var frame = 2000;

var firstTick = true;
data = dimple.filterData(data, category, category_list)
var barChart = new dimple.chart(svg, data);
barChart.setBounds(1300, 100, 100, 400);
var defaultColor = barChart.defaultColors[0];
var indicatorColor = barChart.defaultColors[2];
var y = barChart.addCategoryAxis("y", category);
//debugger;
var x = barChart.addMeasureAxis("x", category);
x.hidden=true;
var s=barChart.addSeries(null, dimple.plot.bar);
s.addEventHandler("click", onClick);
barChart.draw();
y.titleShape.remove();
y.shapes.selectAll("line, path").remove();
y.shapes.selectAll("text").style("text-anchor", "start")
  .style("font-size", "11px")
  .attr("transform", "translate(18, 0.5)");

svg.selectAll("title_text")
  .data(["单击选择暂停",
      "双击恢复"])
  .enter()
  .append("text")
  .attr("x", 1300)
  .attr("y", function (d, i) { return 50 + i * 15; })
  .style("font-family", "sans-serif")
  .style("font-size", "15px")
  .style("color", "Black")
  .text(function (d) { return d; });

s.shapes
   .attr("rx", 10)
   .attr("ry", 10)
   .style("fill", function (d) { return (d.y === category_list[0] ? indicatorColor.fill : defaultColor.fill) })
   .style("stroke", function (d) { return (d.y === category_list[0] ? indicatorColor.stroke : defaultColor.stroke) })
   .style("opacity", 0.4);
var bubbles = new dimple.chart(svg, data);
bubbles.setBounds(60, 50, 1200, 700)
bx=bubbles.addMeasureAxis("x", "avg");
by=bubbles.addMeasureAxis("y", "HR");
bx.title = "击球率"
bx.fontSize = "15px"
by.fontSize = "15px"
by.title = "全垒得分"
bubbles.addSeries(["avg","HR", category], dimple.plot.bubble)
bubbles.addLegend(60, 10, 410, 60);
var story = bubbles.setStoryboard(category, onTick);
story.frameDuration = 5000;
bubbles.draw();

bubbles.legends = [];
story.storyLabel.remove();
d3.select("div").append("h2").text(title).attr("align", "center").attr("id", "data-title");

function onClick(e) {
    story.pauseAnimation();
    if (e.yValue === story.getFrameValue()) {
        story.startAnimation();
    } else {
        story.goToFrame(e.yValue);
        story.pauseAnimation();
    }
}

function onTick(e) {
    if (!firstTick) {
        s.shapes
                .transition()
                .duration(frame / 2)
                .style("fill", function (d) { return (d.y === e ? indicatorColor.fill : defaultColor.fill) })
                .style("stroke", function (d) { return (d.y === e ? indicatorColor.stroke : defaultColor.stroke) });
    }
    firstTick = false;
}

}
