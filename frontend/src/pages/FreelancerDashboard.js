import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function FreelancerDashboard() {
  const [services, setServices] = useState([])
  const [proposals, setProposals] = useState([])
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const username = localStorage.getItem('username') || 'Freelancer'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const servicesRes = await API.get('/services/')
      setServices(servicesRes.data.results || servicesRes.data)
      const proposalsRes = await API.get('/projects/proposals/')
      setProposals(proposalsRes.data.results || proposalsRes.data)
      const ordersRes = await API.get('/orders/')
      setOrders(ordersRes.data.results || ordersRes.data)
    } catch (err) {
      console.log(err)
    }
  }

  const stats = [
    { title: 'My Services', value: services.length, icon: '🛠', color: 'from-blue-400 to-blue-600' },
    { title: 'Proposals', value: proposals.length, icon: '📝', color: 'from-yellow-400 to-yellow-600' },
    { title: 'Active Orders', value: orders.filter(o => o.status === 'active').length, icon: '📦', color: 'from-purple-400 to-purple-600' },
    { title: 'Completed', value: orders.filter(o => o.status === 'completed').length, icon: '✅', color: 'from-green-400 to-green-600' },
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
      <div className="bg-gradient-to-r  from-green-500 via-teal-500 to-blue-600 text-white py-16 px-6">
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
            className="text-lg opacity-90"
          >
            Manage your services, proposals and orders from here.
          </motion.p>
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
        <div className="grid md:grid-cols-3 gap-6 items-stretch">

          {/* My Services */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col h-full"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">🛠 My Services</h2>
            <div className="flex-1">
              {services.length === 0 ? (
                <p className="text-gray-400 text-sm">Koi service nahi hai abhi!</p>
              ) : (
                services.slice(0, 3).map(service => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b py-3"
                  >
                    <p className="font-semibold text-gray-700">{service.title}</p>
                    <p className="text-blue-600 font-bold">${service.price}</p>
                  </motion.div>
                ))
              )}
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate('/services')}
              className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow mt-6"
            >
              Manage Services
            </motion.button>
          </motion.div>

          {/* My Proposals */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col h-full"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">📝 My Proposals</h2>
            <div className="flex-1">
              {proposals.length === 0 ? (
                <p className="text-gray-400 text-sm">Koi proposal nahi hai abhi!</p>
              ) : (
                proposals.slice(0, 3).map(proposal => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b py-3"
                  >
                    <p className="font-semibold text-gray-700">Bid: ${proposal.bid_amount}</p>
                    <p className="text-sm text-gray-400">{proposal.delivery_days} days</p>
                    <span className={`text-xs font-bold ${
                      proposal.status === 'accepted' ? 'text-green-600' :
                      proposal.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {proposal.status}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => navigate('/projects')}
              className="mt-auto w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold shadow mt-6"
            >
              Browse Projects
            </motion.button>
          </motion.div>

          {/* My Orders */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col h-full"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">📦 My Orders</h2>
            <div className="flex-1">
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm">Koi order nahi hai abhi!</p>
              ) : (
                orders.slice(0, 3).map(order => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b py-3"
                  >
                    <p className="font-semibold text-gray-700">Order #{order.id}</p>
                    <p className="text-gray-400 text-sm">${order.amount}</p>
                    <span className={`text-xs font-bold ${
                      order.status === 'active' ? 'text-blue-600' :
                      order.status === 'completed' ? 'text-green-600' :
                      'text-gray-500'
                    }`}>
                      {order.status}
                    </span>
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

export default FreelancerDashboard