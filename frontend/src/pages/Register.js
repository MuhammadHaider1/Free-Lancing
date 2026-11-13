import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Laptop,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react'
import API from '../services/api'
import AuthShell from '../components/AuthShell'

const roles = [
  {
    value: 'client',
    title: 'I am hiring',
    desc: 'Post projects and build a team',
    icon: Building2,
  },
  {
    value: 'freelancer',
    title: 'I am freelancing',
    desc: 'Sell services and win work',
    icon: Laptop,
  },
]

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'client' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/users/register/', form)
      setSuccess(true)
      window.setTimeout(() => navigate('/login'), 2200)
    } catch (err) {
      const data = err.response?.data
      if (data && typeof data === 'object') {
        const firstValue = Object.values(data)[0]
        setError(Array.isArray(firstValue) ? String(firstValue[0]) : String(firstValue))
      } else {
        setError('We could not create your account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthShell
        eyebrow="Account created"
        title="Welcome to FreelanceHub"
        subtitle="Your account is ready. Let's get you to the right place."
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-accent-200 bg-white p-8 text-center shadow-soft"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold text-ink-900">Account successfully created</h2>
          <p className="mt-2 text-sm text-ink-500">
            Redirecting you to the sign-in page so you can get started.
          </p>
          <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-ink-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'linear' }}
              className="h-full rounded-full bg-accent-500"
            />
          </div>
          <Link to="/login" className="btn-primary mt-7 w-full">
            Go to sign in
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Join FreelanceHub"
      title="Create your account"
      subtitle="Free to join. Hire talent or sell your services in minutes."
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
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input pl-10"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input px-10"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
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

          <fieldset>
            <legend className="label">I want to…</legend>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ value, title, desc, icon: Icon }) => {
                const active = form.role === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    aria-pressed={active}
                    className={`rounded-xl border p-3.5 text-left transition duration-200 ${
                      active
                        ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-500/10'
                        : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="mt-2.5 block text-sm font-semibold text-ink-900">{title}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-400">{desc}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <p className="text-xs leading-relaxed text-ink-400">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              <>
                Create free account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default Register
