import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  FileText,
  Plus,
  Send,
  Users,
  X,
} from 'lucide-react'
import API from '../services/api'
import type { Project } from '../lib/types'
import { formatCurrency, formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import EmptyState from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import { StatusBadge } from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'

const statusFilters = [
  { value: 'all', label: 'All projects' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionId, setActionId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const userRole = localStorage.getItem('role')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await API.get('/projects/projects/', { params: { search } })
      setProjects(res.data.results || res.data || [])
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(fetchProjects, 220)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const acceptProposal = async (id: number) => {
    setActionId(id)
    setError('')
    try {
      const res = await API.post('/orders/accept-proposal/', { proposal_id: id })
      // The accept endpoint creates the order + chat conversation.
      const orderId = res.data?.id
      if (orderId) {
        navigate(`/orders/${orderId}`)
        return
      }
      await fetchProjects()
    } catch (err) {
      setError(err.response?.data?.error || 'We could not accept that proposal. Please try again.')
    } finally {
      setActionId(null)
    }
  }

  const rejectProposal = async (id: number) => {
    setActionId(id)
    setError('')
    try {
      await API.post(`/projects/proposals/${id}/reject/`)
      await fetchProjects()
    } catch (err) {
      setError(err.response?.data?.error || 'We could not reject that proposal. Please try again.')
    } finally {
      setActionId(null)
    }
  }

  const visibleProjects =
    statusFilter === 'all' ? projects : projects.filter((project) => project.status === statusFilter)

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Opportunities"
        title="Open projects"
        subtitle="Real briefs from real clients. Send a tailored proposal and win your next engagement."
        actions={
          userRole === 'client' ? (
            <Link to="/create-project" className="btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Post a project
            </Link>
          ) : (
            <Link to="/my-proposals" className="btn-secondary">
              My proposals
            </Link>
          )
        }
      />

      <div className="container-page pt-8">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search projects, skills or clients…"
              className="w-full lg:max-w-md"
            />
            <p className="text-sm text-ink-500">
              {loading ? 'Loading projects…' : `${visibleProjects.length} project${visibleProjects.length === 1 ? '' : 's'} shown`}
            </p>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {statusFilters.map((filter) => {
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
        </div>

        {error && (
          <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <CardSkeleton key={item} lines={4} />
              ))}
            </div>
          ) : visibleProjects.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No projects here yet"
              description={
                statusFilter === 'all'
                  ? 'New briefs are posted every day. Check back soon or create your own project.'
                  : 'There are no projects with this status right now.'
              }
              action={
                statusFilter !== 'all' ? (
                  <button type="button" onClick={() => setStatusFilter('all')} className="btn-secondary">
                    Show all projects
                  </button>
                ) : userRole === 'client' ? (
                  <Link to="/create-project" className="btn-primary">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Post a project
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {visibleProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
                  className="card card-hover flex h-full flex-col p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={project.status} />
                        <span className="text-xs text-ink-400">Posted {formatDate(project.created_at)}</span>
                      </div>
                      <h2 className="mt-3 font-display text-lg font-bold leading-snug text-ink-900">{project.title}</h2>
                    </div>
                    <div className="shrink-0 rounded-xl bg-ink-50 px-3 py-2 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Budget</p>
                      <p className="font-display text-lg font-bold text-ink-900">{formatCurrency(project.budget)}</p>
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{project.description}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
                      Due {formatDate(project.deadline)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
                      {project.proposals?.length || 0} proposal{(project.proposals?.length || 0) === 1 ? '' : 's'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Avatar name={project.client_name} size="xs" />
                      {project.client_name || 'Client'}
                    </span>
                  </div>

                  {userRole === 'client' && project.proposals && project.proposals.length > 0 && (
                    <div className="mt-5 rounded-xl border border-ink-200 bg-ink-50/60 p-3.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink-900">
                          Latest proposals
                        </h3>
                        <Link
                          to={`/projects/${project.id}/proposals`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
                        >
                          View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>

                      <div className="mt-3 space-y-2">
                        {project.proposals.slice(0, 2).map((proposal) => (
                          <div key={proposal.id} className="rounded-lg border border-ink-200 bg-white p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-2">
                                <Avatar name={proposal.freelancer_name} size="xs" />
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold text-ink-900">{proposal.freelancer_name}</p>
                                  <p className="text-[11px] text-ink-400">
                                    {formatCurrency(proposal.bid_amount)} · {proposal.delivery_days} days
                                  </p>
                                </div>
                              </div>
                              <StatusBadge status={proposal.status} />
                            </div>

                            {proposal.status === 'pending' && (
                              <div className="mt-2.5 flex gap-2">
                                <button
                                  type="button"
                                  disabled={actionId === proposal.id}
                                  onClick={() => acceptProposal(proposal.id)}
                                  className="btn-accent flex-1 px-2 py-1.5 text-[11px]"
                                >
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  disabled={actionId === proposal.id}
                                  onClick={() => rejectProposal(proposal.id)}
                                  className="btn-danger flex-1 px-2 py-1.5 text-[11px]"
                                >
                                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {userRole === 'client' && (!project.proposals || project.proposals.length === 0) && (
                    <p className="mt-4 rounded-xl border border-dashed border-ink-200 px-3 py-3 text-center text-xs text-ink-400">
                      No proposals yet — share the brief to attract talent.
                    </p>
                  )}

                  <div className="mt-auto pt-4">
                    {userRole === 'freelancer' && project.status === 'open' ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/send-proposal/${project.id}`)}
                        className="btn-primary w-full"
                      >
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Send a proposal
                      </button>
                    ) : userRole === 'client' ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/projects/${project.id}/proposals`)}
                        className="btn-secondary w-full"
                      >
                        <FileText className="h-4 w-4" aria-hidden="true" />
                        Manage proposals
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 rounded-xl bg-ink-50 px-3 py-2 text-xs font-medium text-ink-400">
                        <CircleDollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                        This project is no longer accepting proposals
                      </div>
                    )}
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

export default Projects
