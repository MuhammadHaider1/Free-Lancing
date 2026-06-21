import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const userRole = localStorage.getItem('role')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await API.get('/projects/projects/', {
        params: { search: search }
      })
      setProjects(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const acceptProposal = async (id) => {
    try {
      await API.post('/orders/accept-proposal/', { proposal_id: id })
      fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const rejectProposal = async (id) => {
    try {
      await API.post(`/projects/proposals/${id}/reject/`)
      fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [search])

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -6,
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">Projects</h1>
              <p className="opacity-80">Find and manage freelance projects</p>
            </div>
            {userRole === 'client' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-project')}
                className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                + Create Project
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-8"
        >
          <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-200 bg-white shadow-sm"
          />
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded mb-4 w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-400 text-lg">Koi project nahi mila!</p>
            {userRole === 'client' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/create-project')}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                Create First Project
              </motion.button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow p-6"
                >
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      project.status === 'open' ? 'bg-green-100 text-green-600' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      project.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                      'bg-red-100 text-red-500'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-green-600 font-bold text-lg">${project.budget}</span>
                    <span className="text-gray-400 text-xs">📅 {project.deadline}</span>
                  </div>

                  <p className="text-gray-400 text-xs mb-4">👤 {project.client_name}</p>

                  {/* Proposals for Client */}
                  {userRole === 'client' && project.proposals?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-t pt-4 mt-2"
                    >
                      <h3 className="font-bold text-gray-700 mb-3">
                        📝 Proposals ({project.proposals.length})
                      </h3>

                      {project.proposals.map((proposal) => (
                        <motion.div
                          key={proposal.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-gray-800">
                              👤 {proposal.freelancer_name}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              proposal.status === 'accepted' ? 'bg-green-100 text-green-600' :
                              proposal.status === 'rejected' ? 'bg-red-100 text-red-500' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {proposal.status}
                            </span>
                          </div>

                          <div className="flex gap-4 text-sm text-gray-500 mb-2">
                            <span>💰 ${proposal.bid_amount}</span>
                            <span>⏱ {proposal.delivery_days} days</span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 italic">
                            "{proposal.cover_letter}"
                          </p>

                          {proposal.status === 'pending' && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => acceptProposal(proposal.id)}
                                className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                              >
                                ✅ Accept
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => rejectProposal(proposal.id)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                              >
                                ❌ Reject
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Send Proposal for Freelancer */}
                  {userRole === 'freelancer' && project.status === 'open' && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/send-proposal/${project.id}`)}
                      className="w-full mt-3 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2.5 rounded-xl font-semibold text-sm shadow hover:shadow-md transition"
                    >
                      📨 Send Proposal
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default Projects