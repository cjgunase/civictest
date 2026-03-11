---
trigger: model_decision
description: Define voice capture, transcription, and fallback behavior for civics sessions.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Voice Capture STT Rule

## Purpose
Enforce a voice-first interview simulation with robust transcription and accessible fallback behavior.

## Non-Negotiables
- Civics simulation defaults to voice input.
- Mic permission denial must not block session completion.
- Transcript must be visible to user before final grading submission when possible.
- Typed fallback path is mandatory.

## Implementation Requirements
- Implement STT provider abstraction interface.
- Handle mic permission states explicitly (granted/denied/prompt).
- Capture transcript confidence/metadata when available.
- Store transcript as primary grading input; audio storage is optional and policy-bound.

## Acceptance Checks
- User can complete session via voice on supported browsers.
- User can complete equivalent session via typed fallback without voice.
- Permission denial routes user into fallback flow without dead end.

## Out of Scope
- Final provider selection economics.
- Reading/writing speech tasks.

## References
- PRD: Flow B (voice-first mock interview)
- PRD: Architecture blueprint (Speech and AI layer)
- PRD: Accessibility metrics and acceptance criteria
