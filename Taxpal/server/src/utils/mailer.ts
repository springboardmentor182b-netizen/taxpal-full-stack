// server/src/utils/mailer.ts
import nodemailer from 'nodemailer';

type Transport = nodemailer.Transporter | null;
let transporter: Transport = null;

/** Parse boolean-ish env values */
function envBool(v: string | undefined, fallback = false): boolean {
  if (v === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

/** Build a transporter from env (SMTP preferred; Gmail app password supported) */
function buildTransport(): Transport {
  const hasSMTP =
    !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
  const hasGmail = !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASS;

  if (!hasSMTP && !hasGmail) return null;

  if (hasSMTP) {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = envBool(process.env.SMTP_SECURE, port === 465); // SSL if 465
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,           // e.g. smtp.ethereal.email / sandbox.smtp.mailtrap.io
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
      // tls: { rejectUnauthorized: true }, // enable/adjust if needed for corp SMTP
    });
  }

  // Gmail (requires 2FA + App Password)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASS!, // 16-char app password
    },
  });
}

/** Lazy-init so .env is loaded before we read it */
function getTransport(): Transport {
  if (transporter) return transporter;
  transporter = buildTransport();
  return transporter;
}

/**
 * Send password reset email.
 * If no SMTP/Gmail configured, logs the reset URL (dev mode).
 */
export async function sendResetEmail(to: string, resetUrl: string): Promise<void> {
  const t = getTransport();

  // DEV fallback: just log the link
  if (!t) {
    console.log(`[DEV][sendResetEmail] No SMTP configured. Reset URL for ${to}: ${resetUrl}`);
    return;
  }

  const from =
    process.env.MAIL_FROM ||
    process.env.SMTP_FROM ||
    process.env.GMAIL_USER ||
    'no-reply@taxpal.local';

  const subject = 'Reset your TaxPal password';
  const html = `
    <p>We received a request to reset your password.</p>
    <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none">Reset password</a></p>
    <p>Or copy this link into your browser:<br>${resetUrl}</p>
    <p><small>This link expires in 30 minutes. If you didn’t request this, you can ignore this email.</small></p>
  `;
  const text = `Reset your password: ${resetUrl} (expires in 30 minutes)`;

  try {
    const info = await t.sendMail({ from, to, subject, text, html });
    console.log('[mailer] sent reset email:', info.messageId);

    // Ethereal preview URL (works when using Ethereal SMTP/test accounts)
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log('[mailer] preview URL:', preview);
  } catch (err: any) {
    console.error('[mailer] sendResetEmail error:', err?.message || err);
  }
}

/** Verify transport on boot so you know if mail can send */
export async function verifyMailer(): Promise<void> {
  const t = getTransport();
  if (!t) {
    console.log('[mailer] DEV mode: no SMTP configured — reset links will be logged to console.');
    return;
  }
  try {
    await t.verify();
    console.log('[mailer] transport verified and ready.');
  } catch (e: any) {
    console.warn('[mailer] transport verification failed:', e?.message || e);
  }
}
