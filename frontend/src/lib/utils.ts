export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(value: number | string | null | undefined, currency = '$'): string {
  const amount = Number(value ?? 0)
  if (Number.isNaN(amount)) return `${currency}0`
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function initials(name?: string | null): string {
  if (!name) return 'U'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function titleCase(value?: string | null): string {
  if (!value) return ''
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

const statusTones: Record<string, Tone> = {
  open: 'success',
  active: 'brand',
  in_progress: 'brand',
  pending: 'warning',
  delivered: 'warning',
  completed: 'success',
  accepted: 'success',
  approved: 'success',
  rejected: 'danger',
  cancelled: 'danger',
  failed: 'danger',
  withdrawn: 'neutral',
}

export function statusTone(status?: string | null): Tone {
  if (!status) return 'neutral'
  return statusTones[status.toLowerCase()] ?? 'neutral'
}

export function statusLabel(status?: string | null): string {
  if (!status) return 'Unknown'
  return titleCase(status)
}

export const categoryMap: Record<
  string,
  { label: string; short: string; gradient: string; emoji: string }
> = {
  web_dev: {
    label: 'Web Development',
    short: 'Web Dev',
    gradient: 'from-indigo-500 to-blue-600',
    emoji: '💻',
  },
  graphic: {
    label: 'Graphic Design',
    short: 'Design',
    gradient: 'from-fuchsia-500 to-pink-600',
    emoji: '🎨',
  },
  writing: {
    label: 'Content Writing',
    short: 'Writing',
    gradient: 'from-amber-500 to-orange-600',
    emoji: '✍️',
  },
  marketing: {
    label: 'Digital Marketing',
    short: 'Marketing',
    gradient: 'from-emerald-500 to-teal-600',
    emoji: '📣',
  },
  other: {
    label: 'Other',
    short: 'Other',
    gradient: 'from-slate-500 to-slate-700',
    emoji: '🧩',
  },
}

export function categoryMeta(category?: string | null) {
  return categoryMap[category ?? 'other'] ?? categoryMap.other
}

export function getStoredUser() {
  if (typeof window === 'undefined') {
    return { token: null, role: null, username: 'User', isStaff: false }
  }
  return {
    token: window.localStorage.getItem('access_token'),
    role: window.localStorage.getItem('role'),
    username: window.localStorage.getItem('username') || 'User',
    isStaff: window.localStorage.getItem('is_staff') === 'true',
  }
}
