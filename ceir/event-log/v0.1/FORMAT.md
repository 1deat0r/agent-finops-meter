# CEIR v0.1 append-only event log

A CEIR event log is UTF-8 JSON Lines (JSONL). Each non-empty line is one immutable envelope:

```json
{"event": {"...": "CEIR v0.1 record"}, "hash": "<64 lowercase hex>", "prev_hash": "<64 lowercase hex>"}
```

The `event` value MUST validate against `ceir/schema/v0.1/ceir.schema.json`. The envelope MUST contain exactly `prev_hash`, `event`, and `hash`; unknown envelope properties are invalid.

## Canonicalization

CEIR v0.1 pins **sorted-key canonical JSON**, not implementation-default pretty printing:

1. Object member names are sorted recursively in ascending Unicode scalar-value lexicographic order.
2. Array order is preserved.
3. Strings use RFC 8259 JSON escaping; no insignificant whitespace is emitted.
4. Numbers use their JSON representation and MUST be finite. CEIR event numbers are non-negative safe integers; USD values are strings.
5. Values are encoded as UTF-8 bytes. Object key order in the source JSON is irrelevant after parsing.
6. Duplicate object member names are invalid and MUST be rejected before canonicalization.

The canonical JSON used for a record is the canonical serialization of the **event object only**. The envelope's `hash` is never included in its own input.

## Chain rule

Let `P` be the raw lowercase hexadecimal `prev_hash` string and `E` be `canonical_json(event)`. The record hash is:

```text
hash = lowercase_hex(SHA-256(UTF-8(P + E)))
```

The first line MUST use 64 zeroes for `prev_hash`. Every later line MUST set `prev_hash` to the immediately preceding line's `hash`. A verifier MUST reject a missing line, broken predecessor, malformed hash, or hash mismatch.

## Ordering and identity

Append order is authoritative; existing lines MUST NOT be rewritten or silently sorted. `run_id` is globally unique within one log. A duplicate `run_id` is rejected even if the chain hashes are otherwise correct. Event timestamps MUST be non-decreasing by append order after conversion to an instant. A later line with an older timestamp is a late-arriving/out-of-order event and is rejected by the strict verifier; quarantine it for a new log or append a corrected event with a new `run_id`.

A final newline is recommended but not required. Blank lines, invalid JSON, duplicate JSON keys, and trailing non-JSON content are malformed and fail closed.