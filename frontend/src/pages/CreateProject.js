import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CircleDollarSign, FileText, Lightbulb, Type } from 'lucide-react'
import API from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'

const tips = [
  'Be specific about deliverables, scope and success criteria.',
  'Set a realistic budget — it attracts better proposals.',
  'Give a deadline that leaves room for quality review.',
]

function CreateProject() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', budget: '', deadline: '' })
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
      await API.post('/projects/projects/', form)
      navigate('/projects')
    } catch (err) {
      const detail = err.response?.data
      setError(
        typeof detail === 'string'
          ? detail
          : 'We could not create that project. Please check the fields and try again.',
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
        eyebrow="Client workspace"
        title="Post a new project"
        subtitle="Write a clear brief, set a fair budget, and let the right freelancers come to you."
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
              <label className="label" htmlFor="project-title">
                Project title
              </label>
              <div className="relative">
                <Type className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                <input
                  id="project-title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="e.g. Build a responsive ecommerce storefront"
                  required
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-400">A specific title gets more qualified proposals.</p>
            </div>

            <div>
              <label className="label" htmlFor="project-description">
                Description
              </label>
              <textarea
                id="project-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="7"
                className="input resize-none"
                placeholder="Describe the goals, deliverables, tech stack and anything the freelancer must know…"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="project-budget">
                  Budget (USD)
                </label>
                <div className="relative">
                  <CircleDollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                  <input
                    id="project-budget"
                    type="number"
                    min="1"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="1000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="project-deadline">
                  Deadline
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                  <input
                    id="project-deadline"
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-ink-100 pt-5 sm:flex-row-reverse">
            <Button type="submit" loading={loading} className="sm:w-auto">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Publish project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/projects')}>
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
              Tips for better proposals
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

          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <p className="text-sm font-semibold text-brand-900">What happens next?</p>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-800/80">
              Your project goes live on the board. Freelancers send proposals with a bid and timeline,
              and you choose the best fit.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CreateProject
