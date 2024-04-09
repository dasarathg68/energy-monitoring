import styles from "../styles/TopDevices.module.css"
import { Devices } from "./Devices"
import React, { useEffect, useState } from 'react';
import axios from "axios";
import instance from "../config/config";

export const TopDevices =({host,protocol,port,devicesInModel,devicesWithName})=>{
    const [connectedClients, setConnectedClients] = useState([]);
    const [deviceData,setDeviceData]=useState();
    // console.log(devicesInModel)
    useEffect(() => {
        const fetchConnectedDevices = async()=>{
    
          let deviceNames = devicesInModel.map(data=>data.device_id)
          instance.get("/connecteddevices").then((data)=>
          {
            let response = data.data
            let clients=[]
            response.map((connection)=>{
                  if(deviceNames.includes(connection.username)){
                      clients.push(connection)
                  }
            })
            let clientnames = clients.map(client=>{return client.username})
            console.log(clientnames)
            setConnectedClients(clients)
            instance.post("/devicelatest",clientnames).then((data)=>{
              // console.log("latest",data.data)
              setDeviceData(data.data)
          }    ).catch(err=>console.log(err))
        }
          )
           
        }

      //  const intervalId = setInterval(fetchConnectedDevices, 1000);
    
      //  // Clean up the interval when the component unmounts or when the `currentDeviceModel` changes
      //  return () => clearInterval(intervalId);
     
    }, [devicesInModel]); // Empty dependency array ensures effect runs only once
  
    return (
    
<div className={styles.cardContainer}>
    <div style={{color:"white"}}>
        <h4> Devices:</h4>
        {/* {connectedClients[0]}  */}
        <div style={{display:"flex",justifyContent:"center"}}>
        {devicesInModel.map(device=>{
         return <Devices devicename={device.components[0].component_name} deviceid={device.device_id} status={device.isOnline?"Online":"Offline"}/>
        })}
        </div>       
                {/* </div>   */}
                <br/>   
               

         
                    <div style={{marginLeft:"5px"}}/>

          </div>
      </div>
      
    );
  };

    // return <div className={styles.cardContainer}>

              {/* <div>
                Top 5 Devices Currently Running
                </div>  
                <br/>   
                <div className={styles.deviceContainer}>
                    <div style={{marginRight:"5px"}}/>
                    <Devices deviceName="Oven"time="1"powerUsage="3.83 kW" color="#880808"/>
                    <Devices deviceName="Gas Furnace"time="1"powerUsage="380W" color="#FFC300" textColor="black"/>
                    <Devices deviceName="Guest Bedroom"time="1"powerUsage="231W" color="#228B22"/>

                    <Devices deviceName="Office"time="1"powerUsage="231W" color="#228B22"/>
                    <Devices deviceName="Living Room"time="1"powerUsage="176 W" color="#228B22"/>
                    <div style={{marginLeft:"5px"}}/>

                </div>
    </div>

} */}



