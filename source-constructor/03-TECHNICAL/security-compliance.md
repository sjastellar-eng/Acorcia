# Source Constructor (SOC) — Security & Compliance

**Document Version:** 1.0
**Last Updated:** 2026-03-02
**Status:** Approved
**Owner:** Engineering Lead

---

## Overview

This document defines the security architecture, data handling practices, threat model, and compliance requirements for Source Constructor. Given that SOC handles deeply personal user data (life goals, desires, fears, career aspirations), security and privacy are foundational — not features.

**Security Principle:** SOC treats user session data with the same confidentiality standard as therapy notes.

---

## 1. Threat Model

### Assets to Protect

| Asset | Sensitivity | Description |
|-------|-------------|-------------|
| Discovery Session transcripts | **Critical** | Deeply personal conversations with AI |
| Project plans | **High** | Users' future plans and goals |
| User PII | **High** | Email, name, profile data |
| Session insights/summaries | **High** | AI-synthesized personal insights |
| Payment data | **High** | Stripe-managed (not stored in SOC systems) |
| Usage analytics | **Medium** | Behavioral data (PostHog) |

### Threat Actors

| Actor | Motivation | Likelihood |
|-------|-----------|------------|
| External attacker | Data theft, credential harvesting | Medium |
| Competitor | Intellectual property / user data | Low |
| Malicious insider | Data exfiltration | Low |
| Curious employee | Unauthorized access to user sessions | Medium |
| Automated scraper | Content scraping | Medium |

### Key Threat Scenarios

1. **Unauthorized access to session transcripts** — highest impact scenario
2. **Account takeover** — phishing or credential stuffing
3. **Data breach via SQL injection or API vulnerability**
4. **Third-party AI provider data exposure** — Anthropic receiving PII
5. **Insider threat** — team member accessing user conversations

---

## 2. Authentication & Authorization

### 2.1 Authentication

**Method:** Email/password with optional OAuth (Google, Apple)

**Password Requirements:**
- Minimum 8 characters
- At least 1 number or special character
- Bcrypt hashing with cost factor 12
- No plaintext password storage ever

**Session Management:**
- JWT access tokens: 15-minute expiry
- Refresh tokens: 30-day expiry, single-use rotation
- Tokens stored in `httpOnly`, `Secure`, `SameSite=Strict` cookies
- No tokens in localStorage or URLs

**Multi-Factor Authentication:**
- TOTP (Time-based One-Time Password) via authenticator app — v1
- SMS OTP as fallback — v1.5
- MFA required for: account email change, subscription management

### 2.2 Authorization

**Row-Level Security (RLS) via Supabase:**

All database tables have RLS policies enforced at the database level. Application-level authorization is a secondary layer.

```sql
-- Example: users can only access their own sessions
CREATE POLICY "users_own_sessions" ON discovery_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Admins have no automatic access to sessions
-- Admin access requires explicit audit trail
```

**API Authorization:**
- Every API endpoint validates JWT and extracts `user_id`
- Parameterized queries only — no dynamic SQL construction
- Resource ownership verified before any read/write operation

---

## 3. Data Encryption

### 3.1 Encryption in Transit

- All traffic: TLS 1.3 minimum (enforced at Cloudflare edge)
- HSTS header with `max-age=31536000; includeSubDomains`
- Certificate pinning not required (web app)
- WebSocket connections: `wss://` only

### 3.2 Encryption at Rest

**Database (Supabase/PostgreSQL):**
- Supabase encrypts all data at rest using AES-256
- Database credentials rotated quarterly

**File Storage:**
- Not applicable for v1 (no file uploads)

**Application-Level Encryption (sensitive fields):**
Session transcripts are additionally encrypted at the application layer before storage.

```javascript
// Session transcript encryption
const encryptedTranscript = encrypt(
  sessionTranscript,
  process.env.SESSION_ENCRYPTION_KEY  // 256-bit AES key, stored in Railway secrets
);
```

**Key Management:**
- Encryption keys stored in Railway environment secrets
- Keys never in code, `.env` files in repository, or logs
- Key rotation plan: annual

---

## 4. Data Privacy

### 4.1 Data Minimization

SOC collects only what is necessary for core functionality:

| Data Type | Collected | Retention | Purpose |
|-----------|-----------|-----------|---------|
| Email | Yes | Account lifetime + 30 days | Authentication, transactional email |
| Name (optional) | Yes | Account lifetime | Personalization |
| Session transcripts | Yes | Account lifetime | Core feature |
| AI-generated insights | Yes | Account lifetime | Core feature |
| Project data | Yes | Account lifetime | Core feature |
| IP address | Yes | 30 days | Security, fraud prevention |
| Usage analytics | Yes | 2 years (anonymized) | Product improvement |
| Payment data | No (Stripe) | N/A | Stripe manages directly |

### 4.2 AI Provider Data Handling

**Anthropic Claude API:**
- Session content is sent to Anthropic for AI processing
- We never send: real names, email addresses, or other direct PII to Anthropic
- Users referred to by internal `user_id` only in API calls
- Anthropic's data processing agreement (DPA) is in place
- Anthropic does not use API data to train models (confirmed in enterprise agreement)

**Data sent to Anthropic (per API call):**
```
{
  "messages": [conversation transcript],
  "context": {
    "user_id": "uuid-internal-only",
    "session_type": "discovery",
    "session_number": 3
  }
}
// Never included: email, name, payment info
```

