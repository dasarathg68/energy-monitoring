import styles from "../styles/TopDevices.module.css"
import { Link } from 'react-router-dom';

export const Devices =({deviceid, devicename,deviceName,powerUsage,time,color,textColor,deviceData,status})=>{
     let limitedName;
     if(deviceName){
   limitedName = deviceName.length > 12 ? deviceName.substring(0, 10) + '...' : deviceName;}
     console.log(deviceData)
   if(!(textColor=="black")){
        textColor="white"
   }
   if(status=="Online"){
     color = "green"
   }else{
     color ="grey"
   }
//     console.log(color)
    return   <>
    <Link to={`/dashboard/${deviceid}`} style={{textDecoration:'none'}}><div className={styles.deviceBox} style={{
     "--textColor":textColor,
     "--color":color
     }}>
        <div className={styles.devices}>
             <span style={{fontSize:"14px"}}>{devicename}</span>
             <br/> 
             <span style={{fontSize:"8px"}}>{deviceid}:{status}</span>
        </div>
    </div>
    </Link>
    </>
}