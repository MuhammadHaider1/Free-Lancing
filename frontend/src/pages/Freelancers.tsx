import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  MapPin,
  Plus,
  Star,
  Users,
} from 'lucide-react'
import API from '../services/api'
import type { Freelancer } from '../lib/types'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import EmptyState from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import Avatar from '../components/ui/Avatar'

function Freelancers() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const role = localStorage.getItem('role')

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await API.get('/users/freelancers/')
        setFreelancers(res.data.results || res.data || [])
      } catch {
        setFreelancers([])
      } finally {
        setLoading(false)
      }
    }
    fetchFreelancers()
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return freelancers
    return freelancers.filter((freelancer) =>
      [freelancer.username, freelancer.bio].filter(Boolean).join(' ').toLowerCase().includes(query),
    )
  }, [freelancers, search])

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Talent network"
        title="Find your next collaborator"
        subtitle="Browse vetted freelancers, compare their experience and start a conversation with confidence."
        actions={
          role === 'client' ? (
            <Link to="/create-project" className="btn-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Post a project
            </Link>
          ) : (
            <Link to="/create-service" className="btn-secondary">
              Create a service
            </Link>
          )
        }
      />

      <div className="container-page pt-8">
        <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or skill…"
            className="w-full sm:max-w-md"
          />
          <p className="text-sm text-ink-500">
            {loading ? 'Loading talent…' : `${filtered.length} freelancer${filtered.length === 1 ? '' : 's'}`}
          </p>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <CardSkeleton key={item} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title={search ? 'No freelancers match that search' : 'No freelancers yet'}
              description={
                search
                  ? 'Try a different name or skill keyword.'
                  : 'New freelancers join every day. Check back soon or post a project to attract talent.'
              }
              action={
                search ? (
                  <button type="button" onClick={() => setSearch('')} className="btn-secondary">
                    Clear search
                  </button>
                ) : (
                  <Link to="/create-project" className="btn-primary">
                    Post a project
                  </Link>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((freelancer, index) => (
                <motion.article
                  key={freelancer.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
                  className="card card-hover group overflow-hidden"
                >
                  <div className="relative h-20 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500">
                    <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                      Verified
                    </span>
                  </div>

                  <div className="px-5 pb-5">
                    <div className="relative z-10 -mt-7 flex items-end justify-between">
                      <Avatar name={freelancer.username} size="lg" className="ring-4 ring-white" />
                      <span className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-ink-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {freelancer.average_rating ? Number(freelancer.average_rating).toFixed(1) : 'New'}
                      </span>
                    </div>

                    <h2 className="mt-3 font-display text-lg font-bold text-ink-900 transition group-hover:text-brand-700">
                      {freelancer.username}
                    </h2>
                    <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-ink-500">
                      {freelancer.bio || 'Freelancer on FreelanceHub, ready to collaborate on your next project.'}
                    </p>

                    <div className="mt-4 grid grid-cols-3 divide-x divide-ink-100 rounded-xl border border-ink-100 bg-ink-50/60 py-2.5 text-center">
                      <div>
                        <p className="font-display text-sm font-bold text-ink-900">{freelancer.services_count ?? 0}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-ink-400">Services</p>
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-ink-900">{freelancer.completed_orders ?? 0}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-ink-400">Jobs</p>
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-ink-900">{freelancer.reviews_count ?? 0}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-ink-400">Reviews</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        Remote · Available
                      </span>
                      <Link to={`/freelancers/${freelancer.id}`} className="btn-secondary px-3 py-2 text-xs">
                        View profile
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">Every profile is reviewed</h3>
                <p className="mt-0.5 text-sm text-ink-500">
                  We verify identity, skills and delivery history so you can hire with confidence.
                </p>
              </div>
            </div>
            <Link to="/services" className="btn-secondary shrink-0">
              <Briefcase className="h-4 w-4" aria-hidden="true" />
              Browse services
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Freelancers
