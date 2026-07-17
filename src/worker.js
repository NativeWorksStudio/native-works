/**
 * NativeWorks — Cloudflare Worker
 * Serves static assets and handles form submissions at POST /api/submit:
 *  1. Sends a branded confirmation email to the submitter (EN/IT/DA)
 *  2. Sends an internal notification with all form fields
 * Emails are sent via Resend (secret: RESEND_API_KEY).
 */

const FROM_ADDRESS   = "NativeWorks <hello@nativeworks.studio>";
const NOTIFY_TO      = ["antonio.visceglia@nativeworks.studio"];
const NOTIFY_CC      = ["info@nativeworks.studio", "paolo.anziano@nativeworks.studio", "jonas.karlberg@nativeworks.studio"];
const SITE_ORIGIN    = "https://www.nativeworks.studio";

/* ── Localized confirmation copy ─────────────────────────────────── */
const COPY = {
  en: {
    contact: {
      subject: "We've received your message — NativeWorks",
      heading: "Thank you for reaching out",
      body: "We've received your message and will get back to you shortly. In the meantime, feel free to explore what we're building.",
    },
    assessment: {
      subject: "Your assessment has been received — NativeWorks",
      heading: "Thank you for completing the assessment",
      body: "We've received your answers. Our team will review them and be in touch shortly with the next steps.",
    },
    footer: "This is an automated confirmation from NativeWorks.",
    cta: "Visit nativeworks.studio",
  },
  it: {
    contact: {
      subject: "Abbiamo ricevuto il tuo messaggio — NativeWorks",
      heading: "Grazie per averci contattato",
      body: "Abbiamo ricevuto il tuo messaggio e ti risponderemo a breve. Nel frattempo, sentiti libero di esplorare ciò che stiamo costruendo.",
    },
    assessment: {
      subject: "Abbiamo ricevuto il tuo assessment — NativeWorks",
      heading: "Grazie per aver completato l'assessment",
      body: "Abbiamo ricevuto le tue risposte. Il nostro team le esaminerà e ti contatterà a breve con i prossimi passi.",
    },
    footer: "Questa è una conferma automatica da NativeWorks.",
    cta: "Visita nativeworks.studio",
  },
  da: {
    contact: {
      subject: "Vi har modtaget din besked — NativeWorks",
      heading: "Tak for din henvendelse",
      body: "Vi har modtaget din besked og vender tilbage hurtigst muligt. I mellemtiden er du velkommen til at udforske, hvad vi bygger.",
    },
    assessment: {
      subject: "Vi har modtaget dit assessment — NativeWorks",
      heading: "Tak fordi du gennemførte assessmentet",
      body: "Vi har modtaget dine svar. Vores team gennemgår dem og kontakter dig snarest med de næste skridt.",
    },
    footer: "Dette er en automatisk bekræftelse fra NativeWorks.",
    cta: "Besøg nativeworks.studio",
  },
};

/* ── Email templates ─────────────────────────────────────────────── */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function confirmationHtml(lang, type, name) {
  const t = COPY[lang] || COPY.en;
  const c = t[type] || t.contact;
  const greeting = name ? `${escapeHtml(name)},` : "";
  return `<!DOCTYPE html>
<html lang="${lang}">
<body style="margin:0;padding:0;background-color:#F8F5EF;font-family:'DM Sans',-apple-system,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F5EF;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#FFFFFF;border:1px solid #D8D2C8;">
        <tr>
          <td style="background-color:#1A1712;padding:28px 40px;">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;letter-spacing:2px;color:#F4F0E8;">NATIVE&nbsp;WORKS</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 8px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:28px;color:#1A1712;">${c.heading}</h1>
            ${greeting ? `<p style="margin:0 0 16px;font-size:15px;color:#1A1712;">${greeting}</p>` : ""}
            <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#6B6860;">${c.body}</p>
            <a href="${SITE_ORIGIN}" style="display:inline-block;padding:12px 28px;background-color:#8E3B28;color:#F4F0E8;text-decoration:none;font-size:14px;letter-spacing:1px;">${t.cta}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #D8D2C8;">
            <p style="margin:0;font-size:12px;color:#A8A09A;">${t.footer}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notificationHtml(fields) {
  const rows = Object.entries(fields)
    .filter(([k, v]) => !k.startsWith("_") && String(v).trim() !== "")
    .map(([k, v]) => `<tr>
      <td style="padding:8px 12px;border:1px solid #D8D2C8;background:#F8F5EF;font-size:13px;color:#6B6860;vertical-align:top;white-space:nowrap;max-width:280px;overflow:hidden;">${escapeHtml(k)}</td>
      <td style="padding:8px 12px;border:1px solid #D8D2C8;font-size:13px;color:#1A1712;">${escapeHtml(v)}</td>
    </tr>`).join("\n");
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#FFFFFF;font-family:-apple-system,Helvetica,Arial,sans-serif;">
  <h2 style="font-size:16px;color:#1A1712;">New submission — nativeworks.studio</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">${rows}</table>
</body></html>`;
}

/* ── Resend ──────────────────────────────────────────────────────── */
async function sendEmail(env, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
  }
  return res.ok;
}

/* ── Submission handler ──────────────────────────────────────────── */
async function handleSubmit(request, env, url) {
  let fields = {};
  try {
    const formData = await request.formData();
    for (const [k, v] of formData.entries()) fields[k] = v;
  } catch (e) {
    return new Response("Bad request", { status: 400 });
  }

  const lang     = ["en", "it", "da"].includes(fields.lang) ? fields.lang : "en";
  const type     = fields.form_type === "assessment" ? "assessment" : "contact";
  const email    = (fields.email || "").trim();
  const name     = (fields.name || "").trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const t        = COPY[lang] || COPY.en;
  const c        = t[type];

  const jobs = [];

  // 1. Internal notification
  jobs.push(sendEmail(env, {
    from: FROM_ADDRESS,
    to: NOTIFY_TO,
    cc: NOTIFY_CC,
    reply_to: validEmail ? email : undefined,
    subject: fields._subject || `New ${type} submission — NativeWorks`,
    html: notificationHtml(fields),
  }));

  // 2. Confirmation to submitter
  if (validEmail) {
    jobs.push(sendEmail(env, {
      from: FROM_ADDRESS,
      to: [email],
      subject: c.subject,
      html: confirmationHtml(lang, type, name),
    }));
  }

  // Emails must not block or break the user's redirect
  try {
    await Promise.allSettled(jobs);
  } catch (e) {
    console.error("Email dispatch failed:", e);
  }

  // Safe redirect: only same-origin paths or nativeworks.studio URLs
  let next = fields._next || (lang === "en" ? "/thank-you.html" : `/${lang}/thank-you.html`);
  try {
    const target = new URL(next, url.origin);
    const allowedHosts = [url.hostname, "www.nativeworks.studio", "nativeworks.studio"];
    if (!allowedHosts.includes(target.hostname)) throw new Error("disallowed host");
    next = target.href;
  } catch {
    next = new URL("/thank-you.html", url.origin).href;
  }
  return Response.redirect(next, 303);
}

/* ── Entry point ─────────────────────────────────────────────────── */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/submit") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }
      return handleSubmit(request, env, url);
    }
    return env.ASSETS.fetch(request);
  },
};
