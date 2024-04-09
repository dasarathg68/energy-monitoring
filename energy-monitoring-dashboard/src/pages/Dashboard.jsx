import { TopDevices } from "../components/TopDevices"
import styles from "../styles/Dashboard.module.css"
import { CurrentDay } from "../components/CurrentDay"
import { HourlyPower } from "../components/HourlyPower"
import { SevenDaysUsage } from "../components/SevenDaysUsage"
import { CurrentMonth } from "../components/CurrentMonth"
import { MonthPowerTotal } from "../components/MonthPowerTotal"
import { PrevWeekTopDev } from "../components/PrevWeekTopDev"
import { useEffect,useState } from "react"
import { Navbar } from '../components/Navbar';
import { IoAddOutline } from "react-icons/io5";
import { Modal, Button, Spinner } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import {getEmail, getToken} from '../utils/utils'
import instance from "../config/config"
export const Dashboard = () => {
    const [deviceNameCreate, setDeviceNameCreate] = useState("");


    const [devicesInModel, setDevicesInModel] = useState([]);
    const [showDevices, setShowDevices] = useState(false);
    const handleOpenDevices = () => setShowDevices(true);
    const handleCloseDevices = () => setShowDevices(false);
    const [isLoading, setLoading] = useState(true);



    const [host,setHost] = useState()
    const [protocol,setProtocol] = useState()
    const [port,setPort] = useState()

    

    const [price, setPrice] = useState(10);
    const [currentDayPowTotal, setCurrentDayPowTotal] = useState(0);
    const [currentDayPowCost, setCurrentDayPowCost] = useState(0); // Initialize to 0
    const [currentMonthPowTotal, setCurrentMonthPowTotal] = useState(0);
    const [currentMonthPowCost, setCurrentMonthPowCost] = useState(0); // Initialize to 0
    const [topDevicesLastWeek, setTopDevicesLastWeek] = useState([]);
    const [powerUsageTodayHourly, setPowerUsageTodayHourly] = useState([]);
    const [monthPowerUsage, setMonthPowerUsage] = useState([]);
    const [sevenDayUsage, setSevenDayUsage] = useState([]);
    const [devicesWithName,setDevicesWithName] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const settingsRes = await instance.get(`/getSettings`)
                setHost(settingsRes.data.host)
                setProtocol(settingsRes.data.protocol)
                setPort(settingsRes.data.port)
                const loginIdentifier = getEmail();
               
                // if(modelsList.includes("SH01RGB")) {
                //     setCurrentDeviceModel("SH01RGB");
                // } else {
                //     setCurrentDeviceModel(modelsList[0]);
                // }
            getDeviceInModel();


            } catch (error) {
                console.error('Error fetching device models:', error);
            }
        };
    
        fetchData();
    
    }, []); // Empty dependency array ensures effect runs only once
    
    // useEffect(() => {
    //     const fetchDataInModel = () => {
    //         // if (currentDeviceModel) {
    //             getDeviceInModel();
    //         // }
    //     };
    
    //     const intervalId = setInterval(fetchDataInModel, 2000);
    
    //     // Clean up the interval when the component unmounts or when the `currentDeviceModel` changes
    //     return () => clearInterval(intervalId);
    // }, [currentDeviceModel]); // Dependency on `currentDeviceModel` ensures that the interval is re-created when this value changes
    
 
    // useEffect(() => {
    //     // Call getDeviceInModel() when the component mounts initially
    //     getDeviceInModel();
    // }, [currentDeviceModel]); // Empty dependency array ensures effect runs only once
    
    const getDeviceInModel = async () => {
        try {
            const token = getToken();
            // console.log(currentDeviceModel)
            // if(currentDeviceModel==null){
            //     return
            // }
            const { data: devicesData } = await instance.get(`/devicemodeldata`, {
                headers: {
                    'token': token
                }
            });
            console.log(devicesData)
            // delay(1000)
            setDevicesWithName(devicesData.map((data)=>({deviceid:data.device_id,name:data.name})))
            // console.log(devicesData.map((data)=>({deviceid:data.device_id,name:data.name})))
            setDevicesInModel(devicesData);
            const deviceNames = devicesData.map(device => device.device_id);
            // console.log(deviceNames)

            const { data: usageData } = await instance.post('/usagehistory',deviceNames, {headers:{'token':getToken()}});
            console.log(usageData)
            setCurrentDayPowTotal(((usageData.totalPowerCurrentDay)).toFixed(3));
            setCurrentDayPowCost(((usageData.totalprice.totalpriceday)).toFixed(1));
            setCurrentMonthPowTotal(((usageData.CurrentMonthPowTotal)).toFixed(3));
            setCurrentMonthPowCost(usageData.totalprice.totalpricemonth.toFixed(1));
            setTopDevicesLastWeek(usageData.topDevicesLastWeek);
            setPowerUsageTodayHourly(usageData.groupedHourlyData);
            setMonthPowerUsage(usageData.powerUsagePerDevicePerDayFormatted);
            setSevenDayUsage(usageData.powerUsageLastWeek);
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

  
    return <>
    <Navbar loggedIn={true}/>
    {isLoading ? (
  <><Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                style={{ 'marginRight': 10 }}
                aria-hidden="true" /><span className="visually-hidden">Loading...</span></>
      ) : (
    <>
                    
                    <div style={{ color: "white" }}>
                        <div style={{display:"flex",justifyContent:"center"}}>Summary</div>
                        <div className={styles.parent}>
                            <div className={styles.child1}>
                                <TopDevices devicesInModel={devicesInModel} devicesWithName={devicesWithName}  />
                                {/* <CurrentDay currentDayPowCost={currentDayPowCost} currentDayPowTotal={currentDayPowTotal} /> */}
                                <HourlyPower powerUsageTodayHourly={powerUsageTodayHourly} devicesWithName={devicesWithName} devicesInModel={devicesInModel}/>
                                {/* <div style={{margin:"20px"}}></div> */}
                                <SevenDaysUsage sevenDaysUsage={sevenDayUsage} />
                            </div>
                            <div className={styles.child2}>
                                <CurrentMonth currentMonthPowCost={currentMonthPowCost} currentMonthPowTotal={currentMonthPowTotal} />
                                <MonthPowerTotal monthPowerUsage={monthPowerUsage} devicesWithName={devicesWithName} devicesInModel={devicesInModel}/>
                                <PrevWeekTopDev topDevicesLastWeek={topDevicesLastWeek} devicesWithName={devicesWithName} devicesInModel={devicesInModel}/>

                            </div>

                        </div>
                        {/* <div className={styles.PowerSpikes}></div>
    <PowerSpikes/> */}
                   


                    </div></>
    )}
    </>
}