import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Package,
  Upload,
} from 'lucide-react'
import API from '../services/api'
import type { Order } from '../lib/types'
import { formatCurrency, formatDate } from '../lib/utils'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import { ListSkeleton } from '../components/ui/Skeleton'
import { StatusBadge } from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'

const statusFilters = [
  { value: 'all', label: 'All orders' },
  { value: 'active', label: 'Active' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'completed', label: 'Completed' },
]

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<Record<number, File | undefined>>({})
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionId, setActionId] = useState<number | null>(null)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)
  const role = localStorage.getItem('role')

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/')
      setOrders(res.data.results || res.data || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const uploadDelivery = async (orderId: number) => {
    if (!files[orderId]) {
      setNotice({ tone: 'error', message: 'Select a delivery file before submitting.' })
      return
    }

    setActionId(orderId)
    setNotice(null)
    try {
      const formData = new FormData()
      formData.append('delivery_file', files[orderId] as File)
      await API.post(`/orders/${orderId}/deliver/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setNotice({ tone: 'success', message: 'Delivery submitted successfully.' })
      setFiles((current) => ({ ...current, [orderId]: undefined }))
      await fetchOrders()
    } catch (err) {
      setNotice({ tone: 'error', message: err.response?.data?.error || 'We could not upload that delivery.' })
    } finally {
      setActionId(null)
    }
  }

  const completeOrder = async (orderId: number) => {
    setActionId(orderId)
    setNotice(null)
    try {
      await API.post(`/orders/${orderId}/complete/`)
      setNotice({ tone: 'success', message: 'Order marked as complete.' })
      await fetchOrders()
    } catch (err) {
      setNotice({ tone: 'error', message: err.response?.data?.error || 'We could not complete that order.' })
    } finally {
      setActionId(null)
    }
  }

  const visibleOrders = statusFilter === 'all' ? orders : orders.filter((order) => order.status === statusFilter)

  return (
    <div className="page-wrap">
      <PageHeader
        eyebrow="Workspace"
        title="My orders"
        subtitle="Track deliveries, review files and keep every engagement moving."
        actions={
          <Link to="/services" className="btn-secondary">
            Browse services
          </Link>
        }
      />

      <div className="container-page pt-8">
        <div className="card p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {statusFilters.map((filter) => {
                const active = statusFilter === filter.value
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setStatusFilter(filter.value)}
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>
            <p className="text-sm text-ink-500">
              {loading ? 'Loading orders…' : `${visibleOrders.length} order${visibleOrders.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className={`mt-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
              notice.tone === 'success'
                ? 'border-accent-200 bg-accent-50 text-accent-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {notice.message}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <ListSkeleton rows={4} />
          ) : visibleOrders.length === 0 ? (
            <EmptyState
              icon={Package}
              title={statusFilter === 'all' ? 'No orders yet' : 'No orders with this status'}
              description={
                statusFilter === 'all'
                  ? 'When a proposal is accepted or a service is purchased, the order will appear here.'
                  : 'Try another filter to see the rest of your orders.'
              }
              action={
                statusFilter !== 'all' ? (
                  <button type="button" onClick={() => setStatusFilter('all')} className="btn-secondary">
                    Show all orders
                  </button>
                ) : (
                  <Link to="/services" className="btn-primary">
                    Browse services
                  </Link>
                )
              }
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {visibleOrders.map((order, index) => (
                <motion.article
                  key={order.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
                  className="card card-hover flex h-full flex-col p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-lg font-bold text-ink-900">Order #{order.id}</h2>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-400">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <p className="font-display text-xl font-bold text-ink-900">{formatCurrency(order.amount)}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Client</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Avatar name={order.client_name} size="xs" />
                        <p className="truncate text-xs font-semibold text-ink-800">{order.client_name || 'Client'}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Freelancer</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Avatar name={order.freelancer_name} size="xs" />
                        <p className="truncate text-xs font-semibold text-ink-800">{order.freelancer_name || 'Freelancer'}</p>
                      </div>
                    </div>
                  </div>

                  {order.status === 'active' && role === 'freelancer' && (
                    <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 p-3.5">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-800">
                        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                        Submit a delivery
                      </p>
                      <input
                        type="file"
                        onChange={(event) =>
                          setFiles((current) => ({ ...current, [order.id]: event.target.files?.[0] }))
                        }
                        className="mt-2.5 block w-full cursor-pointer rounded-lg border border-ink-200 bg-white text-xs text-ink-500 file:mr-3 file:cursor-pointer file:border-0 file:bg-ink-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-ink-700 hover:file:bg-ink-200"
                      />
                      <button
                        type="button"
                        disabled={actionId === order.id}
                        onClick={() => uploadDelivery(order.id)}
                        className="btn-primary mt-2.5 w-full"
                      >
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        {actionId === order.id ? 'Uploading…' : 'Submit delivery'}
                      </button>
                    </div>
                  )}

                  {order.status === 'delivered' && role === 'client' && (
                    <button
                      type="button"
                      disabled={actionId === order.id}
                      onClick={() => completeOrder(order.id)}
                      className="btn-accent mt-4 w-full"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      {actionId === order.id ? 'Completing…' : 'Approve delivery & complete'}
                    </button>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <Link to={`/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                      View order details
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    {order.delivery_file && (
                      <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                        <Package className="h-3.5 w-3.5" aria-hidden="true" />
                        File attached
                      </span>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
