---
trigger: model_decision
description: Standardize UI component usage on shadcn/ui primitives and local design tokens.
owner: civictest
status: mvp
priority: p1
source_prd: civictest_prd.md
---

# UI Components Shadcn Rule

## Purpose
Keep UI implementation consistent by using shadcn/ui as the primary component foundation.

## Non-Negotiables
- Use existing shadcn/ui components and patterns before building custom primitives.
- Reuse project design tokens and utility helpers for styling consistency.
- New UI components must remain accessible by default.

## Implementation Requirements
- Add missing shadcn components via official CLI when needed.
- Keep component variants centralized and typed.
- Avoid duplicate primitive components that overlap shadcn functionality.

## Acceptance Checks
- New UI work references shared shadcn components where appropriate.
- No redundant button/input/card primitives are introduced.
- Styling remains consistent with existing token system.

## Out of Scope
- Full design system rebrand.
- Third-party UI framework migration.

## References
- PRD: UX flows optimized for mobile + web
- PRD: Accessibility requirements
- Existing codebase: `components/ui` and `app/globals.css`
