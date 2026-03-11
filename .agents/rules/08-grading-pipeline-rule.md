---
trigger: model_decision
description: Define deterministic-first grading with structured fallback for ambiguous answers.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Grading Pipeline Rule

## Purpose
Provide consistent and explainable answer grading aligned with civics requirements.

## Non-Negotiables
- Deterministic matching is mandatory first pass.
- LLM fallback is allowed only for uncertain deterministic outcomes.
- Grading must emit canonical verdict enum:
  - `Verdict = CORRECT | INCORRECT | UNCERTAIN`
- Record grader version and confidence metadata.

## Implementation Requirements
- Normalize transcript (case, punctuation, numeric forms) before deterministic checks.
- Match against accepted answer variants with documented thresholds.
- Use structured output schema for fallback grader responses.
- Persist full grading decision trace needed for audit.

## Acceptance Checks
- Common accepted variants pass without LLM fallback.
- Ambiguous cases can be escalated and resolved via fallback pipeline.
- Malformed fallback responses are rejected and handled safely.

## Out of Scope
- Automated retraining or model fine-tuning workflows.
- Reading/writing grading logic.

## References
- PRD: Scoring rubric (conservative grading)
- PRD: Epic: Grading pipeline
- PRD: Data integrity acceptance criteria
