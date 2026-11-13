import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-brand-600', className)} aria-label="Loading" />
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-ink-200/70">
        <Loader2 className="h-5 w-5 animate-spin text-brand-600" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-ink-500">{label}</p>
    </div>
  )
}

export default Spinner
