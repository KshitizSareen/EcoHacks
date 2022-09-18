/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import React,{useEffect, useState} from 'react';
import DatePicker from 'react-date-picker';
import { MultiSelect } from "react-multi-select-component";
import * as d3 from 'd3';
import Select from 'react-select';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";

const geoUrl = "/features.json";




function App() { 

  const [countries, setCountries] = useState([]);
  const [selectedCountries,setSelectedCountries] = useState([{
    value: 142,
    label: "Albania"
  }]);
  const [predictedCountries,setPredictedCountries] = useState(
    {
      value: 142,
      label: "Albania"
    }
  )
  const [startDate,setStartDate] = useState(new Date("2022-07-21"));
  const [endDate,setEndDate] = useState(new Date("2022-08-29"));
  const [predictedDate,setPredictedDate] = useState(new Date("2022-08-29"));
  const [worldData,setWorldData] = useState([]);
  const [aqiValue,setAqiValue] = useState(0);
  var barData = [];
  var lineData = [];
  const barChartRef = React.useRef(null);
  const lineChartRef = React.useRef(null);

  var margin = {top: 10, right: 30, bottom: 30, left: 50};
  const width = window.parent.outerWidth/2.5;
  const height = window.parent.outerHeight/2.5;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight =  height + margin.top + margin.bottom;

  const xScale = d3.scaleBand().range([0,width]).padding(0.1);
  const yScale = d3.scaleLinear().range([height,0]);


  const formatDate = d3.timeFormat("%d %b");

  
  var xAxis = d3.axisBottom(xScale)
  var yAxis = d3.axisLeft(yScale)

  var lineXScale = d3.scaleTime().range([0,width]);
  var lineYScale = d3.scaleLinear().range([height,0]);

  var lineXAxis = d3.axisBottom(lineXScale);
  lineXAxis.tickFormat(formatDate).ticks(d3.timeMonday, formatDate);
  var lineYAxis = d3.axisLeft(lineYScale);
 

  var line = d3.line().x(d=>lineXScale(d.Date))
  .y(d=> lineYScale(d.AQI));

  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 3;
  var circleRadiusHover = 6;
  var duration = 250;



  useEffect(()=>{


    var svgEl = d3.select(barChartRef.current);
    svgEl.selectAll('*').remove();

    var svg = svgEl.append("g").attr("transform",`translate(${margin.left},${margin.top})`);


    svg.append("g").attr("class","xAxis")
    .attr("transform","translate(0,"+height+")");
    

    svg.append("g")
    .attr("class","yAxis")


    var lineSvgRef = d3.select(lineChartRef.current);
    lineSvgRef.selectAll('*').remove();

    var lineSvg = lineSvgRef.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

    lineSvg.append("g").attr("class","xAxis").attr("transform","translate(0,"+height+")");
    lineSvg.append("g").attr("class","yAxis");

    lineSvg.append('g').attr('class','lines');



    /*const tooldiv = svg.append("div").style('visibility','hidden')
    .style('position','absolute')
    .style('background-color','red');*/

    
    /*
    var x=d3.scaleBand().range([0,svgWidth]);
    var xAxis = d3.axisBottom().scale(x);

    svg.append("g").attr("transform", "translate(0," + svgHeight + ")")
    .attr("class","myXaxis");

    var y = d3.scaleLinear().range([svgHeight, 0]);
    var yAxis = d3.axisLeft().scale(y);
    svg.append("g")
      .attr("class","myYaxis")
      */


  },[margin.left, margin.top]);

  useEffect(()=>{
    fetch("https://test-project-361021.wl.r.appspot.com/getcountries", {
method: 'POST'
}).then(res=>{
    res.json().then(data=>{
        let countries = [];
        let selected = [];
        let i=0;
        for(i=0;i<data.length;i++)
        {
            let option = {

            }
            option.value=data[i].CountryCode;
            option.label=data[i].Country;
            if (i===0)
            {
              selected.push(option);
            }
            countries.push(option);
        }
        setCountries(countries);

    });
});
  },[countries]);

  useEffect(()=>{
    Promise.all(buildCharts)
    .then((results) => {
     let data= results;
     console.log(data);
     barData=data;
     setData();
     setWorldData(barData);
     console.log(worldData);
    })
    Promise.all(buildLineCharts)
    .then((results)=>{
      for(let i=0;i<results.length;i++)
      {
        for(let j=0;j<results[i].length;j++)
        {
          lineData.push({
            'Index': results[i][j].index,
            'Country': results[i][j].Country,
            'Date': new Date(results[i][j].Date),
            'AQI': results[i][j].AQI,
            'timeStamp': results[i][j].timeStamp
          })
        }
      }
      setLineData();

    })
  },[selectedCountries,startDate,endDate])


  let buildCharts = selectedCountries.map(country=>{
    return fetch("https://test-project-361021.wl.r.appspot.com/getmeandata",{
      headers:{
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/json'
        },
        method: 'POST',
body: JSON.stringify({
    "intime": startDate.toString(),
    "outTime": endDate.toString(),
    "code": country.value, 
})
    }).then(res=>{
      return res.json().then(data=>{
        return {
          'Country': data[0].Country,
          'Value': data[0]['avg(AQI)']
        }
      })
  })
});

let buildLineCharts = selectedCountries.map(country=>{
  return fetch("https://test-project-361021.wl.r.appspot.com/getalldata",{
    headers:{
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json'
      },
      method: 'POST',
body: JSON.stringify({
  "intime": startDate.toString(),
  "outTime": endDate.toString(),
  "code": country.value, 
})
  }).then(res=>{
    return res.json().then(data=>{
      return data;
})
})
});




function setData()
{
  var t = d3.transition()
  .duration(750)
  console.log(barData)
  console.log(barData[0]);

  let xDomain=[]
  let yMax=0;
  console.log(barData.length);
  for(let i=0;i<barData.length;i++)
  {
    xDomain.push(barData[i].Country);
    yMax=Math.max(yMax,barData[i].Value);
  }
  console.log(xDomain);
  xScale.domain(xDomain)
  yScale.domain([0,yMax])
  var svgEl = d3.select(barChartRef.current);

  var svg = svgEl.select("g");
  svg.selectAll('.xAxis').transition(t).call(xAxis);
  svg.selectAll('.yAxis').transition(t).call(yAxis);

  const tooldiv = d3.select(".barcharttooltip");


  var bars = svg.selectAll('.bar').data(barData,function(d){
    return d.Country
  });

  bars.enter()
  .append("rect")
  .on('mouseover',(e,d)=>{
    if (d.Value<50)
    {
      tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Good");
    }
    else if(d.Value<100)
    {
      tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Moderate");
    }
    else if(d.Value<150)
    {
      tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Unhealthy For Certain Groups");
    }
    else if(d.Value<200)
    {
      tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Unhealthy");
    }
    else if(d.Value<250)
    {
      tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Very Unheatlhy");
    }
    else if(d.Value<600)
    {
      tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Hazardous");
    }
  })
  .on('mousemove',(e,d)=>{
    tooldiv.style('top',(e.pageY-20)+'px').style('left',(e.pageX-20)+'px');
  })
  .on('mouseout',()=>{
    tooldiv.style('visibility','hidden');
  })
  .attr("class","bar")
  .merge(bars)
  .transition(t)
  .attr("width",xScale.bandwidth())
  .attr("height",data => height - yScale(data.Value)-10)
  .attr("x",data=>xScale(data.Country))
  .attr("y",data=>yScale(data.Value)+10)
  .style("fill",(d)=>{
    if (d.Value<50)
    {
      return "green";
    }
    else if(d.Value<100)
    {
      return "yellow";
    }
    else if(d.Value<150)
    {
      return "#f59842";
    }
    else if(d.Value<200)
    {
      return "#ed0707";
    }
    else if(d.Value<250)
    {
      return "#540202";
    }
    else if(d.Value<600)
    {
      return "#210000";
    }
  });

  bars
  .exit()
  .remove();
}


function setLineData()
{
  var t = d3.transition()
  .duration(750)


  var svgLine = d3.select(lineChartRef.current);
  var lineSvg = svgLine.select("g");

  let minX = Infinity;
  let maxX = 0;

  let minY = Infinity;
  let maxY = 0; 

  let minDate = "";
  let maxDate = "";
  for(let i=0;i<lineData.length;i++)
  {
      if (lineData[i].timeStamp>maxX)
      {
        maxX = lineData[i].timeStamp;
        maxDate = lineData[i].Date;
      }
      if(lineData[i].timeStamp<minX)
      {
        minX = lineData[i].timeStamp;
        minDate = lineData[i].Date;
      }
      if (lineData[i].AQI>maxY)
      {
        maxY = lineData[i].AQI;
      }
      if(lineData[i].AQI<minY)
      {
        minY = lineData[i].AQI;
      }
  }
  lineXScale.domain([minDate, maxDate]);
  lineYScale.domain([minY,maxY]);

  lineSvg.selectAll('.xAxis').transition(t).call(lineXAxis);
  lineSvg.selectAll('.yAxis').transition(t).call(lineYAxis);

  const tooldiv = d3.select(".linecharttooltip");
  

  var sumstat = d3.group(lineData,d=>d.Country);

  var lines=lineSvg.selectAll(".line")
  .data(sumstat, d => d.key)
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
  
  lines.enter().append("path")
  .attr("class","line")
  .merge(lines)
  .transition(t)
  .attr("fill","none")
  .attr("stroke",function(d){ return color(d[0])})
  .attr("stroke-width",1.5)
  .transition(t)
  .attr("d",function(d)
  {
    return d3.line().x(function(d){
      return lineXScale(new Date(d.Date));
    })
    .y(function(d){
      return lineYScale(d.AQI);
    })
    (d[1])
  })

  var circle=lineSvg.selectAll(".circle")
  .data(lineData, d => d.Index)
  
  circle.enter().append("circle").on('mouseover',(e,d)=>{
    let today = d.Date;
    const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = dd + '/' + mm;
    tooldiv.style('visibility','visible').text(d.AQI+','+d.Country+','+formattedToday);
  })
  .on('mousemove',(e,d)=>{
    tooldiv.style('top',(e.pageY-20)+'px').style('left',(e.pageX-20)+'px');
  })
  .on('mouseout',()=>{
    tooldiv.style('visibility','hidden');
  })
  .attr("class","circle")
  .merge(circle)
  .transition(t)
  .attr("fill","red")
  .attr("cx", d => lineXScale(d.Date))
  .attr("cy", d => lineYScale(d.AQI))
  .attr("r", circleRadius)

  circle.exit().remove();
  lines.exit().remove();

}

useEffect(()=>{
  let country = predictedCountries;
  console.log(country);
  console.log(new Date(predictedDate).getTime());
  fetch("https://us-west2-aiplatform.googleapis.com/v1/projects/test-project-361021/locations/us-west2/endpoints/3185417127062405120:predict",{
    method: 'POST',
    headers:{
      'Authorization': 'Bearer ya29.a0AVA9y1vNO_42zMTAcxhJMTUpmvpeD8dUv6kfAeNz_ABtd5MD6K-utNMVRJTpuACGzfyjdJa6iMcMQp_e1rZO0Z8hGrYtO5HCSXx7ha_s-AIO9ZnF3kHCS12a5U4JHviZuqu-Z5EIJdzBNshIoG1ly1ah8p54Aq8NSfBB0MUaCgYKATASAQASFQE65dr8k5cSdIi1aY8RdlwoZvN8_g0174',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({

      "instances":[
        [new Date(predictedDate).getTime()/1000,country.value]
      ]
  })
  }).then((res)=>{
    res.json().then(data=>{
      setAqiValue(data.predictions[0]);
    })
  })
},[predictedCountries,predictedDate])

  return (
    <div className="App">
      <div class="barcharttooltip" style={{visibility: 'hidden', position: 'absolute',top: 10}}>10</div>
      <div class="linecharttooltip" style={{visibility: 'hidden', position: 'absolute',top: 10}}>10</div>
      <div class="worldcharttooltip" style={{visibility: 'hidden', position: 'absolute',top: 10}}>10</div>
        <div>
      <h1>Welcome to AQI Visualizer</h1>
      <div style={{
        'display': 'flex',
        'flexDirection': 'row',
        'justifyContent': 'center',
        marginTop: '2%',
        marginBottom: '10%'
      }}>
      <MultiSelect
        options={countries}
        value={selectedCountries}
        onChange={setSelectedCountries}
        labelledBy="Select Countries"
      />
      <DatePicker onChange={setStartDate} value={startDate} minDate={new Date("2022-07-21")} maxDate={new Date("2022-08-29")}/>
      <DatePicker onChange={setEndDate} value={endDate} minDate={new Date("2022-07-21")} maxDate={new Date("2022-08-29")}/>
      </div>
      </div>
      <div style={{
        'display': 'flex',
        'flexDirection': 'row',
        alignItems: 'center',
        'justifyContent': 'center'
      }}>
      <svg ref={barChartRef} width={svgWidth} height={svgHeight}/>
      <svg ref={lineChartRef} width={svgWidth} height={svgHeight}/>
      </div>
      <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}
    >
      <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
      <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const tooldiv = d3.select(".worldcharttooltip");
              const d = worldData.find((s) => s.Country === geo.properties.name);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d ? 
                    (d.Value < 50 ? "green" 
                    : d.Value<100 ? "yellow" 
                    : d.Value<150 ? "#f59842" 
                    : d.Value < 200 ? "#ed0707" 
                    : d.Value < 250 ? "#540202" 
                    : d.Value < 600 ?  "#210000" 
                    : "black" )
                    : "#F5F4F6"}
                    onMouseOver={()=>{
                      if (d.Value<50)
                      {
                        tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Good, "+d.Country);
                      }
                      else if(d.Value<100)
                      {
                        tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Moderate, "+d.Country);
                      }
                      else if(d.Value<150)
                      {
                        tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Unhealthy For Certain Groups, "+d.Country);
                      }
                      else if(d.Value<200)
                      {
                        tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Unhealthy, "+d.Country);
                      }
                      else if(d.Value<250)
                      {
                        tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Very Unheatlhy, "+d.Country);
                      }
                      else if(d.Value<600)
                      {
                        tooldiv.style('visibility','visible').text(Math.round(d.Value)+" , Hazardous, "+d.Country);
                      }
                    }}
                    onMouseMove={(e)=>{
                      tooldiv.style('top',(e.pageY-20)+'px').style('left',(e.pageX-20)+'px');
                    }}
                    onMouseOut={()=>{
                      tooldiv.style('visibility','hidden');
                    }}
                />
              );
            })
          }
        </Geographies>
    </ComposableMap>
    <h2>Predict AQI</h2>
    <div style={{
      'display': 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    }}>
            <Select
        options={countries}
        value={predictedCountries}
        onChange={setPredictedCountries}
        labelledBy="Select Country"
        isMulti={false}
      />
      <DatePicker onChange={setPredictedDate} value={predictedDate}/>
    </div>
    <div style={{
      'display': 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h3>AQI: {aqiValue}</h3>
      <div>
        {
          aqiValue < 50 ?
        <img src='/GoodImage.png' style={{
          width: width*1.5,
          height: height/2.5
        }}/>
        : 
        aqiValue< 100 ?
        <img src='/ModerateImage.png' style={{
          width: width*1.5,
          height: height/2.5
        }}/> : 
        <img src='/UnhealthyForSensitiveGroups.png' style={{
          width: width*1.5,
          height: height/2.5
        }}/> 
    }
      </div>
      </div>
    </div>
  );
}

export default App;
