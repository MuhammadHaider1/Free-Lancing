import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Projects from './pages/Projects'

import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'

import CreateProject from './pages/CreateProject'
import CreateReview from './pages/CreateReview'
import AllReviews from './pages/AllReviews'

import Freelancers from './pages/Freelancers'
import FreelancerProfile from './pages/FreelancerProfile'

import Dashboard from './pages/Dashboard'

import SendProposal from './pages/SendProposal'
import MyProposals from './pages/MyProposals'
import ProjectProposals from './pages/ProjectProposals'

import Services from './pages/Services'
import CreateService from './pages/CreateService'
import ServiceDetail from './pages/ServiceDetail'
import MyServices from './pages/MyServices'

import Wallet from './pages/Wallet'
import AdminWithdrawals from './pages/AdminWithdrawls'
import AdminHome from './pages/AdminHome'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected app */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-service"
            element={
              <ProtectedRoute>
                <CreateService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send-proposal/:projectId"
            element={
              <ProtectedRoute>
                <SendProposal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews/create/:orderId"
            element={
              <ProtectedRoute>
                <CreateReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <AllReviews />
              </ProtectedRoute>
            }
          />
          <Route path="/freelancers" element={<Freelancers />} />
          <Route path="/freelancers/:id" element={<FreelancerProfile />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          <Route path="/my-proposals" element={<MyProposals />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route
            path="/projects/:projectId/proposals"
            element={
              <ProtectedRoute>
                <ProjectProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/withdrawals"
            element={
              <ProtectedRoute>
                <AdminWithdrawals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppShell() {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)
  const isLanding = location.pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <AnimatedRoutes />
      </div>
      {!isAuthPage && <Footer />}
      {isLanding && <span className="sr-only">FreelanceHub marketplace home</span>}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
