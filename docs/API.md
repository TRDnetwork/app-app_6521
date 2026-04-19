# Portfolio Pro API Documentation

## Overview

The Portfolio Pro API consists of a single serverless endpoint that handles contact form submissions. All functionality is contained within Vercel serverless functions, with no traditional backend server or database required.

## Base URL

```
https://portfolio-pro.dev/api
```

## Rate Limiting

All endpoints are protected by rate limiting:

- **Limit**: 10 requests per 10 minutes per IP address
- **Implementation**: Upstash Redis (sliding window)
- **Header**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Behavior**: Fail-open - if rate limiting service is unavailable, requests will still be processed

## Endpoint: Contact Form

### POST /contact

Handles contact form submissions and sends notification emails via Resend.

#### Request

**Headers**
```
Content-Type: application/json
```

**Body Parameters**

| Parameter | Type | Required | Description |
|---------|------|----------|-------------|
| `name` | string | Yes | Sender's full name |
| `email` | string | Yes | Sender's email address |
| `message` | string | Yes | Message content |
| `bot-field` | string | No | Honeypot field (should be empty) |

**Example Request**
```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "message": "I'm interested in your web development services.",
  "bot-field": ""
}
```

**cURL Example**
```bash
curl -X POST https://portfolio-pro.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "message": "I'm interested in your web development services.",
    "bot-field": ""
  }'
```

#### Response

**Success Response (200 OK)**
```json
{
  "success": true
}
```

**Error Responses**

`400 Bad Request` - Validation failed
```json
{
  "message": "Please fill in all required fields."
}
```

```json
{
  "message": "Please enter a valid email address."
}
```

`405 Method Not Allowed` - Invalid HTTP method
```json
{
  "message": "Method not allowed"
}
```

`500 Internal Server Error` - Server processing error
```json
{
  "message": "Failed to send message. Please try again later."
}
```

#### Email Notifications

Upon successful submission, two emails are sent:

1. **Notification to Site Owner**
   - **From**: `onboarding@resend.dev`
   - **To**: `OWNER_EMAIL` (from environment variables)
   - **Subject**: `New message from {name} via Portfolio Pro`
   - **Content**: Includes sender's name, email, and message

2. **Confirmation to Sender**
   - **From**: `onboarding@resend.dev`
   - **To**: Sender's email address
   - **Subject**: `Thanks for reaching out!`
   - **Content**: Automated confirmation with appreciation message

#### Security Features

1. **Honeypot Protection**
   - Hidden `bot-field` detects automated form submissions
   - Bot submissions return 200 OK (silent success) to avoid revealing the protection

2. **Input Validation**
   - Required fields: name, email, message
   - Email format validation using regex
   - Input sanitization using HTML escaping

3. **Rate Limiting**
   - Implemented via Upstash Redis
   - 10 requests per 10 minutes per IP
   - Fail-open behavior for high availability

#### Error Handling

| Error Type | Status Code | Response Message | Notes |
|-----------|------------|------------------|-------|
| Invalid HTTP method | 405 | "Method not allowed" | Only POST accepted |
| Missing required fields | 400 | "Please fill in all required fields." | Name, email, and message required |
| Invalid email format | 400 | "Please enter a valid email address." | Basic regex validation |
| Email service failure | 500 | "Failed to send message. Please try again later." | Logged to Sentry for monitoring |
| Rate limit exceeded | 429 | "Too many requests" | Standard rate limiting response |

#### Monitoring

All API activity is monitored through:
- **Vercel Logs**: Complete request/response logging
- **Sentry**: Error tracking and performance monitoring
- **PostHog**: Analytics on form submission success/failure rates
- **Resend Dashboard**: Email delivery status and open tracking

#### Best Practices

1. **Environment Variables**
   - `RESEND_API_KEY`: Never expose client-side
   - `OWNER_EMAIL`: Configure in production environment

2. **Domain Verification**
   - Verify your sending domain in Resend dashboard
   - Unverified domains send from `onboarding@resend.dev` with warning banner

3. **Testing**
   - Test form submissions after deployment
   - Verify both notification and confirmation emails are received
   - Check Vercel logs for any errors

4. **Maintenance**
   - Monitor email deliverability
   - Review rate limiting effectiveness
   - Update contact information as needed