import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CircleDollarSign,
  Clock,
  FileText,
  Lightbulb,
  Send,
} from 'lucide-react'
import API from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'

const tips = [
  'Show you understood the brief — reference specific requirements.',
  'Explain why you are the right fit, with relevant proof.',
  'Quote a fair bid and a timeline you can genuinely deliver.',
]

function SendProposal() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ cover_letter: '', bid_amount: '', delivery_days: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/projects/proposals/', { ...form, project: projectId })
      navigate('/projects')
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'We could not send that proposal. Please check the fields and try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap">
      <PageHeader
        backTo="/projects"
        backLabel="Back to projects"
        eyebrow="Freelancer workspace"
        title="Send a proposal"
        subtitle="A focused pitch beats a long one. Show you understood the brief and how you will deliver."
      />

      <div className="container-page grid gap-6 pt-8 lg:grid-cols-[1.5fr_1fr]">
        <motion.form
          onSubmit={handleSubmit}
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

          <div className="space-y-5">
            <div>
              <label className="label" htmlFor="cover-letter">
                Cover letter
              </label>
              <textarea
                id="cover-letter"
                name="cover_letter"
                value={form.cover_letter}
                onChange={handleChange}
                rows="8"
                className="input resize-none"
                placeholder="Hi — I read your brief and here is exactly how I would approach it…"
                required
              />
              <p className="mt-1.5 text-xs text-ink-400">
                Aim for 120–200 words: context, approach, proof, and a clear next step.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="bid-amount">
                  Bid amount (USD)
                </label>
                <div className="relative">
                  <CircleDollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                  <input
                    id="bid-amount"
                    type="number"
                    min="1"
                    name="bid_amount"
                    value={form.bid_amount}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="750"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="proposal-days">
                  Delivery days
                </label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                  <input
                    id="proposal-days"
                    type="number"
                    min="1"
                    name="delivery_days"
                    value={form.delivery_days}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-ink-100 pt-5 sm:flex-row-reverse">
            <Button type="submit" loading={loading}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send proposal
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </motion.form>

        <aside className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="card p-5"
          >
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
              <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Winning proposal tips
            </h2>
            <ul className="mt-3 space-y-2.5">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="card flex items-start gap-3 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed text-ink-600">
              Your proposal is saved to <span className="font-semibold text-ink-900">My proposals</span>, where
              you can track its status as the client reviews it.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default SendProposal
