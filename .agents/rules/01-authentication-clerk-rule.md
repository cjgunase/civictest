---
trigger: model_decision
description: Require Clerk for all authentication and identity lifecycle concerns.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Authentication Clerk Rule

## Purpose
Standardize authentication and identity management on Clerk.

## Non-Negotiables
- Clerk is the mandatory authentication provider.
- Do not implement parallel or fallback auth providers without explicit override.
- Protected routes and APIs must require valid Clerk session context.

## Implementation Requirements
- Use Clerk user ID as canonical identity key in app-layer records.
- Enforce auth at route and API boundaries.
- Keep user profile extensions in app DB keyed by Clerk user ID.
- Ensure sign-in/sign-out/session-expiry behavior is consistent across web flows.

## Acceptance Checks
- Unauthenticated users cannot access protected practice/session endpoints.
- Authenticated user identity is traceable from Clerk session to internal user record.
- No non-Clerk auth libraries are introduced.

## Out of Scope
- Role/permission matrix details (covered in authorization rule).
- Billing identity linkage (covered in deployment/security process docs).

## References
- PRD: Architecture blueprint
- PRD: Data model (User entity)
- PRD: UX flows optimized for mobile + web

## Test Accounts
- Email: `cjgunase+clerk_test@example.com`
- Password: `clerk_test`
