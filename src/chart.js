//TODO 
//    - Tooltip - bud 2 moznosti nebo se pro jednu rozhodnout + v Evrope se zobrazuje velmi nizko
//    - Gradient - uplne celej, vcetne tri konkretnich navrhu
//    - Dokoncit Zoom menu - stabilni pozice hlavne dukladne otestovat
//    - ZoomOut hover nefunguje
//    - TextBox pod mapou - pohrat si s malymi burgry neco neco takoveho? 
//    - nefunguji jine promenne nez BMPH
//    - zpresni zoomovani
//    - opravit panning a zooming po zoomu s tlacitkem


//MAIN DEFINITIONS
var year = 2016;
var varName = 'BMPH';
var variantSelect = '"rete';
var colorSelect = 'GreenOrange';
var domRanges =  {
	"BMPH": [[0,0.20],[0.20,0.40],[0.40,0.60],[0.60,0.80],[0.80,1]],
	"McWages":[[0,20],[20,40],[40,60],[60,80],[80,100]],
	"McWages_PPP":[[0,20],[20,40],[40,60],[60,80],[80,100]],
	"BigMacPrice": [[0,20],[20,40],[40,60],[60,80],[80,100]]
}
//var colRange = ['#BBBB88','#CCC68D','#EEDD99','#EEC290','#EEAA88'];//A7DBD8 96ddeb f38630
var legendText = ['< 0.2', '0.2 - 0.4','0.4 - 0.6','0.6 - 0.8','> 0.8'];
var transitionCols = ['#69D2E7','#FA6900'];
var max;	
var min;
var discretes = {
		"GreenOrange" : ['#75995A',"#AAC92D","#E0D819","#EEBB11","#FD9B08"],
		"BlueOrange" : ["#69D2E7","#9fe7f5","#E0E4CC","#F38630","#FA6900"],
		"LightGreenOrange" : ["#BBBB88","#CCC68D","#EEDD99","#EEC290","#EEAA88"]
}

var gradients = {
		
}



//CONTROLLING VARIANTS AND VARIABLES

function changeVariant(variant,colors,id)
{
	    $(".credit a").removeClass("activeVariant");
	    $('#' + id).addClass("activeVariant");   


	colorSelect = colors
	variantSelect = variant;
	LoadMap();
};

function changeYear(xYear)
{
	year = xYear;
	$('#btnYear').html(xYear + '  <img src="src/down-arrow.png" class="menu-icon" />');
	LoadMap();
}

function changeVar(xVar)
{
	varName = xVar;
	$('#btnVar').html(data.seriesDetails[xVar].desc + '  <img src="src/down-arrow.png" class="menu-icon" />' );
	LoadMap();
}

//MAIN LOADING FUNCTION
function LoadMap(version)
{
	max = getMax(data.Countries,year,varName);
	min = getMin(data.Countries,year,varName);
	var zoom = d3.zoom()
	.scaleExtent([1, 5])
	.on("zoom", zoomed);
	
	var svg = d3.select("#gContainer").call(zoom)

	$('.ActiveState').removeClass('ActiveState');

	
	$.each(data.Countries,function(d)
		{
						val = this[year][varName]
			if(val != 'NA')
				{
					$('#' +d).css('fill',getColorFromValue(val));					
					$('#' + d).addClass('ActiveState')

				}
			else
				{
					$('#' + d).css('fill','#AAAAAA')
				}
		}
    );
	handleEvents();
	drawLegend();
};
//HELPING FUNCTIONS - COLORS
function getColorFromValue(val,dom)
{
	var colorScale;
	
	if (variantSelect == 'gradient') {
		colorScale = d3.scaleLinear().domain([min,max]).range(transitionCols).interpolate(d3.interpolateHcl);
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
			if((val >= domRanges[varName][i][0]) && (val < domRanges[varName][i][1]))
				{
					result = discretes[colorSelect][i];
					break;
				}
		}
	return result;	
};

//MAX-MIN
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
			colors = discretes[colorSelect];
			texts = legendText
		}
	
		  var legend = d3.select('#svgLegend').selectAll(".legend")
		  				.data(colors)
		  				.enter().append("g")
		  				.attr("class", "legend")
		  				.attr("transform", function(d, i) { return "translate(" + i * 100 + ",5)"; });
		
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
			$('#divZoomOut').css('display','inline-block');
		}
	else 
		{
			$('#zoomBtn').text('Zoom to')
			$('#divZoomOut').css('display','none')
		}
};

function handleEvents()
{
	var tooltip = d3.select("#tltp").append("div")
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
			}});

};

function getTooltipText(el){
	var s = "<b>" + data.Countries[el].FullName + ":</b> " + Math.round(data.Countries[el][year][varName] * 10)/10 + " " + data.seriesDetails[varName].desc;
	return s
}