# Agent FinOps Meter — W1 Lane A Plan

## Scope

Deliver CEIR v0.1 schema and golden fixtures for G1. This work covers the event contract, append-only JSONL hash-chain format, fail-closed validation, versioning policy, and publication evidence. Lane B vendor audit and all downstream adapters/wrappers remain out of scope for this execution slice.

## Execution sequence and stop point

1. Lock the CEIR v0.1 schema and event-log rules.
2. Add eight fixture sets covering the required valid and failure edges.
3. Add deterministic validators and run the acceptance checks.
4. Measure the acceptance metrics and record evidence in `GATES.md`.
5. Publish the repository artifacts and a schema-registry entry.
6. Stop at G1 and wait for adjudication; do not start the next brief from this plan.

## Implementation tree

```text
ceir/
  schema/v0.1/ceir.schema.json       JSON Schema draft 2020-12
  event-log/v0.1/FORMAT.md           JSONL envelope, canonicalization, chain rules
  fixtures/v0.1/                     eight named fixture sets
  policy/v0.1/VERSIONING.md          semver and pre-1.0 compatibility policy
CHANGELOG.md                          release stub for v0.1.0
scripts/
  ceir-lib.mjs                       local validator and chain primitives
  verify_ceir_schema.mjs             schema contract check
  verify_ceir_fixtures.mjs           fixture matrix check
  verify_ceir_log.mjs                 chain, duplicate, and ordering check
  verify_ceir_policy.mjs              policy/changelog contract check
```

## Contract decisions

- CEIR records are strict objects: unknown fields are rejected; required fields cannot be omitted.
- `case_id: null` is the explicit unattributed state. Empty strings are invalid.
- `cost_usd` and tool costs are decimal strings, never binary JSON numbers: non-negative, no leading zeroes, and at most six fractional digits.
- `ts` is RFC 3339 date-time with an explicit UTC offset. Validation rejects malformed timestamps instead of coercing them.
- A log line is `{prev_hash,event,hash}`. `hash = SHA-256(prev_hash + canonical_json(event))`; the first `prev_hash` is 64 zeroes. The `hash` field is excluded from the hashed input.
- Canonical JSON is pinned to recursively sorted object keys, array order preserved, UTF-8 JSON with no insignificant whitespace, and no non-finite values. The exact algorithm is documented beside the format.
- Append order is authoritative. A timestamp regression is reported as out-of-order/late-arriving and rejected by the strict verifier; existing lines are never rewritten or silently reordered.
- Duplicate `run_id` values are rejected even when their hashes are valid.

## Fixture matrix

| Set | Contract edge | Expected result |
|---|---|---|
| `01-outcomes` | completed, failed, escalated, abandoned | all schema-valid |
| `02-retry-chain` | retry count and repeated run attempts | schema-valid; chain-valid |
| `03-tool-costs` | typed non-empty tool costs | schema-valid |
| `04-unattributed` | `case_id: null` | schema-valid |
| `05-malformed` | missing/invalid fields and unknown property | rejected, never coerced |
| `06-hash-break` | tampered event/hash | chain rejected |
| `07-duplicate-run-id` | duplicate identifier | log rejected |
| `08-late-out-of-order` | timestamp regression in append order | log rejected with ordering diagnostic |

## Acceptance evidence

- A1: schema check exits zero and prints the decisive success token.
- A2: fixture check reports every valid record accepted and every malformed record rejected; no coercions occur.
- A3: log check reports tamper, duplicate, and ordering detections.
- A4: policy check confirms semver, additive-only pre-1.0 rules, and changelog stub.
- G1: public repository URL plus indexed schema-registry URL; publication is not claimed until both are observed.