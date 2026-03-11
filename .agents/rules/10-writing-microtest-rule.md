---
trigger: model_decision
description: Define constraints for the writing micro-test module.
owner: civictest
status: future
priority: p1
source_prd: civictest_prd.md
---

# Writing Microtest Rule

## Purpose
Specify future writing micro-test behavior with meaning-preserving scoring.

## Non-Negotiables
- Future module: do not implement in MVP unless explicitly requested.
- Writing flow supports up to 3 attempts.
- Pass condition: 1 meaning-correct response within allowed attempts.

## Implementation Requirements
- Support dictation-style prompt delivery.
- Accept minor punctuation/spelling variation when meaning is intact.
- Support lined-input UX with typing fallback.
- Persist grading rationale for failed submissions.

## Acceptance Checks
- Meaning-equivalent responses pass.
- Responses that alter meaning fail.
- MVP flow remains independent of this module.

## Out of Scope
- Civics stop-rule logic.
- Advanced handwriting recognition R&D.

## References
- PRD: Feature priority table (writing micro-test)
- PRD: Flow D (writing micro-test)
- PRD: Functional QA test cases (reading/writing)
