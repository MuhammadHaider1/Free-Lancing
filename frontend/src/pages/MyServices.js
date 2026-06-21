import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function MyServices() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const categories = [
    { value: 'web_dev', label: '💻 Web Development' },
    { value: 'graphic', label: '🎨 Graphic Design' },
    { value: 'writing', label: '✍️ Content Writing' },
    { value: 'marketing', label: '📣 Digital Marketing' },
    { value: 'other', label: '🔧 Other' },
  ]

  const fetchServices = async () => {
    try {
      const res = await API.get('/services/')
      setServices(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEdit = (service) => {
    setEditingService(service.id)
    setEditForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      delivery_days: service.delivery_days,
    })
  }

  const handleUpdate = async (id) => {
    try {
      await API.put(`/services/${id}/`, editForm)
      setEditingService(null)
      fetchServices()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/services/${id}/`)
      setDeleteConfirm(null)
      fetchServices()
    } catch (err) {
      console.error(err)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 text-sm"

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">My Services</h1>
              <p className="opacity-80">Manage your freelance services</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-service')}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg"
            >
              ➕ Add Service
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded mb-4 w-2/3" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🛠</div>
            <p className="text-gray-400 text-lg mb-4">Koi service nahi hai abhi!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-service')}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
            >
              Create First Service
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-2xl shadow p-6"
                >
                  {editingService === service.id ? (
                    // Edit Mode
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4">✏️ Edit Service</h3>

                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className={`${inputClass} mb-3`}
                        placeholder="Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className={`${inputClass} mb-3`}
                        rows="3"
                        placeholder="Description"
                      />
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className={`${inputClass} mb-3`}
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                          className={inputClass}
                          placeholder="Price"
                        />
                        <input
                          type="number"
                          value={editForm.delivery_days}
                          onChange={(e) => setEditForm({ ...editForm, delivery_days: e.target.value })}
                          className={inputClass}
                          placeholder="Days"
                        />
                      </div>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleUpdate(service.id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-semibold"
                        >
                          ✅ Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setEditingService(null)}
                          className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                          {categories.find(c => c.value === service.category)?.label || service.category}
                        </span>
                        <span className="text-blue-600 font-bold text-lg">${service.price}</span>
                      </div>

                      <h2 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h2>
                      <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{service.description}</p>

                      <div className="flex justify-between items-center text-xs text-gray-400 mb-4 border-t pt-3">
                        <span>⏱ {service.delivery_days} days</span>
                        <span>👤 {service.freelancer_name}</span>
                      </div>

                      {/* Delete Confirm */}
                      {deleteConfirm === service.id ? (
                        <div className="bg-red-50 rounded-xl p-3 mb-2">
                          <p className="text-red-600 text-sm font-medium mb-2 text-center">
                            Are you sure?
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleDelete(service.id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-semibold"
                            >
                              Yes, Delete
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setDeleteConfirm(null)}
                              className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold"
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleEdit(service)}
                            className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
                          >
                            ✏️ Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setDeleteConfirm(service.id)}
                            className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                          >
                            🗑️ Delete
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyServices