import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquareQuote, ShieldCheck, Star } from 'lucide-react'
import API from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'

const ratingLabels = {
  5: 'Exceptional — exceeded expectations',
  4: 'Great — delivered as promised',
  3: 'Good — a few rough edges',
  2: 'Below expectations',
  1: 'Poor experience',
}

function CreateReview() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submitReview = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/reviews/', { order: orderId, rating, comment })
      navigate('/orders')
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'We could not submit that review. Please try again in a moment.',
      )
    } finally {
      setLoading(false)
    }
  }

  const activeRating = hovered || rating

  return (
    <div className="page-wrap">
      <PageHeader
        backTo="/orders"
        backLabel="Back to orders"
        eyebrow="Feedback"
        title="Leave a review"
        subtitle="Honest feedback helps the next client choose well — and helps great freelancers stand out."
      />

      <div className="container-page grid gap-6 pt-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.form
          onSubmit={submitReview}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="card p-5 sm:p-7"
        >
          {error && (
            <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div>
            <span className="label">Your rating</span>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating out of five">
                {[1, 2, 3, 4, 5].map((value) => {
                  const filled = value <= activeRating
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} star${value === 1 ? '' : 's'}`}
                      onMouseEnter={() => setHovered(value)}
                      onMouseLeave={() => setHovered(0)}
                      onFocus={() => setHovered(value)}
                      onBlur={() => setHovered(0)}
                      onClick={() => setRating(value)}
                      className="rounded-lg p-1 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
                    >
                      <Star
                        className={`h-8 w-8 transition ${
                          filled ? 'fill-amber-400 text-amber-400' : 'fill-ink-100 text-ink-200'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  )
                })}
              </div>
              <span className="text-sm font-semibold text-ink-700">{activeRating}.0 / 5</span>
            </div>
            <p className="mt-2 text-xs text-ink-500">{ratingLabels[activeRating]}</p>
          </div>

          <div className="mt-6">
            <label className="label" htmlFor="review-comment">
              Comment
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="What was it like working together? Mention communication, quality and timeliness."
              rows="6"
              className="input resize-none"
            />
            <p className="mt-1.5 text-xs text-ink-400">Specific feedback is far more useful than “great job”.</p>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-ink-100 pt-5 sm:flex-row-reverse">
            <Button type="submit" loading={loading}>
              <Star className="h-4 w-4" aria-hidden="true" />
              Submit review
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </motion.form>

        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
              <MessageSquareQuote className="h-4 w-4 text-brand-500" aria-hidden="true" />
              What makes a useful review
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                Describe the quality of the delivered work.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                Mention communication and adherence to the timeline.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                Keep it fair, specific and free of personal remarks.
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-accent-200 bg-accent-50/70 p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-accent-800">
              Reviews are tied to completed orders, so every rating reflects a real engagement.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CreateReview
