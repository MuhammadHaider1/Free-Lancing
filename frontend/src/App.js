import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Projects from './pages/Projects'

import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'

import CreateProject from './pages/CreateProject'
import CreateReview from './pages/CreateReview'
import AllReviews from "./pages/AllReviews";

import Freelancers from "./pages/Freelancers";
import FreelancerProfile from "./pages/FreelancerProfile";

import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";

import SendProposal from './pages/SendProposal'
import MyProposals from "./pages/MyProposals";
import ProjectProposals from "./pages/ProjectProposals";

import Services from './pages/Services'
import CreateService from './pages/CreateService'
import ServiceDetail from "./pages/ServiceDetail";
import MyServices from "./pages/MyServices";

import Wallet from "./pages/Wallet";
import AdminWithdrawals from './pages/AdminWithdrawls'
import AdminHome from './pages/AdminHome'


function App() {
  const token = localStorage.getItem('access_token')
  const isStaff = localStorage.getItem('is_staff') === 'true'

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            token
              ? <Navigate to={isStaff ? '/admin-home' : '/home'} />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
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
          path="/freelancers/:id"
          element={<FreelancerProfile />}
        />

        <Route
          path="/services/:id"
          element={<ServiceDetail />}
        />

        <Route
          path="/freelancers"
          element={<Freelancers />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/dashboard/:id"
          element={<ClientDashboard />}
        />

        <Route
          path="/dashboard/:id"
          element={<FreelancerDashboard />}
        />

        <Route
          path="/my-proposals"
          element={<MyProposals />}
        />

        <Route
          path="/my-services"
          element={<MyServices />}
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <AllReviews />
            </ProtectedRoute>
          }
        />
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

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App