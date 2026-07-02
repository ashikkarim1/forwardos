'use client'

/**
 * Forward Copilot — floating trigger + slide-in drawer.
 *
 * Mounted on any dashboard by rendering <CopilotFab role="buyer" />.
 * Feature-flagged behind NEXT_PUBLIC_COPILOT=1 so the whole thing tree-shakes
 * cleanly when disabled and we can turn it on per-environment.
 *
 * Streaming: the /api/copilot/chat endpoint speaks SSE. We parse events by
 * hand from the fetch reader — no EventSource because we need POST + auth
 * cookies + streaming, which EventSource doesn't do.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Sparkles, X, Send, Wrench, Loader2 } from 'lucide-react'

type Role = 'buyer' | 'seller' | 'broker'

type ChatMsg =
  | { kind: 'user'; text: string }
  | { kind: 'assistant'; text: string; toolCalls: ToolCall[]; streaming: boolean }

interface ToolCall {
  id: string
  name: string
  input: unknown
  output?: unknown
}

const COPILOT_ENABLED =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_COPILOT === '1'

// Champagne + ink palette matches the rest of the app.
const CHAMPAGNE = '#B8956A'
const CHAMPAGNE_LIGHT = '#D6C5A8'
const INK = '#1A1A1A'
const CREAM = '#FAF6EF'

const GREETING: Record<Role, string> = {
  buyer:
    'Deal Scout ready. I can run your saved searches, pull comparables, brief you on a listing, or draft a first-touch inquiry. What are you hunting?',
  seller:
    'Exit Coach ready. I can price your listing against live comps, grade incoming inquiries, or draft replies. What do you want to work on?',
  broker:
    'Deal Ops ready. I can summarize your portfolio, flag stalling deals, or draft a top-10 buyer list for any active listing. Where should we start?',
}

const NAMES: Record<Role, string> = {
  buyer: 'Deal Scout',
  seller: 'Exit Coach',
  broker: 'Deal Ops',
}

export interface DealContext {
  dealId: string
  title: string
}

export function CopilotFab({ role, dealContext }: { role: Role; dealContext?: DealContext }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || sending) return
      setSending(true)

      const nextMessages: ChatMsg[] = [
        ...messages,
        { kind: 'user', text },
        { kind: 'assistant', text: '', toolCalls: [], streaming: true },
      ]
      setMessages(nextMessages)
      setInput('')

      const controller = new AbortController()
      abortRef.current = controller

      try {
        const payload = {
          role,
          dealContext,
          messages: nextMessages
            .filter((m) => m.kind !== 'assistant' || m.text.length > 0)
            .map((m) =>
              m.kind === 'user'
                ? { role: 'user' as const, content: m.text }
                : { role: 'assistant' as const, content: m.text },
            ),
        }
        const res = await fetch('/api/copilot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({ error: 'Copilot unreachable.' }))
          appendAssistant((prev) => ({
            ...prev,
            text: prev.text + `\n\n_Error: ${err.error ?? res.statusText}_`,
            streaming: false,
          }))
          return
        }

        const reader = res.body.getReader()
        const dec = new TextDecoder()
        let buf = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += dec.decode(value, { stream: true })
          const parts = buf.split('\n\n')
          buf = parts.pop() ?? ''
          for (const part of parts) handleSseChunk(part)
        }
        appendAssistant((prev) => ({ ...prev, streaming: false }))
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          appendAssistant((prev) => ({
            ...prev,
            text: prev.text + `\n\n_Network error: ${err.message}_`,
            streaming: false,
          }))
        }
      } finally {
        setSending(false)
        abortRef.current = null
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, role, sending, dealContext],
  )

  function appendAssistant(update: (prev: Extract<ChatMsg, { kind: 'assistant' }>) => Extract<ChatMsg, { kind: 'assistant' }>) {
    setMessages((prev) => {
      const copy = prev.slice()
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].kind === 'assistant') {
          copy[i] = update(copy[i] as Extract<ChatMsg, { kind: 'assistant' }>)
          return copy
        }
      }
      return copy
    })
  }

  function handleSseChunk(chunk: string) {
    let event = 'message'
    let data = ''
    for (const line of chunk.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim()
      else if (line.startsWith('data:')) data += line.slice(5).trim()
    }
    if (!data) return
    let parsed: any
    try { parsed = JSON.parse(data) } catch { return }
    if (event === 'text') {
      appendAssistant((prev) => ({ ...prev, text: prev.text + (parsed.delta ?? '') }))
    } else if (event === 'tool_use') {
      appendAssistant((prev) => ({
        ...prev,
        toolCalls: [...prev.toolCalls, { id: parsed.id, name: parsed.name, input: parsed.input }],
      }))
    } else if (event === 'tool_result') {
      appendAssistant((prev) => ({
        ...prev,
        toolCalls: prev.toolCalls.map((t) => (t.id === parsed.id ? { ...t, output: parsed.output } : t)),
      }))
    } else if (event === 'done') {
      appendAssistant((prev) => ({ ...prev, streaming: false }))
    } else if (event === 'error') {
      appendAssistant((prev) => ({
        ...prev,
        text: prev.text + `\n\n_${parsed.message}_`,
        streaming: false,
      }))
    }
  }

  if (!COPILOT_ENABLED) return null

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Forward Copilot' : 'Open Forward Copilot'}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-4 py-3 shadow-2xl transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          background: INK,
          color: CREAM,
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.35)',
        }}
      >
        <Sparkles size={16} style={{ color: CHAMPAGNE }} />
        <span className="text-sm font-medium tracking-tight">
          {open ? 'Close' : NAMES[role]}
        </span>
      </button>

      {/* Backdrop + drawer */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/20"
            aria-hidden
          />
          <aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col shadow-2xl"
            style={{ background: '#FFFFFF' }}
            role="dialog"
            aria-label={`${NAMES[role]} — Forward Copilot`}
          >
            {/* Header */}
            <header
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: CHAMPAGNE_LIGHT }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: `${CHAMPAGNE}20` }}
                >
                  <Sparkles size={14} style={{ color: CHAMPAGNE }} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: INK }}>
                    {NAMES[role]}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: CHAMPAGNE }}>
                    {dealContext ? `Re: ${dealContext.title}` : 'Forward Copilot'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </header>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-6">
              {messages.length === 0 ? (
                <Greeting role={role} onSuggest={send} dealContext={dealContext} />
              ) : (
                messages.map((m, i) => (
                  <MessageRow key={i} msg={m} />
                ))
              )}
            </div>

            {/* Composer */}
            <div className="border-t px-4 py-3" style={{ borderColor: '#EDEAE3', background: CREAM }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send(input)
                    }
                  }}
                  placeholder={`Ask ${NAMES[role]}…`}
                  rows={1}
                  className="flex-1 resize-none rounded-lg border bg-white px-3 py-2 text-[14px] leading-relaxed focus:outline-none focus:ring-1"
                  style={{ borderColor: CHAMPAGNE_LIGHT, color: INK }}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white disabled:opacity-40"
                  style={{ background: INK }}
                  aria-label="Send"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
              <p className="mt-2 text-[10px] leading-snug text-gray-500">
                Copilot uses your real Forward data. It never sends messages on your behalf.
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

