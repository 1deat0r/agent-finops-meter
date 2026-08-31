import { readJson, REQUIRED_FIELDS, OUTCOMES, SCHEMA_PATH } from "./ceir-lib.mjs";

const failures = [];
const schema = await readJson(SCHEMA_PATH);
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};
const properties = schema.properties ?? {};
const required = schema.required ?? [];
const sameMembers = (left, right) => left.length === right.length && left.every((item) => right.includes(item));

expect(schema.$schema === "https://json-schema.org/draft/2020-12/schema", "$schema is not draft 2020-12");
expect(schema.$id === "urn:agent-finops-meter:ceir:v0.1", "$id is not the pinned CEIR v0.1 identifier");
expect(schema.type === "object", "root type is not object");
expect(schema.additionalProperties === false, "root additionalProperties must be false");
expect(sameMembers(required, REQUIRED_FIELDS), "required fields do not match the CEIR contract");
expect(sameMembers(Object.keys(properties), REQUIRED_FIELDS), "properties do not cover exactly the required CEIR fields");
for (const field of REQUIRED_FIELDS) expect(required.includes(field), `missing required field ${field}`);

expect(properties.ts?.format === "date-time", "ts must declare date-time format");
expect(typeof properties.ts?.pattern === "string" && properties.ts.pattern.includes("T") && properties.ts.pattern.includes("[+-]") && properties.ts.pattern.includes("60"), "ts pattern must pin RFC 3339 lexical shape");
expect(properties.case_id?.oneOf?.some((branch) => branch.type === "null"), "case_id must permit null");
expect(properties.case_id?.oneOf?.some((branch) => branch.type === "string" && branch.minLength === 1), "case_id string branch must reject empty values");
expect(JSON.stringify(properties.outcome?.enum) === JSON.stringify(OUTCOMES), "outcome enum is incomplete or reordered");
for (const field of ["tokens_in", "tokens_out", "retries"]) {
  expect(properties[field]?.type === "integer", `${field} must be integer`);
  expect(properties[field]?.minimum === 0, `${field} must have minimum 0`);
}
expect(properties.cost_usd?.$ref === "#/$defs/fixed_usd", "cost_usd must use fixed_usd definition");
expect(typeof schema.$defs?.fixed_usd?.pattern === "string" && schema.$defs.fixed_usd.pattern.includes("{1,6}"), "fixed_usd must cap fractional precision at six digits");
expect(properties.tool_costs?.type === "array" && properties.tool_costs.items?.$ref === "#/$defs/tool_cost", "tool_costs must be a typed array");
expect(properties.source?.$ref === "#/$defs/source", "source must use source definition");
expect(schema.$defs?.tool_cost?.additionalProperties === false, "tool_cost definition must reject unknown fields");
expect(schema.$defs?.source?.additionalProperties === false, "source definition must reject unknown fields");
expect(schema.$defs?.source?.required?.includes("collector_id"), "source must require collector_id");
expect(schema.$defs?.source?.required?.includes("attribution"), "source must require attribution");
expect(schema.$defs?.source?.properties?.attribution?.required?.includes("cwd"), "attribution must require cwd");
expect(schema.$defs?.source?.properties?.attribution?.required?.includes("git"), "attribution must require git");
expect(schema.$defs?.source?.properties?.attribution?.required?.includes("task_label"), "attribution must require task_label");

if (failures.length > 0) {
  console.error("CEIR schema verification failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`CEIR schema verification passed (required_fields=${REQUIRED_FIELDS.length}, outcomes=${OUTCOMES.length})`);
}