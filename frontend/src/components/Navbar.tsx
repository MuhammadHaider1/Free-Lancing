import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Briefcase,
  ChevronDown,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import API from '../services/api'
import type { NotificationItem } from '../lib/types'
import { cn, formatDate } from '../lib/utils'
import Logo from './ui/Logo'
import Avatar from './ui/Avatar'

interface MenuLink {
  to: string
  label: string
  icon: LucideIcon
}

const appLinks = [
  { to: '/home', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/freelancers', label: 'Freelancers' },
]

const guestLinks = [
  { href: '#categories', label: 'Categories' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#testimonials', label: 'Reviews' },
]

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('access_token')
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username') || 'User'
  const isStaff = localStorage.getItem('is_staff') === 'true'

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications/')
      const data = Array.isArray(res.data) ? res.data : res.data.results || []
      setNotifications(data)
    } catch {
      // Notifications are non-critical; keep the shell quiet if the API is unavailable.
    }
  }

  useEffect(() => {
    if (token) fetchNotifications()
  }, [token])

  useEffect(() => {
    setShowMobileMenu(false)
    setShowProfileMenu(false)
    setShowNotifications(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (notifRef.current && !notifRef.current.contains(target)) setShowNotifications(false)
      if (profileRef.current && !profileRef.current.contains(target)) setShowProfileMenu(false)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false)
        setShowProfileMenu(false)
        setShowMobileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    localStorage.removeItem('is_staff')
    navigate('/login')
  }

  const unreadCount = notifications.filter((item) => !item.is_read).length

  const profileMenuLinks: MenuLink[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/services', label: 'Explore services', icon: Briefcase },
    ...(role === 'freelancer' ? [{ to: '/my-services', label: 'My services', icon: FolderKanban }] : []),
    { to: '/orders', label: 'Orders', icon: Package },
    ...(role === 'freelancer'
      ? [{ to: '/my-proposals', label: 'My proposals', icon: FileText }]
      : [{ to: '/projects', label: 'Project proposals', icon: FileText }]),
    { to: '/wallet', label: 'Wallet', icon: Wallet },
    ...(isStaff ? [{ to: '/admin/withdrawals', label: 'Withdrawals', icon: ShieldCheck }] : []),
  ]

  const primaryAction = isStaff
    ? { to: '/admin-home', label: 'Admin overview', icon: ShieldCheck }
    : role === 'freelancer'
      ? { to: '/create-service', label: 'Create service', icon: Plus }
      : { to: '/create-project', label: 'Post a project', icon: Plus }

  const PrimaryIcon = primaryAction.icon

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Logo to={token ? '/home' : '/'} />
          <div className="hidden items-center gap-1 lg:flex">
            {token
              ? appLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'relative rounded-lg px-3 py-2 text-sm font-medium transition',
                        isActive ? 'text-brand-700' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-2 -bottom-[13px] h-0.5 rounded-full bg-brand-600"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))
              : guestLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition hover:bg-ink-50 hover:text-ink-900"
                  >
                    {link.label}
                  </a>
                ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {token ? (
            <>
              <Link
                to={primaryAction.to}
                className="btn-primary hidden sm:inline-flex"
              >
                <PrimaryIcon className="h-4 w-4" aria-hidden="true" />
                {primaryAction.label}
              </Link>

              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications((open) => !open)
                    setShowProfileMenu(false)
                  }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                  aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                  aria-expanded={showNotifications}
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card"
                    >
                      <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-ink-900">Notifications</p>
                          <p className="text-xs text-ink-400">{unreadCount} unread</p>
                        </div>
                        <Bell className="h-4 w-4 text-ink-400" aria-hidden="true" />
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-10 text-center text-sm text-ink-400">You're all caught up.</p>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={cn(
                                'group flex items-start gap-3 border-b border-ink-50 px-4 py-3 last:border-b-0',
                                !notification.is_read && 'bg-brand-50/50',
                              )}
                            >
                              <button
                                type="button"
                                className="min-w-0 flex-1 text-left"
                                onClick={async () => {
                                  try {
                                    await API.post(`/notifications/${notification.id}/read/`)
                                    fetchNotifications()
                                  } catch {
                                    // ignore
                                  }
                                }}
                              >
                                <p className="text-sm leading-snug text-ink-700">{notification.message}</p>
                                <p className="mt-1 text-[11px] text-ink-400">{formatDate(notification.created_at)}</p>
                              </button>
                              <button
                                type="button"
                                className="mt-0.5 rounded-md p-1 text-ink-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                                aria-label="Delete notification"
                                onClick={async () => {
                                  try {
                                    await API.delete(`/notifications/${notification.id}/`)
                                    fetchNotifications()
                                  } catch {
                                    // ignore
                                  }
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu((open) => !open)
                    setShowNotifications(false)
                  }}
                  className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-ink-100"
                  aria-label="Open profile menu"
                  aria-expanded={showProfileMenu}
                >
                  <Avatar name={username} size="sm" />
                  <span className="hidden text-left sm:block">
                    <span className="block max-w-[9rem] truncate text-sm font-semibold leading-tight text-ink-800">
                      {username}
                    </span>
                    <span className="block text-[11px] capitalize leading-tight text-ink-400">
                      {isStaff ? 'Administrator' : role || 'Member'}
                    </span>
                  </span>
                  <ChevronDown className={cn('hidden h-4 w-4 text-ink-400 transition sm:block', showProfileMenu && 'rotate-180')} aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card"
                    >
                      <div className="border-b border-ink-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-ink-900">{username}</p>
                        <p className="mt-0.5 text-xs capitalize text-ink-400">
                          {isStaff ? 'Administrator' : `${role || 'member'} account`}
                        </p>
                      </div>
                      <div className="p-1.5">
                        {profileMenuLinks.map(({ to, label, icon: Icon }) => (
                          <Link
                            key={to + label}
                            to={to}
                            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-900"
                          >
                            <Icon className="h-4 w-4 text-ink-400" aria-hidden="true" />
                            {label}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-ink-100 p-1.5">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-600 transition hover:bg-ink-100 lg:hidden"
            onClick={() => setShowMobileMenu((open) => !open)}
            aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="overflow-hidden border-t border-ink-100 bg-white lg:hidden"
          >
            <div className="container-page space-y-1 py-4">
              {token
                ? appLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-xl px-3 py-2.5 text-sm font-medium',
                          isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))
                : guestLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
                    >
                      {link.label}
                    </a>
                  ))}

              {token && (
                <>
                  <div className="my-2 border-t border-ink-100" />
                  {profileMenuLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to + label}
                      to={to}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
                    >
                      <Icon className="h-4 w-4 text-ink-400" aria-hidden="true" />
                      {label}
                    </Link>
                  ))}
                  <div className="my-2 border-t border-ink-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </>
              )}

              {!token && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/login" className="btn-secondary">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
