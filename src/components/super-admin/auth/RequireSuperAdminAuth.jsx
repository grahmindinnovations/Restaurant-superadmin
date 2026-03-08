import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isSuperAdminAuthed } from './superAdminAuth'

export default function RequireSuperAdminAuth() {
  const location = useLocation()

  if (!isSuperAdminAuthed()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

