import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Banknote,
  Check,
  Clock,
  CreditCard,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react'
import API from '../services/api'
import { formatCurrency, formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import { ListSkeleton } from '../components/ui/Skeleton'
import { StatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'

const filters = [
  { value: 'all', label: 'All requests' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchWithdrawals = async () => {
    try {
      const res = await API.get('/wallet/admin/withdrawals/')
      setWithdrawals(res.data.results || res.data || [])
    } catch {
      setError('We could not load withdrawal requests. You may not have administrator access.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const handleAction = async (id, action) => {
    setActionLoadingId(id)
    setError('')
    try {
      await API.post(`/wallet/admin/withdrawals/${id}/${action}/`)
      await fetchWithdrawals()
    } catch (err) {
      setError(err.response?.data?.error || `We could not ${action} that request. Please try again.`)
    } finally {
      setActionLoadingId(null)
    }
  }

  const stats = useMemo(() => {
    const pending = withdrawals.filter((item) => item.status === 'pending')
    const approved = withdrawals.filter((item) => item.status === 'approved')
    return {
      pendingCount: pending.length,
      pendingAmount: pending.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      approvedAmount: approved.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      total: withdrawals.length,
    }
  }, [withdrawals])

  const visibleWithdrawals = useMemo(
    () =>
      statusFilter === 'all'
        ? withdrawals
        : withdrawals.filter((item) => item.status === statusFilter),
    [withdrawals, statusFilter],
  )

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Administration"
        title="Withdrawal requests"
        subtitle="Review payout requests, verify account details, and settle them with confidence."
        actions={
          <span className="badge-warning">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {stats.pendingCount} pending
          </span>
        }
      />

      <div className="container-page pt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total requests', value: stats.total, icon: Wallet, tone: 'bg-brand-50 text-brand-600' },
            { label: 'Awaiting review', value: stats.pendingCount, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
            {
              label: 'Pending amount',
              value: formatCurrency(stats.pendingAmount),
              icon: Banknote,
              tone: 'bg-violet-50 text-violet-600',
            },
            {
              label: 'Approved payouts',
              value: formatCurrency(stats.approvedAmount),
              icon: ShieldCheck,
              tone: 'bg-accent-50 text-accent-600',
            },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="card flex items-center gap-3 p-4">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-ink-900">{value}</p>
                <p className="text-xs font-medium text-ink-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-6 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filters.map((filter) => {
                const active = statusFilter === filter.value
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
            <p className="text-sm text-ink-500">
              {loading
                ? 'Loading requests…'
                : `${visibleWithdrawals.length} request${visibleWithdrawals.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <ListSkeleton rows={4} />
          ) : visibleWithdrawals.length === 0 ? (
            <EmptyState
              icon={Banknote}
              title={statusFilter === 'all' ? 'No withdrawal requests' : `No ${statusFilter} requests`}
              description={
                statusFilter === 'all'
                  ? 'Payout requests from freelancers will appear here for review.'
                  : 'Try another filter to see the rest of the requests.'
              }
              action={
                statusFilter !== 'all' ? (
                  <button type="button" onClick={() => setStatusFilter('all')} className="btn-secondary">
                    Show all requests
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {visibleWithdrawals.map((withdrawal, index) => (
                <motion.article
                  key={withdrawal.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
                  className="card card-hover p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar name={withdrawal.username} size="md" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-display text-lg font-bold text-ink-900">
                            {withdrawal.username || `User #${withdrawal.id}`}
                          </h2>
                          <StatusBadge status={withdrawal.status} />
                        </div>
                        <p className="mt-1 text-xs text-ink-400">
                          Request #{withdrawal.id} · {formatDate(withdrawal.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-ink-100 bg-ink-50/70 px-4 py-2.5 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Amount</p>
                      <p className="font-display text-xl font-bold text-ink-900">
                        {formatCurrency(withdrawal.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-3.5">
                      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                        <CreditCard className="h-3 w-3" aria-hidden="true" />
                        Method
                      </p>
                      <p className="mt-1 text-sm font-semibold capitalize text-ink-800">
                        {withdrawal.method || '—'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                        Account details
                      </p>
                      <p className="mt-1 break-words text-sm font-medium text-ink-800">
                        {withdrawal.account_details || '—'}
                      </p>
                    </div>
                  </div>

                  {withdrawal.status === 'pending' && (
                    <div className="mt-4 flex flex-col gap-2 border-t border-ink-100 pt-4 sm:flex-row">
                      <Button
                        type="button"
                        variant="accent"
                        className="flex-1"
                        loading={actionLoadingId === withdrawal.id}
                        onClick={() => handleAction(withdrawal.id, 'approve')}
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Approve payout
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="flex-1"
                        disabled={actionLoadingId === withdrawal.id}
                        onClick={() => handleAction(withdrawal.id, 'reject')}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                        Reject request
                      </Button>
                    </div>
                  )}
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminWithdrawals
