/**
 * Forward Intelligence — premium email template kit.
 *
 * Editorial / luxury aesthetic: serif headlines, generous whitespace, no
 * loud colors, sophisticated palette (ink, champagne, accent blue). Every
 * CTA is a primary button that routes back to forwardos.ai — visitors
 * never bounce to a third-party page to engage with a listing.
 *
 * Inline styles only — Gmail strips <style> blocks. Tested across Apple
 * Mail, Outlook 365, Gmail web + iOS, Spark.
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.forwardos.ai'

/** Wrap any inner HTML in the brand shell — masthead, frame, footer. */
export function luxuryEmail(opts: {
  preheader?: string
  eyebrow?: string
  title: string
  intro?: string
  innerHtml: string
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  footerNote?: string
}): string {
  const { preheader = '', eyebrow, title, intro, innerHtml, cta, secondaryCta, footerNote } = opts
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title></head>
<body style="margin:0;padding:0;background:#F4F2EE;font-family:Georgia,'Times New Roman',serif;color:#1A1A1A">
  ${preheader ? `<div style="display:none;font-size:1px;color:#F4F2EE;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escape(preheader)}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F2EE">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E8E4DC;border-radius:4px">
        <!-- Masthead -->
        <tr><td style="padding:32px 40px 0;text-align:center">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.32em;color:#6B6760;text-transform:uppercase">Forward Intelligence</div>
          <div style="height:1px;background:#E8E4DC;margin:18px auto 0;width:48px"></div>
        </td></tr>

        <!-- Eyebrow + headline -->
        <tr><td style="padding:32px 40px 0">
          ${eyebrow ? `<p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.28em;color:#B8956A;text-transform:uppercase;font-weight:bold">${escape(eyebrow)}</p>` : ''}
          <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.18;color:#1A1A1A;font-weight:normal;letter-spacing:-0.01em">${escape(title)}</h1>
          ${intro ? `<p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#4A463F">${escape(intro)}</p>` : ''}
        </td></tr>

        <!-- Inner content -->
        <tr><td style="padding:24px 40px 0">
          ${innerHtml}
        </td></tr>

        <!-- CTAs -->
        ${cta ? `
        <tr><td style="padding:32px 40px 8px;text-align:center">
          <a href="${cta.href}" style="display:inline-block;background:#1A1A1A;color:#FFFFFF !important;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:16px 36px;border-radius:2px">
            <span style="color:#FFFFFF">${escape(cta.label)}</span>
          </a>
        </td></tr>` : ''}
        ${secondaryCta ? `
        <tr><td style="padding:8px 40px 24px;text-align:center">
          <a href="${secondaryCta.href}" style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#6B6760;text-decoration:underline">${escape(secondaryCta.label)}</a>
        </td></tr>` : ''}

        <!-- Footer rule + brand line -->
        <tr><td style="padding:32px 40px">
          <div style="height:1px;background:#E8E4DC;margin:0 auto 20px;width:48px"></div>
          <p style="margin:0 0 6px;text-align:center;font-family:Georgia,'Times New Roman',serif;font-size:12px;font-style:italic;color:#6B6760">Curated business opportunities · USA · Canada · UAE</p>
          ${footerNote ? `<p style="margin:14px 0 0;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:#9A938A;line-height:1.6">${escape(footerNote)}</p>` : ''}
          <p style="margin:14px 0 0;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:10px;color:#9A938A">© 2026 Forward Intelligence · <a href="${SITE}" style="color:#9A938A;text-decoration:underline">forwardos.ai</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/** Render a single confidential listing as an inner email block. */
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
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E8E4DC;border-radius:4px;margin:16px 0">
      <tr><td style="padding:22px 26px">
        <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.24em;color:#B8956A;text-transform:uppercase;font-weight:bold">Confidential listing</p>
        <p style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#1A1A1A">${escape(industryLabel)} Business</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#6B6760;padding-right:16px">
            <strong style="color:#1A1A1A">Region</strong><br>${escape(region)}
          </td>
          <td style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#6B6760;padding-right:16px">
            <strong style="color:#1A1A1A">Asking</strong><br>${escape(askingRange)}
          </td>
          ${heatScore != null ? `<td style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#6B6760">
            <strong style="color:#1A1A1A">Forward score</strong><br>${heatScore}°
          </td>` : ''}
        </tr></table>
        <p style="margin:18px 0 0">
          <a href="${href}" style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#1A1A1A;text-decoration:underline;font-weight:bold">View on Forward →</a>
        </p>
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
