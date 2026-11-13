import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Clock,
  Star,
  UserRound,
} from 'lucide-react'
import API from '../services/api'
import { formatCurrency, formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import { PageLoader } from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Avatar from '../components/ui/Avatar'

function Stars({ rating = 0, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${
            index < Math.round(Number(rating) || 0)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-ink-100 text-ink-200'
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}

function FreelancerProfile() {
  const { id } = useParams()

  const [freelancer, setFreelancer] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/freelancers/${id}/`)
        setFreelancer(res.data)
      } catch {
        setError('We could not load this profile. It may have been removed, or the link is incorrect.')
      }
    }

    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/?freelancer=${id}`)
        setReviews(Array.isArray(res.data.results) ? res.data.results : res.data || [])
      } catch {
        setReviews([])
      }
    }

    fetchProfile()
    fetchReviews()
  }, [id])

  if (error) {
    return (
      <div className="page-wrap">
        <div className="container-page pt-10">
          <EmptyState
            icon={UserRound}
            title="Profile unavailable"
            description={error}
            action={
              <Link to="/freelancers" className="btn-primary">
                Browse freelancers
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  if (!freelancer) {
    return (
      <div className="page-wrap">
        <PageLoader label="Loading profile…" />
      </div>
    )
  }

  const stats = [
    { label: 'Services', value: freelancer.services_count ?? 0 },
    { label: 'Jobs completed', value: freelancer.completed_orders ?? 0 },
    { label: 'Average rating', value: freelancer.average_rating ? Number(freelancer.average_rating).toFixed(1) : '—' },
    { label: 'Reviews', value: freelancer.reviews_count ?? reviews.length },
  ]

  const services = freelancer.services || []

  return (
    <div className="page-wrap">
      <PageHeader
        backTo="/freelancers"
        backLabel="Back to freelancers"
        eyebrow="Freelancer profile"
        title={freelancer.username}
        subtitle={freelancer.bio || 'Independent professional on FreelanceHub.'}
        actions={
          <span className="badge-success">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified freelancer
          </span>
        }
      />

      <div className="container-page space-y-6 pt-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="card overflow-hidden"
        >
          <div className="relative h-28 bg-hero sm:h-32">
            <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
          </div>
          <div className="px-5 pb-6 sm:px-7">
            <div className="relative z-10 -mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <Avatar name={freelancer.username} size="xl" className="ring-4 ring-white" />
                <div className="pb-1">
                  <h2 className="font-display text-xl font-bold text-ink-900">{freelancer.username}</h2>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-500">
                    <BadgeCheck className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
                    {freelancer.email || 'FreelanceHub member'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pb-1">
                {freelancer.average_rating ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {Number(freelancer.average_rating).toFixed(1)} rating
                  </span>
                ) : (
                  <span className="badge-neutral">New on the platform</span>
                )}
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-600">
              {freelancer.bio || 'This freelancer has not added a bio yet, but their services and reviews tell the story.'}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.35 }}
                  className="rounded-xl border border-ink-100 bg-ink-50/60 p-4 text-center"
                >
                  <p className="font-display text-2xl font-bold tracking-tight text-ink-900">{stat.value}</p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="card p-5 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
                <Briefcase className="h-4 w-4 text-brand-500" aria-hidden="true" />
                Services
              </h2>
              <span className="badge-neutral">{services.length}</span>
            </div>

            {services.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-ink-600">No services listed yet</p>
                <p className="mt-1 text-xs text-ink-400">Check back soon for new packages.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.04, duration: 0.3 }}
                  >
                    <Link
                      to={`/services/${service.id}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-ink-100 bg-white px-4 py-3.5 transition hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-900 transition group-hover:text-brand-700">
                          {service.title}
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-400">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {service.delivery_days}-day delivery
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-display text-sm font-bold text-ink-900">
                          {formatCurrency(service.price)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:text-brand-600" aria-hidden="true" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="card p-5 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
                <Star className="h-4 w-4 text-amber-400" aria-hidden="true" />
                Reviews
              </h2>
              <span className="badge-neutral">{reviews.length}</span>
            </div>

            {reviews.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-ink-600">No reviews yet</p>
                <p className="mt-1 text-xs text-ink-400">Completed orders will build this reputation.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review, index) => (
                  <motion.article
                    key={review.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.04, duration: 0.3 }}
                    className="rounded-xl border border-ink-100 bg-ink-50/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={review.client_name} size="xs" />
                        <p className="text-sm font-semibold text-ink-800">{review.client_name || 'Client'}</p>
                      </div>
                      <Stars rating={review.rating} />
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{review.comment}</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-ink-400">
                      <CalendarDays className="h-3 w-3" aria-hidden="true" />
                      {formatDate(review.created_at)}
                    </p>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default FreelancerProfile
