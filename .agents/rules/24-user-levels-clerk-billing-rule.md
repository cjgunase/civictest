---
trigger: model_decision
description: Define user levels, subscription plans, and feature gating using Clerk Billing.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# User Levels and Clerk Billing Rule

## Purpose
Standardize user subscription levels and feature gating based on Clerk Billing plans for B2C SaaS.

## Non-Negotiables
- Clerk Billing is the mandatory subscription and plan management provider. No custom billing logic or alternative payment processors are to be implemented outside of the Clerk ecosystem.
- Two distinct subscription plans exist: `free_user` (Free Plan) and `plus` (Premium Plan).

## User Levels and Entitlements
- **Free Plan (`free_user`)**:
  - Grants access ONLY to the **Study Guide**.
  - Does NOT grant access to premium features such as Interview Simulation or Flashcards.
- **Plus Plan (`plus`)**:
  - Grants access to **ALL** features on the site, including the Study Guide, Interview Simulation, Flashcards, and any future premium resources.

## Implementation Requirements
- **Server-Side Protection**: Use the `auth().has()` method to enforce access control in API routes and Server Components.
  - Example: `has({ plan: 'plus' })` to check if a user is subscribed to the Plus plan.
  - If a free user attempts to access a premium API route or Server Component, return an appropriate generic error or redirect.
- **Client-Side Protection**:
  - Use the `<Show>` component for declarative rendering based on plans.
    - Example: `<Show when={{ plan: 'plus' }} fallback={<UpgradeMessage />}> ... </Show>`
  - Alternatively, use `useAuth().has()` in Client Components to conditionally render UI.
- **Pricing Page**: Include a dedicated pricing page rendering the Clerk `<PricingTable />` component, to allow `free_user` accounts to upgrade to the `plus` plan.
- Ensure that users with the `free_user` plan are gracefully handled and shown clear calls-to-action to upgrade when navigating toward restricted features (e.g. Flashcards, Interviews).

## Acceptance Checks
- Users on the `free_user` plan are definitively blocked from the Interview Simulation, Flashcards, and other non-Study Guide areas, both at the UI component level and the API level.
- Users on the `plus` plan can seamlessly access all application functionalities.
- `<PricingTable />` is properly mounted on an appropriate billing/pricing page to handle subscription upgrades.
- Clerk's built-in access control properties (`plan`, `feature`) are reliably utilized, rather than building a parallel custom roles system for plan features in the application database.

## Out of Scope
- Initial Clerk Authentication implementation details (covered by `01-authentication-clerk-rule.md`).
- Role-based authorization for admin / system functionality (covered by `02-authorization-roles-rule.md`).
- B2B organizational billing and team subscriptions.

## References
- PRD: civictest_prd.md
- Clerk Documentation: Clerk Billing for B2C SaaS
