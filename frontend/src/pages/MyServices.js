import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  Check,
  Clock,
  Code2,
  Megaphone,
  Palette,
  PenLine,
  Plus,
  Puzzle,
  SearchX,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import API from '../services/api'
import { categoryMeta, formatCurrency } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import EmptyState from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'

const categories = [
  { value: 'web_dev', label: 'Web development' },
  { value: 'graphic', label: 'Graphic design' },
  { value: 'writing', label: 'Content writing' },
  { value: 'marketing', label: 'Digital marketing' },
  { value: 'other', label: 'Other' },
]

const categoryIcons = {
  web_dev: Code2,
  graphic: Palette,
  writing: PenLine,
  marketing: Megaphone,
  other: Puzzle,
}

function MyServices() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(null)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')

  const fetchServices = async () => {
    try {
      const res = await API.get('/services/')
      setServices(res.data.results || res.data || [])
    } catch {
      setNotice('We could not load your services right now. Please refresh and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEdit = (service) => {
    setNotice('')
    setEditingService(service.id)
    setEditForm({
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      delivery_days: service.delivery_days,
    })
  }

  const handleUpdate = async (id) => {
    setSaving(true)
    setNotice('')
    try {
      await API.put(`/services/${id}/`, editForm)
      setEditingService(null)
      await fetchServices()
      setNotice('Service updated successfully.')
    } catch {
      setNotice('We could not save those changes. Please check the fields and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setRemoving(id)
    setNotice('')
    try {
      await API.delete(`/services/${id}/`)
      setDeleteConfirm(null)
      await fetchServices()
      setNotice('Service removed.')
    } catch {
      setNotice('We could not remove that service. Please try again.')
    } finally {
      setRemoving(null)
    }
  }

  const visibleServices = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return services
    return services.filter(
      (service) =>
        service.title?.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term) ||
        service.category?.toLowerCase().includes(term),
    )
  }, [services, search])

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Freelancer workspace"
        title="My services"
        subtitle="Keep your packages sharp, priced well, and ready to convert browsers into clients."
        actions={
          <Link to="/create-service" className="btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add service
          </Link>
        }
      />

      <div className="container-page pt-8">
        <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search your services…"
            className="w-full sm:max-w-md"
          />
          <div className="flex items-center gap-3 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-500" aria-hidden="true" />
              {services.length} published package{services.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800"
          >
            {notice}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <CardSkeleton key={item} />
              ))}
            </div>
          ) : visibleServices.length === 0 ? (
            <EmptyState
              icon={search ? SearchX : Sparkles}
              title={search ? 'No services match that search' : 'Create your first service'}
              description={
                search
                  ? 'Try a different keyword, or clear the search to see every package.'
                  : 'Package your skills into a clear offer with pricing and a delivery window. It is the fastest way to start receiving orders.'
              }
              action={
                search ? (
                  <button type="button" onClick={() => setSearch('')} className="btn-secondary">
                    Clear search
                  </button>
                ) : (
                  <button type="button" onClick={() => navigate('/create-service')} className="btn-primary">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create service
                  </button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleServices.map((service, index) => {
                  const meta = categoryMeta(service.category)
                  const Icon = categoryIcons[service.category] || Puzzle
                  const editing = editingService === service.id

                  return (
                    <motion.article
                      key={service.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
                      className="card card-hover flex h-full flex-col p-5"
                    >
                      {editing ? (
                        <form
                          onSubmit={(event) => {
                            event.preventDefault()
                            handleUpdate(service.id)
                          }}
                          className="flex h-full flex-col"
                        >
                          <div className="flex items-center justify-between">
                            <h2 className="font-display text-base font-bold text-ink-900">Edit service</h2>
                            <button
                              type="button"
                              onClick={() => setEditingService(null)}
                              className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                              aria-label="Cancel editing"
                            >
                              <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="mt-4 space-y-3">
                            <div>
                              <label className="label" htmlFor={`title-${service.id}`}>
                                Title
                              </label>
                              <input
                                id={`title-${service.id}`}
                                type="text"
                                value={editForm.title}
                                onChange={(event) => setEditForm({ ...editForm, title: event.target.value })}
                                className="input"
                                required
                              />
                            </div>
                            <div>
                              <label className="label" htmlFor={`description-${service.id}`}>
                                Description
                              </label>
                              <textarea
                                id={`description-${service.id}`}
                                value={editForm.description}
                                onChange={(event) => setEditForm({ ...editForm, description: event.target.value })}
                                rows="3"
                                className="input resize-none"
                                required
                              />
                            </div>
                            <div>
                              <label className="label" htmlFor={`category-${service.id}`}>
                                Category
                              </label>
                              <select
                                id={`category-${service.id}`}
                                value={editForm.category}
                                onChange={(event) => setEditForm({ ...editForm, category: event.target.value })}
                                className="input"
                              >
                                {categories.map((category) => (
                                  <option key={category.value} value={category.value}>
                                    {category.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="label" htmlFor={`price-${service.id}`}>
                                  Price ($)
                                </label>
                                <input
                                  id={`price-${service.id}`}
                                  type="number"
                                  min="1"
                                  value={editForm.price}
                                  onChange={(event) => setEditForm({ ...editForm, price: event.target.value })}
                                  className="input"
                                  required
                                />
                              </div>
                              <div>
                                <label className="label" htmlFor={`days-${service.id}`}>
                                  Days
                                </label>
                                <input
                                  id={`days-${service.id}`}
                                  type="number"
                                  min="1"
                                  value={editForm.delivery_days}
                                  onChange={(event) =>
                                    setEditForm({ ...editForm, delivery_days: event.target.value })
                                  }
                                  className="input"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-auto flex gap-2 pt-5">
                            <Button type="submit" variant="accent" loading={saving} className="flex-1">
                              <Check className="h-4 w-4" aria-hidden="true" />
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              className="flex-1"
                              onClick={() => setEditingService(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-3">
                            <span
                              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}
                            >
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span className="badge-brand">{meta.short}</span>
                          </div>

                          <h2 className="mt-4 font-display text-base font-bold leading-snug text-ink-900">
                            <Link to={`/services/${service.id}`} className="transition hover:text-brand-700">
                              {service.title}
                            </Link>
                          </h2>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
                            {service.description}
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {service.delivery_days}-day delivery
                            <span className="text-ink-200">•</span>
                            <BadgeCheck className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
                            Live listing
                          </div>

                          <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-4">
                            <div className="flex min-w-0 items-center gap-2">
                              <Avatar name={service.freelancer_name} size="xs" />
                              <span className="truncate text-xs font-medium text-ink-600">
                                {service.freelancer_name || 'You'}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-medium uppercase tracking-wider text-ink-400">From</p>
                              <p className="font-display text-lg font-bold text-ink-900">
                                {formatCurrency(service.price)}
                              </p>
                            </div>
                          </div>

                          {deleteConfirm === service.id ? (
                            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
                              <p className="text-center text-xs font-semibold text-rose-700">
                                Delete this service permanently?
                              </p>
                              <div className="mt-2.5 flex gap-2">
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  loading={removing === service.id}
                                  className="flex-1"
                                  onClick={() => handleDelete(service.id)}
                                >
                                  Yes, delete
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setDeleteConfirm(null)}
                                >
                                  Keep it
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4 flex gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleEdit(service)}
                              >
                                <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                className="flex-1"
                                onClick={() => setDeleteConfirm(service.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyServices
