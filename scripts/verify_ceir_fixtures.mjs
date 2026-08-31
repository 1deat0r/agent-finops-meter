import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  FIXTURE_ROOT,
  readJson,
  parseJsonl,
  validateEvent,
  verifyLog
} from "./ceir-lib.mjs";

const manifest = await readJson(resolve(FIXTURE_ROOT, "manifest.json"));
const failures = [];
const requiredSets = new Set([
  "01-outcomes",
  "02-retry-chain",
  "03-tool-costs",
  "04-unattributed",
  "05-malformed",
  "06-hash-break",
  "07-duplicate-run-id",
  "08-late-out-of-order"
]);
const seen = new Set();
let acceptedRecords = 0;
let rejectedRecords = 0;

if (manifest.version !== "0.1") failures.push("fixture manifest version is not 0.1");
if (!Array.isArray(manifest.sets)) failures.push("fixture manifest sets must be an array");
if (Array.isArray(manifest.sets)) {
  if (manifest.sets.length !== 8) failures.push(`expected 8 fixture sets, found ${manifest.sets.length}`);
  for (const fixture of manifest.sets) {
32-35:    if (!fixture || typeof fixture !== "object") { … }
    const id = fixture.id;
37-40:    if (typeof id !== "string" || id.length === 0) { … }
    if (seen.has(id)) failures.push(`duplicate fixture set ${id}`);
    seen.add(id);
    if (!requiredSets.has(id)) failures.push(`unexpected or missing-contract fixture set ${id}`);
    if (!requiredSets.has(id)) continue;

    const path = resolve(FIXTURE_ROOT, fixture.path ?? "");
    let text;
    try {
      text = await readFile(path, "utf8");
50-53:    } catch (error) { … }

    if (fixture.kind === "events") {
…
    } else if (fixture.kind === "log") {
…
    } else {
      failures.push(`${id}: unsupported fixture kind ${fixture.kind}`);
    }
  }
}
for (const requiredSet of requiredSets) {
  if (!seen.has(requiredSet)) failures.push(`missing fixture set ${requiredSet}`);
}

if (failures.length > 0) {
  console.error("CEIR fixture verification failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`CEIR fixture verification passed (fixture_sets=${seen.size}, accepted_records=${acceptedRecords}, rejected_records=${rejectedRecords})`);
}

[…45ln elided; re-read needed ranges, e.g. /run/media/mustbearnold/Projects/Agent FinOps Meter/scripts/verify_ceir_fixtures.mjs:32-35,37-40]