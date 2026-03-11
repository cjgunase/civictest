---
trigger: model_decision
description: Define role-based access controls and least-privilege boundaries.
owner: civictest
status: mvp
priority: p1
source_prd: civictest_prd.md
---

# Authorization Roles Rule

## Purpose
Define and enforce role-based access boundaries across learner and educator workflows.

## Non-Negotiables
- Use least-privilege defaults for all users.
- Support role model: `learner`, `teacher`, `admin`.
- Restrict administrative content updates (e.g., dynamic officials updates) to admin role only.

## Implementation Requirements
- Enforce role checks server-side for all privileged endpoints.
- Scope teacher data access to their own classes/cohorts only.
- Prevent cross-user session/attempt data access unless explicitly authorized.
- Log privileged actions with actor ID and timestamp.

## Acceptance Checks
- Learners can only access their own sessions/results.
- Teachers cannot read or edit unrelated classes.
- Admin-only endpoints reject teacher/learner tokens.

## Out of Scope
- Full teacher dashboard UX details.
- Organization billing authorization model.

## References
- PRD: Target users and personas
- PRD: Teacher/B2B dashboard
- PRD: Privacy, security, and legal constraints
