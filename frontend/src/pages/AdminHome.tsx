import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Clock,
  Package,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'
import API from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import { Card, CardBody } from '../components/ui/Card'
import { PageLoader } from '../components/ui/Spinner'

interface AdminStats {
  total_users: number
  total_clients: number
  total_freelancers: number
  total_orders: number
  pending_withdrawals: number
}

function AdminHome() {
  const username = localStorage.getItem('username') || 'Admin'
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/wallet/admin/stats/')
        setStats(res.data)
      } catch {
        setError('We could not load platform statistics. Please refresh or check your admin access.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="page-wrap">
        <PageLoader label="Loading platform overview…" />
      </div>
    )
  }

  const statCards = stats
    ? [
        { title: 'Total users', value: stats.total_users, icon: Users, tone: 'brand' as const, hint: 'All registered accounts' },
        { title: 'Clients', value: stats.total_clients, icon: UserCheck, tone: 'violet' as const, hint: 'Hiring accounts' },
        { title: 'Freelancers', value: stats.total_freelancers, icon: Briefcase, tone: 'accent' as const, hint: 'Selling services' },
        { title: 'Total orders', value: stats.total_orders, icon: Package, tone: 'amber' as const, hint: 'Platform-wide' },
        { title: 'Pending withdrawals', value: stats.pending_withdrawals, icon: Clock, tone: 'rose' as const, hint: 'Awaiting review', to: '/admin/withdrawals' },
      ]
    : []

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Administration"
        title={`Platform overview`}
        subtitle={`Signed in as ${username}. Monitor marketplace activity and keep payouts moving.`}
        actions={
          <Link to="/admin/withdrawals" className="btn-primary">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Review withdrawals
          </Link>
        }
      />

      <div className="container-page pt-8">
        {error ? (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
              {statCards.map((stat, index) => (
                <StatCard key={stat.title} {...stat} delay={index * 0.05} />
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Card>
                <CardBody>
                  <h2 className="font-display text-lg font-bold text-ink-900">Platform health</h2>
                  <p className="mt-0.5 text-sm text-ink-500">A quick read on marketplace composition.</p>

                  <div className="mt-5 space-y-4">
                    {[
                      {
                        label: 'Clients',
                        value: stats?.total_clients ?? 0,
                        total: stats?.total_users || 1,
                        color: 'bg-brand-500',
                      },
                      {
                        label: 'Freelancers',
                        value: stats?.total_freelancers ?? 0,
                        total: stats?.total_users || 1,
                        color: 'bg-accent-500',
                      },
                    ].map((row) => {
                      const percent = Math.min(100, Math.round((row.value / row.total) * 100))
                      return (
                        <div key={row.label}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-ink-700">{row.label}</span>
                            <span className="text-ink-400">{percent}% of users</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                              className={`h-full rounded-full ${row.color}`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
                      <p className="text-xs font-medium text-ink-400">Orders per user</p>
                      <p className="mt-1 font-display text-xl font-bold text-ink-900">
                        {stats && stats.total_users ? (stats.total_orders / stats.total_users).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
                      <p className="text-xs font-medium text-ink-400">Pending payouts</p>
                      <p className="mt-1 font-display text-xl font-bold text-ink-900">{stats?.pending_withdrawals ?? 0}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="relative overflow-hidden rounded-2xl bg-hero p-6 text-white shadow-lift"
                >
                  <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
                  <div className="relative">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-300">
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-white">Withdrawals need review</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brand-100/85">
                      Approve or reject freelancer payout requests. Approved requests update the wallet immediately.
                    </p>
                    <Link to="/admin/withdrawals" className="btn mt-5 bg-white text-brand-700 hover:bg-brand-50">
                      Open queue
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>

                <Card>
                  <CardBody>
                    <h3 className="font-display text-base font-bold text-ink-900">Admin shortcuts</h3>
                    <div className="mt-4 space-y-1">
                      {[
                        { to: '/admin/withdrawals', label: 'Withdrawal requests', icon: Clock },
                        { to: '/projects', label: 'Review projects', icon: Briefcase },
                        { to: '/orders', label: 'Review orders', icon: Package },
                        { to: '/freelancers', label: 'Freelancer directory', icon: Users },
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminHome
