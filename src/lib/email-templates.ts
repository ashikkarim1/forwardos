/**
 * Forward Intelligence — email template kit.
 *
 * Modern brand styling (matches the product: clean white, ink #1A1A1A,
 * Forward blue #3B82F6 accent, system sans). Layout rules are mobile-first:
 * single-column cards, full-width CTA buttons that cannot wrap, no
 * multi-column <td> rows (iOS Mail collapses those to ~80px columns).
 *
 * Personalization: pass `greetingName` and every email opens "Hi {name},".
 * Inline styles only — Gmail strips <style> blocks.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`
const INK = '#1A1A1A'
const MUTED = '#717171'
const FAINT = '#9A9A9A'
const BLUE = '#3B82F6'
const BORDER = '#E5E7EB'
const BG = '#F4F6F8'

/** Wrap any inner HTML in the brand shell — masthead, frame, footer. */
export function luxuryEmail(opts: {
  preheader?: string
  eyebrow?: string
  title: string
  /** First name for the "Hi {name}," greeting. Omit → no greeting line. */
  greetingName?: string
  intro?: string
  innerHtml: string
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  footerNote?: string
}): string {
  const { preheader = '', eyebrow, title, greetingName, intro, innerHtml, cta, secondaryCta, footerNote } = opts
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT};color:${INK}">
  ${preheader ? `<div style="display:none;font-size:1px;color:${BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escape(preheader)}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG}">
    <tr><td align="center" style="padding:28px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid ${BORDER};border-radius:12px">
        <!-- Masthead -->
        <tr><td style="padding:28px 36px 0;text-align:left">
          <div style="font-family:${FONT};font-size:16px;font-weight:800;color:${INK};letter-spacing:-0.01em">Forward <span style="color:${BLUE}">Intelligence</span></div>
        </td></tr>

        <!-- Eyebrow + headline + greeting -->
        <tr><td style="padding:26px 36px 0">
          ${eyebrow ? `<p style="margin:0 0 10px;font-family:${FONT};font-size:11px;letter-spacing:0.18em;color:${BLUE};text-transform:uppercase;font-weight:800">${escape(eyebrow)}</p>` : ''}
          <h1 style="margin:0 0 14px;font-family:${FONT};font-size:26px;line-height:1.25;color:${INK};font-weight:800;letter-spacing:-0.015em">${escape(title)}</h1>
          ${greetingName ? `<p style="margin:0 0 8px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};font-weight:600">Hi ${escape(greetingName)},</p>` : ''}
          ${intro ? `<p style="margin:0 0 8px;font-family:${FONT};font-size:14px;line-height:1.65;color:${MUTED}">${escape(intro)}</p>` : ''}
        </td></tr>

        <!-- Inner content -->
        <tr><td style="padding:20px 36px 0">
          ${innerHtml}
        </td></tr>

        <!-- CTAs -->
        ${cta ? `
        <tr><td style="padding:26px 36px 6px">
          <a href="${cta.href}" style="display:block;background:${BLUE};color:#FFFFFF !important;font-family:${FONT};font-size:14px;font-weight:800;text-decoration:none;text-align:center;padding:15px 24px;border-radius:8px">
            <span style="color:#FFFFFF">${escape(cta.label)}</span>
          </a>
        </td></tr>` : ''}
        ${secondaryCta ? `
        <tr><td style="padding:6px 36px 20px;text-align:center">
          <a href="${secondaryCta.href}" style="font-family:${FONT};font-size:12px;color:${MUTED};text-decoration:underline">${escape(secondaryCta.label)}</a>
        </td></tr>` : ''}

        <!-- Footer -->
        <tr><td style="padding:26px 36px 28px;border-top:1px solid ${BORDER}">
          <p style="margin:0 0 6px;font-family:${FONT};font-size:12px;color:${MUTED};font-weight:600">Forward Intelligence — Curated business opportunities · USA · Canada · UAE</p>
          ${footerNote ? `<p style="margin:10px 0 0;font-family:${FONT};font-size:11px;color:${FAINT};line-height:1.6">${escape(footerNote)}</p>` : ''}
          <p style="margin:10px 0 0;font-family:${FONT};font-size:11px;color:${FAINT}">© 2026 Forward Intelligence · <a href="${SITE}" style="color:${FAINT};text-decoration:underline">forwardos.ai</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/**
 * Render a single confidential listing as an inner email block.
 *
 * Layout is single-column by design — every label / value pair is a separate
 * line so iOS Mail can't shred the layout into vertical-letter stacks. The
 * CTA is a full-width button, not an inline link.
 */
export function listingBlock(opts: {
  industryLabel: string
  region: string
  askingRange: string
  heatScore?: number | null
  qualityScore?: number | null
  href: string
}): string {
  const { industryLabel, region, askingRange, heatScore, qualityScore, href } = opts
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BORDER};border-radius:12px;margin:0 0 16px;background:#FFFFFF">
      <tr><td style="padding:20px 22px">
        <!-- eyebrow -->
        <div style="font-family:${FONT};font-size:10px;letter-spacing:0.18em;color:${BLUE};text-transform:uppercase;font-weight:800;margin:0 0 6px">Confidential Listing</div>
        <!-- headline -->
        <div style="font-family:${FONT};font-size:19px;line-height:1.3;color:${INK};font-weight:800;letter-spacing:-0.01em;margin:0 0 12px">${escape(industryLabel)} Business</div>

        <!-- key-value pairs, single column -->
        <div style="font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED}">
          <div style="margin:0 0 5px"><span style="color:${FAINT};display:inline-block;width:96px">Region</span><strong style="color:${INK}">${escape(region)}</strong></div>
          <div style="margin:0 0 5px"><span style="color:${FAINT};display:inline-block;width:96px">Asking</span><strong style="color:${INK}">${escape(askingRange)}</strong></div>
          ${heatScore != null ? `<div style="margin:0 0 5px"><span style="color:${FAINT};display:inline-block;width:96px">Forward score</span><strong style="color:${INK}">🔥 ${heatScore}</strong></div>` : ''}
          ${qualityScore != null ? `<div style="margin:0 0 5px"><span style="color:${FAINT};display:inline-block;width:96px">Quality</span><strong style="color:${INK}">${qualityScore}/100</strong></div>` : ''}
        </div>

        <!-- full-width CTA — no chance of breaking onto multiple lines -->
        <div style="margin:16px 0 0">
          <a href="${href}" style="display:block;background:${INK};color:#FFFFFF !important;font-family:${FONT};font-size:13px;font-weight:800;text-decoration:none;text-align:center;padding:13px 20px;border-radius:8px">
            <span style="color:#FFFFFF">View on Forward&nbsp;→</span>
          </a>
        </div>
      </td></tr>
    </table>`
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
