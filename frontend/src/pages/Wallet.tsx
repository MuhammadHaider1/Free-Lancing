import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  Clock,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Wallet as WalletIcon,
  X,
} from 'lucide-react'
import API from '../services/api'
import type { Transaction, WalletSummary, Withdrawal } from '../lib/types'
import { formatCurrency, formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import { Card, CardBody } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { PageLoader } from '../components/ui/Spinner'

function Wallet() {
  const role = localStorage.getItem('role')
  const isFreelancer = role === 'freelancer'

  const [summary, setSummary] = useState<WalletSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', method: '', account_details: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchWalletData = async () => {
    try {
      const summaryRes = await API.get('/wallet/summary/')
      setSummary(summaryRes.data)

      const txRes = await API.get('/wallet/transactions/')
      setTransactions(txRes.data.results || txRes.data || [])

      if (isFreelancer) {
        const wRes = await API.get('/wallet/withdrawals/')
        setWithdrawals(wRes.data.results || wRes.data || [])
      }
    } catch {
      setError('We could not load your wallet right now. Please refresh and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleWithdrawChange = (event) => {
    setWithdrawForm({ ...withdrawForm, [event.target.name]: event.target.value })
  }

  const handleWithdrawSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    if (Number(withdrawForm.amount) > (summary?.available_balance || 0)) {
      setFormError('The withdrawal amount is higher than your available balance.')
      return
    }

    setSubmitting(true)
    try {
      await API.post('/wallet/withdrawals/', withdrawForm)
      setWithdrawForm({ amount: '', method: '', account_details: '' })
      setShowWithdrawForm(false)
      await fetchWalletData()
    } catch (err) {
      setFormError(err.response?.data?.error || 'We could not submit that request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-wrap">
        <PageLoader label="Loading your wallet…" />
      </div>
    )
  }

  const freelancerStats = [
    { label: 'Available balance', value: summary?.available_balance, icon: WalletIcon, tone: 'bg-accent-50 text-accent-600' },
    { label: 'Total earned', value: summary?.total_earned, icon: TrendingUp, tone: 'bg-brand-50 text-brand-600' },
    { label: 'Pending withdrawals', value: summary?.pending_withdrawals, icon: Clock, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Total withdrawn', value: summary?.total_withdrawn, icon: Banknote, tone: 'bg-violet-50 text-violet-600' },
  ]

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Payments"
        title={isFreelancer ? 'Wallet & earnings' : 'Spending history'}
        subtitle={
          isFreelancer
            ? 'Track what you have earned, request payouts, and keep every transaction in one place.'
            : 'See what you have spent across projects and services, with a full transaction history.'
        }
        actions={
          isFreelancer ? (
            <button type="button" onClick={() => setShowWithdrawForm((open) => !open)} className="btn-primary">
              {showWithdrawForm ? <X className="h-4 w-4" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              {showWithdrawForm ? 'Cancel request' : 'Request withdrawal'}
            </button>
          ) : undefined
        }
      />

      <div className="container-page pt-8">
        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isFreelancer ? (
          <div className="relative overflow-hidden rounded-3xl bg-hero p-6 text-white shadow-lift sm:p-8">
            <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
                  Secured by FreelanceHub
                </span>
                <p className="mt-5 text-sm text-brand-100/80">Available to withdraw</p>
                <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {formatCurrency(summary?.available_balance || 0)}
                </p>
                <p className="mt-2 text-xs text-brand-200/80">
                  Payouts are reviewed by an administrator before release.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawForm((open) => !open)}
                className="btn shrink-0 bg-white text-brand-700 hover:bg-brand-50"
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                Withdraw earnings
              </button>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl bg-hero p-6 text-white shadow-lift sm:p-8">
            <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100">
                <CreditCard className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
                Spending overview
              </span>
              <p className="mt-5 text-sm text-brand-100/80">Total spent on completed orders</p>
              <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {formatCurrency(summary?.total_spent || 0)}
              </p>
              <p className="mt-2 text-xs text-brand-200/80">Payments are released only after you approve a delivery.</p>
            </div>
          </div>
        )}

        {isFreelancer && (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {freelancerStats.map(({ label, value, icon: Icon, tone }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="card p-5"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-medium text-ink-500">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold text-ink-900">{formatCurrency(value || 0)}</p>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isFreelancer && showWithdrawForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="mt-6">
                <CardBody>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-ink-900">Request a withdrawal</h2>
                      <p className="mt-0.5 text-sm text-ink-500">
                        Available balance: <strong className="text-ink-800">{formatCurrency(summary?.available_balance || 0)}</strong>
                      </p>
                    </div>
                    <span className="hidden rounded-xl bg-brand-50 p-2.5 text-brand-600 sm:block">
                      <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>

                  {formError && (
                    <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleWithdrawSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="amount" className="label">Amount ($)</label>
                      <input
                        id="amount"
                        type="number"
                        name="amount"
                        min="1"
                        step="0.01"
                        value={withdrawForm.amount}
                        onChange={handleWithdrawChange}
                        className="input"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="method" className="label">Payout method</label>
                      <select
                        id="method"
                        name="method"
                        value={withdrawForm.method}
                        onChange={handleWithdrawChange}
                        className="input"
                        required
                      >
                        <option value="">Select a method</option>
                        <option value="JazzCash">JazzCash</option>
                        <option value="EasyPaisa">EasyPaisa</option>
                        <option value="Bank Transfer">Bank transfer</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="account_details" className="label">Account details</label>
                      <input
                        id="account_details"
                        type="text"
                        name="account_details"
                        value={withdrawForm.account_details}
                        onChange={handleWithdrawChange}
                        className="input"
                        placeholder="Account number, IBAN or phone number"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
                      <button type="button" onClick={() => setShowWithdrawForm(false)} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" disabled={submitting} className="btn-primary">
                        {submitting ? 'Submitting…' : 'Submit request'}
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardBody>
              <h2 className="font-display text-lg font-bold text-ink-900">Transaction history</h2>
              <p className="mt-0.5 text-sm text-ink-500">Every credit, debit and payout on your account.</p>

              <div className="mt-4">
                {transactions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-ink-200 px-4 py-12 text-center">
                    <CircleDollarSign className="mx-auto h-7 w-7 text-ink-300" aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-ink-600">No transactions yet</p>
                    <p className="mt-1 text-xs text-ink-400">Completed orders and withdrawals will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-ink-100">
                    {transactions.map((tx) => {
                      const isCredit = tx.type === 'credit'
                      return (
                        <div key={tx.id} className="flex items-center gap-3 py-3.5">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              isCredit ? 'bg-accent-50 text-accent-600' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {isCredit ? <ArrowDownLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-ink-900">{tx.note || tx.type}</p>
                            <p className="text-xs text-ink-400">{formatDate(tx.created_at)}</p>
                          </div>
                          <p className={`text-sm font-bold ${isCredit ? 'text-accent-600' : 'text-rose-600'}`}>
                            {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="space-y-6">
            {isFreelancer && (
              <Card>
                <CardBody>
                  <h2 className="font-display text-lg font-bold text-ink-900">Withdrawal requests</h2>
                  <p className="mt-0.5 text-sm text-ink-500">Track the status of each payout.</p>

                  <div className="mt-4 space-y-2">
                    {withdrawals.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center">
                        <Banknote className="mx-auto h-6 w-6 text-ink-300" aria-hidden="true" />
                        <p className="mt-2 text-sm font-medium text-ink-600">No requests yet</p>
                        <p className="mt-1 text-xs text-ink-400">Your first payout request will appear here.</p>
                      </div>
                    ) : (
                      withdrawals.map((withdrawal) => (
                        <div key={withdrawal.id} className="rounded-xl border border-ink-100 p-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-display text-base font-bold text-ink-900">{formatCurrency(withdrawal.amount)}</p>
                              <p className="mt-0.5 text-xs text-ink-400">
                                {withdrawal.method} · {formatDate(withdrawal.created_at)}
                              </p>
                            </div>
                            <StatusBadge status={withdrawal.status} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink-900">How payments work</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    Funds are held securely until the client approves delivery. Withdrawals are reviewed by an
                    administrator before they are released.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet
