import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Package,
  Star,
  Upload,
} from 'lucide-react'
import API from '../services/api'
import type { Order, Review } from '../lib/types'
import { formatCurrency, formatDate } from '../lib/utils'
import { StatusBadge } from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { PageLoader } from '../components/ui/Spinner'
import Avatar from '../components/ui/Avatar'
import ChatBox from '../components/ChatBox'

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [review, setReview] = useState<Review | null>(null)
  const [deliveryFile, setDeliveryFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState(false)
  const role = localStorage.getItem('role')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}/`)
        setOrder(res.data)
      } catch {
        setError('We could not load this order. It may have been removed, or you may not have access.')
      }
    }
    const fetchReview = async () => {
      try {
        const res = await API.get(`/reviews/?order=${id}`)
        const data = Array.isArray(res.data) ? res.data : res.data.results || []
        if (data.length > 0) setReview(data[0])
      } catch {
        // review is optional
      }
    }
    fetchOrder()
    fetchReview()
  }, [id])

  const uploadDelivery = async () => {
    if (!deliveryFile) {
      setError('Choose a file before submitting your delivery.')
      return
    }

    setUploading(true)
    setError('')
    setNotice('')
    try {
      const formData = new FormData()
      formData.append('delivery_file', deliveryFile)
      await API.post(`/orders/${id}/deliver/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setNotice('Delivery submitted. The client has been notified.')
      setDeliveryFile(null)
      const res = await API.get(`/orders/${id}/`)
      setOrder(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'We could not upload that delivery. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (error && !order) {
    return (
      <div className="page-wrap">
        <div className="container-page pt-10">
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
          <Link to="/orders" className="btn-secondary mt-4">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="page-wrap">
        <PageLoader label="Loading order…" />
      </div>
    )
  }

  const timeline = [
    { label: 'Order created', done: true, icon: Package },
    {
      label: order.status === 'delivered' || order.status === 'completed' ? 'Delivery submitted' : 'Waiting for delivery',
      done: order.status === 'delivered' || order.status === 'completed',
      icon: Upload,
    },
    {
      label: order.status === 'completed' ? 'Order completed' : 'Waiting for approval',
      done: order.status === 'completed',
      icon: CheckCircle2,
    },
  ]

  const canReview = order.status === 'completed' && role === 'client' && !order.review_exists && !review

  return (
    <div className="page-wrap">
      <section className="page-hero">
        <div className="container-page">
          <Link to="/orders" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to orders
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow">Order details</span>
                <StatusBadge status={order.status} />
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Order #{order.id}
              </h1>
              <p className="mt-1.5 text-sm text-ink-500">Created {formatDate(order.created_at)}</p>
            </div>
            <p className="font-display text-3xl font-bold text-ink-900">{formatCurrency(order.amount)}</p>
          </div>
        </div>
      </section>

      <div className="container-page pt-8">
        {(error || notice) && (
          <div
            role="status"
            className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              error ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-accent-200 bg-accent-50 text-accent-700'
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardBody>
                <h2 className="font-display text-lg font-bold text-ink-900">Progress</h2>
                <p className="mt-0.5 text-sm text-ink-500">Follow the order from brief to final delivery.</p>

                <ol className="mt-6 space-y-0">
                  {timeline.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <li key={step.label} className="relative flex gap-4 pb-7 last:pb-0">
                        {index < timeline.length - 1 && (
                          <span
                            className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px ${step.done ? 'bg-accent-200' : 'bg-ink-200'}`}
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            step.done ? 'bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100' : 'bg-ink-50 text-ink-400 ring-1 ring-inset ring-ink-200'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="pt-1">
                          <p className={`text-sm font-semibold ${step.done ? 'text-ink-900' : 'text-ink-400'}`}>{step.label}</p>
                          <p className="mt-0.5 text-xs text-ink-400">
                            {step.done ? 'Completed' : 'Pending'}
                            {index === 1 && order.delivered_at ? ` · ${formatDate(order.delivered_at)}` : ''}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </CardBody>
            </Card>

            {order.delivery_file && (
              <Card>
                <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-bold text-ink-900">Delivery file</h2>
                      <p className="mt-0.5 text-sm text-ink-500">The latest file submitted for this order.</p>
                    </div>
                  </div>
                  <a
                    href={`http://127.0.0.1:8000${order.delivery_file}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary shrink-0"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download
                  </a>
                </CardBody>
              </Card>
            )}

            {order.status === 'in_progress' && role === 'freelancer' && (
              <Card>
                <CardBody>
                  <h2 className="font-display text-lg font-bold text-ink-900">Submit delivery</h2>
                  <p className="mt-0.5 text-sm text-ink-500">Upload the final files. The client will be notified for approval.</p>
                  <input
                    type="file"
                    onChange={(event) => setDeliveryFile(event.target.files?.[0] || null)}
                    className="mt-4 block w-full cursor-pointer rounded-xl border border-ink-200 bg-white text-xs text-ink-500 file:mr-3 file:cursor-pointer file:border-0 file:bg-ink-100 file:px-3 file:py-2.5 file:text-xs file:font-semibold file:text-ink-700 hover:file:bg-ink-200"
                  />
                  <button type="button" onClick={uploadDelivery} disabled={uploading} className="btn-primary mt-3 w-full">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    {uploading ? 'Uploading…' : 'Submit delivery'}
                  </button>
                </CardBody>
              </Card>
            )}

            {review && (
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-ink-900">Your review</h2>
                    <span className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                      ))}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{review.comment}</p>
                  <p className="mt-2 text-xs text-ink-400">Submitted by {review.client_name}</p>
                </CardBody>
              </Card>
            )}

            <ChatBox orderId={order.id} />
          </div>

          <aside className="space-y-6">
            <Card>
              <CardBody>
                <h2 className="font-display text-base font-bold text-ink-900">Order summary</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Amount</dt>
                    <dd className="font-semibold text-ink-900">{formatCurrency(order.amount)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Status</dt>
                    <dd><StatusBadge status={order.status} /></dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-ink-500">Created</dt>
                    <dd className="font-medium text-ink-800">{formatDate(order.created_at)}</dd>
                  </div>
                  {order.delivered_at && (
                    <div className="flex items-center justify-between">
                      <dt className="text-ink-500">Delivered</dt>
                      <dd className="font-medium text-ink-800">{formatDate(order.delivered_at)}</dd>
                    </div>
                  )}
                </dl>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="font-display text-base font-bold text-ink-900">People</h2>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                    <Avatar name={order.client_name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{order.client_name || 'Client'}</p>
                      <p className="text-xs text-ink-400">Client</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                    <Avatar name={order.freelancer_name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{order.freelancer_name || 'Freelancer'}</p>
                      <p className="text-xs text-ink-400">Freelancer</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/freelancers/${order.freelancer}`)}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                    >
                      View
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {canReview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
              >
                <h2 className="font-display text-base font-bold text-amber-900">How did it go?</h2>
                <p className="mt-1 text-sm text-amber-700">Leave a review to help other clients hire with confidence.</p>
                <button
                  type="button"
                  onClick={() => navigate(`/reviews/create/${order.id}`)}
                  className="btn mt-4 w-full bg-amber-500 text-white hover:bg-amber-600"
                >
                  <Star className="h-4 w-4" aria-hidden="true" />
                  Leave a review
                </button>
              </motion.div>
            )}

            <Card>
              <CardBody>
                <div className="flex items-center gap-2 text-sm text-ink-500">
                  <Clock className="h-4 w-4 text-ink-400" aria-hidden="true" />
                  Need help with this order?
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  Use the chat below to message the other party directly. Keep all communication and files in one place.
                </p>
              </CardBody>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
