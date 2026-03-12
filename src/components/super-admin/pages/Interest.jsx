import React, { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, query, setDoc, deleteDoc } from 'firebase/firestore'  
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Trash2, Calendar } from "lucide-react"

import { db } from '../../../firebase'

function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'users'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLoading(false)
        setError('')
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setLeads(data)
      },
      (err) => {
        setLoading(false)
        setLeads([])
        setError(err?.message || 'Failed to load leads.')
      }
    )
    return () => unsub()
  }, [])

  return { leads, loading, error }
}

function StatusBadge({ status }) {
  const map = {
    new: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:ring-sky-800',
    read: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:ring-slate-800',
    meeting_scheduled:
      'bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-800'
  }
  const labelMap = {
    new: 'New Lead',
    read: 'Message Read',
    meeting_scheduled: 'Meeting Scheduled'
  }
  const cls =
    map[status] ||
    'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:ring-slate-800'
  const label = labelMap[status] || 'New Lead'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {label}
    </span>
  )
}

function MessageModal({ open, onClose, lead }) {
  if (!lead) return null
  const name = lead.fullName || lead.name || '-'

  const createdAt =
    lead.createdAt?.toDate?.() instanceof Date ? lead.createdAt.toDate().toLocaleString() : lead.createdAt || '-'

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-8">
        <DialogPanel className="relative max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
            <DialogTitle className="text-sm font-semibold text-slate-900 dark:text-white">Lead Message</DialogTitle>
            <button
              onClick={onClose}
              className="inline-flex size-7 items-center justify-center rounded-full text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3 px-5 py-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium text-slate-900 dark:text-slate-100">{name}</div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <div>
                <div className="font-semibold">Email</div>
                <div className="truncate">{lead.email || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Phone Number</div>
                <div className="truncate">{lead.phone || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Business Name</div>
                <div className="truncate">{lead.companyName || lead.company || '-'}</div>
              </div>
              <div>
                <div className="font-semibold">Date</div>
                <div>{createdAt}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Full Message
              </div>
              <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                {lead.message || '-'}
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

function ScheduleModal({ open, onClose, lead, onScheduled }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [mode, setMode] = useState('Google Meet')
  const [notes, setNotes] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setError('')
      setSubmitting(false)
      setNotes('')
      setMode('Google Meet')
      setDate('')
      setTime('')
      setMeetingLink('')
    }
  }, [open])

  if (!lead) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date || !time) {
      setError('Please select date and time.')
      return
    }

    const onlineModes = ['Google Meet', 'Zoom', 'Microsoft Teams']
    const isOnline = onlineModes.includes(mode)
    if (isOnline && !meetingLink.trim()) {
      setError('Meeting link is required for online meetings.')
      return
    }

      try {
        setSubmitting(true)
        setError('')

        const token = localStorage.getItem('super_admin_token') || ''

        const response = await fetch('http://localhost:5000/api/schedule-meeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            clientName: lead.fullName || lead.name || '',
            clientEmail: lead.email || '',
            meetingDate: date,
            meetingTime: time,
            meetingLink: meetingLink.trim()
          })
        })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || 'Failed to schedule meeting on server.')
      }

      // Optional: update original lead status in Firestore (if allowed by rules)
      try {
        const userRef = doc(collection(db, 'users'), lead.id)
        await setDoc(
          userRef,
          {
            status: 'meeting_scheduled'
          },
          { merge: true }
        )
      } catch {
        // ignore if rules don't allow
      }

      onScheduled?.()
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to schedule meeting.')
    } finally {
      setSubmitting(false)
    }
  }

  const name = lead.fullName || lead.name || '-'

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-8">
        <DialogPanel className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 dark:border-slate-800">
            <DialogTitle className="text-sm font-semibold text-slate-900 dark:text-white">Schedule Meeting</DialogTitle>
            <button
              onClick={onClose}
              className="inline-flex size-7 items-center justify-center rounded-full text-xs text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <form
            id="schedule-meeting-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-4 text-sm space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Lead Name</div>
                <div className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 leading-10 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {name}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Email</div>
                <div className="h-10 truncate rounded-xl border border-slate-200 bg-slate-50 px-3 leading-10 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {lead.email || '-'}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Phone Number</div>
                <div className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 leading-10 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {lead.phone || '-'}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Business Name</div>
                <div className="h-10 truncate rounded-xl border border-slate-200 bg-slate-50 px-3 leading-10 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  {lead.companyName || lead.company || '-'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Meeting Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              >
                <option>Google Meet</option>
                <option>Zoom</option>
                <option>Microsoft Teams</option>
                <option>In Person</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Meeting Link {['Google Meet', 'Zoom', 'Microsoft Teams'].includes(mode) ? '(required)' : '(optional)'}
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
                {error}
              </div>
            ) : null}
          </form>

          <div className="border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="schedule-meeting-form"
                disabled={submitting}
                className="inline-flex h-9 items-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {submitting ? 'Scheduling…' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default function Interest() {
  const { leads, loading, error } = useLeads()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [messageLead, setMessageLead] = useState(null)
  const [scheduleLead, setScheduleLead] = useState(null)

  const handleDelete = async (leadId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;
  
    try {
      await deleteDoc(doc(db, "users", leadId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete lead");
    }
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    let result = leads
    if (s) {
      result = result.filter((l) => {
        const haystack = [
          l.fullName,
          l.name,
          l.email,
          l.phone,
          l.company,
          l.companyName
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(s)
      })
    }

    const getName = (l) => (l.fullName || l.name || '').toLowerCase()
    const getBusiness = (l) => (l.companyName || l.company || '').toLowerCase()
    const getDate = (l) =>
      l.createdAt?.toDate?.() instanceof Date ? l.createdAt.toDate().getTime() : 0

    const sorted = [...result]
    if (sortBy === 'date_desc') sorted.sort((a, b) => getDate(b) - getDate(a))
    if (sortBy === 'name_asc') sorted.sort((a, b) => getName(a).localeCompare(getName(b)))
    if (sortBy === 'business_asc') sorted.sort((a, b) => getBusiness(a).localeCompare(getBusiness(b)))

    return sorted
  }, [leads, search, sortBy])

  const desktopTable = (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      
      <div className="min-w-[720px] lg:min-w-[960px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900/60">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Lead ID</th>
              <th className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                Name
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Phone Number</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Business Name</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Message</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">
                <button
                  type="button"
                  onClick={() => setSortBy(sortBy === 'date_desc' ? 'name_asc' : 'date_desc')}
                  className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300"
                >
                  Date
                </button>
              </th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {filtered.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-slate-500 dark:text-slate-400" colSpan={9}>
                  {loading ? 'Loading leads…' : 'No leads found.'}
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const name = lead.fullName || lead.name || '-'
                const email = lead.email || '-'
                const phone = lead.phone || '-'
                const business = lead.companyName || lead.company || '-'
                const messageText = typeof lead.message === 'string' ? lead.message : '-'
                const messagePreview =
                  messageText.length > 30 ? `${messageText.slice(0, 30)}…` : messageText || '-'
                const createdAt =
                  lead.createdAt?.toDate?.() instanceof Date
                    ? lead.createdAt.toDate().toLocaleString()
                    : lead.createdAt || '-'

                return (
                  <tr key={lead.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                    <td className="px-3 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{lead.id}</td>
                    <td className="sticky left-0 z-0 bg-white px-3 py-3 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                      {name}
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      <span className="max-w-[180px] truncate" title={email}>
                        {email}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">{phone}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      <span className="max-w-[180px] truncate" title={business}>
                        {business}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="max-w-[160px] truncate" title={messageText}>
                          {messagePreview}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMessageLead(lead)}
                          className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                        >
                          Read
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">{createdAt}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-3 py-3">
   <div className="flex items-center justify-end gap-2">


<div className="flex items-center justify-end gap-2"> 

<button
  onClick={() => setScheduleLead(lead)}
  className="flex items-center gap-1 rounded-lg bg-slate-900 px-2 py-2 text-white hover:bg-slate-800 md:px-3 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
>
  <Calendar className="w-4 h-4 shrink-0" />
  <span className="hidden md:inline text-xs font-medium">
    Schedule
  </span>
</button>

<button
  onClick={() => handleDelete(lead.id)}
  className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-red-600 hover:bg-red-100 md:px-3"
>
  <Trash2 className="w-4 h-4 shrink-0" />
  <span className="hidden md:inline text-xs font-medium">
    Delete
  </span>
</button>

</div>
  </div>
</td>
        
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  const mobileList = (
    <div className="mt-4 space-y-3 md:hidden">
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {loading ? 'Loading leads…' : 'No leads found.'}
        </div>
      ) : (
        filtered.map((lead) => {
          const name = lead.fullName || lead.name || '-'
          const business = lead.companyName || lead.company || '-'
          const messageText = typeof lead.message === 'string' ? lead.message : '-'
          const messagePreview =
            messageText.length > 30 ? `${messageText.slice(0, 30)}…` : messageText || '-'

          return (
            <div
              key={lead.id}
              className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-xs dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{business}</div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Message:</span> {messagePreview}
              </div>
              <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMessageLead(lead)}
                  className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                >
                  Read
                </button>
                <div className="flex items-center justify-end gap-2 pt-1 text-xs">
  <button
    type="button"
    onClick={() => setMessageLead(lead)}
    className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
  >
    Read
  </button>

  <button
    type="button"
    onClick={() => setScheduleLead(lead)}
    className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
  >
    Schedule Meet
  </button>

  <button
    type="button"
    onClick={() => handleDelete(lead.id)}
    className="rounded-full bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700"
  >
    Delete
  </button>
</div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interested Leads</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            All inbound interest captured from your contact forms.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="h-10 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            >
              <option value="date_desc">Sort: Date (newest)</option>
              <option value="name_asc">Sort: Name (A–Z)</option>
              <option value="business_asc">Sort: Business (A–Z)</option>
            </select>
          </div>

          <button className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            Export CSV
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">Total Leads: {filtered.length}</div>

        <div className="hidden md:block">{desktopTable}</div>
        {mobileList}
      </div>

      <MessageModal open={!!messageLead} onClose={() => setMessageLead(null)} lead={messageLead} />
      <ScheduleModal
        open={!!scheduleLead}
        onClose={() => setScheduleLead(null)} 
        lead={scheduleLead}
        onScheduled={() => {
          // In real app, you might show a toast and optionally filter out scheduled leads from Interest
        }}
      />
    </div>
  )
}
