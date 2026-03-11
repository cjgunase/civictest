---
trigger: model_decision
description: Define future spaced repetition scheduling and mastery-tracking requirements.
owner: civictest
status: future
priority: p1
source_prd: civictest_prd.md
---

# SRS Mastery Rule

## Purpose
Specify future spaced repetition behavior for long-term civics retention.

## Non-Negotiables
- Future module: do not implement in MVP unless explicitly requested.
- Maintain per-user, per-question review state.
- Scheduling updates must be deterministic and reproducible.

## Implementation Requirements
- Track interval, ease factor, and next due timestamp.
- Update state on each graded attempt using defined scheduling formula.
- Surface mastery states clearly to the learner.

## Acceptance Checks
- Correct answers increase interval per configured policy.
- Incorrect answers reduce interval/reset as configured.
- Scheduling state remains stable across repeated recalculation.

## Out of Scope
- Teacher dashboard analytics.
- Adaptive ML personalization.

## References
- PRD: Feature priority table (SRS + mastery)
- PRD: Data model (SRSState)
- PRD: Learning metrics
