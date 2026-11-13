import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, Send } from 'lucide-react'
import API from '../services/api'
import { formatDate } from '../lib/utils'
import { Spinner } from './ui/Spinner'
import Avatar from './ui/Avatar'

function ChatBox({ orderId }) {
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const username = localStorage.getItem('username') || ''

  const fetchChat = async () => {
    try {
      const res = await API.get('/chat/conversations/')
      const conversations = res.data.results || res.data || []
      const conv = conversations.find((item) => item.order === orderId)

      if (conv) {
        setConversation(conv)
        setMessages(conv.messages || [])
      }
    } catch {
      setError('We could not load this conversation. Please refresh and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim() || sending) return

    if (!conversation) {
      setError('Conversation not found for this order yet.')
      return
    }

    setSending(true)
    setError('')
    try {
      await API.post('/chat/messages/', { conversation: conversation.id, text: text.trim() })
      setText('')
      await fetchChat()
    } catch {
      setError('We could not send that message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-base font-bold text-ink-900">Project chat</h2>
            <p className="text-[11px] text-ink-400">Keep decisions and files in one thread.</p>
          </div>
        </div>
        <span className="badge-neutral">{messages.length} message{messages.length === 1 ? '' : 's'}</span>
      </div>

      <div className="h-72 space-y-3 overflow-y-auto bg-ink-50/40 px-4 py-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-500 shadow-soft ring-1 ring-ink-200/70">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-medium text-ink-600">No messages yet</p>
            <p className="mt-0.5 text-xs text-ink-400">Say hello and align on the next step.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const mine = message.sender_name === username
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar name={message.sender_name} size="xs" />
                  <div className={`max-w-[80%] ${mine ? 'text-right' : ''}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                        mine
                          ? 'rounded-br-md bg-brand-600 text-white'
                          : 'rounded-bl-md border border-ink-100 bg-white text-ink-700'
                      }`}
                    >
                      {message.text}
                    </div>
                    <p className="mt-1 text-[10px] text-ink-400">
                      {mine ? 'You' : message.sender_name} · {formatDate(message.created_at)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div role="alert" className="border-t border-rose-100 bg-rose-50 px-4 py-2.5 text-xs text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-ink-100 bg-white p-3">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          aria-label="Message"
          className="input"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !text.trim()}
          className="btn-primary shrink-0"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{sending ? 'Sending…' : 'Send'}</span>
        </button>
      </div>
    </motion.section>
  )
}

export default ChatBox
