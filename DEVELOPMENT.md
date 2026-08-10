# Development

This document describes the local development workflow for `jsonresume-theme-eventide`: installing dependencies, building and testing the theme, working on the built-in editor, and publishing releases.

## Prerequisites

- Node.js and npm
- Optional: [`mise`](https://mise.jdx.dev/) for the release helper task

Use `npm ci` to install dependencies. This project is sensitive to exact tool versions, so `npm ci` is preferable to `npm install`, especially when debugging CI differences.

```console
npm ci
```

During install, the `prepare` script does two things:

- installs Husky git hooks
- runs `npm run build`

## Daily workflow

### Build the theme

```console
npm run build
```

This runs:

1. `prebuild`, which regenerates `schema.d.ts` from the JSON Resume schema
2. `vite build`, which produces the library bundles in `dist/`

The package currently ships three bundle formats:

- `dist/index.js`: ESM build
- `dist/index.cjs`: CommonJS build
- `dist/index.umd.cjs`: UMD build

Type declarations are emitted to `dist/index.d.ts`.

### Run the editor locally

```console
npm run dev
```

This serves the built-in editor from `editor/` through Vite.

### Build the editor

```console
npm run build-editor
```

This builds the standalone editor and writes the output to `public/`, which is what GitHub Pages deploys.

## Verification

Run these before pushing changes:

```console
npm run type-check
npm run format -- --check
npm test
```

Notes:

- `npm run type-check` runs `tsc`
- `npm run format -- --check` verifies formatting with Prettier
- `npm test` runs Vitest
- CI uses `npm test -- --coverage`

If formatting passes locally but fails in CI, the first thing to check is whether your local dependencies are stale. Reinstall with `npm ci`.

## Git hooks

Husky installs two hooks:

- `pre-commit`: runs `lint-staged`
- `pre-push`: runs `npm test`

If `pre-commit` fails with a missing `lint-staged` error, dependencies have not been installed correctly. Run `npm ci`.

## CI and workflows

### Verify workflow

`.github/workflows/verify.yml` is the reusable verification workflow. It runs:

1. `npm ci`
2. `npm run type-check`
3. `npm run format -- --check`
4. `npm test -- --coverage`

### Main workflow

`.github/workflows/main.yml` runs the verify workflow on pushes, except for version tags matching `v*`.

### npm publish workflow

`.github/workflows/publish.yml` runs on pushes of tags matching `v*`.

It:

1. re-runs verification
2. checks that the git tag matches `package.json`'s version
3. publishes the package to npm with provenance enabled

This means a release is created by making a version bump commit and pushing the corresponding tag.

### GitHub Pages workflow

`.github/workflows/pages.yml` runs on pushes to `main` and on manual dispatch.

It:

1. runs `npm ci`
2. runs `npm run build-editor`
3. uploads `public/`
4. deploys that artifact to GitHub Pages

## Releasing

### Manual release

To publish a new version manually:

```console
npm version patch
git push
git push --follow-tags
```

Replace `patch` with `minor` or `major` as needed.

`npm version` updates `package.json` and `package-lock.json`, creates a commit, and creates a `v*` tag. Pushing the tag triggers the publish workflow.

### Release with mise

If you use `mise`, the repository includes a helper task:

```console
mise run release patch
```

Equivalent levels:

- `mise run release patch`
- `mise run release minor`
- `mise run release major`

The task runs:

1. `npm version <level>`
2. `git push`
3. `git push --follow-tags`

## Files worth knowing

- `package.json`: scripts, package metadata, dependencies
- `vite.config.js`: library build configuration
- `editor/vite.config.js`: editor build configuration
- `.github/workflows/verify.yml`: reusable CI checks
- `.github/workflows/publish.yml`: npm publication on version tags
- `.github/workflows/pages.yml`: editor deployment to GitHub Pages
- `.husky/pre-commit`: pre-commit checks
- `.husky/pre-push`: pre-push checks
