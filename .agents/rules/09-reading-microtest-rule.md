---
trigger: model_decision
description: Define constraints for the reading micro-test module.
owner: civictest
status: future
priority: p1
source_prd: civictest_prd.md
---

# Reading Microtest Rule

## Purpose
Specify future reading micro-test behavior aligned with USCIS-style constraints.

## Non-Negotiables
- Future module: do not implement in MVP unless explicitly requested.
- Reading flow supports up to 3 attempts.
- Pass condition: 1 correct reading within allowed attempts.

## Implementation Requirements
- Present sentence clearly before read-aloud capture.
- Score content integrity with tolerance for accent variation.
- End module immediately on first passing attempt.
- Persist attempt-by-attempt outcomes for traceability.

## Acceptance Checks
- Module exits as pass after first correct attempt.
- Module exits as fail after exhausting attempts with no correct read.
- MVP builds contain no forced dependency on this module.

## Out of Scope
- Civics oral Q&A scoring.
- Full literacy curriculum progression.

## References
- PRD: Feature priority table (reading micro-test)
- PRD: Flow C (reading micro-test)
- PRD: Prioritized acceptance criteria (reading/writing mechanics)
