import styles from "../../styles/TopDevices.module.css"
import ReactApexChart from "react-apexcharts";
export const SevenDaysUsageSingle =({sevenDaysUsage})=>{
    // console.log(sevenDaysUsage)
    // let newvar = sevenDaysUsage.reverse()
    // console.log(newvar)
   let data=sevenDaysUsage.map(day=>day.totalPower.toFixed(3))
    data.reverse()
    // console.log(data)
    const options = {
          
        series: [{
            name:'Usage',
          data:   data      
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          fill:{
                colors:"#228B22"
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            
            }
          },
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: sevenDaysUsage.map(day=>day.date).reverse(),
            axisTicks:{
                show:false
              }
              ,
              labels:{
                style:{
                    colors:"#FFF"
                }
              },
              axisBorder:{
                show:false
              },
          },
          yaxis:{
            labels:{
                style:{
                    colors:"#FFF"
                }
              }
          },
          grid:{
            show:false
          }
          ,
          axisTicks:{
            show:false
          },
         
          
          responsive: [{
            breakpoint: 1200,
            options: {
              chart: {
                width: 375
              },}}],
        tooltip: {
            y: [{
              // seriesName: 'Gait Parameters',

              formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                return `${value.toFixed(3)} kWh`

              }
            }]
        }
        },
        
      
      
      };
    return (
        <div className={styles.sevendaysusagecontainer}>
Last 7 days Power Usage        
<div id="chart" style={{display:"flex", justifyContent:"center",color:"black"}}>
                <ReactApexChart options={options.options} series={options.series} type="bar" height={250} width={650} />
              </div>
 </div>
    );
}