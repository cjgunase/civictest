---
trigger: model_decision
description: Define future localization strategy and regulated exemption-based language mode controls.
owner: civictest
status: future
priority: p2
source_prd: civictest_prd.md
---

# Localization and Exemptions Rule

## Purpose
Define boundaries for localized UX and exemption-based language handling.

## Non-Negotiables
- Future module: do not implement in MVP unless explicitly requested.
- Do not implement full localization in MVP unless explicitly requested.
- Default civics practice remains English-first.
- Native-language civics mode must be gated behind explicit exemption qualification acknowledgment.

## Implementation Requirements
- Separate UI language from test-language policy controls.
- Require explicit user declaration before enabling exemption-based language mode.
- Preserve audit log for language-mode changes.

## Acceptance Checks
- Non-exempt users cannot accidentally enter unrestricted non-English civics mode.
- Exemption-gated flows clearly present qualification disclaimer.
- MVP builds remain functional without localization module enabled.

## Out of Scope
- Full multilingual content parity.
- Legal adjudication of exemption eligibility.

## References
- PRD: Language and localization needs
- PRD: Core personas (50/20, 55/15, 65/20)
- PRD: UX flow considerations
