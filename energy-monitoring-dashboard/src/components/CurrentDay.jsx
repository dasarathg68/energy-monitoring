import styles from "../styles/TopDevices.module.css"

export const CurrentDay =({currentDayPowTotal,currentDayPowCost})=>{
    let color ="green"
    if((currentDayPowTotal/1000)>=100){
        color="red"
    }
    return (
        <div style={{display:"flex",flexDirection:"row",width:"95%",justifyContent:"center"}}>
            <div className={styles.currentdaycontainer}>
                Current Day Power Total
                <div className={styles.textdiv} style={{
     "--color":color
     }}>                {(currentDayPowTotal/1000).toFixed(3)} kWh
                </div>
            </div>
            <div className={styles.currentdaycontainer}>
                Current Day Power Cost
                <div className={styles.textdiv} style={{
     "--color":color
     }}>                ₹{currentDayPowCost}
                </div>
            </div>
        </div>
    );
}