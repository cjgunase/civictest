---
trigger: model_decision
description: Define standards for future N-400 speaking and comprehension drill modules.
owner: civictest
status: future
priority: p1
source_prd: civictest_prd.md
---

# Speaking Interview Drills Rule

## Purpose
Specify future interview-speaking drill requirements tied to naturalization interview preparation.

## Non-Negotiables
- Future module: do not implement in MVP unless explicitly requested.
- Drills must mirror interview-style question-and-answer interactions.
- Scoring must prioritize comprehension and response relevance.

## Implementation Requirements
- Include scripted prompt sets mapped to interview topics.
- Capture response timing, completeness, and comprehension indicators.
- Provide actionable feedback while preserving user dignity and accessibility.

## Acceptance Checks
- Drill session can be completed in voice or accessible fallback mode.
- Outputs include transparent feedback dimensions.
- No coupling that blocks MVP civics-only launch.

## Out of Scope
- Official legal evaluation replacement.
- Reading/writing modules.

## References
- PRD: Feature priority table (N-400 speaking/comprehension drills)
- PRD: English speaking assessment is embedded in interview
- PRD: Target users and personas
