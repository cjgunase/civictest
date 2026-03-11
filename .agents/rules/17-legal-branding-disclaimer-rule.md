---
trigger: model_decision
description: Enforce legal copy and branding constraints to avoid implied government endorsement.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Legal Branding Disclaimer Rule

## Purpose
Prevent misleading government affiliation signals and enforce legally safe presentation.

## Non-Negotiables
- Do not use DHS/USCIS seals, logos, or branding implying endorsement.
- Include clear non-affiliation disclaimer in public-facing product surfaces.
- Avoid content that suggests official agency authorization.

## Implementation Requirements
- Add and maintain standardized disclaimer copy.
- Include legal review check in release checklist.
- Ensure design assets are independently created and not agency marks.

## Acceptance Checks
- Public pages include visible non-affiliation language.
- No restricted government branding appears in UI or assets.
- Release checklist blocks launch if legal copy is missing.

## Out of Scope
- Trademark registration strategy.
- Comprehensive legal counsel workflow automation.

## References
- PRD: Privacy, security, and legal constraints
- PRD: Launch checklist (legal UI checklist)
- PRD: Public-domain content nuance
