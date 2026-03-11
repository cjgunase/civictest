---
trigger: model_decision
description: Define data minimization, retention, and security controls for sensitive user data.
owner: civictest
status: mvp
priority: p0
source_prd: civictest_prd.md
---

# Privacy Retention Security Rule

## Purpose
Protect user data with explicit retention boundaries and secure handling practices.

## Non-Negotiables
- Encrypt sensitive data at rest and in transit.
- Minimize retained sensitive artifacts, especially raw audio.
- Retention policy must distinguish transcript vs raw audio lifetimes.
- Access to sensitive records must be role-restricted and auditable.

## Implementation Requirements
- Define retention windows and deletion job behavior.
- Store only data needed for product function and auditability.
- Log privileged access to sensitive data.
- Avoid collecting unnecessary medical documentation by default.

## Acceptance Checks
- Retention jobs enforce configured deletion windows.
- Access control prevents unauthorized transcript/audio access.
- Security-sensitive operations leave audit logs.

## Out of Scope
- HIPAA compliance program implementation.
- Third-party SOC2 certification process.

## References
- PRD: Privacy, security, and legal constraints
- PRD: Data retention defaults
- PRD: Architecture blueprint (storage and API)
