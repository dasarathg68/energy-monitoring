
import styles from "../../styles/TopDevices.module.css"
import ReactApexChart from "react-apexcharts";
export const MonthPowerTotalSingle = ({monthPowerUsage,devicesWithName})=>{
  // console.log("mon",monthPowerUsage)
  //  monthPowerUsage.map((data)=>{
  //   // console.log("hi",data)
  //   for(let i of devicesWithName){
  //     if(i.deviceid==data.name){
  //         data.name =i.name;
  //     }
  //   }
  // })
  let categories =[]

  if(monthPowerUsage[0]){
  // console.log("usage stats",monthPowerUsage[0].data.length)
  for(let i=1;i<=monthPowerUsage[0].data.length;i++){
      categories.push(i)
  }
  // console.log("categoriesss",categories)
  }
    const options = {
      series:monthPowerUsage,
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,    
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      dataLabels: {
        enabled:false
      },
      xaxis: {
        // categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
        categories: categories,
        labels:{
            style:{
                colors:"#FFF",
                fontSize:"10px"
            }
          },
        axisTicks:{
            show:false
          },
          axisBorder:{
            show:false
          },
      },
      grid:{
        show:false
      }
      ,
      axisTicks:{
        show:false
      },
     
      yaxis: {
        labels: {
            formatter: function (value) {
                return value.toFixed(1);
            },
            style: {
                colors: "#FFF"
            }
        }
    }
,    
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " kWh"
          }
        }
      },
      fill: {
        opacity: 1
      },
     
      legend: {
        position: 'top',
        labels:{
          colors:"#FFF"
        }
      },
    },
  
  
  };
    
    return <>
    <div  className={styles.hourlypowercontainer}>
    <div style={{}}>Month Power Total</div>
    <div id="chart" style={{color:"black"}}>
    <ReactApexChart options={options.options} series={options.series} type="bar" height={250} />
              </div>
    

    </div>
    </>
}