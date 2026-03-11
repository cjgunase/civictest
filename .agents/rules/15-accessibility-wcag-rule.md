---
trigger: model_decision
description: Enforce WCAG 2.2 AA accessibility requirements for all core user journeys.
owner: civictest
status: mvp
priority: p1
source_prd: civictest_prd.md
---

# Accessibility WCAG Rule

## Purpose
Ensure core flows are inclusive and usable with or without voice interaction.

## Non-Negotiables
- Target WCAG 2.2 AA for core journeys.
- Every voice action must have a non-voice equivalent path.
- Critical feedback must be conveyed visually and programmatically.

## Implementation Requirements
- Provide keyboard-accessible controls for practice flows.
- Ensure sufficient contrast and readable typography defaults.
- Support captions/transcripts where voice output is used.
- Include accessibility checks in release gates.

## Acceptance Checks
- User can complete login, practice, and results without microphone.
- Core pages pass automated accessibility checks and manual keyboard traversal.
- Error/validation states are announced and visible.

## Out of Scope
- Certification by external accessibility auditor.
- Native app-specific accessibility APIs.

## References
- PRD: Accessibility metrics
- PRD: Prioritized acceptance criteria (Accessibility)
- PRD: Launch checklist (WCAG 2.2 AA audit)
