# Gates: W1 Lane A CEIR v0.1

OWNS: ceir/**, scripts/ceir-lib.mjs, scripts/verify_ceir*.mjs, GATES.md

Scope: Deliver the CEIR v0.1 schema, pinned event-log rules, golden fixtures, versioning policy, and public publication evidence.

- [x] A1: CEIR schema is valid draft 2020-12 JSON Schema and declares every required event field
  CHECK: node scripts/verify_ceir_schema.mjs
  EXPECT: CEIR schema verification passed
  EVIDENCE: exit 0; required_fields=13, outcomes=4; schema JSON parse and structural assertions passed.

- [x] A2: Every golden fixture validates or rejects loudly according to its declared expectation
  CHECK: node scripts/verify_ceir_fixtures.mjs
  EXPECT: CEIR fixture verification passed
  EVIDENCE: exit 0; fixture_sets=8, accepted_records=8, rejected_records=11.

- [x] A3: Hash-chain verification detects tampering, duplicate run IDs, and out-of-order events
  CHECK: node scripts/verify_ceir_log.mjs
  EXPECT: CEIR log verification passed
  EVIDENCE: exit 0; valid_logs=1, hash_breaks=1, duplicate_run_ids=1, out_of_order=1.

- [x] A4: Versioning policy and changelog stub state semver and additive-only pre-1.0 rules
  CHECK: node scripts/verify_ceir_policy.mjs
  EXPECT: CEIR policy verification passed
  EVIDENCE: exit 0; semver=stated, pre_1_0=additive_only, changelog=stubbed.

- [ ] G1: Schema and fixtures are publicly published and the registry entry is indexed
  EVIDENCE: pending; requires public repository URL and registry URL supplied after publication