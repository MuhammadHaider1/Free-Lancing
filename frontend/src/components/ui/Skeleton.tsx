import { cn } from '../../lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />
}

export function CardSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('card p-6', className)}>
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="mt-4 h-4 w-3/4" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn('mt-2 h-3', index === lines - 1 ? 'w-1/2' : 'w-full')} />
      ))}
      <Skeleton className="mt-5 h-9 w-full rounded-xl" />
    </div>
  )
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="card flex items-center gap-4 p-4">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default Skeleton
