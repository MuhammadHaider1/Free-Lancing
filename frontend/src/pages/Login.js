import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react'
import API from '../services/api'
import AuthShell from '../components/AuthShell'

function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate(localStorage.getItem('is_staff') === 'true' ? '/admin-home' : '/home', { replace: true })
    }
  }, [navigate])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/users/login/', form)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)

      const profile = await API.get('/users/profile/', {
        headers: { Authorization: `Bearer ${res.data.access}` },
      })

      localStorage.setItem('role', profile.data.role)
      localStorage.setItem('username', profile.data.username)
      localStorage.setItem('is_staff', profile.data.is_staff)

      navigate(profile.data.is_staff ? '/admin-home' : '/home')
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(detail || 'Those credentials did not match. Please check your username and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to FreelanceHub"
      subtitle="Pick up where you left off — your projects, proposals and payouts are waiting."
    >
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft sm:p-7">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input pl-10"
                placeholder="your username"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="label">
                Password
              </label>
              <span className="mb-1.5 text-xs font-medium text-ink-400">Minimum 8 characters</span>
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input px-10"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500/30"
            />
            Keep me signed in
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink-100" />
          <span className="text-xs font-medium uppercase tracking-wider text-ink-400">New here?</span>
          <span className="h-px flex-1 bg-ink-100" />
        </div>

        <Link to="/register" className="btn-secondary w-full">
          Create a free account
        </Link>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
        By signing in you agree to our Terms of Service and Privacy Policy.
      </p>
    </AuthShell>
  )
}

export default Login
