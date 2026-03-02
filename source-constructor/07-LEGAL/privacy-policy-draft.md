# Privacy Policy — Source Constructor

**Version:** 1.0 Draft | **Last Updated:** March 2026 | **Status:** Legal Review Required

> ⚠️ DRAFT — This document requires review by a qualified attorney before publication.

---

## Source Constructor Privacy Policy

**Effective Date:** [Launch Date]

Source Constructor ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.

---

## 1. Information We Collect

### 1.1 Information You Provide Directly

**Account Information**
- Email address (required for account creation)
- Name or display name
- Profile photo (optional)
- Password (stored as bcrypt hash, never in plaintext)

**Discovery Session Data**
- Your text responses during Discovery Sessions
- Follow-up answers to AI questions
- Revisions and edits you make to answers

**Project and Goal Data**
- Project names, descriptions, and visions
- Milestones and tasks you create or approve
- Progress notes and check-in responses

**Communication Data**
- Messages to AI companion
- Feedback you submit
- Support requests

### 1.2 Information Collected Automatically

**Usage Data**
- Pages and features you access
- Time spent in each section
- Click patterns and navigation flows
- Session timestamps

**Device and Technical Data**
- IP address (anonymized after 90 days)
- Browser type and version
- Operating system
- Device type (mobile/desktop)
- Referring URL

**Analytics Data** (via PostHog — privacy-first analytics)
- Feature usage counts
- Funnel conversion events
- Error reports (anonymized)

### 1.3 Information From Third Parties

**OAuth Providers** (Google, Apple — if you choose)
- Email address, name, profile photo as provided by the OAuth provider
- We do not access any other data from these providers

**Payment Information** (Stripe)
- We do not store credit card numbers
- Stripe provides us with: last 4 digits, expiry, billing name, billing country
- Full payment data is processed and stored exclusively by Stripe

---

## 2. How We Use Your Information

### 2.1 Core Service Delivery

| Purpose | Legal Basis | Data Used |
|---------|------------|-----------|
| Run Discovery Sessions | Contract performance | Session responses |
| Generate personalized projects | Contract performance | Session results, profile |
| Provide Daily AI Companion | Contract performance | Check-in history, projects |
| Show progress and insights | Contract performance | All user activity data |

### 2.2 AI Processing

**IMPORTANT:** Your Discovery Session responses and check-in messages are sent to Anthropic's Claude API to generate AI responses. This means:

- Your data is processed by Anthropic's servers
- Anthropic's data processing is governed by their [Data Processing Agreement](https://www.anthropic.com/legal/privacy)
- We use API access which means Anthropic does NOT use your data to train their models (as of March 2026)
- Session content is sent in encrypted form over TLS

We implement the following protections:
- We never include your full name or email in prompts sent to the AI
- We use anonymized user IDs in AI context
- Sensitive topics (health conditions, detailed financial info) are excluded from prompts

### 2.3 Service Improvement

- Aggregate, anonymized analytics to understand product usage
- A/B testing of features (using anonymized cohorts)
- Bug detection and performance monitoring

### 2.4 Communications

- Transactional emails (account confirmations, receipts)
- Product updates (if you opt in)
- Marketing emails (if you explicitly opt in)
- You can unsubscribe from any non-transactional email at any time

### 2.5 Legal and Safety

- Comply with legal obligations
- Enforce our Terms of Service
- Protect against fraud, abuse, and security threats

---

## 3. Data Sharing and Disclosure

### We DO share your data with:

| Recipient | What | Why |
|-----------|------|-----|
| Anthropic (Claude API) | Session content (anonymized) | AI processing |
| Supabase | All stored data | Database hosting (EU/US regions) |
| Stripe | Payment processing data | Billing |
| PostHog | Anonymized usage events | Analytics |
| Resend | Email address | Transactional emails |
| Vercel | Traffic metadata | Hosting |

### We DO NOT:
- Sell your personal data to third parties
- Share your Discovery Session content with advertisers
- Allow third parties to use your data for their own marketing
- Share your data with data brokers

