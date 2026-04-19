# 📨 Portfolio Pro Email Setup Guide

This guide walks you through setting up transactional emails for your portfolio site using Resend and Vercel.

---

## 1. Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com) and sign up or log in.
2. Navigate to **API Keys** and create a new API key.
3. Copy the key (it will look like `re_12345678-...`).

> 🔐 Never commit this key to version control.

---

## 2. Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to **Settings > Environment Variables**.
2. Add the following variables:

| Key               | Value                        |
|-------------------|------------------------------|
| `RESEND_API_KEY`  | `re_12345678-...` (your key) |
| `OWNER_EMAIL`     | `you@yourdomain.com`         |

> ⚠️ Do NOT use `VITE_RESEND_API_KEY` — that would expose the key to the browser. Only serverless functions can access `RESEND_API_KEY`.

---

## 3. Verify Your Sending Domain

1. In Resend Dashboard, go to **Domains**.
2. Click **Add Domain** and enter your domain (e.g., `portfolio-pro.dev`).
3. Add the DNS records (TXT and CNAME) to your domain provider.
4. Wait for verification (usually a few minutes).

✅ Until verified, emails will be sent from `onboarding@resend.dev` with a warning banner.

---

## 4. Frontend Integration (Already Done)

The contact form in your app already sends data via:

```ts
fetch('/api/contact', {
  method: 'POST',
  body: JSON.stringify({ name, email, message }),
});
```

No client-side email logic is used — everything is handled securely server-side.

---

## 5. Test the Contact Form

1. Deploy your site or run locally with Vercel CLI.
2. Fill out the contact form.
3. Check:
   - You receive the message at `OWNER_EMAIL`
   - The user gets a confirmation email
   - No errors in Vercel logs (`vc logs`)

---

## 6. Monitor & Debug

- View email logs: [https://resend.com/emails](https://resend.com/emails)
- Check Vercel serverless function logs: `vc logs`
- If emails fail, ensure:
  - `RESEND_API_KEY` is correct
  - Domain is verified
  - No typos in email addresses

---

✅ You're all set! Your portfolio now securely handles contact form submissions with professional emails.