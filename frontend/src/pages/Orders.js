import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import API from '../services/api'
import { useNavigate } from 'react-router-dom'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState({})
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/')
      setOrders(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const uploadDelivery = async (orderId) => {
    if (!files[orderId]) {
      alert("Pehle delivery file select karo")
      return
    }

    try {
      const formData = new FormData()
      formData.append("delivery_file", files[orderId])

      await API.post(`/orders/${orderId}/deliver/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      alert("Delivery submitted!")
      fetchOrders()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || "Upload failed")
    }
  }

  const completeOrder = async (orderId) => {
    try {
      await API.post(`/orders/${orderId}/complete/`)
      alert("Order completed!")
      fetchOrders()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.error || "Something went wrong")
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const statusStyle = (status) =>
    status === 'active'
      ? 'bg-blue-100 text-blue-600'
      : status === 'completed'
      ? 'bg-green-100 text-green-600'
      : status === 'delivered'
      ? 'bg-yellow-100 text-yellow-600'
      : 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold">My Orders</h1>
            <p className="opacity-80 mt-1">Track deliveries and manage your orders</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"
            />
          </div>
        ) : orders.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-10"
          >
            Koi order nahi mila!
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Order #{order.id}
                </h2>
                <p className="text-gray-500 text-sm mb-1">
                  Client: {order.client_name}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  Freelancer: {order.freelancer_name}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">
                    ${order.amount}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-400 text-xs mt-2">
                  Created: {new Date(order.created_at).toLocaleDateString()}
                </p>

                {order.status === "active" &&
                  localStorage.getItem("role") === "freelancer" && (
                    <div
                      className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="file"
                        onChange={(e) =>
                          setFiles({
                            ...files,
                            [order.id]: e.target.files[0]
                          })
                        }
                        className="mb-2 text-xs w-full"
                      />
                      <motion.button
                        onClick={() => uploadDelivery(order.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm py-2 rounded-xl font-semibold shadow hover:shadow-md transition"
                      >
                        Submit Delivery
                      </motion.button>
                    </div>
                  )}

                {order.status === "delivered" &&
                  localStorage.getItem("role") === "client" && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        completeOrder(order.id)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm py-2 rounded-xl font-semibold shadow hover:shadow-md transition mt-3"
                    >
                      Mark Complete
                    </motion.button>
                  )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders