import React from 'react'

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  )
}

export default function OurClients() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Our Clients</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            All approved clients, ready for product assignment and account management.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Clients" value="—" />
        <StatCard label="Active Products" value="—" />
        <StatCard label="Estimated Revenue" value="—" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/60">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Client ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Company</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Contact</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Phone</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Approval Date</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Products</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
              <tr>
                <td className="px-3 py-3 text-slate-500 dark:text-slate-400" colSpan={8}>
                  Approved clients from Meted Clients will be listed here with product assignments and active/inactive
                  status. Wire up Firestore to populate this table.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
