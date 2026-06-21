import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import API from '../services/api'

function Home() {
  const username = localStorage.getItem('username') || 'User'
  const role = localStorage.getItem('role') || 'client'
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const servicesRes = await API.get('/services/')
      setServices(servicesRes.data.results || servicesRes.data)

      const ordersRes = await API.get('/orders/')
      setOrders(ordersRes.data.results || ordersRes.data)

      const reviewsRes = await API.get('/reviews/')
      setReviews(reviewsRes.data.results || reviewsRes.data)
    } catch (err) {
      console.log(err)
    }
  }

  const earnings = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + parseFloat(o.amount || 0), 0)
    .toFixed(0)

  const stats = [
    { title: 'Services', value: services.length, icon: '🛠', color: 'from-blue-400 to-blue-600', link: '/services' },
    { title: 'Orders', value: orders.length, icon: '📦', color: 'from-purple-400 to-purple-600', link: '/orders' },
    { title: 'Reviews', value: reviews.length, icon: '⭐', color: 'from-yellow-400 to-yellow-500', link: '/reviews' },
    { title: 'Earnings', value: `$${earnings}`, icon: '💰', color: 'from-green-400 to-green-600', link: '/orders' },
  ]

  const quickActions = [
    ...(role === 'freelancer' ? [{ to: '/create-service', color: 'from-blue-500 to-blue-700', icon: '➕', label: 'Create Service' }] : []),
    ...(role === 'client' ? [{ to: '/create-project', color: 'from-green-500 to-green-700', icon: '📋', label: 'Create Project' }] : []),
    { to: '/projects', color: 'from-indigo-500 to-indigo-700', icon: '🔍', label: 'Browse Projects' },
    { to: '/orders', color: 'from-purple-500 to-purple-700', icon: '📦', label: 'My Orders' },
    { to: '/services', color: 'from-yellow-400 to-yellow-600', icon: '🛠', label: 'Services' },
    { to: '/freelancers', color: 'from-teal-500 to-teal-700', icon: '👥', label: 'Freelancers' },
    { to: '/dashboard', color: 'from-pink-500 to-pink-700', icon: '📊', label: 'Dashboard' },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r  from-green-500 via-teal-500 to-blue-600 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-5xl font-bold mb-4"
          >
            Welcome Back, {username} 👋
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl opacity-90 mb-8"
          >
            Manage your freelance career, services, orders and grow your income.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-4 flex-wrap"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/services"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg inline-block"
              >
                Browse Services
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/projects"
                className="border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-200 inline-block"
              >
                View Projects
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              onClick={() => navigate(item.link)}
              className="bg-white rounded-2xl shadow p-6 cursor-pointer"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {item.icon}
              </div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-3xl font-bold mt-1"
              >
                {item.value}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              >
                <Link
                  to={action.to}
                  className={`bg-gradient-to-br ${action.color} text-white p-5 rounded-2xl text-center shadow block`}
                >
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <p className="font-semibold text-sm">{action.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white rounded-2xl shadow p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Why FreelanceHub?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🚀', title: 'Grow Faster', desc: 'Create services and attract clients from around the world.' },
              { icon: '💬', title: 'Easy Communication', desc: 'Chat directly with clients and freelancers in real time.' },
              { icon: '⭐', title: 'Build Reputation', desc: 'Earn reviews and grow your profile to get more work.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="p-6 bg-gray-50 rounded-xl cursor-pointer"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Home