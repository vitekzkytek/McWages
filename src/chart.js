//var data= data;
var year = 2016;
var varName = 'BMPH';
var variantSelect = 'bins';
var domRange = [[0,0.20],[0.20,0.40],[0.40,0.60],[0.60,0.80],[0.80,1]];
var colRange = ['#69D2E7','#A7DBD8','#E0E4CC','#F38630','#FA6900'];
var legendText = ['< 0.2', '0.2 - 0.4','0.4 - 0.6','0.6 - 0.8','> 0.8'];
var transitionCols = ['rgba(105,210,231,1)','rgba(250,105,0,1)'];
var max = getMax(data.Countries,year,varName);
var min = getMin(data.Countries,year,varName);


function getColorFromValue(val,dom)
{
	var colorScale;
	
	if (variantSelect == 'gradient') {
		colorScale = d3.scaleLinear().domain([min,max]).range(transitionCols);
		return colorScale(val);
	}
	else {

		return ValToCol(val);
	}
	
};

function ValToCol(val)
{
	var result = '';
	for (i =0; i < 5; i++)
		{
			if((val >= domRange[i][0]) && (val < domRange[i][1]))
				{
					result = colRange[i];
					break;
				}
		}
	return result;	
};

function getMax(countries, year,varName) {
    var max;
    for (var country in countries)    {
    	if (!max || parseFloat(countries[country][year][varName]) > max)
    		{max = parseFloat(countries[country][year][varName])}
    }
    return max;
};

function getMin(countries, year,varName) {
    var min;
    for (var country in countries)    {
    	if (!min || parseFloat(countries[country][year][varName]) < min)
    		{min = parseFloat(countries[country][year][varName])}
    }
    return min;
};

function changeVariant(variant)
{

		$('#gradient-link').toggleClass('activeVariant')
		$('#discrete-link').toggleClass('activeVariant')
	variantSelect = variant;
	LoadMap();
}

function changeYear(xYear)
{
	year = xYear;
	$('#btnYear').text(xYear);
	LoadMap();
}

function changeVar(xVar)
{
	varName = xVar;
	$('#btnVar').text(data.seriesDetails[xVar].desc);
	LoadMap();
}

function LoadMap(version)
{
	var zoom = d3.zoom()
	.scaleExtent([1, 5])
	.on("zoom", zoomed);
	
	var svg = d3.select("#gContainer").call(zoom)


	
	$.each(data.Countries,function(d)
		{
			val = this[year][varName]
			if(val != 'NA')
				{
					$('#' +d).css('fill',getColorFromValue(val));
				}
			else
				{
					$('#' + d).css('fill','#CCCCCC')
				}
		}
    );
	handleEvents();
	drawLegend();
};

function drawLegend()
{
	d3.select("#svgLegend").selectAll("*").remove();
	d3.select('#svgLegend')
		.append('text')
		.attr('class','legend-text')
		.attr('y','18px')
		.text(data.seriesDetails[varName].desc)
		
	var colors;
	var texts;
	
	if(variantSelect == 'gradient')
		{
			colors = [min,max].map(getColorFromValue)
			texts = ['0','1']
		}
	else 
		{
			colors = colRange;
			texts = legendText
		}
	
		  var legend = d3.select('#svgLegend').selectAll(".legend")
		  				.data(colors)
		  				.enter().append("g")
		  				.attr("class", "legend")
		  				.attr("transform", function(d, i) { return "translate(" + i * 90 + ",5)"; });
		
		  legend.append("rect")
			      .attr("x", 180)
			      .attr("width", 18)
			      .attr("height", 18)
			      .style("fill", function(d,i) {return colors[i]; });
		  legend.append("text")
			      .attr("x", 170)
			      .attr("y", 9)
			      .attr("dy", ".35em")
			      .attr('class','legend-text')
			      .style("text-anchor", "end")
			      .text(function(d,i) {return texts[i]; })
};

function zoomed() {
	  d3.select('#gContainer').attr("transform", d3.event.transform);
	};



function TransformZoom(s,ZoomName){
	g = d3.select('#gContainer').transition().duration(750).attr('transform',s);
	if (ZoomName != 'Zoom Out')
		{
			$('#zoomBtn').text(ZoomName);
			$('#zoomOutBtn').css('display','inline-block');
		}
	else 
		{
			$('#zoomBtn').text('Zoom to')
			$('#zoomOutBtn').css('display','none')
		}
};

function handleEvents()
{
	var tooltip = d3.select("body").append("div")
	.attr("class","tooltip")
	.style("opacity",0);
	
	g = d3.selectAll('.state')
		.on('mouseover', function() {
			if (data.Countries.hasOwnProperty(this.id)){
			tooltip.transition()
				.duration(200)
				.style('opacity',0.9);
			tooltip.html(getTooltipText(this.id))
			}})
		.on('mouseout',function(){
			if (data.Countries.hasOwnProperty(this.id)){
			tooltip.transition()
			.duration(500)
			.style('opacity',0);
			}})
		.on('mousemove',function(){
			if (data.Countries.hasOwnProperty(this.id)){			
			tooltip
				.style('left', d3.event.pageX + 'px')
				.style('top',(d3.event.pageY - 28) + 'px')
			}});
};

function getTooltipText(el){
	var s = "<b>" + data.Countries[el].FullName + ":</b> " + Math.round(data.Countries[el][year][varName] * 10)/10 + " " + data.seriesDetails[varName].desc;
	return s
}