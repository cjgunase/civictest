---
trigger: model_decision
description: Define future educator dashboard boundaries, permissions, and reporting behavior.
owner: civictest
status: future
priority: p2
source_prd: civictest_prd.md
---

# Teacher Dashboard Rule

## Purpose
Specify future educator features for classroom management and cohort progress reporting.

## Non-Negotiables
- Future module: do not implement in MVP unless explicitly requested.
- Teacher access must be scoped to assigned classrooms only.
- Student privacy must be preserved in all cohort views and exports.

## Implementation Requirements
- Support class creation, join codes, enrollment management.
- Provide civics performance summaries by learner and cohort.
- Gate export features behind appropriate permissions.

## Acceptance Checks
- Teachers can view only their enrolled learners.
- Join code flow creates correct class membership.
- Export output excludes unauthorized user data.

## Out of Scope
- District-level enterprise admin tooling.
- Billing seat automation.

## References
- PRD: Target users (Educator/program manager)
- PRD: Flow E (Teacher dashboard)
- PRD: Spaced repetition and educator dashboard epic
