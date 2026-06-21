import { useState } from 'react'
import { motion } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function CreateProject() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/projects/projects/', form)
      navigate('/projects')
    } catch (err) {
      setError('Kuch error aya! ' + JSON.stringify(err.response?.data || ''))
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-200 text-sm bg-white"

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/projects')}
              className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition"
            >
              ← Back to Projects
            </button>
            <h1 className="text-4xl font-bold">Create Project</h1>
            <p className="opacity-80 mt-1">Post a project and find the best freelancer</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6"
            >
              ❌ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-5"
            >
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Build me an ecommerce website"
                required
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-5"
            >
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className={inputClass}
                placeholder="Describe your project requirements in detail..."
                required
              />
            </motion.div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="1000"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </motion.div>
            </div>

            {/* Tips Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6"
            >
              <p className="text-green-700 text-sm font-semibold mb-2">💡 Tips for better proposals:</p>
              <ul className="text-green-600 text-xs space-y-1">
                <li>✅ Be specific about requirements</li>
                <li>✅ Set a realistic budget</li>
                <li>✅ Give enough time for delivery</li>
              </ul>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating...
                </span>
              ) : '📋 Create Project'}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateProject