import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../pages/login'
import SuperAdminDashboard from '../pages/SuperAdminDashboard'
function Routers() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/super-admin' element={<SuperAdminDashboard />} />
        </Routes>
    </div>
  )
}

export default Routers
