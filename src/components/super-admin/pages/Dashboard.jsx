import React from 'react'

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
      {hint ? <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{hint}</div> : null}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">A premium, real-time Super Admin workspace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Interested Leads" value="—" hint="Pulled from Firestore users collection" />
        <StatCard label="Meted Clients" value="—" hint="Leads you’ve met / contacted" />
        <StatCard label="Our Clients" value="—" hint="Approved and active clients" />
        <StatCard label="Revenue" value="—" hint="Placeholder (optional)" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 xl:col-span-2">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Activity</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            This area is ready for charts/metrics once your product data is connected.
          </div>
          <div className="mt-4 grid h-48 place-items-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Chart placeholder
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">Quick actions</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Review new leads in Interest
            </div>
            <div className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Approve clients in Meted Clients
            </div>
            <div className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-800 dark:text-slate-200">
              Assign products to approved clients
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

