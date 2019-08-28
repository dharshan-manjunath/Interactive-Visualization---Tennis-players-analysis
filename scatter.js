var data = [];

var width = 1200;
var height = 1000;

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}



//define row information
function row(d) {
    if ((d.player1 == "Stanislas Wawrinka"||d.player1=="Rafael Nadal" || d.player1=="Roger Federer" || 
        d.player1=="Andy Murray" || d.player1=="Novak Djokovic"|| d.player1=="Andy Roddick") 
        && d.FirstandSecondPointWon1 > 0 && d.return2 > 0 && d.return1>0 &&  d.total1>0 && d.total2>0 && d.avgFirstServe1>0 && d.avgFirstServe2>0 && d.ace1>0 && d.ace2>0 && d.error1 > 0 && d.error2> 0)
  return {
    year: +d.year, // convert "Year" column to number
    player1: d.player1,
    ace1: +d.ace1,
    firstServe1: +d.firstServe1,
    net1: +d.net1,
    firstPointWon1: +d.firstPointWon1,
    secPointWon1: +d.secPointWon1,
    FirstandSecondPointWon1: +d.FirstandSecondPointWon1,
    return1: +d.return1,
    total1: +d.total1,
    error1: +d.error1,
    player2: d.player2,
    ace2: +d.ace2,
    avgFirstServe2: +d.avgFirstServe2,
    firstServe2: +d.firstServe2,
    net2: +d.net2,
    firstPointWon2: +d.firstPointWon2,
    secPointWon2: d.secPointWon2,
    FirstandSecondPointWon1: +d.FirstandSecondPointWon1,
    return2: +d.return2,
    total2: +d.total2,
    error2: +d.error2
    

  };
}

