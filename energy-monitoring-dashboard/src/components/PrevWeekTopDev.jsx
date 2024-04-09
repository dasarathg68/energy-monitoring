import styles from "../styles/TopDevices.module.css"
import ReactApexChart from "react-apexcharts";

export const PrevWeekTopDev =({topDevicesLastWeek,devicesWithName,devicesInModel})=>{
  // console.log(devicesInModel)
  // console.log(topDevicesLastWeek)
    // topDevicesLastWeek.map(data=>{
    //     for(let i of devicesWithName){
    //       if(i.deviceid==data._id){
    //         data._id= i.name;
    //       }
    //     }
    // })
    let temp = devicesInModel
    topDevicesLastWeek.map(data=>{
      for(let i of temp){
        if(i.device_id == data._id){
         data._id = i.components[0].component_name
        }
      }
    })

   let data = topDevicesLastWeek.map(device=>(device.totalPower.toFixed(2)*1))
    // console.log("tofixed",topDevicesLastWeek)
    // console.log("direct", topDevicesLastWeek.map(device=>device.totalPower))
    const options ={
          
        series: data,
        options: {
          chart: {
            width: 380,
            type: 'pie',
          },
        
          
          legend: {
            // position: 'right'
            labels:{
              colors:"#FFF"
            }
          },
          labels: topDevicesLastWeek.map(device=>device._id),
          responsive: [{
            breakpoint: 600,
            options: {
              chart: {
                width: 375
              },
              legend: {
                // position: 'right'
                color:"#FFF"
                
              }
            }
          }],

          tooltip: {
        y: data.map(value => ({ // Use map to generate formatter function for each data point
            formatter: function (val, { seriesIndex, dataPointIndex, w }) {
                return `${val.toFixed(2)} kWh`;
            }
        }))
    }
        },
      
      
      };
    return <div className={styles.topdevicescontainer}>
    Top 5 Devices Last Week
    <div id="chart" style={{display:"flex",justifyContent:"center", color:"white"}}>
                <ReactApexChart options={options.options} series={options.series} type="pie" width={380} />
              </div>
     </div>
}       