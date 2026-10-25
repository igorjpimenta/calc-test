// smoke.js — basic smoke run proving local execution works.
import { add, sub, mul, div } from "./src/calc.js";

const checks = [
  ["add(2, 3) === 5", add(2, 3), 5],
  ["sub(7, 4) === 3", sub(7, 4), 3],
  ["mul(3, 4) === 12", mul(3, 4), 12],
  ["div(8, 2) === 4", div(8, 2), 4],
];

let failed = 0;
for (const [name, actual, expected] of checks) {
  if (actual === expected) console.log(`ok   ${name}`);
  else {
    console.error(`FAIL ${name}: got ${actual}`);
    failed++;
  }
}

try {
  div(1, 0);
  console.error("FAIL div(1, 0) should throw");
  failed++;
} catch (e) {
  console.log(`ok   div(1, 0) throws: ${e.constructor.name}: ${e.message}`);
}

if (failed) {
  console.error(`smoke: ${failed} check(s) failed`);
  process.exit(1);
}
console.log("smoke: all checks passed");
