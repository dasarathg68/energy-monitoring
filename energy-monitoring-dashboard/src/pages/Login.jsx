import styles from '../styles/login.module.css'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import { Navbar } from '../components/Navbar';
import { setToken,getToken, setEmail } from '../utils/utils';
import axios from 'axios'
export const Login = ()=>{
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        login_identifier: '',
        password: '',
      })
  const handleLogin = async (e) => {
    e.preventDefault()
    // console.log(data)
    axios.post("http://smartyhometech.com/userlogin",data).then((data)=>{
        // console.log(data)
        setToken(data.data.access_token)

        navigate("/dashboard")
    }
    ).catch((err)=>{alert(err)
    console.log(err)
    })
    console.log(data)
    setEmail(data.login_identifier)

  }
    return ( <>
    <Navbar loggedIn={false}/>
      <div>
  
          <div className={styles.logincard}>
            <h1 className={styles.hello}>Hello,</h1>
            <h1 className={styles.welcome}>Welcome!</h1>
            <Form onSubmit={handleLogin}>
              <Form.Group className={styles.label1} controlId="formBasicEmail">
                <Form.Label className={styles.labelText}>Email address</Form.Label>
               <div> <Form.Control
                  onChange={(e) => setData({
                    ...data,
                    login_identifier: e.target.value,
                  })}
                  value={data.login_identifier}
                  required
                  type="email"
                  placeholder="Enter email" />
                  </div>
              </Form.Group>
  
  
  
              <Form.Group className={styles.label2} controlId="formBasicPassword">
                <Form.Label className={styles.labelText}>Password</Form.Label>
               <div> <Form.Control
                  onChange={(e) => setData({
                    ...data,
                    password: e.target.value,
                  })}
                  value={data.password}
                  required
                  type="password"
                  placeholder="Password" />
                </div>
              </Form.Group>
              <div className="text-center">
                {loading ?
                  <div className="spinner-border text-primary" role="status">
                    {/* <span className="visually-hidden">Loading...</span> */}
                  </div>
  
                  :

                  <Button className={styles.logButton} variant="primary" type="submit">
                    Login
                  </Button>}
  
              </div>
            </Form>
          </div>
        </div></>

    );
}