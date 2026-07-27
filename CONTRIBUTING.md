# Contributing

Thanks for helping out. This project is a React port of [Cally](https://github.com/WickyNilliams/cally) — when in doubt about behaviour, Cally is the reference.

## Getting started

```bash
git clone https://github.com/ElJijuna/calendar-react.git
cd calendar-react
npm install
npm run dev          # demo playground at http://localhost:5173
npm run storybook    # component workbench at http://localhost:6006
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite playground (`demo/`) wired to the source |
| `npm run storybook` | Storybook 10 workbench |
| `npm test` | Jest + jsdom + Testing Library |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Tests with coverage thresholds (90%) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Biome + ESLint |
| `npm run lint:fix` | Autofix both |
| `npm run build` | Vite library build + `dist/styles.css` |
| `npm run check:exports` | `attw` + `publint` on the packed tarball |

## Ground rules

- **Parity first.** Prop names, defaults, part names and keyboard behaviour follow Cally. If you deviate, say why in the PR.
- **Accessibility is not optional.** Every interactive change needs keyboard coverage and a `jest-axe` assertion.
- **Tests with behaviour.** Query by role and accessible name; avoid snapshots and implementation details.
- **No runtime dependencies.** The package ships zero dependencies; keep it that way.
- **Formatting is automated.** Biome owns formatting, ESLint owns correctness. Run `npm run lint:fix` before pushing.

## Commits

Conventional Commits, enforced by commitlint:

```
feat: add pageBy="single" support to CalendarMulti
fix(range): keep the hover preview after paging
docs: document data-part tokens
```

## Changesets

Anything user-facing needs a changeset:

```bash
npm run changeset
```

Pick the bump (patch / minor / major) and describe the change for the changelog. Releases are automated: merging to `main` opens a "version packages" PR, and merging that publishes to npm with provenance.

## Reporting bugs

Open an issue with the version, a minimal reproduction, and what you expected. If the same bug exists in Cally, mention it — the fix may belong upstream.