function Greeting({
  role,
  onSuggest,
  dealContext,
}: {
  role: Role
  onSuggest: (t: string) => void
  dealContext?: DealContext
}) {
  if (dealContext) {
    const dealSuggestions =
      role === 'seller'
        ? [
            'What price band fits this listing against live comps?',
            'How is this listing performing — views, saves, inquiries?',
            'Draft this week\'s update for this listing.',
          ]
        : role === 'broker'
        ? [
            'Give me a top-10 buyer list for this deal.',
            'Is this deal stalling — what should I do next?',
            'Draft the client update for this listing.',
          ]
        : [
            'Brief me on this listing — signals, risks, and how it compares.',
            'Is this a good deal? Show me the comparables.',
            'Draft a first-touch inquiry for this listing.',
          ]
    return (
      <div>
        <p className="text-[14px] leading-relaxed" style={{ color: INK }}>
          {NAMES[role]} is scoped to <strong>{dealContext.title}</strong>. Ask about this listing directly — no need to name it.
        </p>
        <div className="mt-4 space-y-2">
          {dealSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSuggest(s)}
              className="block w-full rounded-lg border px-3 py-2 text-left text-[12.5px] leading-snug hover:bg-white"
              style={{ borderColor: CHAMPAGNE_LIGHT, color: '#4A4A4A' }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const buyerSuggestions = [
    'What are my saved searches watching right now?',
    'Show me the top 5 SaaS listings under $5M with disclosed motivation.',
    'What do comparables say for a healthcare business in USA with $3M revenue?',
  ]
  const sellerSuggestions = [
    'What price band should I list at?',
    'Grade my most recent inquiry.',
    'Draft a reply to the last buyer that asked about the data room.',
  ]
  const brokerSuggestions = [
    'Which of my client deals is stalling?',
    'Draft this week\'s client update for my top listing.',
    'Give me a top-10 buyer list for my newest deal.',
  ]
  const suggestions =
    role === 'seller' ? sellerSuggestions : role === 'broker' ? brokerSuggestions : buyerSuggestions

  return (
    <div>
      <p className="text-[14px] leading-relaxed" style={{ color: INK }}>
        {GREETING[role]}
      </p>
      <div className="mt-4 space-y-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="block w-full rounded-lg border px-3 py-2 text-left text-[12.5px] leading-snug hover:border-[color:var(--tw-champagne)] hover:bg-white"
            style={{ borderColor: CHAMPAGNE_LIGHT, color: '#4A4A4A' } as React.CSSProperties}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageRow({ msg }: { msg: ChatMsg }) {
  if (msg.kind === 'user') {
    return (
      <div className="mb-5 flex justify-end">
        <div
          className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-[14px] leading-relaxed"
          style={{ background: INK, color: CREAM }}
        >
          {msg.text}
        </div>
      </div>
    )
  }
  return (
    <div className="mb-6">
      {msg.toolCalls.length > 0 && (
        <div className="mb-2 space-y-1.5">
          {msg.toolCalls.map((t) => (
            <ToolChip key={t.id} call={t} />
          ))}
        </div>
      )}
      {(msg.text || msg.streaming) && (
        <div
          className="whitespace-pre-wrap text-[14px] leading-relaxed"
          style={{ color: INK }}
        >
          {msg.text}
          {msg.streaming && <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse" style={{ background: CHAMPAGNE }} />}
        </div>
      )}
    </div>
  )
}

function ToolChip({ call }: { call: ToolCall }) {
  const pending = call.output == null
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]"
      style={{
        borderColor: CHAMPAGNE_LIGHT,
        background: '#FAF6EF',
        color: '#5A4A2E',
      }}
    >
      {pending ? (
        <Loader2 size={10} className="animate-spin" />
      ) : (
        <Wrench size={10} style={{ color: CHAMPAGNE }} />
      )}
      <span className="font-medium tracking-tight">{humanize(call.name)}</span>
    </div>
  )
}

function humanize(name: string) {
  return name.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
}
