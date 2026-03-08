import React, { Fragment, useMemo, useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  BriefcaseIcon,
  Cog6ToothIcon,
  CubeIcon,
  PresentationChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Breadcrumbs from './ui/Breadcrumbs'
import { setSuperAdminAuthed } from './auth/superAdminAuth'
import { useTheme } from './theme/ThemeProvider'

const nav = [
  { label: 'Dashboard', to: '/super-admin/dashboard', icon: PresentationChartBarIcon },
  { label: 'Interest', to: '/super-admin/interest', icon: UserGroupIcon },
  { label: 'Meted Clients', to: '/super-admin/meted-clients', icon: BriefcaseIcon },
  { label: 'Our Clients', to: '/super-admin/our-clients', icon: CubeIcon },
  { label: 'Products', to: '/super-admin/products', icon: AdjustmentsHorizontalIcon },
  { label: 'Settings', to: '/super-admin/settings', icon: Cog6ToothIcon }
]

function SidebarContent({ onNavigate }) {
  const top = useMemo(() => nav.slice(0, 6), [])
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-3 px-3 py-4">
        <div className="grid size-10 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-slate-900">
          SA
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Super Admin</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">SaaS CRM Console</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {top.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60'
                )
              }
            >
              <Icon className="size-5 opacity-90" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="px-2 pb-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <div className="font-semibold text-slate-900 dark:text-white">Enterprise Mode</div>
          <div className="mt-1">Real-time leads, approvals, and product assignments.</div>
        </div>
      </div>
    </div>
  )
}

export default function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Transition show={mobileOpen} as={Fragment}>
        <Dialog onClose={setMobileOpen} className="relative z-50 lg:hidden">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/50" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition duration-200 ease-out"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition duration-200 ease-in"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex w-full max-w-xs flex-col bg-white shadow-xl dark:bg-slate-950">
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      <div className="mx-auto grid min-h-dvh w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block">
          <SidebarContent />
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Bars3Icon className="size-5" />
                </button>
                <Breadcrumbs />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </button>

                <button
                  onClick={() => {
                    setSuperAdminAuthed(false)
                    navigate('/', { replace: true })
                  }}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-800"
                >
                  <ArrowLeftStartOnRectangleIcon className="size-5" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

