import { useState } from 'react'
import { motion } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function CreateService() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'web_dev',
    price: '',
    delivery_days: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/services/', form)
      navigate('/services')
    } catch (err) {
      setError('Kuch error aya — dobara try karo!')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'web_dev', label: '💻 Web Development' },
    { value: 'graphic', label: '🎨 Graphic Design' },
    { value: 'writing', label: '✍️ Content Writing' },
    { value: 'marketing', label: '📣 Digital Marketing' },
    { value: 'other', label: '🔧 Other' },
  ]

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 text-sm bg-white"

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
              onClick={() => navigate('/services')}
              className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition"
            >
              ← Back to Services
            </button>
            <h1 className="text-4xl font-bold">Create Service</h1>
            <p className="opacity-80 mt-1">Showcase your skills to clients</p>
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
                Service Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. I will build a React website"
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
                placeholder="Describe your service in detail..."
                required
              />
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-5"
            >
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </motion.div>

            {/* Price & Delivery */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="500"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                  Delivery Days
                </label>
                <input
                  type="number"
                  name="delivery_days"
                  value={form.delivery_days}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="7"
                  required
                />
              </motion.div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating...
                </span>
              ) : '🚀 Create Service'}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default CreateService