const array = [...document.querySelectorAll(`.totalVolume`)];
const barchartDiv = document.querySelector('.barchart');

let width = 960;
let height = 300;

let dataArray = [];
for (let i = 0; i < array.length; i++) {
  dataArray.push(parseInt(array[i].dataset.totalvolume));
}

const yMin = d3.min(dataArray);
const yMax = d3.max(dataArray);

const yScale = d3.scaleLinear().domain([0, yMax]).range([0, height]);

const svg = d3
  .select('.barchart')
  .append('svg')
  .attr('viewBox', `0 0 ${width} ${height}`);

svg
  .selectAll('rect')
  .data(dataArray)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('height', yScale)
  .transition()
  .attr('width', width / array.length)
  .transition()
  .attr('x', function (d, i) {
    return i * (width / array.length);
  })
  .attr('y', function (d, i) {
    return height - yScale(d);
  });

svg
  .selectAll('text')
  .data(dataArray)
  .enter()
  .append('text')
  .text(function (d) {
    return d;
  })
  .attr('class', 'text')
  .attr('x', function (d, i) {
    return i * (width / array.length) + 25;
  })
  .transition()
  .duration(1200)
  .attr('y', function (d, i) {
    return height + 30 - yScale(d);
  });
