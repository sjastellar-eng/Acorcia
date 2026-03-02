# Data Retention Policy — Source Constructor

> Internal policy document | Version 1.0 | March 2026

---

## Purpose

This policy defines how long Source Constructor retains different categories of data, and the procedures for secure deletion.

---

## Retention Schedule

| Data Category | Retention Period | Trigger | Deletion Method |
|--------------|----------------|---------|----------------|
| User account data | Account deletion + 30 days | Account deletion request | Hard delete from DB |
| Discovery session content | Account deletion + 30 days | Account deletion | Hard delete JSONB |
| Project data | Account deletion + 30 days | Account deletion | Hard delete |
| Daily check-in data | Account deletion + 30 days | Account deletion | Hard delete |
| Payment records (Stripe) | 7 years | Account deletion | Stripe managed; we keep reference IDs |
| Invoices | 7 years | Legal requirement | Archived, access restricted |
| Server access logs | 90 days | Rolling | Automatic log rotation |
| Error logs (Sentry) | 90 days | Rolling | Auto-purge |
| Analytics events (PostHog) | 24 months | Rolling | Auto-purge |
| Email logs (Resend) | 30 days | Rolling | Auto-purge |
| Database backups | 30 days | Rolling | Encrypted, auto-purge |
| Deleted account backups | 30 days after deletion | Account deletion | Purge after backup cycle |

---

## Deletion Process

### Automated Deletion
- A scheduled job runs daily checking for accounts marked for deletion
- Accounts with deletion_requested_at > 30 days ago are purged
- Associated data in all tables is cascade-deleted

### Manual Deletion Requests (GDPR Art. 17)
- User submits deletion request via app or email
- Account is marked `deletion_scheduled_at = NOW()` immediately (user loses access)
- Full purge occurs within 30 days
- Confirmation email sent to user within 5 business days
- Exception: payment records retained per legal obligation

### Backup Purge
- Production backups are retained for 30 days
- Deleted user data may remain in backups for up to 30 days post-deletion
- This is disclosed in Privacy Policy

---

## Legal Hold

If we receive a legal hold notice, affected data may be retained beyond standard periods. Legal team must approve and document all holds.

---

## Review

This policy is reviewed annually or when significant product or legal changes occur.

**Owner:** Head of Engineering + Legal Counsel
**Last reviewed:** March 2026
