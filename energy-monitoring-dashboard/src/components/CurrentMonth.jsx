import styles from "../styles/TopDevices.module.css"

export const CurrentMonth =({currentMonthPowTotal,currentMonthPowCost})=>{
    let color ="green"
    if((currentMonthPowTotal/1000)>=1000){
        color="red"
    }
    return (
        <div style={{display:"flex",flexDirection:"row",width:"95%",color:{color}}}>
            <div className={styles.cardContainer}>
                Current Month Power Total
                <div className={styles.textdiv} style={{
     "--color":color
     }}>
                  {((currentMonthPowTotal)/1000).toFixed(1)} kWh
                </div>
            </div>
            <div className={styles.cardContainer}>
                Current Month Power Cost
                <div className={styles.textdiv} style={{
     "--color":color
     }}>                ₹
{currentMonthPowCost}
                </div>
            </div>
        </div>
    );
}