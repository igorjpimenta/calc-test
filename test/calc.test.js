// calc.test.js — the node --test suite: stable src/calc.js API + the CLI.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { add, sub, mul, div } from "../src/calc.js";

const root = path.join(import.meta.dirname, "..");
const bin = path.join(root, "bin", "calc.js");

function run(args) {
  return spawnSync(process.execPath, [bin, ...args], { encoding: "utf8" });
}

// ── src/calc.js API (stable for smoke.js) ───────────────────────────────────

test("add/sub/mul/div compute correctly", () => {
  assert.equal(add(2, 3), 5);
  assert.equal(sub(7, 4), 3);
  assert.equal(mul(3, 4), 12);
  assert.equal(div(8, 2), 4);
});

test("operations handle negatives and floats", () => {
  assert.equal(add(-2, -3), -5);
  assert.equal(sub(4, 7), -3);
  assert.equal(mul(-3, 4), -12);
  assert.equal(div(1, 2), 0.5);
});

test("div by zero throws RangeError naming the error", () => {
  assert.throws(() => div(1, 0), (e) => {
    assert.equal(e.constructor, RangeError);
    assert.match(e.message, /division by zero/);
    return true;
  });
});

// ── CLI ─────────────────────────────────────────────────────────────────────

test("calc --help prints usage and exits 0", () => {
  const r = run(["--help"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /usage: calc <add\|sub\|mul\|div> <a> <b>/);
  assert.match(r.stdout, /--help/);
});

test("calc -h matches --help", () => {
  const r = run(["-h"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /usage: calc/);
});

test("each operation computes through the CLI", () => {
  for (const [args, out] of [
    [["add", "2", "3"], "5"],
    [["sub", "7", "4"], "3"],
    [["mul", "3", "4"], "12"],
    [["div", "8", "2"], "4"],
  ]) {
    const r = run(args);
    assert.equal(r.status, 0, args.join(" "));
    assert.equal(r.stdout.trim(), out, args.join(" "));
  }
});

test("CLI division by zero errors with exit 1", () => {
  const r = run(["div", "1", "0"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /division by zero/);
  assert.equal(r.stdout, "");
});

test("unknown operation is a usage error (exit 2)", () => {
  const r = run(["pow", "2", "3"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /unknown operation: pow/);
});

test("wrong arity is a usage error (exit 2)", () => {
  const r = run(["add", "1"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /expected 2 numbers/);
});

test("non-numeric operands are usage errors (exit 2)", () => {
  for (const bad of [["add", "x", "1"], ["mul", "1", ""], ["sub", "NaN", "1"]]) {
    const r = run(bad);
    assert.equal(r.status, 2, bad.join(" "));
    assert.match(r.stderr, /not a number/);
  }
});

test("no arguments is a usage error (exit 2)", () => {
  const r = run([]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /usage: calc/);
});
