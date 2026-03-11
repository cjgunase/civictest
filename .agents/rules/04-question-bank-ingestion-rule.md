---
trigger: model_decision
description: Define ingestion and validation requirements for the civics question bank.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Question Bank Ingestion Rule

## Purpose
Ensure the question bank is loaded and maintained with integrity and traceability.

## Non-Negotiables
- Support 2025 128-question civics bank structure.
- Every question must have at least one accepted answer variant.
- No duplicate question identifiers.
- Preserve metadata for special categories (e.g., dynamic answers, 65/20 starred items).

## Implementation Requirements
- Build idempotent ingestion pipeline.
- Validate schema before write.
- Maintain source version stamp for imported content.
- Reject partial imports that violate integrity constraints.

## Acceptance Checks
- Import job produces exactly expected count for active bank version.
- Zero duplicates after import.
- Validation fails when any question lacks answer variants.

## Out of Scope
- Runtime grading logic.
- Dynamic official value updates at runtime.

## References
- PRD: Data ingestion: the 2025 question bank
- PRD: Data model (Question, AnswerVariant)
- PRD: Launch checklist (content accuracy check)
