import fs from 'node:fs';
import path from 'node:path';

const artifactPath = path.resolve(process.cwd(), 'research/vendor-audit.md');
const artifact = fs.readFileSync(artifactPath, 'utf8');

function fail(message) {
  throw new Error(message);
}

function expect(condition, message) {
  if (!condition) fail(message);
}

expect(artifact.includes('**As-of date:** 2026-09-01'), 'audit as-of date is missing');
expect(artifact.includes('## Results at a glance'), 'results section is missing');
expect(artifact.includes('## Strict CFO-facing count'), 'strict count section is missing');
expect(artifact.includes('## Vendor evidence'), 'vendor evidence section is missing');
expect(artifact.includes('## Conservative G0 recommendation'), 'G0 recommendation is missing');

const lines = artifact.split(/\r?\n/);
const headerIndex = lines.findIndex((line) => line.startsWith('| Vendor / product |'));
expect(headerIndex >= 0, 'vendor results table header is missing');

const rows = [];
for (const line of lines.slice(headerIndex + 2)) {
  if (!line.startsWith('|')) break;
  const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
  if (cells.length === 6 && cells[0].startsWith('[')) rows.push(cells);
}

expect(rows.length === 10, `expected 10 vendor rows, found ${rows.length}`);
const vendorNames = rows.map((row) => row[0].match(/^\[([^\]]+)\]/)?.[1]);
expect(vendorNames.every(Boolean), 'every vendor row must have a linked name');
expect(new Set(vendorNames).size === rows.length, 'vendor names must be unique');

function status(cell) {
  return cell.match(/^\*\*(Yes|Partial|Unknown)\*\*/)?.[1] ?? null;
}

const statuses = rows.map((row) => row.slice(2, 5).map(status));
expect(statuses.every((row) => row.every(Boolean)), 'every criterion cell needs Yes, Partial, or Unknown');
const strictCfoVendors = statuses.filter((row) => row.every((value) => value === 'Yes')).length;
expect(strictCfoVendors === 0, `strict CFO-facing count changed unexpectedly: ${strictCfoVendors}`);

const evidenceHeadingIndex = lines.findIndex((line) => line === '## Vendor evidence');
const recommendationIndex = lines.findIndex((line) => line === '## Conservative G0 recommendation');
const evidenceHeadings = lines
  .slice(evidenceHeadingIndex + 1, recommendationIndex)
  .filter((line) => line.startsWith('### '));
expect(evidenceHeadings.length === 10, `expected 10 vendor evidence sections, found ${evidenceHeadings.length}`);

const sourceUrls = [...artifact.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
expect(sourceUrls.length >= 30, `expected at least 30 cited source URLs, found ${sourceUrls.length}`);
expect(new Set(sourceUrls).size >= 25, 'cited source URLs lack sufficient coverage');
expect(
  artifact.includes('**0 of 10 vendors pass the strict threshold (all three criteria = Yes).**'),
  'strict count statement is missing or inconsistent'
);

console.log('Vendor audit verification passed');
console.log(`as_of=2026-09-01; vendors=${rows.length}; vendor_evidence_sections=${evidenceHeadings.length}; source_urls=${sourceUrls.length}; unique_source_urls=${new Set(sourceUrls).size}; strict_cfo_vendors=${strictCfoVendors}`);
