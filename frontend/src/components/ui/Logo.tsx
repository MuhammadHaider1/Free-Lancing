import { Link } from 'react-router-dom'
import { BriefcaseBusiness } from 'lucide-react'
import { cn } from '../../lib/utils'

interface LogoProps {
  to?: string
  light?: boolean
  compact?: boolean
  className?: string
}

export function Logo({ to = '/', light = false, compact = false, className }: LogoProps) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-2.5', className)} aria-label="FreelanceHub home">
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 shadow-sm transition duration-300 group-hover:shadow-glow">
        <span className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent" aria-hidden="true" />
        <BriefcaseBusiness className="relative h-5 w-5 text-white" strokeWidth={2.2} aria-hidden="true" />
      </span>
      {!compact && (
        <span className={cn('font-display text-lg font-bold tracking-tight', light ? 'text-white' : 'text-ink-900')}>
          Freelance
          <span className={light ? 'text-brand-200' : 'text-brand-600'}>Hub</span>
        </span>
      )}
    </Link>
  )
}

export default Logo
