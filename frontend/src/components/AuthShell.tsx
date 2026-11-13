import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BadgeCheck, ShieldCheck, Sparkles, Star } from 'lucide-react'
import Logo from './ui/Logo'

interface AuthShellProps {
  children: ReactNode
  eyebrow: string
  title: string
  subtitle: string
}

const bullets = [
  { icon: BadgeCheck, text: 'Vetted freelancers with real client reviews' },
  { icon: ShieldCheck, text: 'Protected payments released on approval' },
  { icon: Sparkles, text: 'One workspace for briefs, chat and deliveries' },
]

export function AuthShell({ children, eyebrow, title, subtitle }: AuthShellProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-hero p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 bg-grid bg-grid opacity-30" aria-hidden="true" />
        <div className="absolute -left-20 top-32 h-72 w-72 animate-pulse-slow rounded-full bg-brand-400/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 animate-pulse-slow rounded-full bg-accent-400/20 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <Logo to="/" light />
          <div className="mt-16 max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
              {eyebrow}
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white">
              Where great work finds great people.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-100/80">
              Join a marketplace built for trust, clarity and long-term collaboration — not just one-off gigs.
            </p>

            <ul className="mt-8 space-y-3.5">
              {bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-brand-50/90">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent-300">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="relative mt-12 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
        >
          <div className="flex items-center gap-1 text-amber-300">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            ))}
          </div>
          <blockquote className="mt-3 text-sm leading-relaxed text-brand-50/90">
            “We hired a designer and a developer in the same afternoon. The whole workflow — brief,
            chat, delivery, payment — stayed in one place.”
          </blockquote>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-teal-500 text-xs font-bold text-white">
              SA
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Sara Ahmed</p>
              <p className="text-[11px] text-brand-200/80">Ops Lead, Vertex Studio</p>
            </div>
          </div>
        </motion.div>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo to="/" />
            <span className="badge-brand">{eyebrow}</span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </motion.div>
      </main>
    </div>
  )
}

export default AuthShell
