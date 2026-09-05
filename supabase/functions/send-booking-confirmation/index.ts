// Supabase Edge Function — send booking confirmation emails via Resend.
// Deploy: supabase functions deploy send-booking-confirmation
//
// SECURITY: this function only ever accepts an appointment_id. All customer
// and service data is read server-side with the service role key — the
// caller can no longer supply arbitrary names/emails/content to be sent
// from the business's verified domain.
//
// Required Supabase secrets (set with `supabase secrets set KEY=value`):
//   RESEND_API_KEY            — your Resend API key (https://resend.com)
//   ADMIN_NOTIFICATION_EMAIL  — address that receives new-booking alerts
//   FROM_EMAIL                — verified sender address in Resend (e.g. noreply@yourdomain.com)
//   BUSINESS_NAME             — displayed in email subject / header (default: RepaTek)
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by
// the Edge Function runtime — do not set them manually.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') ?? ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'noreply@repatek.fr'
const BUSINESS_NAME = Deno.env.get('BUSINESS_NAME') ?? 'RepaTek'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestPayload {
  appointment_id: string
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle browser preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY secret is not set')
      return json({ error: 'Email service not configured' }, 500)
    }

    const { appointment_id }: RequestPayload = await req.json()
    if (!appointment_id) {
      return json({ error: 'appointment_id is required' }, 400)
    }

    const { data: appointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('full_name, email, phone, notes, appointment_date, start_time, end_time, services(name)')
      .eq('id', appointment_id)
      .maybeSingle()

    if (fetchError) {
      console.error('Failed to fetch appointment:', fetchError)
      return json({ error: 'Internal error' }, 500)
    }
    if (!appointment) {
      return json({ error: 'Appointment not found' }, 404)
    }

    const customerName = appointment.full_name
    const customerEmail = appointment.email
    const customerPhone = appointment.phone
    const serviceName = (appointment.services as { name: string } | null)?.name ?? 'Service'
    const notes = appointment.notes as string | null

    const formattedDate = formatDate(appointment.appointment_date)
    const formattedTime = `${formatTime(appointment.start_time)} – ${formatTime(appointment.end_time)}`

    const tasks: Promise<unknown>[] = [
      sendEmail({
        from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
        to: customerEmail,
        subject: `Confirmation de rendez-vous — ${serviceName}`,
        html: buildCustomerEmail({ customerName, serviceName, formattedDate, formattedTime, notes }),
        reply_to: ADMIN_EMAIL || undefined,
      }),
    ]

    if (ADMIN_EMAIL) {
      tasks.push(
        sendEmail({
          from: `${BUSINESS_NAME} <${FROM_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: `Nouvelle demande — ${customerName} · ${serviceName}`,
          html: buildAdminEmail({ customerName, customerEmail, customerPhone, serviceName, formattedDate, formattedTime, notes }),
        }),
      )
    }

    const results = await Promise.allSettled(tasks)
    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length) {
      failures.forEach((f) => console.error('Email send failed:', f))
    }

    return json({ success: true, sent: results.length - failures.length })
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

async function sendEmail({ from, to, subject, html, reply_to }: { from: string; to: string; subject: string; html: string; reply_to?: string }) {
  const payload: Record<string, string> = { from, to, subject, html }
  if (reply_to) payload.reply_to = reply_to
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

// ── Email templates ────────────────────────────────────────────────────────

function baseWrapper(title: string, bodyContent: string): string {
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#04070d;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#0c121f;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
    <div style="background:linear-gradient(135deg,#2f6fed,#22d3ee);padding:28px 32px;">
      <p style="margin:0;color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">${BUSINESS_NAME}</p>
      <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;line-height:1.3;">${title}</h1>
    </div>
    <div style="padding:28px 32px;">
      ${bodyContent}
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.08);padding:16px 32px;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,0.3);font-size:11px;">&copy; ${year} ${BUSINESS_NAME}. Tous droits réservés.</p>
    </div>
  </div>
</body>
</html>`
}

function detailRow(label: string, value: string, topBorder = false): string {
  const border = topBorder ? 'border-top:1px solid rgba(255,255,255,0.06);margin-top:8px;padding-top:8px;' : ''
  return `<tr>
    <td style="padding:5px 12px 5px 0;color:rgba(255,255,255,0.45);font-size:13px;white-space:nowrap;vertical-align:top;${border}">${label}</td>
    <td style="padding:5px 0;color:#e8edf7;font-size:13px;font-weight:600;${border}">${value}</td>
  </tr>`
}

function buildCustomerEmail(p: {
  customerName: string
  serviceName: string
  formattedDate: string
  formattedTime: string
  notes: string | null
}): string {
  const safeName = escHtml(p.customerName)
  const firstName = safeName.split(' ')[0] ?? safeName
  const notesRow = p.notes ? detailRow('Remarques', escHtml(p.notes), true) : ''

  return baseWrapper(
    'Votre rendez-vous a bien été reçu',
    `<p style="margin:0 0 20px;color:rgba(255,255,255,0.8);font-size:15px;">Bonjour <strong>${firstName}</strong>,</p>
    <p style="margin:0 0 24px;color:rgba(255,255,255,0.6);line-height:1.65;font-size:14px;">
      Nous avons bien reçu votre demande. Un membre de notre équipe vous contactera prochainement
      pour confirmer votre créneau.
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
    <div style="margin:20px 0 0;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.25);border-radius:8px;padding:12px 16px;">
      <p style="margin:0;color:#f59e0b;font-size:13px;">⏳ Statut : <strong>En attente de confirmation</strong></p>
    </div>
    <p style="margin:24px 0 0;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;">
      Des questions ? Répondez à cet e-mail — notre équipe vous contactera rapidement.
    </p>`,
  )
}

function buildAdminEmail(p: {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  formattedDate: string
  formattedTime: string
  notes: string | null
}): string {
  const notesRow = p.notes ? detailRow('Remarques', escHtml(p.notes), true) : ''

  return baseWrapper(
    'Nouvelle demande de rendez-vous',
    `<p style="margin:0 0 20px;color:rgba(255,255,255,0.6);font-size:14px;line-height:1.65;">
      Une nouvelle demande vient d'être soumise via le site. Connectez-vous au tableau de bord
      pour la confirmer ou la traiter.
    </p>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px 20px 12px;">
      <p style="margin:0 0 14px;font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Informations client &amp; rendez-vous</p>
      <table style="width:100%;border-collapse:collapse;">
        ${detailRow('Nom', escHtml(p.customerName))}
        ${detailRow('E-mail', escHtml(p.customerEmail))}
        ${detailRow('Téléphone', escHtml(p.customerPhone))}
        ${detailRow('Service', escHtml(p.serviceName), true)}
        ${detailRow('Date', p.formattedDate)}
        ${detailRow('Heure', p.formattedTime)}
        ${notesRow}
      </table>
    </div>`,
  )
}
