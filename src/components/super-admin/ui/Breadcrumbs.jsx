import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LABELS = {
  dashboard: 'Dashboard',
  interest: 'Interest',
  'meted-clients': 'Meted Clients',
  'our-clients': 'Our Clients',
  products: 'Products',
  settings: 'Settings'
}

export default function Breadcrumbs() {
  const location = useLocation()

  const crumbs = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const superAdminIdx = parts.indexOf('super-admin')
    const sub = superAdminIdx >= 0 ? parts.slice(superAdminIdx + 1) : []
    const pageKey = sub[0] || 'dashboard'

    return [
      { label: 'Super Admin', to: '/super-admin/dashboard' },
      { label: LABELS[pageKey] || pageKey, to: location.pathname }
    ]
  }, [location.pathname])

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
      <Link className="font-medium hover:text-slate-900 dark:hover:text-white" to={crumbs[0].to}>
        {crumbs[0].label}
      </Link>
      <span className="text-slate-400 dark:text-slate-500">/</span>
      <span className="font-medium text-slate-900 dark:text-white">{crumbs[1].label}</span>
    </nav>
  )
}

<button
 onClick={() =>
   updateMeetingStatus(user.id,{
     progress: meetingProgress,
     status: status,
     feedback: feedback
   })
 }
>
Update
</button>

