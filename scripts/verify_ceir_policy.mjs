import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PROJECT_ROOT } from "./ceir-lib.mjs";

const policyPath = resolve(PROJECT_ROOT, "ceir/policy/v0.1/VERSIONING.md");
const changelogPath = resolve(PROJECT_ROOT, "CHANGELOG.md");
const [policy, changelog] = await Promise.all([
  readFile(policyPath, "utf8"),
  readFile(changelogPath, "utf8")
]);
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

expect(/Semantic Versioning|SemVer|semver/i.test(policy), "policy does not state semver");
expect(/additive-only/i.test(policy), "policy does not state additive-only pre-1.0 rules");
expect(/before 1\.0|pre-1\.0|0\.x/i.test(policy), "policy does not scope compatibility rules before 1.0");
expect(/MUST NOT be removed|invalidate an existing valid event/i.test(policy), "policy does not protect existing valid events");
expect(/0\.1\.0/.test(policy), "policy does not identify the initial 0.1.0 publication");
expect(/^# Changelog/m.test(changelog), "changelog heading is missing");
expect(/\[0\.1\.0\]/.test(changelog), "changelog 0.1.0 stub is missing");
expect(/canonicalization|hash-chain|schema/i.test(changelog), "changelog stub does not identify contract artifacts");

if (failures.length > 0) {
  console.error("CEIR policy verification failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("CEIR policy verification passed (semver=stated, pre_1_0=additive_only, changelog=stubbed)");
}