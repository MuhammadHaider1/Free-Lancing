import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Check,
  Code2,
  CreditCard,
  Megaphone,
  MessageSquare,
  Palette,
  PenLine,
  Puzzle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '../components/ui/Reveal'

const categories = [
  { icon: Code2, title: 'Web Development', desc: 'Websites, apps & APIs', gradient: 'from-indigo-500 to-blue-600' },
  { icon: Palette, title: 'Graphic Design', desc: 'Brand, UI & visuals', gradient: 'from-fuchsia-500 to-pink-600' },
  { icon: PenLine, title: 'Content Writing', desc: 'Copy, blogs & docs', gradient: 'from-amber-500 to-orange-600' },
  { icon: Megaphone, title: 'Digital Marketing', desc: 'SEO, ads & growth', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Puzzle, title: 'Specialized Work', desc: 'Niche & technical skills', gradient: 'from-slate-500 to-slate-700' },
]

const steps = [
  {
    icon: Search,
    title: 'Discover the right talent',
    desc: 'Browse verified freelancers and fixed-scope services with transparent pricing and delivery times.',
  },
  {
    icon: Send,
    title: 'Brief, chat and agree',
    desc: 'Send a project brief or proposal, chat in real time, and agree on scope before any work starts.',
  },
  {
    icon: CreditCard,
    title: 'Deliver and get paid',
    desc: 'Track milestones, review deliveries, and release secure payments from your FreelanceHub wallet.',
  },
]

const testimonials = [
  {
    quote:
      'We rebuilt our entire marketing site in two weeks. The quality of talent and the order flow made it feel like having an in-house team.',
    name: 'Ayesha Khan',
    role: 'Founder, Northstar Labs',
    initials: 'AK',
    tone: 'from-indigo-500 to-violet-600',
  },
  {
    quote:
      'I went from one-off gigs to a predictable pipeline. Proposals, chat, and payouts all live in one dashboard now.',
    name: 'Daniyal Raza',
    role: 'Full-stack freelancer',
    initials: 'DR',
    tone: 'from-emerald-500 to-teal-600',
  },
  {
    quote:
      'Clear scopes, protected payments, and real reviews. It is the first marketplace our procurement team actually likes.',
    name: 'Sara Ahmed',
    role: 'Ops Lead, Vertex Studio',
    initials: 'SA',
    tone: 'from-amber-500 to-orange-600',
  },
]

const clientFeatures = [
  'Post a project with a clear budget and deadline',
  'Compare proposals side by side',
  'Chat and share files in one place',
  'Release payment only when you are happy',
]

const freelancerFeatures = [
  'Package your skills into a productised service',
  'Send tailored proposals to open projects',
  'Manage deliveries and revisions in one inbox',
  'Withdraw earnings to JazzCash, EasyPaisa or bank',
]

