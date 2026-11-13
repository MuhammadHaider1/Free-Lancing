import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CircleDollarSign,
  Clock,
  Layers,
  Lightbulb,
  Sparkles,
  Type,
} from 'lucide-react'
import API from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'

const categories = [
  { value: 'web_dev', label: 'Web development' },
  { value: 'graphic', label: 'Graphic design' },
  { value: 'writing', label: 'Content writing' },
  { value: 'marketing', label: 'Digital marketing' },
  { value: 'other', label: 'Other' },
]

const tips = [
  'Lead with the outcome the client gets, not the tools you use.',
  'Price for the value delivered and keep the scope explicit.',
  'Promise a delivery window you can confidently hit.',
]

function CreateService() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'web_dev',
    price: '',
    delivery_days: '',
  })
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
      await API.post('/services/', form)
      navigate('/services')
    } catch {
      setError('We could not create that service. Please check the fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap">
      <PageHeader
        backTo="/services"
        backLabel="Back to services"
        eyebrow="Freelancer workspace"
        title="Create a service"
        subtitle="Turn your expertise into a clear, buyable package with a price and a delivery window."
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
              <label className="label" htmlFor="service-title">
                Service title
              </label>
              <div className="relative">
                <Type className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                <input
                  id="service-title"
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="e.g. I will build a fast React landing page"
                  required
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-400">Start with “I will…” — it reads like an offer.</p>
            </div>

            <div>
              <label className="label" htmlFor="service-description">
                Description
              </label>
              <textarea
                id="service-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="7"
                className="input resize-none"
                placeholder="Explain what is included, how you work, and what the client receives…"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="service-category">
                Category
              </label>
              <div className="relative">
                <Layers className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                <select
                  id="service-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="input pl-10"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="service-price">
                  Price (USD)
                </label>
                <div className="relative">
                  <CircleDollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                  <input
                    id="service-price"
                    type="number"
                    min="1"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="service-days">
                  Delivery days
                </label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                  <input
                    id="service-days"
                    type="number"
                    min="1"
                    name="delivery_days"
                    value={form.delivery_days}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="7"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-ink-100 pt-5 sm:flex-row-reverse">
            <Button type="submit" loading={loading}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Publish service
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/services')}>
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
              Make it easy to buy
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

          <div className="rounded-2xl border border-accent-200 bg-accent-50/70 p-5">
            <p className="text-sm font-semibold text-accent-800">Why packages work</p>
            <p className="mt-1.5 text-sm leading-relaxed text-accent-700">
              Clients prefer a fixed price and timeline over a custom quote. A clear package removes
              hesitation and shortens the buying decision.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CreateService
