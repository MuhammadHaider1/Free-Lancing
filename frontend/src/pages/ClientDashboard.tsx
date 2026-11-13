import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Package,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import API from '../services/api'
import type { Order, Project } from '../lib/types'
import { formatCurrency, formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { StatusBadge } from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { PageLoader } from '../components/ui/Spinner'
import Avatar from '../components/ui/Avatar'

function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const username = localStorage.getItem('username') || 'Client'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, orderRes] = await Promise.all([
          API.get('/projects/projects/'),
          API.get('/orders/'),
        ])
        setProjects(projectRes.data.results || projectRes.data || [])
        setOrders(orderRes.data.results || orderRes.data || [])
      } catch {
        // empty states handle API failures
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { title: 'My projects', value: projects.length, icon: ClipboardList, tone: 'brand' as const, hint: `${projects.filter((project) => project.status === 'open').length} open`, to: '/projects' },
    { title: 'Active orders', value: orders.filter((order) => ['active', 'in_progress', 'delivered'].includes(order.status)).length, icon: Package, tone: 'violet' as const, hint: 'Work in progress', to: '/orders' },
    { title: 'Completed', value: orders.filter((order) => order.status === 'completed').length, icon: CheckCircle2, tone: 'accent' as const, hint: 'Delivered successfully', to: '/orders' },
    { title: 'Total spent', value: formatCurrency(orders.reduce((sum, order) => sum + Number(order.amount || 0), 0)), icon: CircleDollarSign, tone: 'amber' as const, hint: 'Across all orders', to: '/wallet' },
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
        eyebrow="Client workspace"
        title={`Welcome back, ${username.split(' ')[0]}`}
        subtitle="Keep your projects moving and your best freelancers close."
        actions={
          <>
            <Link to="/freelancers" className="btn-secondary">
              <Users className="h-4 w-4" aria-hidden="true" />
              Find talent
            </Link>
            <Link to="/create-project" className="btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Post a project
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

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-ink-900">My projects</h2>
                    <p className="mt-0.5 text-sm text-ink-500">Briefs you have posted recently.</p>
                  </div>
                  <Link to="/projects" className="btn-ghost px-2.5 py-2 text-xs">
                    View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-4 space-y-2">
                  {projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-ink-200 px-4 py-10 text-center">
                      <Briefcase className="mx-auto h-6 w-6 text-ink-300" aria-hidden="true" />
                      <p className="mt-3 text-sm font-medium text-ink-600">No projects yet</p>
                      <p className="mt-1 text-xs text-ink-400">Post your first brief and start receiving proposals.</p>
                      <Link to="/create-project" className="btn-primary mt-4">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Post a project
                      </Link>
                    </div>
                  ) : (
                    projects.slice(0, 5).map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}/proposals`}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition hover:border-ink-200 hover:bg-ink-50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <ClipboardList className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-brand-700">{project.title}</span>
                          <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
                            <CalendarDays className="h-3 w-3" aria-hidden="true" />
                            Due {formatDate(project.deadline)} · {project.proposals?.length || 0} proposals
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <span className="text-sm font-bold text-ink-900">{formatCurrency(project.budget)}</span>
                          <StatusBadge status={project.status} />
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg font-bold text-ink-900">My orders</h2>
                    <p className="mt-0.5 text-sm text-ink-500">Track deliveries and approve completed work.</p>
                  </div>
                  <Link to="/orders" className="btn-ghost px-2.5 py-2 text-xs">
                    View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-4 space-y-2">
                  {orders.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-ink-200 px-4 py-10 text-center">
                      <Package className="mx-auto h-6 w-6 text-ink-300" aria-hidden="true" />
                      <p className="mt-3 text-sm font-medium text-ink-600">No orders yet</p>
                      <p className="mt-1 text-xs text-ink-400">Hire a freelancer or browse services to get started.</p>
                      <Link to="/services" className="btn-secondary mt-4">
                        Browse services
                      </Link>
                    </div>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <Link
                        key={order.id}
                        to={`/orders/${order.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition hover:border-ink-200 hover:bg-ink-50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <Package className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-ink-900 group-hover:text-brand-700">Order #{order.id}</span>
                          <span className="mt-0.5 block truncate text-xs text-ink-400">
                            {order.freelancer_name || 'Freelancer'} · {formatDate(order.created_at)}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <span className="text-sm font-bold text-ink-900">{formatCurrency(order.amount)}</span>
                          <StatusBadge status={order.status} />
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden rounded-2xl bg-hero p-6 text-white shadow-lift"
            >
              <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-300">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">Hire with confidence</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-100/85">
                  Compare proposals, review verified profiles, and release payment only when delivery meets your brief.
                </p>
                <Link to="/freelancers" className="btn mt-5 bg-white text-brand-700 hover:bg-brand-50">
                  Explore talent
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>

            <Card>
              <CardBody>
                <h3 className="font-display text-base font-bold text-ink-900">Workspace shortcuts</h3>
                <div className="mt-4 space-y-1">
                  {[
                    { to: '/create-project', label: 'Post a new project', icon: Plus },
                    { to: '/services', label: 'Browse services', icon: Briefcase },
                    { to: '/wallet', label: 'View spending', icon: CircleDollarSign },
                    { to: '/reviews', label: 'Read client reviews', icon: TrendingUp },
                  ].map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to + label}
                      to={to}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
                    >
                      <Icon className="h-4 w-4 text-ink-400" aria-hidden="true" />
                      {label}
                      <ArrowRight className="ml-auto h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>

            <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white p-4">
              <Avatar name={username} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{username}</p>
                <p className="text-xs capitalize text-ink-400">Client account</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
