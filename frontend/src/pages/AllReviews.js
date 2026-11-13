import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, MessageSquareQuote, SearchX, Star } from 'lucide-react'
import API from '../services/api'
import { formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import EmptyState from '../components/ui/EmptyState'
import { ListSkeleton } from '../components/ui/Skeleton'
import Avatar from '../components/ui/Avatar'

function Stars({ rating = 0, size = 'h-3.5 w-3.5' }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`${size} ${
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

function AllReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get('/reviews/')
        setReviews(Array.isArray(res.data.results) ? res.data.results : res.data || [])
      } catch {
        setError('We could not load reviews right now. Please refresh and try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const average = useMemo(() => {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
  }, [reviews])

  const distribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((value) => ({
      value,
      count: reviews.filter((review) => Number(review.rating) === value).length,
    }))
  }, [reviews])

  const visibleReviews = useMemo(() => {
    const term = search.trim().toLowerCase()
    return reviews.filter((review) => {
      const matchesRating = !ratingFilter || Number(review.rating) === ratingFilter
      const matchesSearch =
        !term ||
        review.comment?.toLowerCase().includes(term) ||
        review.client_name?.toLowerCase().includes(term) ||
        review.freelancer_name?.toLowerCase().includes(term)
      return matchesRating && matchesSearch
    })
  }, [reviews, search, ratingFilter])

  return (
    <div className="page-wrap">
      <PageHeader
        backTo="/home"
        backLabel="Back to home"
        eyebrow="Community"
        title="Reviews"
        subtitle="Real feedback from completed orders across the marketplace."
        actions={
          <span className="badge-brand">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            {reviews.length} review{reviews.length === 1 ? '' : 's'}
          </span>
        }
      />

      <div className="container-page pt-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="card h-fit p-5 sm:p-6">
            <div className="flex items-end gap-3">
              <p className="font-display text-4xl font-bold tracking-tight text-ink-900">
                {average ? average.toFixed(1) : '—'}
              </p>
              <div className="pb-1">
                <Stars rating={average} size="h-4 w-4" />
                <p className="mt-1 text-xs text-ink-400">Average across all reviews</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {distribution.map((row) => {
                const percent = reviews.length ? Math.round((row.count / reviews.length) * 100) : 0
                return (
                  <button
                    key={row.value}
                    type="button"
                    onClick={() => setRatingFilter(ratingFilter === row.value ? 0 : row.value)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition ${
                      ratingFilter === row.value ? 'bg-brand-50' : 'hover:bg-ink-50'
                    }`}
                  >
                    <span className="w-8 shrink-0 text-xs font-semibold text-ink-600">{row.value} ★</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <span
                        className="block h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                    <span className="w-8 shrink-0 text-right text-[11px] text-ink-400">{row.count}</span>
                  </button>
                )
              })}
            </div>

            {ratingFilter > 0 && (
              <button
                type="button"
                onClick={() => setRatingFilter(0)}
                className="btn-secondary mt-4 w-full"
              >
                Clear {ratingFilter}-star filter
              </button>
            )}
          </div>

          <div>
            <div className="card p-4 sm:p-5">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search reviews by keyword or name…"
              />
            </div>

            {error && (
              <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <div className="mt-4">
              {loading ? (
                <ListSkeleton rows={4} />
              ) : visibleReviews.length === 0 ? (
                <EmptyState
                  icon={search || ratingFilter ? SearchX : MessageSquareQuote}
                  title={search || ratingFilter ? 'No reviews match these filters' : 'No reviews yet'}
                  description={
                    search || ratingFilter
                      ? 'Try a different keyword or clear the rating filter.'
                      : 'Reviews appear here once clients complete their first orders.'
                  }
                  action={
                    search || ratingFilter ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          setSearch('')
                          setRatingFilter(0)
                        }}
                      >
                        Clear filters
                      </button>
                    ) : (
                      <Link to="/services" className="btn-primary">
                        Browse services
                      </Link>
                    )
                  }
                />
              ) : (
                <div className="space-y-3">
                  {visibleReviews.map((review, index) => (
                    <motion.article
                      key={review.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.25), duration: 0.35 }}
                      className="card p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={review.client_name} size="sm" />
                          <div>
                            <p className="text-sm font-semibold text-ink-900">{review.client_name || 'Client'}</p>
                            {review.freelancer_name && (
                              <p className="text-[11px] text-ink-400">
                                reviewed{' '}
                                <Link
                                  to="/freelancers"
                                  className="font-medium text-brand-700 hover:text-brand-800"
                                >
                                  {review.freelancer_name}
                                </Link>
                              </p>
                            )}
                          </div>
                        </div>
                        <Stars rating={review.rating} />
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-ink-700">{review.comment}</p>

                      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-400">
                        <CalendarDays className="h-3 w-3" aria-hidden="true" />
                        {formatDate(review.created_at)}
                      </p>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllReviews
