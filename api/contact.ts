import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, 'bot-field': botField } = req.body;

  // Honeypot check
  if (botField) {
    return res.status(200).json({ success: true }); // Silent success to fool bots
  }

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  try {
    // Send notification to site owner
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.OWNER_EMAIL || 'contact@portfolio-pro.dev',
      subject: `New message from ${name} via Portfolio Pro`,
      html: await renderContactNotification({ name, email, message }),
    });

    // Optionally send confirmation to user
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Thanks for reaching out!',
      html: await renderContactConfirmation({ name }),
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
}

async function renderContactNotification({ name, email, message }: { name: string; email: string; message: string }) {
  const html = `
    <div style="font-family: 'Satoshi', sans-serif; color: #1a2e1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5; border: 1px solid #e9e5dd; border-radius: 8px;">
      <h2 style="font-family: 'Fraunces', serif; color: #1a2e1a; font-size: 1.5rem; margin-bottom: 8px;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #e66000;">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 3px solid #e66000; padding-left: 12px; margin: 16px 0; color: #4a4a4a;">${escapeHtml(
        message
      )}</blockquote>
      <hr style="border: 1px solid #e9e5dd; margin: 24px 0;" />
      <p style="color: #4a4a4a; font-size: 0.875rem;">This message was sent via the Portfolio Pro contact form.</p>
    </div>
  `;
  return html;
}

async function renderContactConfirmation({ name }: { name: string }) {
  const html = `
    <div style="font-family: 'Satoshi', sans-serif; color: #1a2e1a; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5; border: 1px solid #e9e5dd; border-radius: 8px;">
      <h2 style="font-family: 'Fraunces', serif; color: #1a2e1a; font-size: 1.5rem;">Hi ${escapeHtml(
        name
      )}, thanks for reaching out!</h2>
      <p>I've received your message and will get back to you as soon as possible.</p>
      <p>In the meantime, feel free to explore more of my work at <a href="https://portfolio-pro.dev" style="color: #e66000;">portfolio-pro.dev</a>.</p>
      <hr style="border: 1px solid #e9e5dd; margin: 24px 0;" />
      <p style="color: #4a4a4a; font-size: 0.875rem;">This is an automated confirmation email from Portfolio Pro.</p>
    </div>
  `;
  return html;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Mock document for SSR — only used in escapeHtml
// In production, you can use a library like 'isomorphic-dompurify' for stronger sanitization
if (typeof document === 'undefined') {
  (global as any).document = {
    createElement: () => ({
      textContent: '',
      innerHTML: '',
    }),
  };
}