import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  Clock,
  FileText,
  HandCoins,
  SearchX,
  Send,
} from 'lucide-react'
import API from '../services/api'
import { formatCurrency, formatDate, statusLabel } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import EmptyState from '../components/ui/EmptyState'
import { ListSkeleton } from '../components/ui/Skeleton'
import { StatusBadge } from '../components/ui/Badge'

function MyProposals() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await API.get('/projects/proposals/')
        setProposals(res.data.results || res.data || [])
      } catch {
        setError('We could not load your proposals right now. Please refresh and try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchProposals()
  }, [])

  const counts = useMemo(() => {
    return proposals.reduce(
      (acc, proposal) => {
        acc.total += 1
        if (proposal.status === 'accepted') acc.accepted += 1
        else if (proposal.status === 'rejected') acc.rejected += 1
        else acc.pending += 1
        return acc
      },
      { total: 0, accepted: 0, pending: 0, rejected: 0 },
    )
  }, [proposals])

  const filters = [
    { value: 'all', label: 'All', count: counts.total },
    { value: 'pending', label: 'Pending', count: counts.pending },
    { value: 'accepted', label: 'Accepted', count: counts.accepted },
    { value: 'rejected', label: 'Rejected', count: counts.rejected },
  ]

  const visibleProposals = useMemo(() => {
    const term = search.trim().toLowerCase()
    return proposals.filter((proposal) => {
      const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter
      const matchesSearch =
        !term ||
        proposal.project_title?.toLowerCase().includes(term) ||
        proposal.cover_letter?.toLowerCase().includes(term)
      return matchesStatus && matchesSearch
    })
  }, [proposals, search, statusFilter])

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Freelancer workspace"
        title="My proposals"
        subtitle="Every pitch you have sent, with its current status and the numbers that matter."
        actions={
          <Link to="/projects" className="btn-primary">
            <Send className="h-4 w-4" aria-hidden="true" />
            Find projects
          </Link>
        }
      />

      <div className="container-page pt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total sent', value: counts.total, tone: 'bg-brand-50 text-brand-600' },
            { label: 'Pending review', value: counts.pending, tone: 'bg-amber-50 text-amber-600' },
            { label: 'Accepted', value: counts.accepted, tone: 'bg-accent-50 text-accent-600' },
            { label: 'Not selected', value: counts.rejected, tone: 'bg-rose-50 text-rose-600' },
          ].map((stat) => (
            <div key={stat.label} className="card flex items-center gap-3 p-4">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}>
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xl font-bold text-ink-900">{stat.value}</p>
                <p className="text-xs font-medium text-ink-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-6 flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((filter) => {
              const active = statusFilter === filter.value
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  {filter.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              )
            })}
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search proposals…"
            className="w-full lg:max-w-sm"
          />
        </div>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <ListSkeleton rows={4} />
          ) : visibleProposals.length === 0 ? (
            <EmptyState
              icon={search || statusFilter !== 'all' ? SearchX : FileText}
              title={search || statusFilter !== 'all' ? 'No proposals match these filters' : 'No proposals sent yet'}
              description={
                search || statusFilter !== 'all'
                  ? 'Try clearing the search or switching back to all proposals.'
                  : 'Browse open projects, send a thoughtful pitch, and track every response here.'
              }
              action={
                search || statusFilter !== 'all' ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('all')
                    }}
                  >
                    Clear filters
                  </button>
                ) : (
                  <Link to="/projects" className="btn-primary">
                    Browse projects
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )
              }
            />
          ) : (
            <div className="space-y-4">
              {visibleProposals.map((proposal, index) => (
                <motion.article
                  key={proposal.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
                  className="card card-hover p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-ink-900">
                          {proposal.project_title || `Project #${proposal.project}`}
                        </h2>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-400">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        Sent {formatDate(proposal.created_at)}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <div className="rounded-xl border border-ink-100 bg-ink-50/70 px-3.5 py-2 text-center">
                        <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                          <HandCoins className="h-3 w-3" aria-hidden="true" />
                          Bid
                        </p>
                        <p className="font-display text-base font-bold text-ink-900">
                          {formatCurrency(proposal.bid_amount)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-ink-100 bg-ink-50/70 px-3.5 py-2 text-center">
                        <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          Delivery
                        </p>
                        <p className="font-display text-base font-bold text-ink-900">
                          {proposal.delivery_days}d
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-600">{proposal.cover_letter}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3.5">
                    <span className="text-xs font-medium text-ink-400">
                      Proposal #{proposal.id} · {statusLabel(proposal.status)}
                    </span>
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                    >
                      View project board
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProposals
