import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../services/api'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username') || 'User'
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileRef = useRef(null)

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications/')
      if (Array.isArray(res.data)) {
        setNotifications(res.data)
      } else if (res.data.results) {
        setNotifications(res.data.results)
      } else {
        setNotifications([])
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (token) fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    navigate('/login')
  }

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter(n => !n.is_read).length
    : 0

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/projects', label: 'Projects' },
  ]

  const isStaff = localStorage.getItem('is_staff') === 'true'

  const profileMenuLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/services', label: 'Services', icon: '🛠' },
    ...(isStaff ? [{ to: '/admin/withdrawals', label: 'Withdrawals', icon: '🏦' }] : []),
    ...(role === 'freelancer' ? [{ to: '/my-services', label: 'My Services', icon: '📁' }] : []),
    { to: '/orders', label: 'Orders', icon: '📦' },
    { to: '/my-proposals', label: 'My Proposals', icon: '📨' },
    ...(role === 'client' ? [{ to: '/projects', label: 'Project Proposals', icon: '📥' }] : []),
    { to: '/wallet', label: 'Wallet', icon: '💰' },
  ]

  const initial = username.charAt(0).toUpperCase()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Link to="/home" className="text-2xl font-bold tracking-wide">
          Freelance<span className="text-yellow-300">Hub</span>
        </Link>
      </motion.div>

      {/* Links */}
      <div className="flex gap-2 items-center">
        {token ? (
          <>
            {/* Nav Links */}
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={link.to}
                  className="px-3 py-1.5 rounded-lg hover:bg-white/20 transition duration-200 text-sm font-medium"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-xl px-2"
              >
                🔔
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="absolute -top-1 -right-1 text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-80 bg-white text-gray-800 rounded-2xl shadow-2xl p-4 z-50"
                  >
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">
                      🔔 Notifications
                    </h3>

                    {notifications.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-4">
                        No notifications yet!
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          onClick={async () => {
                            try {
                              await API.post(`/notifications/${notification.id}/read/`)
                              fetchNotifications()
                            } catch (err) {
                              console.log(err)
                            }
                          }}
                          className={`border-b py-3 cursor-pointer rounded-lg px-2 transition ${
                            !notification.is_read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async (e) => {
                              e.stopPropagation()
                              await API.delete(`/notifications/${notification.id}/`)
                              fetchNotifications()
                            }}
                            className="text-red-500 text-xs mt-1 hover:text-red-700 transition"
                          >
                            Delete
                          </motion.button>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar + Dropdown */}
            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center shadow"
              >
                {initial}
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="font-semibold text-sm truncate">{username}</p>
                      <p className="text-xs text-gray-400 capitalize">{role}</p>
                    </div>

                    {profileMenuLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition"
                        >
                          <span>{link.icon}</span>
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <motion.button
                        whileHover={{ backgroundColor: '#fef2f2' }}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 transition text-left"
                      >
                        <span>🚪</span>
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg hover:bg-white/20 transition duration-200 text-sm font-medium"
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-4 py-1.5 rounded-lg font-semibold text-sm shadow hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar