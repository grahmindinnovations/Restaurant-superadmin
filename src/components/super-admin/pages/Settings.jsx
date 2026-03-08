import React from 'react'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Admin preferences, roles (future), audit logs (future).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Workspace</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">Configure branding and notification defaults.</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Security</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This demo uses local login gating. Connect Firebase Auth for production-grade security.
          </div>
        </div>
      </div>
    </div>
  )
}

