---
trigger: model_decision
description: Define deployment environment, secrets, and rollout safety requirements.
owner: civictest
status: mvp
priority: p1
source_prd: civictest_prd.md
---

# Deployment Environments Rule

## Purpose
Ensure safe and repeatable deployments with proper isolation and feature controls.

## Non-Negotiables
- Separate environments for local, staging, and production.
- Secrets must not be hardcoded or committed.
- Risky provider integrations must be feature-flagged for safe rollout.

## Implementation Requirements
- Use environment-specific configuration for provider keys and endpoints.
- Gate new STT/TTS/LLM integrations behind runtime flags.
- Provide rollback path for feature flags affecting session grading.
- Keep deployment checklist with preflight validation.

## Acceptance Checks
- Production build runs without development secrets.
- Feature flags can disable fallback or provider-specific paths without redeploy.
- Staging can validate end-to-end flow before production promotion.

## Out of Scope
- Multi-region active-active failover.
- Vendor-specific infra templates.

## References
- PRD: Architecture blueprint
- PRD: Hardening + launch timeline
- PRD: Cost controls and provider abstractions
