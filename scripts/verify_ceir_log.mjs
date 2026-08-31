import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { FIXTURE_ROOT, verifyLog } from "./ceir-lib.mjs";

const checks = [
  { file: "02-retry-chain.jsonl", expectValid: true },
  { file: "06-hash-break.jsonl", expectValid: false, diagnostic: "hash mismatch" },
  { file: "07-duplicate-run-id.jsonl", expectValid: false, diagnostic: "duplicate run_id" },
  { file: "08-late-out-of-order.jsonl", expectValid: false, diagnostic: "out-of-order timestamp" }
];
const failures = [];
let validLogs = 0;
let detectedHashBreaks = 0;
let detectedDuplicates = 0;
let detectedOrderingErrors = 0;

for (const check of checks) {
  const path = resolve(FIXTURE_ROOT, check.file);
  let result;
  try {
    result = verifyLog(await readFile(path, "utf8"), check.file);
  } catch (error) {
    failures.push(`${check.file}: ${error.message}`);
    continue;
  }
  if (check.expectValid) {
    if (!result.ok) failures.push(`${check.file}: expected valid chain, got ${result.errors.join("; ")}`);
    else validLogs += 1;
  } else {
    if (result.ok) failures.push(`${check.file}: expected strict verification failure`);
    if (check.diagnostic && !result.errors.some((error) => error.includes(check.diagnostic))) {
      failures.push(`${check.file}: missing ${check.diagnostic} diagnostic`);
    }
  }
  detectedHashBreaks += result.errors.filter((error) => error.includes("hash mismatch") || error.includes("prev_hash mismatch")).length;
  detectedDuplicates += result.duplicateRunIds.length;
  detectedOrderingErrors += result.outOfOrder.length;
}

if (failures.length > 0) {
  console.error("CEIR log verification failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`CEIR log verification passed (valid_logs=${validLogs}, hash_breaks=${detectedHashBreaks}, duplicate_run_ids=${detectedDuplicates}, out_of_order=${detectedOrderingErrors})`);
}