
//ToDo - DDL pro year a variable,tooltip, dat na github, doladeni hoveru, handling NAs, PRIDEJ HONKKONG, SINGAPUR mozna brunei, 
// v mape uplne chybi Bahrain, musim ho dokreslit - vzhledem k tomu, ze to ani nespadlo, tak to asi budu muset zkontrolovat		

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
			//zamysli se jestli budes loadovat vzdycky znovu, nebo budes muset po zmene promenne ci roku odebrat u tech, kde nic neni
			val = this[year][varName]
			$('#' +d).css('fill',getColorFromValue(val,dom,cols));
		}
    );
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
 