function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-hero text-white">
        <div className="absolute inset-0 bg-grid bg-grid opacity-40 mask-fade-b" aria-hidden="true" />
        <div className="absolute -left-24 top-24 h-72 w-72 animate-pulse-slow rounded-full bg-brand-400/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 animate-pulse-slow rounded-full bg-accent-400/20 blur-3xl" aria-hidden="true" />

        <div className="container-page relative grid gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
              The freelance marketplace, reimagined
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-6 max-w-2xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Hire exceptional talent.
              <span className="mt-2 block bg-gradient-to-r from-brand-200 via-white to-accent-200 bg-clip-text text-transparent">
                Deliver extraordinary work.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-brand-100/85 sm:text-lg"
            >
              FreelanceHub connects ambitious teams with vetted freelancers. Brief, collaborate, and pay
              securely — all from one beautifully simple workspace.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link to="/register" className="btn-accent px-5 py-3 text-sm">
                Get started free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className="btn border border-white/20 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur hover:bg-white/20"
              >
                Explore the marketplace
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brand-100/80"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['AK', 'DR', 'SA', 'MU'].map((name, index) => (
                    <span
                      key={name}
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${['from-indigo-400 to-violet-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500', 'from-sky-400 to-blue-500'][index]} text-[10px] font-bold text-white ring-2 ring-brand-950/40`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <span>
                  <strong className="font-semibold text-white">12,000+</strong> members
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" aria-hidden="true" />
                <strong className="font-semibold text-white">4.9/5</strong>
                <span>from 2,400+ reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent-300" aria-hidden="true" />
                <span>Payment protection</span>
              </div>
            </motion.div>
          </div>

          {/* Hero preview */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl shadow-brand-950/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="badge-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  Live project
                </span>
                <span className="text-xs font-medium text-ink-400">Updated 2m ago</span>
              </div>

              <h3 className="mt-4 font-display text-lg font-bold text-ink-900">Mobile banking app redesign</h3>
              <p className="mt-1 text-sm text-ink-500">Product design · 4 week sprint · 2 milestones</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: 'Budget', value: '$2,400' },
                  { label: 'Proposals', value: '12' },
                  { label: 'Timeline', value: '28d' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-ink-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">{stat.label}</p>
                    <p className="mt-1 font-display text-base font-bold text-ink-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium text-ink-500">
                  <span>Milestone progress</span>
                  <span className="text-ink-900">64%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '64%' }}
                    transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-ink-100 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="avatar h-9 w-9 text-xs">DR</span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">Daniyal Raza</p>
                    <p className="text-[11px] text-ink-400">Top rated · 98% success</p>
                  </div>
                </div>
                <span className="badge-success">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified
                </span>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-3 -top-6 hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-card sm:block"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Wallet className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-medium text-ink-400">Payment released</p>
                  <p className="font-display text-sm font-bold text-ink-900">+$480.00</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-card sm:block"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-medium text-ink-400">New message</p>
                  <p className="text-xs font-semibold text-ink-900">“Looks great — ship it!”</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logos */}
      <section className="border-b border-ink-200/70 bg-white py-8">
        <div className="container-page flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
            Trusted by modern teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-display text-lg font-bold tracking-tight text-ink-300">
            {['Northstar', 'Lumen', 'Vertex', 'Arc Labs', 'Orbit'].map((brand) => (
              <span key={brand} className="transition hover:text-ink-500">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-page py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Browse by category</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Expertise for every ambitious idea
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-500">
            From a landing page to a full product launch, find specialists who have done it before.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ icon: Icon, title, desc, gradient }) => (
            <StaggerItem key={title}>
              <Link to="/services" className="group card card-hover block h-full p-5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{title}</h3>
                <p className="mt-1 text-sm text-ink-500">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100">
                  Explore <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-ink-200/70 bg-white py-20">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Three steps from brief to delivery
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-500">
              A clear, protected workflow that keeps both sides aligned from the first message to the final file.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <div className="relative h-full rounded-2xl border border-ink-200 bg-ink-50/40 p-6">
                  <span className="absolute right-5 top-5 font-display text-5xl font-extrabold text-ink-200/80">
                    0{index + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft ring-1 ring-ink-200/70">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Two audiences */}
      <section className="container-page py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-ink-200 bg-white p-8 shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-ink-900">For clients</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Build a shortlist in minutes, not weeks. Every project has a clear scope, budget, and delivery date.
              </p>
              <ul className="mt-6 space-y-3">
                {clientFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary mt-7">
                Post a project
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-lift">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/20">
                <Briefcase className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">For freelancers</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/85">
                Turn your skills into a reliable business. Win work, manage clients, and withdraw earnings with ease.
              </p>
              <ul className="mt-6 space-y-3">
                {freelancerFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-brand-50/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn mt-7 bg-white text-brand-700 hover:bg-brand-50">
                Start selling services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-ink-200/70 bg-white">
        <div className="container-page grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, value: '12k+', label: 'Verified members' },
            { icon: Briefcase, value: '8.5k', label: 'Projects delivered' },
            { icon: TrendingUp, value: '98%', label: 'Success rate' },
            { icon: Zap, value: '< 2h', label: 'Average response' },
          ].map(({ icon: Icon, value, label }, index) => (
            <Reveal key={label} delay={index * 0.06}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
                  <p className="text-xs font-medium text-ink-500">{label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container-page py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Loved by both sides</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Real work. Real outcomes.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-500">
            Teams and freelancers use FreelanceHub to build long-term, high-trust working relationships.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.tone} text-xs font-bold text-white`}>
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{testimonial.name}</p>
                    <p className="text-xs text-ink-400">{testimonial.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-hero px-6 py-14 text-center shadow-lift sm:px-12">
            <div className="absolute inset-0 bg-grid bg-grid opacity-30" aria-hidden="true" />
            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-brand-100">
                <Sparkles className="h-3.5 w-3.5 text-accent-300" aria-hidden="true" />
                Your next great hire starts here
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to build something remarkable?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-brand-100/85">
                Join thousands of teams and freelancers who ship better work, together.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/register" className="btn-accent px-5 py-3">
                  Create your free account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/login" className="btn border border-white/20 bg-white/10 px-5 py-3 text-white hover:bg-white/20">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

export default Landing
