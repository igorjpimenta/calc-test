# calc-test

Permissions-proving calculator — 4-op CLI over a stable arithmetic core.

- `src/calc.js` — add / sub / mul / div (div by zero throws)
- `bin/calc.js` — the CLI
- `npm run smoke` — smoke run proving local execution works

## Usage

```
calc <add|sub|mul|div> <a> <b>
calc --help
```

```
$ node bin/calc.js add 2 3
5
$ node bin/calc.js div 1 0
calc: division by zero   (exit 1)
$ node bin/calc.js --help
usage: calc <add|sub|mul|div> <a> <b>
       calc --help
```

Exit codes: `0` ok · `1` runtime error (division by zero) · `2` usage error
(unknown operation, wrong arity, non-numeric operands, missing operation).

## Development

- `npm test` — full `node --test` suite (API + CLI)
- `npm run smoke` — smoke run against `src/calc.js`
