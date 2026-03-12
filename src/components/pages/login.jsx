import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isSuperAdminAuthed, setSuperAdminAuthed } from '../super-admin/auth/superAdminAuth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

const VALID_EMAIL = 'ganesh@gmail.com'
const VALID_PASSWORD = 'Ganesh@123'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectTo = useMemo(() => {
    const from = location.state?.from
    return typeof from === 'string' && from.startsWith('/super-admin') ? from : '/super-admin'
  }, [location.state])

  useEffect(() => {
    if (isSuperAdminAuthed()) navigate('/super-admin', { replace: true })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      const resp = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!resp.ok) {
        const data = await resp.json().catch(() => null)
        throw new Error(data?.message || 'Invalid credentials')
      }

      const data = await resp.json()
      if (data?.token) {
        localStorage.setItem('super_admin_token', data.token)
      }

      await signInWithEmailAndPassword(auth, email, password)

      setSuperAdminAuthed(true)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
            SA
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Super Admin</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to manage leads, clients, and products.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ganesh@gmail.com"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail(VALID_EMAIL)
                setPassword(VALID_PASSWORD)
                setError('')
              }}
              className="w-full text-xs font-medium text-slate-600 underline-offset-4 hover:underline"
            >
              Use demo credentials
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Protected access. Only authorized Super Admin credentials are allowed.
        </p>
      </div>
    </div>
  )
}

export default Login

