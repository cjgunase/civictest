---
trigger: model_decision
description: Govern handling of dynamic official-dependent civics answers.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Dynamic Officials Rule

## Purpose
Handle answers that change over time (elections/appointments) without corrupting historical session outcomes.

## Non-Negotiables
- Dynamic-answer questions must be explicitly flagged.
- User-facing surfaces must show that some answers can change.
- Display a `last_updated` marker for dynamic answer data.
- Historical attempts remain immutable once recorded.

## Implementation Requirements
- Separate question content from dynamic fact values.
- Provide controlled admin update workflow for dynamic values.
- Snapshot or version dynamic values used at grading time.
- Log updater identity and update timestamp.

## Acceptance Checks
- Dynamic-answer questions resolve against current configured value.
- Past session grading records do not change after dynamic updates.
- UI displays dynamic-answer notice and last-updated metadata.

## Out of Scope
- Broad political/news data ingestion automation.
- Teacher-facing editorial workflows.

## References
- PRD: 2025 civics test operational rules (answers may change)
- PRD: Core features table (officials can change)
- PRD: Scoring rubric (dynamic officials handling)
