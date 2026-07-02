/**
 * POST /api/copilot/chat
 *
 * Streaming chat endpoint for the Forward Copilot. Runs a tool-use loop
 * against Claude Sonnet 4.6 with role-scoped tools (buyer / seller / broker).
 * Emits Server-Sent Events (SSE) so the drawer UI can render text as it
 * streams and show tool-call chips as they land.
 *
 * SSE event types emitted:
 *   text        { delta: string }             — model text chunk
 *   tool_use    { id, name, input }           — model requested a tool
 *   tool_result { id, name, output }          — server executed the tool
 *   done        {}                            — final assistant turn ended
 *   error       { message }                   — anything that goes wrong
 *
 * Guardrails:
 *   - Session required. Role in body must match session role (except ADMIN).
 *   - Max 8 tool-use iterations per request (loop-blowup backstop).
 *   - No tool ever performs a side-effectful action (send email, publish,
 *     charge). Draft tools return prepared content only.
 */
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSession } from '@/lib/auth'
import { getToolsForRole, invokeTool, toAnthropicToolDefs, type ToolCtx } from '@/lib/copilot/tools'
import { systemPromptFor } from '@/lib/copilot/system-prompts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MODEL = process.env.COPILOT_MODEL || 'claude-sonnet-4-6'
const MAX_TOOL_ITERATIONS = 8

type IncomingMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return json({ error: 'Sign in required.' }, 401)

  if (!process.env.ANTHROPIC_API_KEY) {
    return json(
      { error: 'Copilot not configured. Set ANTHROPIC_API_KEY in the environment.' },
      503,
    )
  }

  const body = (await req.json().catch(() => null)) as
    | {
        role?: 'buyer' | 'seller' | 'broker'
        messages?: IncomingMessage[]
        dealContext?: { dealId: string; title: string }
      }
    | null
  if (!body?.messages?.length) return json({ error: 'Missing messages.' }, 400)

  const role = body.role ?? inferRoleFromSession(session.role)
  if (role !== inferRoleFromSession(session.role) && session.role !== 'ADMIN') {
    return json({ error: 'Role mismatch.' }, 403)
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const tools = getToolsForRole(role)
  const toolDefs = toAnthropicToolDefs(tools)
  const ctx: ToolCtx = { userId: session.userId, role: session.role as ToolCtx['role'] }

  let system = systemPromptFor(role)
  if (body.dealContext?.dealId) {
    system += `\n\nThe user is currently viewing listing ${body.dealContext.dealId} ("${body.dealContext.title}"). If they say "this listing", "this deal", or use a pronoun without naming a listing, assume they mean this one — call get_listing with dealId "${body.dealContext.dealId}" first before answering.`
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        )
      }

      // Convert incoming user/assistant text turns into Anthropic content-block form.
      const messages: Anthropic.MessageParam[] = body.messages!.map((m) => ({
        role: m.role,
        content: [{ type: 'text' as const, text: m.content }],
      }))

      try {
        for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
          const assistantBlocks: Anthropic.ContentBlockParam[] = []
          let stopReason: string | null = null

          // Stream one assistant turn. Text gets forwarded; tool_use blocks
          // get collected so we can execute them after the turn ends.
          const modelStream = client.messages.stream({
            model: MODEL,
            max_tokens: 2048,
            system,
            tools: toolDefs as any,
            messages,
          })

          modelStream.on('text', (delta) => send('text', { delta }))

          const finalMsg = await modelStream.finalMessage()
          stopReason = finalMsg.stop_reason

          for (const block of finalMsg.content) {
            if (block.type === 'text') {
              assistantBlocks.push({ type: 'text', text: block.text })
            } else if (block.type === 'tool_use') {
              send('tool_use', { id: block.id, name: block.name, input: block.input })
              assistantBlocks.push({
                type: 'tool_use',
                id: block.id,
                name: block.name,
                input: block.input,
              })
            }
          }

          messages.push({ role: 'assistant', content: assistantBlocks })

          if (stopReason !== 'tool_use') {
            send('done', {})
            controller.close()
            return
          }

          // Execute every tool_use block from this turn.
          const toolResults: Anthropic.ToolResultBlockParam[] = []
          for (const block of assistantBlocks) {
            if (block.type !== 'tool_use') continue
            const output = await invokeTool(block.name, block.input, ctx)
            send('tool_result', { id: block.id, name: block.name, output })
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(output, bigIntSafe),
            })
          }
          messages.push({ role: 'user', content: toolResults })
        }

        // Hit the loop cap without a natural stop — end cleanly with a note.
        send('error', {
          message: `Copilot ran ${MAX_TOOL_ITERATIONS} tool iterations without settling — ending turn.`,
        })
        controller.close()
      } catch (err: any) {
        send('error', { message: err?.message ?? 'Copilot error.' })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function inferRoleFromSession(role: string): 'buyer' | 'seller' | 'broker' {
  if (role === 'SELLER') return 'seller'
  if (role === 'BROKER') return 'broker'
  return 'buyer'
}

// BigInts appear in nested Deal fields we didn't convert. Keep JSON.stringify safe.
function bigIntSafe(_key: string, value: unknown) {
  return typeof value === 'bigint' ? Number(value) : value
}
