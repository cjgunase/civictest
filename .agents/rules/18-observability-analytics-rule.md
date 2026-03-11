---
trigger: model_decision
description: Define event tracking and observability requirements for product and quality metrics.
owner: civictest
status: mvp
priority: p1
source_prd: civictest_prd.md
---

# Observability Analytics Rule

## Purpose
Standardize telemetry needed to evaluate product outcomes and reliability.

## Non-Negotiables
- Track core session lifecycle events and outcomes.
- Track grading pathway usage (deterministic vs fallback).
- Keep event taxonomy versioned and documented.

## Implementation Requirements
- Emit events for session start, answer submitted, verdict assigned, stop reason, and session complete.
- Capture fallback grading rate and confidence distribution.
- Define minimal dashboard metrics before beta.
- Ensure analytics excludes unnecessary PII.

## Acceptance Checks
- Event stream can reproduce pass/fail funnel metrics.
- Stop reason distribution is queryable.
- Fallback rate is measurable by question and release version.

## Out of Scope
- Full BI warehouse implementation.
- Marketing attribution stack.

## References
- PRD: Product success metrics
- PRD: Format fidelity metrics
- PRD: Primary outcome metric
