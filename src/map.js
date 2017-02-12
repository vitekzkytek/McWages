
//ToDo - doladeni hoveru, doladeni tooltip textu
var year = 2016;
var varName = 'BMPH'

function getColorFromValue(val,dom,cols)
{
	var colorScale = d3.scaleLinear().domain(dom).range(cols);
	return colorScale(val)
	//return('rgba(245,128,37,' + (0.5 + (val/2))+ ')');
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

function LoadMap()
{
	var max = getMax(data.Countries,year,varName);
	var min = getMin(data.Countries,year,varName);
	dom = [min,max]
	cols = ['rgba(247,128,37,0.3)','rgba(247,128,37,1)']
	$.each(data.Countries,function(d)
		{
			val = this[year][varName]
			if(val != 'NA')
				{
					$('#' +d).css('fill',getColorFromValue(val,dom,cols));
				}
			else
				{
					$('#' + d).css('fill','#CCCCCC')
				}
			
			
		}
    );
	handleEvents();
};

function TransformZoom(s,ZoomName){

	g = d3.select('#mapGroup').transition().duration(750).attr('transform',s);
	
	if(ZoomName != 'Zoom Out')
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
	var s = "<b>" + data.Countries[el].FullName + "</b>";
	return s
}