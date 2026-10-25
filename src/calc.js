// calc.js — minimal arithmetic core. TASK-phxtrd builds the calculator out.

export function add(a, b) {
  return a + b;
}

export function sub(a, b) {
  return a - b;
}

export function mul(a, b) {
  return a * b;
}

export function div(a, b) {
  if (b === 0) throw new RangeError("division by zero");
  return a / b;
}
