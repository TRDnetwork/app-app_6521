export default function ContactNotification({ name, email, message }) {
  return `
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
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}