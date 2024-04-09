import styles from "../../styles/TopDevices.module.css"
import ReactApexChart from "react-apexcharts";
export const HourlyPowerSingle =({powerUsageTodayHourly,devicesWithName})=>{
   
    const options = {
          series:powerUsageTodayHourly,
    //     series: [
    //         // {
    //     //   name: 'Marine Sprite',
    //     //   data: [44, 55, 41, 37, 22, 43, 21]
    //     // }, {
    //     //   name: 'Reborn Kid',
    //     //   data: [25, 12, 19, 32, 25, 24, 10]
    //     // }
    // ],
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
            categories: [
                "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
                "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
                "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
            ],
            labels:{
                style:{
                    colors:"#FFF",
                    fontSize:"10px"
                },
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
        },
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
    return (
        <div className={styles.hourlypowercontainer}>
Hourly Power by Device       
<div id="chart" style={{color:"black"}}>
                <ReactApexChart options={options.options} series={options.series} type="bar" height={250} />
              </div>
  </div>
    );
}