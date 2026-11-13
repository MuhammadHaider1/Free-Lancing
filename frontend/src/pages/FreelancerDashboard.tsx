import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Package,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import API from '../services/api'
import type { Order, Proposal, Service } from '../lib/types'
import { categoryMeta, formatCurrency, formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { StatusBadge } from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { PageLoader } from '../components/ui/Spinner'
import Avatar from '../components/ui/Avatar'

function FreelancerDashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const username = localStorage.getItem('username') || 'Freelancer'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, proposalsRes, ordersRes] = await Promise.all([
          API.get('/services/'),
          API.get('/projects/proposals/'),
          API.get('/orders/'),
        ])
        setServices(servicesRes.data.results || servicesRes.data || [])
        setProposals(proposalsRes.data.results || proposalsRes.data || [])
        setOrders(ordersRes.data.results || ordersRes.data || [])
      } catch {
        // empty states handle API failures
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const earnings = orders
    .filter((order) => order.status === 'completed')
    .reduce((sum, order) => sum + Number(order.amount || 0), 0)

  const stats = [
    { title: 'My services', value: services.length, icon: Briefcase, tone: 'brand' as const, hint: 'Live on the marketplace', to: '/my-services' },
    { title: 'Proposals sent', value: proposals.length, icon: FileText, tone: 'amber' as const, hint: `${proposals.filter((proposal) => proposal.status === 'pending').length} awaiting reply`, to: '/my-proposals' },
    { title: 'Active orders', value: orders.filter((order) => ['active', 'in_progress', 'delivered'].includes(order.status)).length, icon: Package, tone: 'violet' as const, hint: 'Work in progress', to: '/orders' },
    { title: 'Earnings', value: formatCurrency(earnings), icon: CircleDollarSign, tone: 'accent' as const, hint: 'From completed orders', to: '/wallet' },
  ]

  if (loading) {
    return (
      <div className="page-wrap">
        <PageLoader label="Loading your dashboard…" />
      </div>
    )
  }

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Freelancer workspace"
        title={`Welcome back, ${username.split(' ')[0]}`}
        subtitle="Sharpen your services, send stronger proposals, and keep every delivery on track."
        actions={
          <>
            <Link to="/projects" className="btn-secondary">
              <Send className="h-4 w-4" aria-hidden="true" />
              Find projects
            </Link>
            <Link to="/create-service" className="btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create service
            </Link>
          </>
        }
      />

      <div className="container-page pt-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index * 0.05} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="flex h-full flex-col">
            <CardBody className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink-900">My services</h2>
                <Link to="/my-services" className="btn-ghost px-2.5 py-2 text-xs">
                  Manage
                </Link>
              </div>
              <div className="mt-4 flex-1 space-y-2">
                {services.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center">
                    <Briefcase className="mx-auto h-6 w-6 text-ink-300" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-ink-600">No services yet</p>
                    <Link to="/create-service" className="btn-primary mt-4 w-full">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Create your first service
                    </Link>
                  </div>
                ) : (
                  services.slice(0, 4).map((service) => {
                    const meta = categoryMeta(service.category)
                    return (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-ink-200 hover:bg-ink-50"
                      >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${meta.gradient} text-white`}>
                          <Briefcase className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-brand-700">{service.title}</span>
                          <span className="text-[11px] text-ink-400">{meta.short} · {service.delivery_days} days</span>
                        </span>
                        <span className="text-sm font-bold text-ink-900">{formatCurrency(service.price)}</span>
                      </Link>
                    )
                  })
                )}
              </div>
              {services.length > 0 && (
                <Link to="/my-services" className="btn-secondary mt-4 w-full">
                  Manage services
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </CardBody>
          </Card>

          <Card className="flex h-full flex-col">
            <CardBody className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink-900">Recent proposals</h2>
                <Link to="/my-proposals" className="btn-ghost px-2.5 py-2 text-xs">
                  View all
                </Link>
              </div>
              <div className="mt-4 flex-1 space-y-2">
                {proposals.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center">
                    <FileText className="mx-auto h-6 w-6 text-ink-300" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-ink-600">No proposals yet</p>
                    <p className="mt-1 text-xs text-ink-400">Find an open project and pitch your skills.</p>
                    <Link to="/projects" className="btn-primary mt-4 w-full">
                      Browse projects
                    </Link>
                  </div>
                ) : (
                  proposals.slice(0, 4).map((proposal) => (
                    <div key={proposal.id} className="rounded-xl border border-ink-100 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-1 text-sm font-semibold text-ink-900">{proposal.project_title || `Project #${proposal.project}`}</p>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <p className="mt-1 text-xs text-ink-400">
                        Bid {formatCurrency(proposal.bid_amount)} · {proposal.delivery_days} days
                      </p>
                    </div>
                  ))
                )}
              </div>
              {proposals.length > 0 && (
                <Link to="/my-proposals" className="btn-secondary mt-4 w-full">
                  Track proposals
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </CardBody>
          </Card>

          <Card className="flex h-full flex-col">
            <CardBody className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink-900">Active orders</h2>
                <Link to="/orders" className="btn-ghost px-2.5 py-2 text-xs">
                  View all
                </Link>
              </div>
              <div className="mt-4 flex-1 space-y-2">
                {orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center">
                    <Package className="mx-auto h-6 w-6 text-ink-300" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-ink-600">No orders yet</p>
                    <p className="mt-1 text-xs text-ink-400">Accepted proposals will appear here.</p>
                  </div>
                ) : (
                  orders.slice(0, 4).map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-ink-200 hover:bg-ink-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                        <Package className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink-900 group-hover:text-brand-700">Order #{order.id}</span>
                        <span className="text-[11px] text-ink-400">{formatDate(order.created_at)}</span>
                      </span>
                      <span className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-ink-900">{formatCurrency(order.amount)}</span>
                        <StatusBadge status={order.status} />
                      </span>
                    </Link>
                  ))
                )}
              </div>
              {orders.length > 0 && (
                <Link to="/orders" className="btn-secondary mt-4 w-full">
                  Manage orders
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl bg-hero p-6 text-white shadow-lift sm:p-8"
          >
            <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100">
                  <Sparkles className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
                  Keep momentum
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold text-white">Your next client is one proposal away.</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-brand-100/85">
                  Browse fresh briefs, tailor your pitch, and keep your delivery times realistic. Small,
                  specific proposals win more often than generic ones.
                </p>
              </div>
              <Link to="/projects" className="btn shrink-0 bg-white text-brand-700 hover:bg-brand-50">
                Find projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          <Card>
            <CardBody>
              <h3 className="font-display text-base font-bold text-ink-900">At a glance</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-3">
                  <span className="inline-flex items-center gap-2 text-sm text-ink-600">
                    <CheckCircle2 className="h-4 w-4 text-accent-600" aria-hidden="true" />
                    Completed orders
                  </span>
                  <span className="font-display text-lg font-bold text-ink-900">{orders.filter((order) => order.status === 'completed').length}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-3">
                  <span className="inline-flex items-center gap-2 text-sm text-ink-600">
                    <TrendingUp className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    Accepted proposals
                  </span>
                  <span className="font-display text-lg font-bold text-ink-900">{proposals.filter((proposal) => proposal.status === 'accepted').length}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-3">
                  <span className="inline-flex items-center gap-2 text-sm text-ink-600">
                    <Wallet className="h-4 w-4 text-amber-600" aria-hidden="true" />
                    Wallet balance
                  </span>
                  <Link to="/wallet" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                    Open wallet
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                <Avatar name={username} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{username}</p>
                  <p className="text-[11px] capitalize text-ink-400">Freelancer account</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default FreelancerDashboard
