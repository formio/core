# @formio/core

## Identity

- **Name:** `@formio/core` — version in [`package.json`](./package.json).
- **License:** MIT. **OSS sync:** YES — `ossRepo: { repo: github.com/formio/core }`. Everything in `src/` ships publicly.
- **Purpose:** Isomorphic data-processing engine for form.io. Defines the processor pipeline (validation, conditions, calculations, etc.) and the component traversal utilities every other package uses.

## Floor — immutable musts

- **Do not import from `src/experimental/`** in any file re-exported by [`src/index.ts`](./src/index.ts) (directly or transitively). Experimental is a staging area; widening the public surface to it ties stability to unstable code. See [gotcha core/experimental-import-01](../../docs/gotchas/core.md#experimental-import-01-do-not-import-from-srcexperimental-in-stable-exports).
- **Do not put license-gated logic, secrets, internal endpoints, or non-public fixtures in `src/`.** OSS sync means everything here is public on the next release.
- **Sync + async pairs must change together.** Known pairs: `eachComponentData`/`Async`, `processOne`/`Sync`, `postProcessOne`/`Sync`, and `validateProcess`/`validateProcessSync` — and the list is open-ended; grep for a `Sync` sibling before assuming a function stands alone. Prefer extracting a shared helper both sides call over patching each side (the FIO-11701 fix shape). See [gotcha core/sync-async-pair-01](../../docs/gotchas/core.md#sync-async-pair-01--eachcomponentdata-and-eachcomponentdataasync-must-stay-in-lockstep).
- **Processor order in the `Processors` array is load-bearing** — do not reorder without a PR-level reason and an integration test that proves the invariant your change relies on. [`src/process/process.ts:183`](./src/process/process.ts).
- **No runtime dependency on Express, Mongo, or any DOM API.** This package runs on the server, in browsers, and in jsdom-less environments. Adding such a dep silently breaks at least one consumer.
- **Public API additions go through `src/index.ts` re-exports.** Don't expect consumers to deep-import from `src/process/foo`.

## Ceiling — emerging patterns

Each pattern names a real file in this package. Mirror the example.

- **Pattern: a new processor exports a `ProcessorInfo` with name, processor fn, optional post-processor, and `shouldProcess` predicate. Example:** [`src/process/clearHidden/index.ts`](./src/process/clearHidden/index.ts) — the smallest reference shape. Read this before writing a new processor.
- **Pattern: additive `ProcessorContext` / `ProcessContext` field is added to both types, defaulted, and threaded through `process.ts` + `processOne.ts`. Example:** the FIO-11216 fix (commit `906ebe3fa8`) added `localRoot` / `localData` / `localRow` end-to-end. Search for `localRoot` across `src/types/process/` and `src/process/process.ts` to see the pattern.
- **Pattern: process integration tests use JSON fixtures in `src/process/__tests__/fixtures/`, registered via the `index.ts` barrel. Example:** [`src/process/__tests__/fixtures/index.ts`](./src/process/__tests__/fixtures/index.ts) — every new fixture file must be re-exported here or `process.test.ts` won't see it.
- **Pattern: traversal recursion always passes `localRoot` and conditionally swaps it on `dataObject` boundaries. Example:** [`src/utils/formUtil/eachComponentData.ts:146-162`](./src/utils/formUtil/eachComponentData.ts) — the scope handoff for nested forms. Mirror this shape in any new traversal function.
- **Pattern: small per-area `__tests__/` directory with `<feature>.test.ts` + `fixtures/`. Example:** [`src/process/__tests__/`](./src/process/__tests__/) — preferred for anything that needs fixture data. Co-located `*.spec.ts` is acceptable for pure unit tests.

## Blast radius

**18 dependents, tier: high.** See [`/docs/dependencies/core.md`](../../docs/dependencies/core.md) for the full list and the workflow for non-additive changes.

## Test & Build

```sh
pnpm -F @formio/core test         # TEST=1 mocha --loader=tsx
pnpm -F @formio/core lint         # eslint src
pnpm -F @formio/core check-types  # tsc --noEmit
pnpm -F @formio/core build        # clean + docs + tsc + tsc-alias + webpack dev + prod
```

"Green" for a local iteration = `test` + `lint` + `check-types` all pass. **"Green" for a PR = the dependents' tests pass too** — this is a high-blast-radius package (18 dependents), so before calling a change done run:

```sh
pnpm test --filter='...@formio/core'   # this package + all 18 dependents (turbo rebuilds them first)
```

`build` is only required when verifying the published artifact.

To run a single test file, use mocha directly from the package directory:

```sh
cd packages/core
TEST=1 npx mocha --loader=tsx src/process/__tests__/process.test.ts
```

## Hot paths & gotchas

See [`/docs/gotchas/core.md`](../../docs/gotchas/core.md). Current entries: nested-form scope (`core/nested-form-scope-01`), sync/async pairing (`core/sync-async-pair-01`), processor order (`core/processor-order-01`), experimental imports (`core/experimental-import-01`), validation rule registries (`core/validation-rule-sets-01`), multiple-value path scope (`core/multiple-value-path-scope-01`), normalize/default/filter value lifecycle (`core/normalize-value-lifecycle-01`).

## Cross-cutting triggers

- **Editing `src/utils/formUtil/eachComponent*`** → re-read [gotcha core/nested-form-scope-01](../../docs/gotchas/core.md#nested-form-scope-01--conditionals-inside-a-nested-form-must-resolve-against-the-nested-forms-local-root-not-the-outer-root) and [core/sync-async-pair-01](../../docs/gotchas/core.md#sync-async-pair-01--eachcomponentdata-and-eachcomponentdataasync-must-stay-in-lockstep) before changing recursion semantics.
- **Adding or reordering `Processors`** → audit any consumer that picks a subset by index; integration test required.
- **Touching `src/utils/conditions.ts`, `src/utils/operators/`, or the `conditions`/`clearHidden` processors** → read [`/docs/cross-cutting/conditional-logic.md`](../../docs/cross-cutting/conditional-logic.md) first. The same semantics exist in `@formio/js` (parallel 20-file operator registry) and `@formio/premium`; a one-sided change diverges client from server.
- **Touching `src/process/validation/`** → read the [Anatomy of validation](../../docs/architecture/core.md#anatomy-of-validation) section and [core/validation-rule-sets-01](../../docs/gotchas/core.md#validation-rule-sets-01--four-rule-registries-merge-into-two-exported-sets-gating-depends-on-conditions-having-already-run) first. Know which of the four rule arrays you're in, change all three `shouldSkipValidation*` wrappers together, and remember validation reads `scope.conditionallyHidden` precomputed by conditions. Regression tests go at both levels: the rule's `rules/__tests__/` file AND a pipeline case in `process/__tests__/process.test.ts` (the #849 shape).
- **Combining `path` with `data`/`row`/`localData` from a `ProcessorContext`** → confirm which root each is relative to; inside nested forms `path` is local while `data` is the root submission. See [core/multiple-value-path-scope-01](../../docs/gotchas/core.md#multiple-value-path-scope-01--per-index-validation-of-multiple-true-reads-data-by-path-inside-a-nested-form-those-are-differently-scoped).
- **Touching type coercion or empty-value handling (`normalize`, `defaultValue`, `filter`)** → trace the value through all three processors; `undefined` vs `null` mean different things to `filter`. See [core/normalize-value-lifecycle-01](../../docs/gotchas/core.md#normalize-value-lifecycle-01--server-side-value-normalization-spans-normalize--defaultvalue--filter-with-different-empty-value-semantics-per-stage).
- **Touching `src/process/fetch/`** → the same authored DataSource config is also executed client-side by `@formio/premium`'s DataSource component; interpolation/trigger semantics must stay in parity. See [`premium/datasource-dual-execution-01`](../../docs/gotchas/premium.md#datasource-dual-execution-01--datasource-fetch-config-runs-in-two-worlds-this-component-client-and-cores-fetch-processor-server).
- **Touching `src/utils/Evaluator.ts`, `registerEvaluator`, the `evaluate()` util, or anything a processor passes into `evaluate`** → read [`/docs/cross-cutting/server-evaluation.md`](../../docs/cross-cutting/server-evaluation.md) first. The server replaces the Evaluator with a sandboxed one at boot; context shape and error semantics are a four-package contract.
- **`major` bump** → coordinate with the OSS release (this directory ships to github.com/formio/core).

## References

- Repo-wide: [`/CLAUDE.md`](../../CLAUDE.md), [`/STANDARDS.md`](../../STANDARDS.md)
- Architecture: [`/docs/architecture/core.md`](../../docs/architecture/core.md)
- Dependencies: [`/docs/dependencies/core.md`](../../docs/dependencies/core.md)
- Gotchas: [`/docs/gotchas/core.md`](../../docs/gotchas/core.md)
