import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  Code2,
  Megaphone,
  MessageSquare,
  Palette,
  PenLine,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
} from 'lucide-react'
import API from '../services/api'
import { categoryMeta, formatCurrency } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import { PageLoader } from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import Avatar from '../components/ui/Avatar'

const categoryIcons = {
  web_dev: Code2,
  graphic: Palette,
  writing: PenLine,
  marketing: Megaphone,
  other: Puzzle,
}

const guarantees = [
  { icon: ShieldCheck, text: 'Payment held safely until you approve the delivery' },
  { icon: MessageSquare, text: 'Built-in messaging keeps the brief and files together' },
  { icon: CheckCircle2, text: 'Clear scope, price and timeline agreed up front' },
]

function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}/`)
        setService(res.data)
      } catch {
        setError('We could not load this service. It may have been removed, or the link is incorrect.')
      }
    }
    fetchService()
  }, [id])

  if (error) {
    return (
      <div className="page-wrap">
        <div className="container-page pt-10">
          <EmptyState
            icon={Puzzle}
            title="Service unavailable"
            description={error}
            action={
              <Link to="/services" className="btn-primary">
                Back to services
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="page-wrap">
        <PageLoader label="Loading service…" />
      </div>
    )
  }

  const meta = categoryMeta(service.category)
  const Icon = categoryIcons[service.category] || Puzzle

  return (
    <div className="page-wrap">
      <PageHeader
        backTo="/services"
        backLabel="Back to services"
        eyebrow={meta.label}
        title={service.title}
        subtitle="Service details, delivery expectations and pricing — all in one place."
      />

      <div className="container-page grid gap-6 pt-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="card overflow-hidden"
          >
            <div className={`relative h-32 bg-gradient-to-br ${meta.gradient} sm:h-40`}>
              <div className="absolute inset-0 bg-grid bg-grid opacity-25" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" aria-hidden="true" />
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {meta.label}
              </span>
            </div>

            <div className="p-5 sm:p-7">
              <h2 className="font-display text-xl font-bold text-ink-900">About this service</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">
                {service.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Tag, label: 'Category', value: meta.label },
                  { icon: Clock, label: 'Delivery', value: `${service.delivery_days} days` },
                  { icon: BadgeCheck, label: 'Status', value: 'Available' },
                ].map(({ icon: RowIcon, label, value }) => (
                  <div key={label} className="rounded-xl border border-ink-100 bg-ink-50/60 p-3.5">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                      <RowIcon className="h-3 w-3" aria-hidden="true" />
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="card p-5 sm:p-7"
          >
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <Sparkles className="h-5 w-5 text-brand-500" aria-hidden="true" />
              What you get
            </h2>
            <ul className="mt-4 space-y-3">
              {guarantees.map(({ icon: GuaranteeIcon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-ink-600">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
                    <GuaranteeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="card overflow-hidden"
          >
            <div className="border-b border-ink-100 bg-ink-50/60 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Starting at</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900">
                {formatCurrency(service.price)}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-500">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                Delivered in {service.delivery_days} days
              </p>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-white px-3.5 py-2.5">
                <span className="text-xs font-medium text-ink-500">Delivery</span>
                <span className="text-sm font-semibold text-ink-900">{service.delivery_days} days</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-ink-100 bg-white px-3.5 py-2.5">
                <span className="text-xs font-medium text-ink-500">Category</span>
                <span className="text-sm font-semibold text-ink-900">{meta.short}</span>
              </div>

              <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3.5">
                <p className="text-xs leading-relaxed text-brand-800">
                  Have a question before ordering? Open the freelancer profile and start a conversation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/freelancers/${service.freelancer}`)}
                className="btn-primary w-full"
              >
                <UserRound className="h-4 w-4" aria-hidden="true" />
                View freelancer profile
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link to="/services" className="btn-secondary w-full">
                Browse more services
              </Link>
            </div>
          </motion.div>

          <div className="card flex items-center gap-3 p-4">
            <Avatar name={service.freelancer_name} size="md" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Offered by</p>
              <p className="truncate text-sm font-semibold text-ink-900">{service.freelancer_name || 'Freelancer'}</p>
              {service.freelancer_bio && (
                <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">{service.freelancer_bio}</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ServiceDetail
