import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Check,
  Clock,
  FileText,
  HandCoins,
  Inbox,
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

function ProjectProposals() {
  const { projectId } = useParams()

  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await API.get(`/projects/proposals/?project=${projectId}`)
        setProposals(res.data.results || res.data || [])
      } catch {
        setError('We could not load these proposals. Please refresh and try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchProposals()
  }, [projectId])

  const fetchProposals = async () => {
    const res = await API.get(`/projects/proposals/?project=${projectId}`)
    setProposals(res.data.results || res.data || [])
  }

  const handleAction = async (proposalId, action) => {
    setActionLoadingId(proposalId)
    setError('')
    try {
      await API.post(`/projects/proposals/${proposalId}/${action}/`)
      await fetchProposals()
    } catch (err) {
      setError(err.response?.data?.error || `We could not ${action} that proposal. Please try again.`)
    } finally {
      setActionLoadingId(null)
    }
  }

  const pendingCount = useMemo(
    () => proposals.filter((proposal) => proposal.status === 'pending').length,
    [proposals],
  )

  return (
    <div className="page-wrap">
      <PageHeader
        backTo="/projects"
        backLabel="Back to projects"
        eyebrow="Client workspace"
        title="Proposals received"
        subtitle="Compare bids, read the pitch, and move the right freelancer forward."
        actions={
          <span className="badge-brand">
            {pendingCount} awaiting decision
          </span>
        }
      />

      <div className="container-page pt-8">
        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <ListSkeleton rows={4} />
        ) : proposals.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No proposals yet"
            description="Share the project brief widely. Proposals will appear here as freelancers respond."
            action={
              <Link to="/projects" className="btn-secondary">
                Back to projects
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal, index) => (
              <motion.article
                key={proposal.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
                className="card card-hover p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <Avatar name={proposal.freelancer_name} size="md" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-ink-900">
                          {proposal.freelancer_name || `Freelancer #${proposal.freelancer}`}
                        </h2>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-400">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        Applied {formatDate(proposal.created_at)}
                      </p>
                    </div>
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

                <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                    <FileText className="h-3 w-3" aria-hidden="true" />
                    Cover letter
                  </p>
                  <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                    {proposal.cover_letter}
                  </p>
                </div>

                {proposal.status === 'pending' && (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="accent"
                      className="flex-1"
                      loading={actionLoadingId === proposal.id}
                      onClick={() => handleAction(proposal.id, 'accept')}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Accept proposal
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="flex-1"
                      disabled={actionLoadingId === proposal.id}
                      onClick={() => handleAction(proposal.id, 'reject')}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      Reject
                    </Button>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectProposals
