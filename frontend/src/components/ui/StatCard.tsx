import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  hint?: string
  trend?: string
  to?: string
  tone?: 'brand' | 'accent' | 'amber' | 'violet' | 'rose'
  delay?: number
}

const toneStyles = {
  brand: 'bg-brand-50 text-brand-600 ring-brand-100',
  accent: 'bg-accent-50 text-accent-600 ring-accent-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  violet: 'bg-violet-50 text-violet-600 ring-violet-100',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100',
}

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
  to,
  tone = 'brand',
  delay = 0,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset', toneStyles[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-2 py-1 text-[11px] font-semibold text-accent-700">
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-ink-500">{title}</p>
      <p className="mt-1 font-display text-3xl font-bold tracking-tight text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {to ? (
        <Link to={to} className="stat-card block">
          {content}
        </Link>
      ) : (
        <div className="stat-card">{content}</div>
      )}
    </motion.div>
  )
}

export default StatCard
