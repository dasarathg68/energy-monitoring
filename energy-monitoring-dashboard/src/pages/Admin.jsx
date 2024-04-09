import { Button } from "react-bootstrap"
import { Navbar } from "../components/Navbar"
import { Modal } from "react-bootstrap"
import styles from "../styles/login.module.css"
import { useEffect, useState } from "react"
import instance from "../config/config"
export const AdminPage = () =>{
    const [inputPassword,setInputPassword] = useState("")
    const [enter,setEnter]=useState(false)
    const [host,setHost] = useState()
    const [protocol,setProtocol] = useState()
    const [port,setPort] = useState()
    const [topic,setTopic] =useState()

    const [show, setShow] = useState(false);
    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);
    const [deviceNameCreate,setDeviceNameCreate] = useState()
    const [deviceNameDelete,setDeviceNameDelete] = useState()

    const [showDelete, setShowDelete] = useState(false);
    const handleDeleteOpen = () => setShowDelete(true);
    const handleDeleteClose = () => setShowDelete(false);
    const [modelsList,setModelsList]=useState()
    const handleClick = () => {
        setIsEditing(true);
      };
      const handleBlur = () => {
        setIsEditing(false);
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'host') { // Fixed typo here
            setHost(value);
        } else if (name === 'protocol') {
            // Handle protocol change here
            setProtocol(value);
        }
        else if(name == "port"){
            setPort(value);
        }
        else if(name=="device_name"){
            // console.log(value)
            setDeviceNameCreate(value)

        }
        else if(name=="topic"){
            setTopic(value)
        }
      
        else if(name=="device_name_delete"){
            setDeviceNameDelete(value)
        }
    };
    const deleteDeviceModel = async ()=>{
        try{
            const response = await instance.delete(`/deletemodel/${deviceNameDelete}`);
            alert('Device Model deleted successfully');
            window.location.reload(false);
        }
        catch(error){
            console.log(error)
        }
    }
      const handleCreateNewDeviceModel = async () => {
        try {
            // const email = getEmail();
            console.log(deviceNameCreate)
            const payload = { devicename: deviceNameCreate };
            await instance.post('/addmodel',payload);
            alert('Device Model added successfully');
            window.location.reload(false);
        } catch (error) {
            console.error('Error creating new device model:', error);
            alert(error.response?.data?.message || 'An error occurred');
        }
    };
    const [isEditing, setIsEditing] = useState(false);
    useEffect(()=>{
        // const fetchSettings =async()=>{
            try{
            instance.get('/getmodelslist').then((data)=>{
                console.log(data.data)
                setModelsList(data.data)
            })
           instance.get(`/getSettings`).then((data)=>{
            // console.log(data.data)
            setHost(data.data.host)
            setPort(data.data.port)
            setProtocol(data.data.protocol)
            setTopic(data.data.topic)
        
        })}
        catch(error){
            console.log(error)
        }
        // }
        // fetchSettings();
    },[])
    return (
        <>
        <Navbar/>
        { !enter?(
        <><div className={styles.settingscard}>
            
                    <h2>Settings:</h2>
                    <input className={styles.input} type="password" placeholder="Enter password" onChange={(e) => setInputPassword(e.target.value)} />
                    <Button variant="dark" size="md" style ={{marginTop:"3px"}}onClick={() => {
                    if (inputPassword == "rajraj123") {
                        setEnter(true)
                    }
                } }>Enter</Button>
                </div></>):(
                    <>
                    <div className={styles.settingscard}>

                    <h2>Settings:</h2>
                    {isEditing ? (
                                <div style={{ fontFamily: "Monsterrat" }}>
                                   
                                    <div>
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <span>Host:</span>
                                            <input type="text" className={styles.input} defaultValue={host} name="host" onChange={handleChange}></input>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <span>Protocol:</span>
                                            <input type="text" className={styles.input} defaultValue={protocol} name="protocol" onChange={handleChange}></input>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <span> Port:</span>
                                            <input type="text" className={styles.input} defaultValue={port} name="port" onChange={handleChange}></input>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <span> Topic:</span>
                                            <input type="text" className={styles.input} defaultValue={topic} name="topic" onChange={handleChange}></input>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                                        <Button variant="dark" onClick={async () => {
                                            try {
                                                console.log("hiiiii")
                                                await instance.put("/updateSettings", { protocol, port, host,topic }).then(() => {
                                                    alert("Updated Successfully")
                                                    handleBlur()
                                                })
                                            } catch (error) {
                                                alert(error)
                                            }
                                        } }>Save</Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                <div onClick={handleClick}>
                                    <div>
                                        <div>
                                            Host: {host}
                                        </div>
                                        <div>
                                            Protocol: {protocol}
                                        </div>
                                        <div>
                                            Port: {port}
                                        </div>
                                        <div>
                                            Topic: {topic}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Button variant="dark" onClick={handleBlur}>Edit</Button>

                                    </div>
                            
                                </div>
                                <Button variant="dark" size="sm" style={{marginTop:"5px"}}onClick={handleOpen}>Add Device Model</Button>
                                <Button variant="dark" size="sm" style={{marginTop:"5px"}}onClick={handleDeleteOpen}>Delete Device Model</Button>

                                </>
                            )}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>             
        <Modal size='md'
          show={show} onHide={handleClose} centered className={styles.modal_backdrop_overall}>
                  <Modal.Header className={styles.modal_backdrop}>
                        <Modal.Title>Add Device Model</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modal_backdrop}style={{display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <div>
                        {modelsList.map(model=>{return <div>{model.deviceModelName}<br/></div>})}
                    </div>
                    <div style={{display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <input onChange={handleChange} className={styles.input} name='device_name'  type="text" placeholder="Enter Device Model"/>
                 
                  </div>
                  
                </Modal.Body>
                <div className={styles.modal_backdrop} style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
                   <Button variant='dark' className={styles.addButton} onClick={handleCreateNewDeviceModel}>
                  Save
                </Button>
                </div>
    
          </Modal> 
          <Modal size='md'
          show={showDelete} onHide={handleDeleteClose} centered className={styles.modal_backdrop_overall}>
                  <Modal.Header className={styles.modal_backdrop}>
                        <Modal.Title>Delete Device Model</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modal_backdrop}style={{display:"flex", flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <div>
                    {modelsList.map(model=>{return <div>{model.deviceModelName}<br/></div>})}
                    </div>
                    <div>
                  <input onChange={handleChange} className={styles.input} name='device_name_delete'  type="text" placeholder="Enter Device Model"/>
                  </div>
                  
                </Modal.Body>
                <div className={styles.modal_backdrop} style={{display:"flex", alignItems:"center",justifyContent:"center"}}>
                   <Button variant='dark' className={styles.addButton} onClick={deleteDeviceModel}>
                  Delete
                </Button>
                </div>
    
          </Modal> 
          </div>
                    </div>
                    </>
                )
        }
        </>
    )
}