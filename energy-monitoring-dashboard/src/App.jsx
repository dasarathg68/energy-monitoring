import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-calendar-heatmap/dist/styles.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import PrivateRoutes from './utils/PrivateRoutes';
import styles from './App.module.css'
import axios from 'axios';
import { AdminPage } from './pages/Admin';
import { SingleDevice } from './pages/SingleDevice';
function App() {
 
  return (
    <div className={styles.container}>   

    <Routes>
     <Route path="/admin" element={<AdminPage/>}/>
     <Route path="/" element={<Login />}/> 
     <Route element={<PrivateRoutes />}>
    <Route path="/dashboard" element={<Dashboard />}/>
    <Route path="/dashboard/:deviceid" element = {<SingleDevice/>}/>
    </Route>
    </Routes>
  </div>

);
}

export default App;
