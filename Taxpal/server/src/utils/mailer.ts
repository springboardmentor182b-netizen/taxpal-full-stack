// server/src/utils/mailer.ts
import nodemailer from 'nodemailer';

type Transport = nodemailer.Transporter | null;

let transporter: Transport = null;

function buildTransport(): Transport {
  // DEV fallback: if neither SMTP nor Gmail creds exist, return null (we'll log links)
  const hasSMTP = !!process.env.SMTP_HOST;
  const hasGmail = !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASS;

  if (!hasSMTP && !hasGmail) return null;

  // MAILTRAP / any SMTP (recommended for dev & QA)
  if (hasSMTP) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,               // e.g. sandbox.smtp.mailtrap.io
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });
  }

  // GMAIL (requires 2FA + App Password)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASS!,         // 16-char app password
    },
  });
}

transporter = buildTransport();

/**
 * Send password reset email.
 * In DEV (no SMTP/Gmail configured) it logs the reset URL instead of throwing.
 */
export async function sendResetEmail(to: string, resetUrl: string) {
  // DEV: no transport → log to console
  if (!transporter) {
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
    <p><a href="${resetUrl}">Click here to reset</a></p>
    <p>This link expires in 30 minutes.</p>
  `;
  const text = `Reset your password: ${resetUrl} (expires in 30 minutes)`;

  const info = await transporter.sendMail({ from, to, subject, text, html });
  console.log('[mailer] sent reset email:', info.messageId);
}

/** Verify transport on boot so you know if mail can send */
export async function verifyMailer() {
  if (!transporter) {
    console.log('[mailer] DEV mode: no SMTP configured — reset links will be logged to console.');
    return;
  }
  try {
    await transporter.verify();
    console.log('[mailer] transport verified and ready.');
  } catch (e: any) {
    console.warn('[mailer] transport verification failed:', e?.message || e);
  }
}