//load csv file
d3.csv("data/10yearAUSOpenMatches.csv", row, function(error, csv_data){
    csv_data.forEach(function (d) {
        data.push({ 
    year: d.year, // convert "Year" column to number
    player1: d.player1,
    ace1: d.ace1,
    firstServe1: d.firstServe1,
    net1: d.net1,
    firstPointWon1: d.firstPointWon1,
    secPointWon1: d.secPointWon1,
    FirstandSecondPointWon1: d.FirstandSecondPointWon1,
    return1: d.return1,
    total1: d.total1,
    error1: d.error1,
    player2: d.player2,
    ace2: d.ace2,
    avgFirstServe2: d.avgFirstServe2,
    firstServe2: d.firstServe2,
    net2: d.net2,
    firstPointWon2: d.firstPointWon2,
    secPointWon2: d.secPointWon2,
    FirstandSecondPointWon1: d.FirstandSecondPointWon1,
    return2: d.return2,
    total2: d.total2,
    error2: d.error2});
    });
console.log(data[0]);
    // Define the div for the tooltip
    var tooltip = d3.select("body").append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

    var scale_y = d3.scale.linear()
                    .domain([
                            d3.max(data, function(d) { return d.return2; })+2.5,
                            d3.min(data, function(d) { return d.return2; })-0.2
                            ])
                    .range([0, 550]);
                                

    var scale_x = d3.scale.linear()
                    .domain([
                            d3.min(data, function(d) { return d.FirstandSecondPointWon1; })-5,
                            d3.max(data, function(d) { return d.FirstandSecondPointWon1; })+2.5
                            ])
                    .range([0, 1000]);
    
   
    var data_svg = d3.select(".scatterdiv")
                    .append("svg")
                    .attr("class","scatter")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform","translate(80,20)");

    //Showing the X-axis showing percentage of first and second points Won and Y-axis showing Opponents Return percentage                
    var xAxis = d3.svg.axis()
    .scale(scale_x)
                .innerTickSize(7)
                .outerTickSize(3)
                .orient("bottom");

    var yAxis = d3.svg.axis()
    			.scale(scale_y)
    			.orient("left")
    			.innerTickSize(7)
    			.outerTickSize(3);


    data_svg.append("svg:g")
            .call(xAxis)
            .attr("transform", "translate(77,569)")
            .style("font-size","15px")
            .style("font-family", "Arial");

    data_svg.append("svg:g")
            .call(yAxis)
            .attr("transform", "translate(80,19)")
            .style("font-size","15px")
            .style("font-family", "Arial");

    data_svg.append("text")      // text label for the x axis
            .attr("transform", "translate(600,635)")
            .style("text-anchor", "middle")
            .text("First and Second Point Won Percentage")
            .style("font-size","25px")
            .style("font-family", "Arial");

    data_svg.append("text")     //text label for y axis
            .attr("transform", "rotate(-90)")
           // .attr("y", 0 – margin.left)
        	.attr("x",0 - (height / 2))
        	.attr("dy", "1em")
        	.attr("dx","10em")
            .text("Opponent Return Percentage ")
            .style("text-anchor", "middle")
            .style("font-size","22px")
            .style("font-family", "Arial"); 
                                       

    var default_opacity = 0.5;
    var colorScale = d3.scale.category10(); 

    var radiusScale = d3.scale.linear().domain([
                            d3.min(data, function(d) { return d.total1; }),
                            d3.max(data, function(d) { return d.total1; })
                            ]).range([1, 20]);

    function color(d) {
            return d.player1;   
    }

    function radius(d) {
        return d.total1;
    }

    // Defines a sort order so that the smallest dots are drawn on top.
    function order(a, b) {
        return radius(b) - radius(a);
    }

    

    var data_g = data_svg.selectAll("circle")
        .data(data)
        .enter()
        .append("g");

    var data_radar = [
                        [
                        {axis: "First Point Won", value: 0},
                        {axis: "Second Point Won", value: 0},
                        {axis: "First Serve", value: 0},
                        {axis: "Net", value: 0},
                        {axis: "Ace", value: 0},
                        {axis: "Return", value: 0},
                        {axis: "Error", value: 0},
                        {axis: "Total", value: 0}
                        
                        ]
                    ];

    RadarChart.draw("#chart", data_radar);


    var data_circles = data_g.append("circle")
        .attr("cx", function(d) {
            return scale_x(d.FirstandSecondPointWon1+2.5);
        })
        .attr("opacity", default_opacity)
        .attr("cy", function(d) {
            return scale_y(d.return2-0.7);
        })
        .attr("r", function(d) {
            return radiusScale(radius(d));
        })
        .style("fill", function (d) {
            return colorScale(color(d));
        })
        .attr('class',function(d){
            return d.player1.replace(' ','_');
        })
        .on("mouseover", function(d) {
            d3.selectAll("." +d.player1.replace(' ','_'))
                .moveToFront()
                .style("opacity", 0.8);
            d3.selectAll("circle:not(." +d.player1.replace(' ','_') +")")
                .style("opacity", 0.1);

            //tooptip appears
            tooltip.transition()        
                .duration(200)      
                .style("opacity", .9);      
            tooltip.html("<b>" +d.player1 + "</b><br>Year: " +d.year +"<br>Opponent: " +d.player2+"<br>First and second Point Won: " + d.FirstandSecondPointWon1 +"% <br>Opponent Return: " +d.return2 +"%<br>Total points : " +d.total1)  
                .style("left", (d3.event.pageX + (radius(d)/2)*0.1) + "px")     
                .style("top", (d3.event.pageY + (radius(d)/2)*0.1) + "px");

            document.getElementById('chart').style.display = "block";
            
            var data = [
                            [
                            {axis: "First Point Won", value: d.firstPointWon1},
                            {axis: "Second Point Won", value: d.secPointWon1},
                            {axis: "First Serve", value: d.firstServe1},
                            {axis: "Net", value: d.net1},
                            {axis: "Ace", value: d.ace1*10},
                            {axis: "Return", value: d.return1},
                            {axis: "Error", value: d.error1},
                            {axis: "Total", value: d.total1/2}
                            
                            ],[
                            {axis: "First Point Won", value: d.firstPointWon2},
                            {axis: "Second Point Won", value: d.secPointWon2},
                            {axis: "First Serve", value: d.firstServe2},
                            {axis: "Net", value: d.net2},
                            {axis: "Ace", value: d.ace2*10},
                            {axis: "Return", value: d.return2},
                            {axis: "Error", value: d.error2},
                            {axis: "Total", value: d.total2/2}
                            
                            ]
                        ];

            RadarChart.draw("#chart", data);

        })

        .on("mouseout", function(d) {
            document.getElementById('chart').style.display = "hidden";
            d3.selectAll("circle")
                .style("opacity", default_opacity);

            //tooptip disappears
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
            var data = [
                            [
                        {axis: "First Point Won", value: 0},
                        {axis: "Second Point Won", value: 0},
                        {axis: "First Serve", value: 0},
                        {axis: "Net", value: 0},
                        {axis: "Ace", value: 0},
                        {axis: "Return", value: 0},
                        {axis: "Error", value: 0},
                        {axis: "Total", value: 0}
                        
                        ]
                        ];

            RadarChart.draw("#chart", data);
        })
        .sort(order);

    // colorScale.domain(function(d) { return d.player1; });

    //console.log(colorScale.domain().slice());


    var legend = data_svg.selectAll("svg")
    .data(colorScale.domain())
    .enter().append("g")
    .attr("class","legend")
    .attr("transform", function(d,i) {
        //console.log(i);
        return "translate(" +(i+1)*15 +",0)";
    });


    legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("transform", function(d,i) {
        return "translate(" +(i*(160+i)) +",0)";
    })
    .style("fill", colorScale);
    
    legend.append("text")
    .data(colorScale.domain())
    .attr("id", function(d){return "text_"+d.replace(" ","_");})
    .attr("transform", function(d,i) {
        return "translate(" +(i*(160+i)+25) +",16)";
    })
    .text(function(d) { 
        //console.log(d);
        return d;})
    .on("click", function(d) {
        //console.log(d.replace(' ','_'));
        var appBanners = document.getElementsByClassName(d.replace(' ','_'));


        for (var i = 0; i < appBanners.length; i ++) {
            //console.log("bba");
            
            if (!isHidden(appBanners[i])) {
                appBanners[i].style.display = 'none';
                d3.select(this).attr("fill","#155555");
                document.getElementById("text_" +d.replace(" ","_")).style.opacity = 0.4;
                document.getElementById("text_" +d.replace(" ","_")).style.color = "#155555";
            }

            else {
                appBanners[i].style.display = 'block';
                d3.select(this).attr("fill","black");
                document.getElementById("text_" +d.replace(" ","_")).style.color = "black"
                document.getElementById("text_" +d.replace(" ","_")).style.opacity = 1;
            }

        }
    })

    .style("text-anchor", "start")
    .style("font-size","20px")
    .style("font-family","helvetica");


 
});