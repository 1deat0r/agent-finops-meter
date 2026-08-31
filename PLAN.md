# Agent FinOps Meter — W1 Execution Plan

## Scope

Lane A delivered the CEIR v0.1 schema, golden fixtures, append-only hash-chain format, fail-closed validators, versioning policy, and G1 publication evidence. Lane B now delivers the public vendor audit required for G0. Adapters, wrappers, harness hooks, gallery, calculator, and hosted services remain outside this W1 audit slice.

## Lane A completion and stop point

Lane A's G1 artifacts are complete and published. The CEIR contract is the shared interface for downstream work; changes after publication are red flags, not routine edits.

## Lane B — G0 vendor-audit execution

1. Define the strict CFO-facing test: completed case/workflow cost, explicit chargeback/showback/allocation, and cost attribution for retry, failed, abandoned, and unattributed work.
2. Review roughly ten agent/LLM observability products using primary official documentation, APIs, and source repositories only.
3. Separate finance-unit economics from engineer-facing traces, token/latency dashboards, request/session rollups, and raw spend views.
4. Publish one cited competitive-landscape table in research/vendor-audit.md.
5. Run the reproducible audit check, independently verify cited source availability, measure the strict pass count, and apply the fixed G0 decision rule.
6. Post G0 evidence and stop for adjudication; do not begin another gate or change scope/date from this plan.

## Audit artifact tree

research/vendor-audit.md is the single public competitive-landscape artifact. It records the as-of date, selection rationale, criteria, per-vendor statuses, primary-source links, strict count, and conservative recommendation.

scripts/verify_vendor_audit.mjs checks the artifact's vendor-row count, evidence-section count, status cells, source-link coverage, and strict CFO-facing count.

## Acceptance evidence

- G0: audit check exits zero and reports ten vendors with ten evidence sections, cited source URLs, and a strict CFO-facing count of zero.
- G0 decision: 0–1 qualifying vendors preserves the “almost none” positioning; 2+ would require same-day repositioning to cross-harness neutrality + local-first.
- After posting G0 evidence, wait for adjudication. No downstream implementation is authorized by this plan.
