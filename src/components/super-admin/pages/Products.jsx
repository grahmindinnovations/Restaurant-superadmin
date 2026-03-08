import React from 'react'

export default function Products() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Product catalog management scaffold (connect to Firestore when ready).
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">Coming soon</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Add product CRUD, pricing tiers, feature flags, and assignment rules here.
        </div>
      </div>
    </div>
  )
}

