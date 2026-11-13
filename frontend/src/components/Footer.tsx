import { Link } from 'react-router-dom'
import { ArrowRight, AtSign, Globe, Mail, MessageCircle } from 'lucide-react'
import Logo from './ui/Logo'

const columns = [
  {
    title: 'Marketplace',
    links: [
      { to: '/services', label: 'Browse services' },
      { to: '/projects', label: 'Find projects' },
      { to: '/freelancers', label: 'Top freelancers' },
      { to: '/reviews', label: 'Client reviews' },
    ],
  },
  {
    title: 'For freelancers',
    links: [
      { to: '/create-service', label: 'Create a service' },
      { to: '/my-proposals', label: 'My proposals' },
      { to: '/wallet', label: 'Earnings & payouts' },
      { to: '/dashboard', label: 'Freelancer dashboard' },
    ],
  },
  {
    title: 'For clients',
    links: [
      { to: '/create-project', label: 'Post a project' },
      { to: '/projects', label: 'Manage projects' },
      { to: '/orders', label: 'Track orders' },
      { to: '/dashboard', label: 'Client dashboard' },
    ],
  },
]

function Footer() {
  return (
    <footer className="border-t border-ink-200/70 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              The modern marketplace for exceptional freelance talent. Hire faster, deliver better,
              and get paid securely.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Globe, label: 'Website', href: '#' },
                { icon: AtSign, label: 'Social profile', href: '#' },
                { icon: MessageCircle, label: 'Community', href: '#' },
                { icon: Mail, label: 'Email us', href: 'mailto:hello@freelancehub.dev' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-ink-900">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-ink-500 transition hover:text-brand-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-ink-200 bg-ink-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">Get product updates</p>
            <p className="mt-0.5 text-xs text-ink-500">Hiring tips and marketplace news. No spam.</p>
          </div>
          <form className="flex w-full max-w-sm gap-2" onSubmit={(event) => event.preventDefault()}>
            <input type="email" required placeholder="you@company.com" className="input" aria-label="Email address" />
            <button type="submit" className="btn-primary shrink-0" aria-label="Subscribe">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
            <span className="cursor-default">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
