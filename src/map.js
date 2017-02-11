
//ToDo - DDL pro year a variable,tooltip, dat na github, doladeni hoveru, handling NAs, PRIDEJ HONKKONG, SINGAPUR mozna brunei, 
// v mape uplne chybi Bahrain, musim ho dokreslit - vzhledem k tomu, ze to ani nespadlo, tak to asi budu muset zkontrolovat		


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


function LoadMap(varName,year)
{
	var max = getMax(data.Countries,year,varName);
	var min = getMin(data.Countries,year,varName);
	dom = [min,max]
	cols = ['rgba(247,128,37,0.3)','rgba(247,128,37,1)']
	$.each(data.Countries,function(d)
		{
			//zamysli se jestli budes loadovat vzdycky znovu, nebo budes muset po zmene promenne ci roku odebrat u tech, kde nic neni
			val = this[year][varName]
			$('#' +d).css('fill',getColorFromValue(val,dom,cols));
		}
    );
	//		var states = d3.selectAll('#mapGroup')
		//		.data(data.Countries, function (d) {
			//		return d.ID;
//})
	//			.style('fill',function(d,i) {return(getColorFromValue(d[year][varName])); })
			

}


function TransformZoom(s,ZoomName){

	g = d3.select('#mapGroup').transition().duration(750).attr('transform',s);
	
	if(ZoomName != 'Zoom Out')
		{
			//$('.dropdown-content').css('display','none')
			//$('.dropdown:hover .dropdown-content').css('display','block')
			//$('.dropdown-content').hide();
			//$('.dropdown-content').attr('style','')
			$('#zoomBtn').text(ZoomName);
			$('#zoomOutBtn').css('display','inline-block');
		}
	else 
		{
			$('#zoomBtn').text('Zoom to')
			$('#zoomOutBtn').css('display','none')
		}
}
 

function ZoomSouthAmerica()
{
	TransformZoom('translate(-400,-1200) scale(3,3)', 'South America');
}

function ZoomMiddleEast()
{
	TransformZoom('translate(-2500,-1450) scale(5,5)', 'Middle East');
}

function ZoomAsiaSouth()
{
	TransformZoom('translate(-1850,-1100) scale(3,3)','Indian Ocean');
}

function ZoomAsiaNorth()
{
	TransformZoom('translate(-1400,-300) scale(2.5,2.5)','North Asia');
}

function ZoomEurope()
{
	TransformZoom('translate(-2000,-1150) scale(5,5)');
}

function ZoomNorthAmerica()
{
	TransformZoom('translate(150,-150) scale(2,2)');
}

function ZoomWorld()
{
	TransformZoom('translate(0,0) scale(1,1)','Zoom Out');
}
