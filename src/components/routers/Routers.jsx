import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/login'
import RequireSuperAdminAuth from '../super-admin/auth/RequireSuperAdminAuth'
import SuperAdminLayout from '../super-admin/SuperAdminLayout'
import { ThemeProvider } from '../super-admin/theme/ThemeProvider'
import Dashboard from '../super-admin/pages/Dashboard'
import Interest from '../super-admin/pages/Interest'
import MetedClients from '../super-admin/pages/MetedClients'
import OurClients from '../super-admin/pages/OurClients'
import Products from '../super-admin/pages/Products'
import Settings from '../super-admin/pages/Settings'
function Routers() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Login />} />

            <Route element={<RequireSuperAdminAuth />}>
              <Route
                path="/super-admin"
                element={
                  <ThemeProvider>
                    <SuperAdminLayout />
                  </ThemeProvider>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="interest" element={<Interest />} />
                <Route path="meted-clients" element={<MetedClients />} />
                <Route path="our-clients" element={<OurClients />} />
                <Route path="products" element={<Products />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </div>
  )
}

export default Routers
