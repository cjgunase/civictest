---
trigger: model_decision
description: Define global architecture constraints and cross-cutting implementation standards.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Global Architecture Rule

## Purpose
Set baseline architecture standards for all CivicTest modules so implementation remains consistent, auditable, and testable.

## Non-Negotiables
- Use Next.js App Router with TypeScript for all new application code.
- Keep deterministic-first processing for scoring or decision logic; use AI fallback only when deterministic logic is uncertain.
- Preserve auditability for user-impacting decisions (grading, stop reasons, dynamic answer resolution).
- Keep the PRD as source-of-truth for product behavior.

## Implementation Requirements
- Define shared domain types in one place and reuse them across API/UI layers.
- Enforce strict typing and avoid `any` for domain logic.
- Isolate external providers behind interfaces (auth, STT, TTS, LLM, storage).
- Track versioned decision metadata for grading and rule engines.

## Acceptance Checks
- All core modules compile with strict TypeScript settings.
- No direct provider calls from UI components; provider calls go through service abstractions.
- Grading/session decisions are reproducible from persisted data.

## Out of Scope
- Provider-specific setup details (covered in provider-specific rules).
- Feature-specific behavior for individual modules.

## References
- PRD: Executive summary
- PRD: Data model and technical architecture
- PRD: QA, acceptance criteria, privacy, and legal constraints
