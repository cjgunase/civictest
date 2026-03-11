---
trigger: model_decision
description: Define patterns for data retrieval, database mutations via Server Actions, and Zod validation.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Data Fetching, Mutations, and Validation Rule

## Purpose
Standardize how data is retrieved from the database, mutated, and validated to ensure a secure, type-safe, and consistent application layer in Next.js.

## Non-Negotiables
- **Data Retrieval:** Must *always* be done via React Server Components (RSC). Do not use client-side fetching or API routes for standard database reads.
- **Mutations:** Any updates, deletes, or inserts into the database must *always* be done via Next.js Server Actions.
- **Data Validation:** All incoming data and validation logic must *always* be performed using the `zod` library.
- **Type Safety in Actions:** Any data passed to Server Actions must be validated by Zod and must have an explicit TypeScript type. **DO NOT** use raw `FormData` as the argument type for Server Actions.

## Implementation Requirements
- Define Zod schemas for all inbound mutations (e.g., forms, API payloads, Server Action arguments).
- Infer TypeScript types directly from Zod schemas (e.g., `type UserInput = z.infer<typeof userSchema>`) to guarantee synchronization between runtime validation and compile-time types.
- Ensure Client Components parse or structure data appropriately before passing it to Server Actions. Server Actions must receive structured, strongly-typed objects—not `FormData` instances.
- Wrap Server Action logic safely and handle Zod validation errors to return typed, standardized error responses back to the client.

## Acceptance Checks
- All database read operations `db.select()` occur within `async` Server Components.
- All database write operations (`db.insert`, `db.update`, `db.delete`) are encapsulated within functions marked explicitly with `"use server"`.
- Zod schemas exist for all entities being mutated.
- Server Action parameters exclusively use TypeScript types defined and inferred from Zod.

## Out of Scope
- Specific database connection logic and ORM semantics (covered in the Database Drizzle Neon rule).
- Authentication validations (covered in Authentication Clerk rule).

## References
- PRD: Data model and technical architecture
- Next.js Documentation: Server Actions and Mutations
- Zod Documentation
