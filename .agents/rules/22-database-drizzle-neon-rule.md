---
trigger: model_decision
description: Require Drizzle ORM and Neon Postgres for database connections and schemas.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Database Connection via Drizzle and Neon Rule

## Purpose
Standardize all database connections, migrations, and schema management via Drizzle ORM using Neon serverless Postgres.

## Non-Negotiables
- Drizzle ORM is the mandatory data access layer.
- Neon Postgres is the mandatory serverless database provider.
- Use `@neondatabase/serverless` and `drizzle-orm/neon-http` for database connectivity.
- Never expose connection credentials (`DATABASE_URL`) to client-side code; keep it restricted to server environments (e.g., inside `.env.local`).

## Implementation Requirements
- All database definitions (schemas and relationships) must be maintained in the `src/db/schema.ts` file or an equivalent directory explicitly managed by Drizzle Kit.
- Execute all local schema iterations using `npx drizzle-kit push` or `npx drizzle-kit migrate`.
- Write type-safe queries leveraging Drizzle ORM utilities and inferred TypeScript types (e.g., `typeof table.$inferSelect`).
- Isolate database connection logic to a single unified module (e.g., `src/db/index.ts` or `src/index.ts`) for reusability across data-layer functions.
- If interactive transactions are needed, fall back from `neon-http` to the fully-compatible WebSockets `neon-serverless` driver.

## Acceptance Checks
- Ensure Drizzle config (`drizzle.config.ts`) explicitly references the `.env.local` target securely.
- No direct `pg` or independent query builders outside of Drizzle are introduced.
- Connection code properly imports `drizzle` from `drizzle-orm/neon-http`.
- The connection driver operates securely within Vercel/serverless boundaries without exposing credentials to the browser.

## Out of Scope
- Specific row-level security details or specific Clerk role-to-db mappings (covered in authorization/roles rule).
- Specific data models and table logic beyond their required use of Drizzle ORM syntax.

## References
- PRD: Data model and technical architecture
- PRD: Hardening + launch timeline
- Get Started with Drizzle and Neon (neon-http logic)
