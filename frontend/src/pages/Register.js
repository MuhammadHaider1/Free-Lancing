import { useState } from 'react'
import { motion } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/users/register/', form)
      setSuccess('Account Successfully Created!')
      setError('')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError('Error! Please try again.')
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 text-sm"

  const fields = [
    { label: 'Username', name: 'username', type: 'text', placeholder: 'Enter your username' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email' },
    { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br  from-green-500 via-teal-500 to-blue-600 flex items-center justify-center px-4">

      {/* Background decorations */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10"
      >

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold">
            Freelance<span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Create your account today!</p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-4 text-center"
          >
            ✅ {success} Redirecting to login...
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Input Fields */}
          {fields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className="mb-4"
            >
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className={inputClass}
                placeholder={field.placeholder}
              />
            </motion.div>
          ))}

          {/* Role Select */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6"
          >
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['client', 'freelancer'].map((r) => (
                <motion.button
                  key={r}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-3 rounded-xl border-2 font-semibold text-sm capitalize transition duration-200 ${
                    form.role === r
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-500 hover:border-blue-300'
                  }`}
                >
                  {r === 'client' ? '🏢 Client' : '💻 Freelancer'}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200 text-sm disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </motion.div>

        </form>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-400 mt-6 text-sm"
        >
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </a>
        </motion.p>

      </motion.div>
    </div>
  )
}

export default Register