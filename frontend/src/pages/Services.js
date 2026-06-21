import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const role = localStorage.getItem('role')
  const navigate = useNavigate()

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await API.get('/services/', {
        params: { search: search, category: category }
      })
      setServices(res.data.results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [search, category])

  const categories = [
    { value: '', label: '🌐 All Categories' },
    { value: 'web_dev', label: '💻 Web Development' },
    { value: 'graphic', label: '🎨 Graphic Design' },
    { value: 'writing', label: '✍️ Content Writing' },
    { value: 'marketing', label: '📣 Digital Marketing' },
    { value: 'other', label: '🔧 Other' },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r  from-green-500 via-teal-500 to-blue-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Services</h1>
              <p className="opacity-80">Find the best freelance services</p>
            </div>
            {role === 'freelancer' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-service')}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                ➕ Create Service
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 bg-white shadow-sm"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition duration-200 bg-white shadow-sm md:w-56"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded mb-4 w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">Koi service nahi mili!</p>
            {role === 'freelancer' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-service')}
                className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                Create First Service
              </motion.button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  onClick={() => navigate(`/services/${service.id}`)}
                  className="bg-white rounded-2xl shadow p-6 cursor-pointer"
                >
                  {/* Category Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                      {service.category === 'web_dev' ? '💻 Web Dev' :
                       service.category === 'graphic' ? '🎨 Design' :
                       service.category === 'writing' ? '✍️ Writing' :
                       service.category === 'marketing' ? '📣 Marketing' : '🔧 Other'}
                    </span>
                    <span className="text-2xl font-bold text-blue-600">${service.price}</span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h2>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>

                  <div className="flex justify-between items-center border-t pt-3">
                    <p className="text-gray-400 text-xs">👤 {service.freelancer_name}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                      ⏱ {service.delivery_days} days
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

      </div>
    </div>
  )
}

export default Services