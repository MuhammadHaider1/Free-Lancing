import type { HTMLAttributes, ReactNode } from 'react'
import { cn, statusLabel, statusTone } from '../../lib/utils'
import type { Tone } from '../../lib/utils'

const toneClasses: Record<Tone, string> = {
  brand: 'badge-brand',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
}

const dotClasses: Record<Tone, string> = {
  brand: 'bg-brand-500',
  success: 'bg-accent-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-ink-400',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  dot?: boolean
  children: ReactNode
}

export function Badge({ tone = 'neutral', dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(toneClasses[tone], className)} {...rest}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} aria-hidden="true" />}
      {children}
    </span>
  )
}

export function StatusBadge({ status, className }: { status?: string | null; className?: string }) {
  const tone = statusTone(status)
  return (
    <Badge tone={tone} dot className={cn('capitalize', className)}>
      {statusLabel(status)}
    </Badge>
  )
}

export default Badge
