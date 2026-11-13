import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: ReactNode
  backTo?: string
  backLabel?: string
  className?: string
  align?: 'left' | 'center'
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  backTo,
  backLabel = 'Back',
  className,
  align = 'left',
}: PageHeaderProps) {
  return (
    <section className={cn('page-hero', className)}>
      <div className="container-page">
        {backTo && (
          <Link
            to={backTo}
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
            align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
          )}
        >
          <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
            {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm leading-relaxed text-ink-500 sm:text-base">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
        </motion.div>
      </div>
    </section>
  )
}

export default PageHeader
