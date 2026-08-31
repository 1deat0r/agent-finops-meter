import { createHash } from "node:crypto";
…
import { fileURLToPath } from "node:url";

export const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SCHEMA_PATH = resolve(PROJECT_ROOT, "ceir/schema/v0.1/ceir.schema.json");
export const FIXTURE_ROOT = resolve(PROJECT_ROOT, "ceir/fixtures/v0.1");
export const ZERO_HASH = "0".repeat(64);
export const OUTCOMES = ["completed", "failed", "escalated", "abandoned"];
11-25:export const REQUIRED_FIELDS = [ … ];
export const EVENT_FIELDS = new Set(REQUIRED_FIELDS);
export const ENVELOPE_FIELDS = new Set(["prev_hash", "event", "hash"]);
const FIXED_USD = /^(0|[1-9][0-9]*)(\.[0-9]{1,6})?$/;
const HASH = /^[0-9a-f]{64}$/;
const RFC3339 = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d):((?:[0-5]\d|60))(?:\.(\d+))?(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

35-38:function skipWhitespace(text, index) { … }

40-64:function readString(text, start) { … }

66-70:function readPrimitive(text, start) { … }

72-79:function scanValue(text, start) { … }

81-100:function scanObject(text, start) { … }

102-114:function scanArray(text, start) { … }

116-121:function assertNoDuplicateKeys(text) { … }

123-132:export function parseJson(text, label = "JSON") { … }

134-142:export function parseJsonl(text, label = "JSONL") { … }

export async function readJson(path) {
  return parseJson(await readFile(path, "utf8"), path);
}

148-155:function addMissingAndExtraErrors(value, allowed, required, path, errors) { … }

function validateNonEmptyString(value, path, errors) {
  if (typeof value !== "string" || value.length === 0) errors.push(`${path}: expected non-empty string`);
}

161-165:function validateFixedUsd(value, path, errors) { … }

167-173:function daysInMonth(year, month) { … }

175-200:export function timestampToMillis(value) { … }

202-262:export function validateEvent(event) { … }

264-274:function compareUnicodeScalars(left, right) { … }

276-302:export function canonicalize(value, path = "$", seen = new Set()) { … }

304-307:export function hashEvent(prevHash, event) { … }

309-321:export function validateEnvelope(envelope) { … }

323-382:export function verifyLog(text, label = "JSONL log") { … }

384-392:export function buildLog(events) { … }

[…306ln elided; re-read needed ranges, e.g. /run/media/mustbearnold/Projects/Agent FinOps Meter/scripts/ceir-lib.mjs:2-3,11-25]