import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock,
  Code2,
  Megaphone,
  Palette,
  PenLine,
  Plus,
  Puzzle,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import API from '../services/api'
import type { Service } from '../lib/types'
import { categoryMeta, formatCurrency } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import EmptyState from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import Avatar from '../components/ui/Avatar'

const categories = [
  { value: '', label: 'All categories', icon: SlidersHorizontal },
  { value: 'web_dev', label: 'Web development', icon: Code2 },
  { value: 'graphic', label: 'Graphic design', icon: Palette },
  { value: 'writing', label: 'Content writing', icon: PenLine },
  { value: 'marketing', label: 'Digital marketing', icon: Megaphone },
  { value: 'other', label: 'Other', icon: Puzzle },
]

const categoryIcons = {
  web_dev: Code2,
  graphic: Palette,
  writing: PenLine,
  marketing: Megaphone,
  other: Puzzle,
}

function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const role = localStorage.getItem('role')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    const fetchServices = async () => {
      setLoading(true)
      try {
        const res = await API.get('/services/', { params: { search, category } })
        if (active) setServices(res.data.results || res.data || [])
      } catch {
        if (active) setServices([])
      } finally {
        if (active) setLoading(false)
      }
    }
    const timer = window.setTimeout(fetchServices, 220)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [search, category])

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Marketplace"
        title="Explore services"
        subtitle="Fixed-scope packages from verified freelancers. Clear pricing, clear delivery, no surprises."
        actions={
          <>
            {role === 'freelancer' && (
              <Link to="/my-services" className="btn-secondary">
                My services
              </Link>
            )}
            {role === 'freelancer' && (
              <Link to="/create-service" className="btn-primary">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create service
              </Link>
            )}
          </>
        }
      />

      <div className="container-page pt-8">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search services, skills or keywords…"
              className="w-full lg:max-w-md"
            />
            <p className="text-sm text-ink-500">
              {loading ? 'Searching the marketplace…' : `${services.length} service${services.length === 1 ? '' : 's'} available`}
            </p>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(({ value, label, icon: Icon }) => {
              const active = category === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <CardSkeleton key={item} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No services match that search"
              description="Try a broader keyword or another category. New services are added every day."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setCategory('')
                  }}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const meta = categoryMeta(service.category)
                const Icon = categoryIcons[service.category] || Puzzle
                return (
                  <motion.article
                    key={service.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
                    className="card card-hover group flex h-full flex-col p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="badge-brand">{meta.short}</span>
                    </div>

                    <h2 className="mt-4 font-display text-base font-bold leading-snug text-ink-900 transition group-hover:text-brand-700">
                      <Link to={`/services/${service.id}`}>{service.title}</Link>
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">{service.description}</p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {service.delivery_days}-day delivery
                      <span className="text-ink-200">•</span>
                      <BadgeCheck className="h-3.5 w-3.5 text-accent-500" aria-hidden="true" />
                      Verified seller
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar name={service.freelancer_name} size="xs" />
                        <span className="truncate text-xs font-medium text-ink-600">{service.freelancer_name || 'Freelancer'}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-ink-400">From</p>
                        <p className="font-display text-lg font-bold text-ink-900">{formatCurrency(service.price)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/services/${service.id}`)}
                      className="btn-secondary mt-4 w-full"
                    >
                      View service
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>

        {role !== 'freelancer' && services.length > 0 && (
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-900">Can't find the exact service?</h3>
                <p className="mt-0.5 text-sm text-ink-500">Post a project brief and let freelancers come to you.</p>
              </div>
            </div>
            <Link to="/create-project" className="btn-primary shrink-0">
              Post a project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Services
