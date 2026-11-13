import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FolderKanban,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import API from '../services/api'
import type { Order, Review, Service } from '../lib/types'
import { categoryMeta, formatCurrency, formatDate } from '../lib/utils'
import StatCard from '../components/ui/StatCard'
import { StatusBadge } from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { Reveal } from '../components/ui/Reveal'
import { PageLoader } from '../components/ui/Spinner'

function Home() {
  const username = localStorage.getItem('username') || 'User'
  const role = localStorage.getItem('role') || 'client'
  const isStaff = localStorage.getItem('is_staff') === 'true'
  const navigate = useNavigate()

  const [services, setServices] = useState<Service[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, ordersRes, reviewsRes] = await Promise.all([
          API.get('/services/'),
          API.get('/orders/'),
          API.get('/reviews/'),
        ])
        setServices(servicesRes.data.results || servicesRes.data || [])
        setOrders(ordersRes.data.results || ordersRes.data || [])
        setReviews(reviewsRes.data.results || reviewsRes.data || [])
      } catch {
        // The dashboard still renders with empty states if the API is unavailable.
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const earnings = orders
    .filter((order) => order.status === 'completed')
    .reduce((sum, order) => sum + Number(order.amount || 0), 0)

  const activeOrders = orders.filter((order) => ['active', 'in_progress', 'delivered'].includes(order.status))
  const completedOrders = orders.filter((order) => order.status === 'completed')

  const stats = [
    { title: 'Services', value: services.length, icon: Briefcase, tone: 'brand' as const, hint: 'Listed on the marketplace', to: '/services' },
    { title: 'Orders', value: orders.length, icon: Package, tone: 'violet' as const, hint: `${activeOrders.length} active right now`, to: '/orders' },
    { title: 'Reviews', value: reviews.length, icon: Star, tone: 'amber' as const, hint: 'Client feedback received', to: '/reviews' },
    {
      title: role === 'freelancer' ? 'Earnings' : 'Spent',
      value: formatCurrency(earnings),
      icon: CircleDollarSign,
      tone: 'accent' as const,
      hint: role === 'freelancer' ? 'From completed orders' : 'On completed orders',
      to: '/wallet',
    },
  ]

  const quickActions = [
    ...(role === 'freelancer'
      ? [{ to: '/create-service', label: 'Create a service', desc: 'Package your skills', icon: Plus, tone: 'bg-brand-50 text-brand-600' }]
      : [{ to: '/create-project', label: 'Post a project', desc: 'Brief new work', icon: Plus, tone: 'bg-brand-50 text-brand-600' }]),
    { to: '/projects', label: 'Browse projects', desc: 'Find your next brief', icon: Search, tone: 'bg-violet-50 text-violet-600' },
    { to: '/services', label: 'Explore services', desc: 'See what is trending', icon: Briefcase, tone: 'bg-accent-50 text-accent-600' },
    { to: '/freelancers', label: 'Find talent', desc: 'Browse profiles', icon: Users, tone: 'bg-amber-50 text-amber-600' },
    { to: '/orders', label: 'Manage orders', desc: 'Track deliveries', icon: Package, tone: 'bg-sky-50 text-sky-600' },
    { to: '/wallet', label: 'Open wallet', desc: 'Payments & payouts', icon: Wallet, tone: 'bg-rose-50 text-rose-600' },
    { to: '/dashboard', label: 'Dashboard', desc: 'Your full overview', icon: LayoutDashboard, tone: 'bg-ink-100 text-ink-600' },
  ]

  if (loading) {
    return (
      <div className="page-wrap">
        <PageLoader label="Preparing your workspace…" />
      </div>
    )
  }

  return (
    <div className="page-wrap">
      <div className="container-page pt-8">
        {/* Welcome panel */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-hero p-6 text-white shadow-lift sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-grid bg-grid opacity-30" aria-hidden="true" />
          <div className="absolute -right-16 -top-20 h-64 w-64 animate-pulse-slow rounded-full bg-accent-400/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 animate-pulse-slow rounded-full bg-brand-400/20 blur-3xl" aria-hidden="true" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100">
                <Sparkles className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
                {isStaff ? 'Administrator workspace' : `${role} workspace`}
              </span>
              <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back, {username.split(' ')[0]}.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-100/85 sm:text-base">
                {role === 'freelancer'
                  ? 'Your services, proposals and deliveries are all in one place. Here is what needs your attention today.'
                  : 'Your projects, orders and trusted freelancers are all in one place. Here is your workspace at a glance.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link to={role === 'freelancer' ? '/create-service' : '/create-project'} className="btn bg-white text-brand-700 hover:bg-brand-50">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {role === 'freelancer' ? 'Create a service' : 'Post a project'}
                </Link>
                <Link to="/projects" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Browse open work
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] font-medium uppercase tracking-wider text-brand-200/80">Active orders</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">{activeOrders.length}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-accent-200">
                  <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  In progress
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] font-medium uppercase tracking-wider text-brand-200/80">
                  {role === 'freelancer' ? 'Earned' : 'Completed'}
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {role === 'freelancer' ? formatCurrency(earnings) : completedOrders.length}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-accent-200">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  Lifetime
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index * 0.05} />
          ))}
        </div>

        {/* Quick actions */}
        <Reveal className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Quick actions</h2>
              <p className="section-subtitle">Everything you need to keep work moving.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickActions.map(({ to, label, desc, icon: Icon, tone }, index) => (
              <motion.button
                key={to + label}
                type="button"
                onClick={() => navigate(to)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.04, duration: 0.35 }}
                whileHover={{ y: -4 }}
                className="card group flex flex-col items-start p-4 text-left transition hover:border-brand-200 hover:shadow-lift"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-3 text-sm font-semibold text-ink-900">{label}</span>
                <span className="mt-0.5 text-[11px] leading-snug text-ink-400">{desc}</span>
                <ArrowUpRight className="mt-3 h-4 w-4 text-ink-300 transition group-hover:text-brand-600" aria-hidden="true" />
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Recent activity */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink-900">Recent services</h2>
                  <p className="mt-0.5 text-sm text-ink-500">Fresh listings from the marketplace.</p>
                </div>
                <Link to="/services" className="btn-ghost px-2.5 py-2 text-xs">
                  View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                {services.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center">
                    <p className="text-sm text-ink-500">No services yet.</p>
                    <Link to="/services" className="mt-2 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">
                      Explore the marketplace
                    </Link>
                  </div>
                ) : (
                  services.slice(0, 4).map((service) => {
                    const meta = categoryMeta(service.category)
                    return (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition hover:border-ink-200 hover:bg-ink-50"
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white`}>
                          <Briefcase className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                            {service.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-ink-400">
                            {meta.short} · {service.delivery_days} day delivery
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-bold text-ink-900">{formatCurrency(service.price)}</span>
                      </Link>
                    )
                  })
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink-900">Recent orders</h2>
                  <p className="mt-0.5 text-sm text-ink-500">Track deliveries and next steps.</p>
                </div>
                <Link to="/orders" className="btn-ghost px-2.5 py-2 text-xs">
                  View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                {orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center">
                    <p className="text-sm text-ink-500">No orders yet.</p>
                    <Link to="/projects" className="mt-2 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">
                      Find work to get started
                    </Link>
                  </div>
                ) : (
                  orders.slice(0, 4).map((order) => (
                    <Link
                      key={order.id}
                      to={`/orders/${order.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition hover:border-ink-200 hover:bg-ink-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
                        <Package className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                          Order #{order.id}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
                          <CalendarDays className="h-3 w-3" aria-hidden="true" />
                          {formatDate(order.created_at)}
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

        {/* Footer CTA */}
        <Reveal className="mt-10">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                <FolderKanban className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">
                  {role === 'freelancer' ? 'Ready to win your next client?' : 'Have a project in mind?'}
                </h3>
                <p className="mt-0.5 text-sm text-ink-500">
                  {role === 'freelancer'
                    ? 'Keep your services sharp and send a tailored proposal today.'
                    : 'Post a clear brief and start comparing proposals from verified freelancers.'}
                </p>
              </div>
            </div>
            <Link to={role === 'freelancer' ? '/projects' : '/create-project'} className="btn-primary shrink-0">
              {role === 'freelancer' ? 'Find projects' : 'Post a project'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

export default Home
