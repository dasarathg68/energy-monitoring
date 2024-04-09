import styles from "../styles/Navbar.module.css"
import { HiOutlineRefresh } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import img from './logo-white-1692103135.png'

export const Navbar =({loggedIn})=>{
    const navigate = useNavigate();
    return <div className={styles.container}>
        <img src={img} style={{cursor:"pointer"}}onClick={()=>navigate("/dashboard")}height={35}></img>

        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            
             <span  className={styles.active} target="_blank">Home Energy Usage <span style={{fontSize:"8px"}}>© 2024 - Powered By SmartyHome</span></span>
            
        </div>
       
        {loggedIn?
        <div style={{display:"flex",margin:"10px"}}>
            <span className={styles.icons}>
                <HiOutlineRefresh onClick={()=>{window.location.reload(false)}}/>   
            </span>
            &emsp;
            {/* <span className={styles.icons}>
                <FaUserCircle />
            </span> */}
            &emsp;
            <span className={styles.icons} onClick={()=>{
                localStorage.clear();
                navigate("/")
                }}>
            <IoLogOut />
            </span>

        </div>: <span className={styles.icons}>
                <FaUserCircle />
            </span>
        }
  </div>
}