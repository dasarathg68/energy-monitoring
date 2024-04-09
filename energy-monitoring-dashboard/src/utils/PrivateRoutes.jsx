import { Outlet, Navigate } from 'react-router-dom'
import {getToken} from './utils'
const PrivateRoutes = () => {
   
      let token = getToken()
    return(
        token ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoutes