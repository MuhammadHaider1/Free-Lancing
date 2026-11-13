import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, MessageSquareQuote, Star } from 'lucide-react'
import API from '../services/api'
import { formatDate } from '../lib/utils'
import { ListSkeleton } from '../components/ui/Skeleton'
import Avatar from '../components/ui/Avatar'

function Stars({ rating = 0 }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
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

function Reviews({ freelancerId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/?freelancer=${freelancerId}`)
        setReviews(Array.isArray(res.data.results) ? res.data.results : res.data || [])
      } catch {
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    if (freelancerId) {
      fetchReviews()
    } else {
      setLoading(false)
    }
  }, [freelancerId])

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
          <MessageSquareQuote className="h-4 w-4 text-brand-500" aria-hidden="true" />
          Client reviews
        </h2>
        <span className="badge-neutral">{reviews.length}</span>
      </div>

      {loading ? (
        <div className="mt-4">
          <ListSkeleton rows={2} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-ink-200 bg-ink-50/50 px-4 py-10 text-center">
          <p className="text-sm font-medium text-ink-600">No reviews yet</p>
          <p className="mt-1 text-xs text-ink-400">Completed orders will start building this reputation.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <AnimatePresence>
            {reviews.map((review, index) => (
              <motion.article
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="card p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={review.client_name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{review.client_name || 'Client'}</p>
                      {review.freelancer_name && (
                        <p className="text-[11px] text-ink-400">for {review.freelancer_name}</p>
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
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  )
}

export default Reviews
