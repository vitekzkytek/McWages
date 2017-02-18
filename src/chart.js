//TODO 

//    - TextBox pod mapou - pohrat si s malymi burgry neco neco takoveho? 
//    - zkonotrolovat nakolik barvy skutecne odpovidaji hodnotam
//    - opravit panning a zooming po zoomu s tlacitkem


//MAIN DEFINITIONS
var year = 2016;
var varName = 'BMPH';
var variantSelect = 'discrete';
var colorSelect = 'GreenOrange';


var legendProperties = {
		"texts" : {
				"gradient" : { "BMPH" : ['0','0.2','0.4','0.6','0.8','1'],
							   "McWages" : ['0','20','40','60','80','100'],
							   "McWages_PPP" : ['0','20','40','60','80','100'],
							   "BigMacPrice" : ['0','20','40','60','80','100']
								},
				"discrete" : { "BMPH" : ['< 0.2', '0.2 - 0.4','0.4 - 0.6','0.6 - 0.8','> 0.8'],
							   "McWages" : ['< 20', '20 - 40','40 - 60','60 - 80','> 80'],
							   "McWages_PPP" : ['< 20', '20 - 40','40 - 60','60 - 80','> 80'],
							   "BigMacPrice" : ['< 20', '20 - 40','40 - 60','60 - 80','> 80']
								}
					},
		"minmax" : {
				"BMPH" : [0,1],
				"McWages" : [0,100],
				"McWages_PPP":[0,100],
				"BigMacPrice" : [0,100]
		},
		"colors" : {
			"discrete" : {
				"GreenOrange" : ['#75995A',"#AAC92D","#E0D819","#EEBB11","#FD9B08"],
				"BlueOrange" : ["#69D2E7","#9fe7f5","#E0E4CC","#F38630","#FA6900"],
				"LightGreenOrange" : ["#BBBB88","#CCC68D","#EEDD99","#EEC290","#EEAA88"]
				},
			"gradient" : {	
				"GreenOrange" : ['#75995A','#90B144',"#AAC92D",'#C5D123',"#E0D819","#E7CA15","#EEBB11",'#F6AB0D',"#FD9B08"],
				"BlueOrange" : ["#69D2E7",'#84DDEE',"#9fe7f5",'#C0E6E1',"#E0E4CC",'#EAB57E',"#F38630",'#F77818',"#FA6900"],
				"LightGreenOrange" : ["#BBBB88",'#C4C18B',"#CCC68D",'#DDD293',"#EEDD99",'#EED095',"#EEC290",'#EEB68C',"#EEAA88"]
				}
			}
		};

var max;	
var min;
var colorScale;
var tooltipfloat;

// CONTROLLING VARIANTS AND VARIABLES

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

// MAIN LOADING FUNCTION
function LoadMap()
{
	max = legendProperties.minmax[varName][1];
	min = legendProperties.minmax[varName][0];
	
	var zoom = d3.zoom()
	.scaleExtent([1, 5])
	.on("zoom", zoomed);
		
	var svg = d3.select("#gContainer").call(zoom)

	$('.ActiveState').removeClass('ActiveState');
	$('#linear-gradient').remove();

	if( variantSelect == 'gradient') {
		var linearGradient = d3.select('#defs').append('linearGradient').attr('id','linear-gradient');
		
		linearGradient // mozna ze y ma byt 50 %, podle obrazku v blogu
					.attr('x1','0%')
					.attr('y1','0%')
					.attr('x2','100%')
					.attr('y2','0%');
		
		colorScale = d3.scaleLinear().range(legendProperties.colors.gradient[colorSelect])
		linearGradient.selectAll('stop')
				.data(colorScale.range())
				.enter()
				.append('stop')
				.attr('offset',function(d,i) {return i/(colorScale.range().length-1);} )
				.attr('stop-color',function(d) {return d; });
	}
	
	var colorCont;
	var rangeCont;
	if (variantSelect == 'gradient')
	{
		colorCont = legendProperties.colors.gradient[colorSelect];
		rangeCont = generateDomRange(legendProperties.colors.gradient[colorSelect]);
	}
	else 
	{
		colorCont = legendProperties.colors.discrete[colorSelect];
		rangeCont = generateDomRange(legendProperties.colors.discrete[colorSelect]);
	}
	
	$.each(data.Countries,function(d)
		{
			var val = this[year][varName];
			if(val != 'NA')
				{
					$('#' +d).css('fill',ValToCol(val,colorCont,rangeCont));					
					$('#' + d).addClass('ActiveState');

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
// HELPING FUNCTIONS - COLORS

function ValToCol(val,colorCont,rangeCont)
{
	var result = '';
	

	for (i =0; i < rangeCont.length; i++)
		{
			if((val >= rangeCont[i][0]) && (val < rangeCont[i][1]))
				{
					result = colorCont[i];
					break;
				}
		}
	return result;	
};

function generateDomRange(colorCont)
{
	var result = [];
	var inter = (max-min)/colorCont.length;
	var last = min;
	for( i = 0; i < colorCont.length; i++)
		{
			result.push([last, min + (i+1) * inter]);
			last = min + (i+1) * inter;
			
		}
	return result;
}

function drawLegend()
{
	d3.select("#svgLegend").selectAll("*").remove();
	var svgLegend = d3.select('#svgLegend');
		svgLegend.append('text')
		.attr('class','legend-text')
		.attr('y','18px')
		.text(data.seriesDetails[varName].desc)

	var colors;
	var texts;
	
	if(variantSelect == 'gradient')
		{	
			rectWidth = 300;
			svgLegend.append('rect')
				.attr('id','rectGradient')
				.attr('width',rectWidth)
				.attr('height',10)
				.attr('x',180)
				.attr('y',9)
				.style('fill','url(#linear-gradient)');
			
			texts = legendProperties.texts.gradient[varName]
			
			interval = rectWidth /(texts.length-1)
			svgLegend.selectAll('g')
				.data(texts)
				.enter()
				.append('text')
				.attr('class','legend-text')
				.attr('x',function (d,i) { return 180 + i * interval; })
				.attr('y',35)
				.attr('text-anchor','middle')
				.text(function (d) {return d;})
		}
	else 
		{
			colors = legendProperties.colors.discrete[colorSelect];
			texts = legendProperties.texts.discrete[varName];
		
	
		  var legend = d3.select('#svgLegend').selectAll(".legend")
		  				.data(colors)
		  				.enter()
		  				.append("g")
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
		}
};

function zoomed() {
	  d3.select('#gContainer').attr("transform", d3.event.transform);
	};



function TransformZoom(s,ZoomName){
	g = d3.select('#gContainer').transition().duration(750).attr('transform',s);
	if (ZoomName != 'Zoom Out')
		{
			$('#btnZoom').html(ZoomName  +    '  <img src="src/down-arrow.png" class="menu-icon" />');
			$('#divZoomOut').css('display','inline-block');
		}
	else 
		{
			$('#btnZoom').html('Zoom to  ' +  '<img src="src/down-arrow.png" class="menu-icon" />')
			$('#divZoomOut').css('display','none')
		}
};

function handleEvents()
{
	d3.select('#tooltip').selectAll("*").remove();
			div = d3.select('#tltpflt')
			tooltip = d3.select('body').append('div')
				.attr('class','tooltipfloat')
				.style('opacity',0);
			
			g = d3.selectAll('.state')
				.on('mouseover', function () {
					if (data.Countries.hasOwnProperty(this.id)){
							tooltip.transition()
							.duration(200)
							.style('opacity',0.85);
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
			 				.style('top',(d3.event.pageY - 28) + 'px');
		 			}});


};

function getTooltipText(el){
	var s = "<b>" + data.Countries[el].FullName + ":</b> " + Math.round(data.Countries[el][year][varName] * 10)/10 + " " + data.seriesDetails[varName].desc;
	return s
}