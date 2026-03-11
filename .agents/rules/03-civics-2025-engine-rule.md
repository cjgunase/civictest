---
trigger: model_decision
description: Define the canonical 2025 civics session state machine and stop logic.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Civics 2025 Engine Rule

## Purpose
Provide the canonical implementation contract for 2025 civics simulation behavior.

## Non-Negotiables
- Question bank size target: 128 questions.
- Session asks up to 20 questions.
- Pass threshold: 12 correct.
- Fail threshold: 9 incorrect.
- Stop immediately when pass or fail threshold is reached.

## Implementation Requirements
- Maintain counters: `asked`, `correct`, `incorrect`.
- Expose canonical enum:
  - `StopReason = PASS_REACHED_12 | FAIL_REACHED_9 | MAX_20_REACHED | ABANDONED`
- Prevent additional questions after terminal state.
- Persist final stop reason and terminal counters in session record.

## Acceptance Checks
- Engine terminates on 12th correct answer with `PASS_REACHED_12`.
- Engine terminates on 9th incorrect answer with `FAIL_REACHED_9`.
- Engine terminates at 20 asked with `MAX_20_REACHED` if no prior terminal condition.

## Out of Scope
- Reading/writing test mechanics.
- Answer grading details beyond pass/fail counter integration.

## References
- PRD: 2025 civics test operational rules
- PRD: Flow B (2025 civics mock interview)
- PRD: Prioritized acceptance criteria (Civics stop logic)