### Legal Disclosure
We may disclose your information if required by law, court order, or to protect the rights and safety of our users and the public. We will attempt to notify you unless prohibited by law.

---

## 4. Data Retention

| Data Type | Retention Period | Notes |
|-----------|----------------|-------|
| Account data | Until account deletion + 30 days | Soft delete, then purge |
| Discovery Sessions | Until deletion + 30 days | User can delete individual sessions |
| Daily check-ins | Until account deletion + 30 days | |
| Projects | Until account deletion + 30 days | |
| Payment records | 7 years | Required by law |
| Server logs | 90 days | Security and debugging |
| Analytics events | 24 months (anonymized) | Aggregated trends |
| Backup data | 30 days after deletion | Recovery window |

---

## 5. Your Rights

### For All Users

**Access:** You can request a copy of all personal data we hold about you. We will respond within 30 days.

**Correction:** You can correct inaccurate information directly in your profile settings.

**Deletion:** You can delete your account at any time. We will purge your data within 30 days (except legally required records).

**Data Portability:** You can export your data (sessions, projects, check-ins) in JSON format from Settings → Export Data.

**Objection:** You can opt out of marketing communications and analytics tracking.

### For EU/EEA Users (GDPR)

In addition to the above, you have the right to:
- **Restrict processing** of your data in certain circumstances
- **Lodge a complaint** with your national data protection authority
- **Withdraw consent** at any time (for processing based on consent)
- **Not be subject** to fully automated decisions that significantly affect you

To exercise any right, contact: **privacy@sourceconstructor.ai**

We will respond within 30 days (EU: within 1 month as required by GDPR).

---

## 6. Data Security

### Technical Measures
- All data encrypted in transit using TLS 1.3
- All data encrypted at rest using AES-256
- Database access restricted by Row Level Security (RLS)
- API authentication using JWT with short expiry (1 hour) + refresh tokens
- Regular security audits and penetration testing (annually)
- Vulnerability disclosure program

### Organizational Measures
- Access to production data limited to essential personnel only
- All team members sign data processing agreements
- Annual security training for all staff
- Incident response plan in place

### Breach Notification
In the event of a data breach affecting your personal data, we will:
- Notify affected users within 72 hours of discovery
- Notify relevant authorities as required by applicable law
- Provide information on what happened and what we're doing about it

---

## 7. International Data Transfers

Source Constructor is based in [Country]. We use service providers that may process data in the United States and European Union.

For EU/EEA users: We ensure adequate protection through:
- Standard Contractual Clauses (SCCs) with processors
- Processing agreements with GDPR-compliant vendors

---

## 8. Children's Privacy

Source Constructor is not intended for users under 16 years of age. We do not knowingly collect data from children under 16. If we become aware that we have collected data from a child under 16, we will delete it promptly.

---

## 9. Cookies

We use minimal cookies:

| Cookie | Type | Purpose | Duration |
|--------|------|---------|----------|
| auth_token | Essential | User authentication | Session |
| refresh_token | Essential | Keep user logged in | 30 days |
| posthog_session | Analytics | Anonymous usage analytics | 1 year |
| stripe_mid | Payment | Fraud prevention (Stripe) | 1 year |

We do NOT use third-party advertising cookies.

You can disable non-essential cookies in your browser settings. This will not affect core functionality.

---

## 10. Changes to This Policy

We may update this Privacy Policy occasionally. When we make significant changes:
- We will update the "Last Updated" date
- We will notify you by email (for material changes)
- We will show an in-app notification

Continued use of Source Constructor after changes constitute acceptance.

---

## 11. Contact Us

**Data Controller:** Source Constructor
**Email:** privacy@sourceconstructor.ai
**Response time:** Within 5 business days (privacy inquiries), within 30 days (GDPR requests)

---

*This policy is written in plain language. If you have questions about anything here, please reach out — we're happy to explain.*
