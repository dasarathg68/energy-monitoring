import styles from "../../styles/SIngleDevice.module.css"
import { Devices } from "../Devices"
import React, { useEffect, useState } from 'react';
import axios from "axios";
import instance from "../../config/config";
import mqtt from "mqtt"

export const DeviceStatus =({host,protocol,port,deviceid,deviceData})=>{
    // const [connectedClients, setConnectedClients] = useState([]);
    // console.log(deviceData)
  const [price,setPrice] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  console.log(deviceData)
    const handleClick = () => {
        setIsEditing(true);
      };
  const handleBlur = async () => {
    try{
        console.log(price)
         await instance.put("/updateprice",{
          price:price,
          deviceid:deviceid
         })
    }
    catch(error){
      console.log(error)
    }
    setIsEditing(false);
  };
  console.log(deviceData)
    let liveDataStructure =  Object.create({
        power: 0,
        voltage:0,
        current:0,
        powerfactor:0
    })
    const [liveData,setLiveData]=useState(liveDataStructure);
    // console.log(devicesInModel)
    useEffect(() => {
      try{
      instance.get(`/pricedetails/${deviceid}`).then((data)=>{
        setPrice(data.data.price)
      })
      instance.get(`/getSettings`).then((data)=>{
        // console.log(data.data)
        let host = `wss://`+`${data.data.host}`
        let port = 8083
        const mqttClient = mqtt.connect(`${host}`,{
          username:"",
          password:"",
          port,
          // clientId,
          path: '/mqtt',
          protocol: 'mqtt', // Explicitly set the protocol
        });
          // console.log(mqttClient)
        
      
          mqttClient.on('connect', () => {
            console.log("connected")
            mqttClient.subscribe(`/PUB/${deviceid}/HLW`);
         
          });
  
        mqttClient.on('message', (topic, payload) => {
          const msg = JSON.parse(payload.toString());
          let data =  {
            voltage:msg.v,
            current:msg.c,
            power:msg.p,
            powerfactor:msg.pf
          }
          // console.log(data)
          setLiveData(data)
       
          return () => {
            // Clear the interval on unmount
            // Destroy the chart instance on unmount
      
            mqttClient.end()
      
          };
          
    
    })
      
       
      })
    }
    catch(error){
      console.log(error)
    }

    }, []); // Empty dependency array ensures effect runs only once
  
    return (
      <>
<div className={styles.cardContainer} style={{"--color":deviceData.isOnline?"green":"#26282A"}}>
    <div style={{color:"white"}}>
        {/* <h4> Device:</h4> */}
        {/* {connectedClients[0]}  */}
    <span style={{marginLeft:"",fontSize:"18px"}}>{deviceData?deviceData.components[0].component_name:null}</span>
   
              <div style={{fontSize:"12px"}}>{deviceid}</div>
              <span style={{display:"flex", alignItems:"center",justifyContent:"center",paddingLeft:"5px",paddingTop:"5px",marginRight:"15px", fontSize:"18px"}}>
        Price per unit: ₹
        {
            isEditing?(
                <input type="number" style={{width:"40px"}} defaultValue={price} onChange={(e)=>{
                    // console.log(e.target.value);
                    setPrice(e.target.value)
                   
                }} onBlur={handleBlur}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    handleBlur()
                  }
                }}
                />
            ):(
                <span onClick={handleClick}> {price} </span>

            )
        }
    </span>
                {/* </div>   */}
                {/* <br/> */}      
      </div>
               
      </div>
      <div className={styles.datawrapper}>
                  <div className={styles.livedatabox} style={{"--color":deviceData.isOnline?"green":"#26282A"}}>
                    <div>Power</div>
                    <br />
                    <div className={styles.values}>{liveData.power}W</div>
                  </div>
                  <div className={styles.livedatabox} style={{"--color":deviceData.isOnline?"green":"#26282A"}}>
                    <div>Voltage</div>
                    <br />
                    <span className={styles.values}>{liveData.voltage}V</span>
                  </div>
                  <div className={styles.livedatabox} style={{"--color":deviceData.isOnline?"green":"#26282A"}}>
                    <div>Current</div>
                    <br />
                    <span className={styles.values}>{liveData.current}A</span>
                  </div>
                  <div className={styles.livedatabox} style={{"--color":deviceData.isOnline?"green":"#26282A"}}>
                    <div>Power Factor</div>
                    <br />
                    <span className={styles.values}>{liveData.powerfactor}</span>
                  </div>
</div>

                </>    );
  };



