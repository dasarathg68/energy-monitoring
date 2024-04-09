import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import instance from '../config/config'; // Adjust the import path based on your project structure
import { Navbar } from '../components/Navbar';
import { MonthPowerTotal } from '../components/MonthPowerTotal';
import styles from '../styles/Dashboard.module.css'
import { CurrentDay } from '../components/CurrentDay';
import { CurrentMonth } from '../components/CurrentMonth';
import { DeviceStatus } from '../components/SingleDevice/DeviceStatus';
import { HourlyPowerSingle } from '../components/SingleDevice/HourlyPowerSingle';
import { SevenDaysUsageSingle } from '../components/SingleDevice/SevenDaysUsageSingle';
import { MonthPowerTotalSingle } from '../components/SingleDevice/MonthPowerTotalSingle';
import { Spinner } from 'react-bootstrap';
import { getToken } from '../utils/utils';
export const SingleDevice = () => {
  const { deviceid } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [usageData,setUsageData] = useState(null)
  const [isLoading, setLoading] = useState(true);
  const getDeviceUsageData = async () => {
    try {
        const token = getToken();
        
        let deviceId =[]
        if(deviceid){
        deviceId.push(deviceid)
        }
        const { data: usage } = await instance.post('/usagehistory', deviceId,{headers:{'token':getToken()}});
        console.log(usage)
        setUsageData(usage)
        setLoading(false)
      
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch device details using device ID from the URL parameter
        const { data } = await instance.get(`/device`,{
            headers:{
                token: getToken(),
                deviceid:deviceid
            }
        });

        console.log(data)
        setDeviceData(data);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching device details:', error);
        setLoading(false);
      }
    };
    getDeviceUsageData();

    fetchData();
  }, []);

  return (
    <>
    <Navbar loggedIn={true}/>
    <div style={{ color: "white" }}>
                            {isLoading ? (
                            <div>
                                <Spinner as="span" animation="border" size="sm" role="status" style={{ marginRight: 10 }} aria-hidden="true" />
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                          <div>
                          <div className={styles.devicestatuscontainer}>
                                <DeviceStatus deviceid={deviceid} deviceData={deviceData} />
                              </div>
                            <div className={styles.parent}>
                                <div className={styles.child1}>
                                    {/* Render components related to device status */}
                                    <HourlyPowerSingle powerUsageTodayHourly={usageData.groupedHourlyData}/>
                                    {/* Other components */}
                                    {/* <div style={{ margin: "20px" }}></div> */}
                                    <SevenDaysUsageSingle sevenDaysUsage={usageData.powerUsageLastWeek} />
                                </div>
                                <div className={styles.child2}>
                                    {/* Other components */}
                                    {/* <CurrentDay currentDayPowTotal={usageData.totalPowerCurrentDay} currentDayPowCost={usageData.totalPricePerDevice[0].totalPrice.toFixed(2)} /> */}
                                    <CurrentDay currentDayPowTotal={usageData.totalPowerCurrentDay} currentDayPowCost={usageData.totalprice.totalpriceday.toFixed(2)}  />
                                   
                                    {/* <CurrentMonth currentMonthPowTotal={usageData.CurrentMonthPowTotal} currentMonthPowCost={usageData.totalpricemonth.toFixed(2)}/> */}
                                    <CurrentMonth currentMonthPowTotal={usageData.CurrentMonthPowTotal} currentMonthPowCost={usageData.totalprice.totalpricemonth.toFixed(2)}/>
                                   
                                    <MonthPowerTotalSingle monthPowerUsage={usageData.powerUsagePerDevicePerDayFormatted}/>
                                </div>
                            </div>
                            </div>
                        )}

        </div>
    </>
  );
};

