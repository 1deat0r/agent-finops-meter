# CEIR versioning policy

CEIR follows Semantic Versioning (`MAJOR.MINOR.PATCH`) after the public v0.1 contract is published. The schema identifier and fixture set identify the contract consumed by a collector or compiler.

Before 1.0, changes are **additive-only**: new optional properties, definitions, and documented enum values MAY be added in a minor release; clarifications and non-semantic tooling changes use a patch release. Existing required fields, field types, accepted value shapes, outcome meanings, canonicalization, and hash-chain rules MUST NOT be removed or narrowed within v0.x. A change that would invalidate an existing valid event requires a new major contract decision, even if the major number is still zero.

A consumer MUST pin the CEIR minor version it reads, validate records before attribution, and fail closed on unknown required behavior. Producers MUST continue emitting the pinned fields and MUST NOT silently coerce malformed values. A schema change after v0.1 publication requires a compatibility review and an entry in `CHANGELOG.md`; it is not a routine edit.

The initial publication is `v0.1.0`. Fixture changes that correct an invalid expected result, alter canonical bytes, or change an acceptance edge are contract changes and MUST be called out in the changelog. New fixtures that only add coverage are patch-level documentation/tooling changes.