### 4.3 Third-Party Services

| Service | Data Shared | Legal Basis |
|---------|-------------|-------------|
| Anthropic | Session content (pseudonymized) | Contract performance |
| Stripe | Email, payment info | Contract performance |
| Resend | Email, name | Contract performance |
| PostHog | Anonymized usage events | Legitimate interest |
| Supabase | All data (hosting) | Contract performance |
| Railway | Application code (hosting) | Contract performance |

---

## 5. API Security

### 5.1 Input Validation

All API inputs validated at request entry:
- Schema validation using Zod (TypeScript)
- String inputs sanitized before DB operations
- Maximum payload size: 50KB per request
- File upload: not supported in v1

### 5.2 Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 5 attempts | 15 min per IP |
| `/api/auth/register` | 3 attempts | 60 min per IP |
| `/api/session/message` | 60 messages | 60 min per user |
| `/api/*` (general) | 100 requests | 1 min per user |

Rate limit state stored in Redis (Upstash).

### 5.3 Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 5.4 CORS Policy

```
Allowed origins: https://sourceconstructor.com, https://app.sourceconstructor.com
Credentials: true
Methods: GET, POST, PUT, DELETE
Headers: Content-Type, Authorization
```

---

## 6. Vulnerability Management

### 6.1 Dependency Scanning

- **Automated:** GitHub Dependabot — weekly scan, auto-PR for patches
- **Manual review:** All major version upgrades reviewed before merging
- **Critical vulnerabilities:** Patch within 24 hours, redeploy same day

### 6.2 Code Review

- All code changes require PR review by ≥ 1 team member
- Security-sensitive changes (auth, data access) require Engineering Lead review
- No direct pushes to `main`

### 6.3 Penetration Testing

- Pre-launch: 3rd party penetration test (scheduled Month 2 of MVP)
- Annual: External pen test post-launch
- Bug bounty: Considered for v1.5

### 6.4 Incident Response

**Severity Levels:**

| Level | Description | Response Time | Escalation |
|-------|-------------|---------------|------------|
| P0 | Active data breach | 15 min | CEO + Engineering Lead immediately |
| P1 | Potential unauthorized access | 1 hour | Engineering Lead |
| P2 | Vulnerability discovered | 24 hours | Engineering Lead |
| P3 | Security misconfiguration | 72 hours | Dev team |

**Breach Notification:**
- Users notified within 72 hours of confirmed breach (GDPR requirement)
- Notification includes: what was affected, what we're doing, what users should do
- Supervisory authority notified within 72 hours

---

## 7. GDPR & Privacy Compliance

### 7.1 Legal Bases for Processing

| Processing Activity | Legal Basis |
|--------------------|-------------|
| Delivering the core service | Contract performance |
| Sending transactional emails | Contract performance |
| Product analytics (anonymized) | Legitimate interest |
| Marketing emails | Explicit consent |

### 7.2 User Rights

SOC supports all GDPR user rights via the Account Settings page:

| Right | Implementation | SLA |
|-------|----------------|-----|
| Right to Access | "Download my data" button → JSON export | Immediate |
| Right to Rectification | Edit profile/preferences in settings | Immediate |
| Right to Erasure | "Delete my account" → removes all data | 30 days |
| Right to Portability | JSON export of all user data | Immediate |
| Right to Object | Opt-out of analytics, marketing | Immediate |

### 7.3 Data Retention Policy

See full policy: `07-LEGAL/data-retention-policy.md`

Summary:
- Active accounts: data retained for account lifetime
- Deleted accounts: data purged within 30 days
- Anonymized analytics: retained indefinitely
- Backup retention: 90 days

---

## 8. Infrastructure Security

### 8.1 Production Environment

| Component | Provider | Security Measures |
|-----------|----------|-------------------|
| Frontend | Vercel | DDoS protection, edge network |
| Backend | Railway | Private networking, env secrets |
| Database | Supabase | RLS, encrypted at rest, private access |
| Cache/Queue | Upstash (Redis) | TLS, auth tokens |
| CDN/WAF | Cloudflare | WAF rules, bot protection, DDoS |

### 8.2 Access Control (Team)

- Production database: Engineering Lead + 1 backup only
- Production environment variables: Railway secrets, never in code
- Admin panel: 2FA required for all team members
- Principle of least privilege: every team member has minimum required access

### 8.3 Logging & Monitoring

**What we log:**
- API request metadata (timestamp, endpoint, status, user_id)
- Authentication events (login attempts, MFA, password change)
- Errors and exceptions
- Rate limit triggers

**What we never log:**
- Session transcript content
- Passwords or tokens
- Full request bodies (only metadata)

Logs retained for: 90 days
Monitoring: Railway built-in + PostHog for application-level events

---

## 9. Security Checklist: Pre-Launch

- [ ] All API endpoints have authentication middleware
- [ ] RLS policies verified on all Supabase tables
- [ ] Rate limiting tested under load
- [ ] Dependency vulnerability scan clean (0 high/critical)
- [ ] Security headers configured and verified
- [ ] Penetration test completed and critical findings resolved
- [ ] Data export and deletion functions tested end-to-end
- [ ] Privacy policy reviewed by legal
- [ ] Anthropic DPA signed
- [ ] Stripe PCI compliance confirmed
- [ ] Error messages do not expose internal system details
- [ ] Session transcripts encryption verified

---

*Security Owner: Engineering Lead | Review cycle: Quarterly | Last reviewed: March 2026*
