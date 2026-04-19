export default function ContactConfirmation({ name }) {
  return `
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
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}