# Portfolio Pro

A clean, modern personal portfolio website built with React, Vite, and Tailwind CSS. This static site features a hero section, about paragraph, project showcase, and a secure contact form powered by Resend and Vercel serverless functions.

## Features

- **Hero Section**: Prominent display of name and role with smooth scroll-in animation
- **About Section**: Descriptive paragraph highlighting skills and experience
- **Project Showcase**: Responsive grid of 3 featured projects with hover effects
- **Contact Form**: Secure form with:
  - Client-side validation
  - Honeypot spam protection
  - Rate limiting via Upstash Redis
  - Email delivery through Resend
  - Success/error feedback with toast notifications
- **Performance Optimized**: 
  - Lighthouse score >90
  - Zero external JavaScript (except PostHog and Sentry)
  - Critical CSS inlined
  - Font preconnect
- **Accessibility**: Full a11y support with proper ARIA labels and keyboard navigation
- **Responsive Design**: Mobile-first approach with perfect rendering on all devices

## Tech Stack

**Frontend**
- React 18 + Vite
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

**Backend**
- Vercel Serverless Functions
- Resend (email delivery)
- Upstash Redis (rate limiting)
- Sentry (error monitoring)
- PostHog (analytics)

**Security**
- Honeypot pattern for spam prevention
- Input validation and sanitization
- Upstash rate limiting (10 requests per 10 minutes per IP)
- Environment variable protection

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn
- Vercel account
- Resend account

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio-pro.git
cd portfolio-pro

# Install dependencies
npm install

# Create .env file
cp .env.example .env.local

# Add your environment variables to .env.local
# RESEND_API_KEY=your_api_key
# OWNER_EMAIL=your_email@domain.com

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_POSTHOG_KEY=your_posthog_key
VITE_SENTRY_DSN=your_sentry_dsn
```

For production, set these in Vercel dashboard (Settings → Environment Variables):

```env
RESEND_API_KEY=your_api_key
OWNER_EMAIL=your_email@domain.com
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

**Note**: `RESEND_API_KEY` should NEVER be exposed client-side. It's only used in serverless functions.

## Usage

The site is designed as a single-page application with a vertical scroll layout:

1. **Hero Section**: Displays your name and professional title
2. **About Section**: Share your background, skills, and experience
3. **Projects Section**: Showcase 3 featured projects with titles and descriptions
4. **Contact Section**: Visitors can send you messages through the form

To customize the content, edit `src/App.tsx`:

```typescript
// Update your personal information
const projects = [
  {
    title: 'Your Project Title',
    description: 'Detailed description of your project and technologies used.',
  },
  // ... more projects
];
```

## API Endpoints

### POST /api/contact

Handles contact form submissions and sends emails via Resend.

**Request**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to work together!",
  "bot-field": "" // honeypot field
}
```

**Response Codes**
- `200`: Success - message sent
- `400`: Bad Request - validation error
- `405`: Method Not Allowed - only POST accepted
- `500`: Internal Server Error - email sending failed

**Example Request**
```bash
curl -X POST https://portfolio-pro.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Great portfolio! Let's connect."
  }'
```

## Folder Structure

```
portfolio-pro/
├── api/
│   └── contact.ts            # Serverless function for email handling
├── public/                   # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utility functions and API clients
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── styles.css                # Tailwind customizations
├── index.html                # HTML template with critical CSS
└── vite.config.ts            # Vite configuration
```

## Deployment

Deployed exclusively on Vercel:

```bash
# Deploy to Vercel
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Security Notes

1. **Rate Limiting**: Implemented via Upstash Redis with a sliding window of 10 requests per 10 minutes per IP address
2. **Honeypot**: Hidden form field detects and silently rejects bot submissions
3. **Input Validation**: Server-side validation of all form fields
4. **Sanitization**: HTML escaping to prevent XSS attacks
5. **Error Handling**: Generic error messages to avoid information disclosure

**Fail-Open Policy**: If rate limiting service is unavailable, the form will still accept submissions to ensure availability.

## Monitoring

- **Error Tracking**: Sentry captures all serverless function errors
- **Analytics**: PostHog tracks form submissions and user interactions
- **Email Logs**: Resend dashboard provides delivery status and open tracking
- **Vercel Logs**: Full serverless function logging and monitoring

## Email Setup

See [EMAIL_SETUP.md](EMAIL_SETUP.md) for detailed instructions on configuring Resend and setting up your sending domain.

## License

MIT License