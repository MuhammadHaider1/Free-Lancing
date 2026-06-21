import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function ClientDashboard() {
  const [projects, setProjects] = useState([])
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Client'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const projectRes = await API.get('/projects/projects/')
      setProjects(projectRes.data.results || projectRes.data)
      const orderRes = await API.get('/orders/')
      setOrders(orderRes.data.results || orderRes.data)
    } catch (err) {
      console.log(err)
    }
  }

  const stats = [
    { title: 'My Projects', value: projects.length, icon: '📋', color: 'from-blue-400 to-blue-600' },
    { title: 'Active Orders', value: orders.filter(o => o.status === 'active').length, icon: '📦', color: 'from-purple-400 to-purple-600' },
    { title: 'Completed', value: orders.filter(o => o.status === 'completed').length, icon: '✅', color: 'from-green-400 to-green-600' },
    { title: 'Total Spent', value: `$${orders.reduce((sum, o) => sum + parseFloat(o.amount || 0), 0).toFixed(0)}`, icon: '💰', color: 'from-yellow-400 to-yellow-600' },
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

  const buttonVariants = {
    hover: {
      scale: 1.04,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    tap: {
      scale: 0.96,
      transition: { duration: 0.1 }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl font-bold mb-2"
          >
            Welcome, {username} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="text-lg opacity-90 mb-6"
          >
            Manage your projects, orders and find the best freelancers.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: 0.5, duration: 0.4 }}
            onClick={() => navigate('/create-project')}
            className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold shadow-lg"
          >
            + Create New Project
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow p-6 cursor-pointer"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {item.icon}
              </div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <p className="text-3xl font-bold mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">

          {/* My Projects */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col h-full"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">📋 My Projects</h2>
            <div className="flex-1">
              {projects.length === 0 ? (
                <p className="text-gray-400 text-sm">Koi project nahi hai abhi!</p>
              ) : (
                projects.slice(0, 4).map(project => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b py-3"
                  >
                    <p className="font-semibold text-gray-700">{project.title}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-green-600 font-bold">${project.budget}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'open' ? 'bg-green-100 text-green-600' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate('/projects')}
              className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow mt-6"
            >
              View All Projects
            </motion.button>
          </motion.div>

          {/* My Orders */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col h-full"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">📦 My Orders</h2>
            <div className="flex-1">
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm">Koi order nahi hai abhi!</p>
              ) : (
                orders.slice(0, 4).map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b py-3"
                  >
                    <p className="font-semibold text-gray-700">Order #{order.id}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-purple-600 font-bold">${order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'active' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'completed' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">Freelancer: {order.freelancer_name}</p>
                  </motion.div>
                ))
              )}
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate('/orders')}
              className="mt-auto w-full bg-purple-600 text-white py-3 rounded-xl font-semibold shadow mt-6"
            >
              View All Orders
            </motion.button>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default ClientDashboard