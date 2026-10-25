#!/usr/bin/env node
// calc.js — 4-op CLI over the stable src/calc.js API.

import { add, sub, mul, div } from "../src/calc.js";

const OPS = { add, sub, mul, div };

const USAGE = `usage: calc <add|sub|mul|div> <a> <b>
       calc --help

  add a b    print a + b
  sub a b    print a - b
  mul a b    print a * b
  div a b    print a / b (errors on division by zero)

exit codes: 0 ok · 1 runtime error (division by zero) · 2 usage error`;

function fail(msg, code = 2) {
  console.error(`calc: ${msg}`);
  process.exit(code);
}

const [op, ...rest] = process.argv.slice(2);

if (op === "--help" || op === "-h" || op === "help") {
  console.log(USAGE);
  process.exit(0);
}
if (op === undefined) fail(`missing operation\n\n${USAGE}`);

const fn = OPS[op];
if (!fn) fail(`unknown operation: ${op} (expected add|sub|mul|div)`);
if (rest.length !== 2) fail(`expected 2 numbers for ${op}, got ${rest.length}`);

const nums = rest.map((raw) => {
  const n = Number(raw);
  if (String(raw).trim() === "" || !Number.isFinite(n)) fail(`not a number: ${JSON.stringify(raw)}`);
  return n;
});

try {
  console.log(fn(nums[0], nums[1]));
} catch (e) {
  fail(e.message ?? String(e), 1);
}
