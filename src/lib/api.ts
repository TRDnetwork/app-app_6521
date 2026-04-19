export const sendContactForm = async (data: {
  name: string;
  email: string;
  message: string;
  'bot-field'?: string;
}) => {
  // Honeypot check
  if (data['bot-field'] && data['bot-field'].trim() !== '') {
    throw new Error('Bot submission detected');
  }

  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to send message');
  }

  return response.json();
};