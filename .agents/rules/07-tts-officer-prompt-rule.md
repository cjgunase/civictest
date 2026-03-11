---
trigger: model_decision
description: Standardize text-to-speech officer prompts and fallback behaviors.
owner: civictest
status: mvp
priority: p1
source_prd: civictest_prd.md
---

# TTS Officer Prompt Rule

## Purpose
Ensure question prompts feel interview-like and consistent across sessions.

## Non-Negotiables
- Prompt sequencing must follow interview flow (intro, question, response wait, grading transition).
- TTS failures must gracefully degrade to on-screen text prompts.
- Prompt timing must avoid truncating user response windows.

## Implementation Requirements
- Implement provider-agnostic TTS adapter.
- Cache prompt audio when practical by question and voice profile.
- Keep deterministic prompt script templates under version control.
- Ensure transcript or text prompt remains available for accessibility.

## Acceptance Checks
- Each question can be delivered with TTS when available.
- Session remains operable when TTS is unavailable.
- Intro script and stop notifications are consistent with civics engine state.

## Out of Scope
- Voice persona customization marketplace.
- Multilingual prompt packs for future localization.

## References
- PRD: Flow B (officer voice asks questions)
- PRD: Sample voice-interview script
- PRD: Architecture blueprint (TTS provider abstraction)
