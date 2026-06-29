// Supabase Edge Function — send appointment confirmed email via Resend.
// Deploy: supabase functions deploy send-appointment-confirmed
//
// Required Supabase secrets (same as send-booking-confirmation):
//   RESEND_API_KEY   — your Resend API key
//   FROM_EMAIL       — verified sender address in Resend
//   BUSINESS_NAME    — displayed in email header (default: RéparTech)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'noreply@repartech.com'
const BUSINESS_NAME = Deno.env.get('BUSINESS_NAME') ?? 'RéparTech'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConfirmPayload {
  customerName: string
  customerEmail: string
  serviceName: string
  appointmentDate: string  // YYYY-MM-DD
  startTime: string        // HH:MM:SS
  endTime: string          // HH:MM:SS
  notes: string | null
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY secret is not set')
      return json({ error: 'Email service not configured' }, 500)
    }

    const payload: ConfirmPayload = await req.json()
    const { customerName, customerEmail, serviceName, appointmentDate, startTime, endTime, notes } = payload

    const formattedDate = formatDate(appointmentDate)
    const formattedTime = `${formatTime(startTime)} – ${formatTime(endTime)}`

    await sendEmail({
      from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
      to: customerEmail,
      subject: `✅ Rendez-vous confirmé — ${serviceName}`,
      html: buildConfirmedEmail({ customerName, serviceName, formattedDate, formattedTime, notes }),
    })

    return json({ success: true })
  } catch (err) {
    console.error('Edge function error:', err)
    return json({ error: 'Internal error' }, 500)
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

async function sendEmail({ from, to, subject, html }: { from: string; to: string; subject: string; html: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${text}`)
  }
  return res.json()
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':')
  return `${h}h${m}`
}

function detailRow(label: string, value: string, topBorder = false): string {
  const border = topBorder ? 'border-top:1px solid rgba(255,255,255,0.06);margin-top:8px;padding-top:8px;' : ''
  return `<tr>
    <td style="padding:5px 12px 5px 0;color:rgba(255,255,255,0.45);font-size:13px;white-space:nowrap;vertical-align:top;${border}">${label}</td>
    <td style="padding:5px 0;color:#e8edf7;font-size:13px;font-weight:600;${border}">${value}</td>
  </tr>`
}

function buildConfirmedEmail(p: {
  customerName: string
  serviceName: string
  formattedDate: string
  formattedTime: string
  notes: string | null
}): string {
  const safeName = escHtml(p.customerName)
  const firstName = safeName.split(' ')[0] ?? safeName
  const notesRow = p.notes ? detailRow('Remarques', escHtml(p.notes), true) : ''
  const year = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#04070d;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#0c121f;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

    <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:28px 32px;">
      <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">${BUSINESS_NAME}</p>
      <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;line-height:1.3;">Votre rendez-vous est confirmé ✅</h1>
    </div>

    <div style="padding:28px 32px;">
      <p style="margin:0 0 20px;color:rgba(255,255,255,0.8);font-size:15px;">Bonjour <strong>${firstName}</strong>,</p>
      <p style="margin:0 0 24px;color:rgba(255,255,255,0.6);line-height:1.65;font-size:14px;">
        Bonne nouvelle ! Votre rendez-vous a été <strong style="color:#4ade80;">confirmé</strong> par notre équipe.
        Nous vous attendons à la date et à l'heure indiquées ci-dessous.
      </p>

      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px 20px 12px;">
        <p style="margin:0 0 14px;font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Détails du rendez-vous</p>
        <table style="width:100%;border-collapse:collapse;">
          ${detailRow('Service', escHtml(p.serviceName))}
          ${detailRow('Date', p.formattedDate)}
          ${detailRow('Heure', p.formattedTime)}
          ${notesRow}
        </table>
      </div>

      <div style="margin:20px 0 0;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.25);border-radius:8px;padding:12px 16px;">
        <p style="margin:0;color:#4ade80;font-size:13px;">✅ Statut : <strong>Confirmé</strong></p>
      </div>

      <p style="margin:24px 0 0;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;">
        Besoin d'annuler ou de modifier votre rendez-vous ? Contactez-nous dès que possible
        en répondant à cet e-mail.
      </p>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.08);padding:16px 32px;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,0.3);font-size:11px;">&copy; ${year} ${BUSINESS_NAME}. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`
}
