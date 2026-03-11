---
trigger: model_decision
description: Define mandatory test coverage and quality gates across critical domains.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Testing Quality Gates Rule

## Purpose
Set enforceable quality gates to prevent regressions in critical test-simulation behavior.

## Non-Negotiables
- Civics stop logic regressions are release blockers.
- Grading regressions are release blockers.
- Critical path APIs require automated tests.

## Implementation Requirements
- Maintain unit tests for state machine thresholds and boundary behavior.
- Add integration tests for session progression APIs.
- Add e2e tests for happy path and fallback path user flows.
- Include fixtures for deterministic and uncertain grading cases.

## Acceptance Checks
- Test suite fails on any change that breaks 12/9/20 terminal behavior.
- Test suite verifies canonical enums and terminal session outputs.
- CI quality gate blocks merge on failing critical tests.

## Out of Scope
- Load/performance benchmarking at scale.
- Chaos engineering.

## References
- PRD: Prioritized acceptance criteria
- PRD: Functional QA test cases
- PRD: Developer task list (acceptance tests)
