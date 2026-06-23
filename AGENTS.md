# Repository Instructions

## Project Facts

- Single Angular application named `rise`; source root is `src/` and routes are wired in `src/app/app.routes.ts` with lazy `loadComponent` imports.
- Use `pnpm` only. The repo declares `packageManager: pnpm@11.8.0`, Angular CLI is configured with `packageManager: pnpm`, and `.npmrc` has `engine-strict=true` plus dependency script controls.
- Angular is v22; do not add `standalone: true` to components/directives/pipes because standalone is already the default.

## Commands

- Install: `pnpm install`
- Dev server: `pnpm start` or `pnpm exec ng serve` on `http://localhost:4200/`.
- Production build: `pnpm build` (`ng build`, default config is production with bundle budgets).
- Development watch build: `pnpm watch`.
- Lint TS and Angular templates: `pnpm lint`.
- Format only app sources: `pnpm format` runs Prettier on `src/**/*.{ts,html,css,json}`.
- Unit tests: `pnpm test` uses Angular's `@angular/build:unit-test` builder with Vitest and jsdom by default.
- Focus one spec file: `pnpm exec ng test --include src/app/path/name.component.spec.ts`.
- Focus by suite/test name: `pnpm exec ng test --filter 'NamePattern'`.
- List discovered tests without running: `pnpm exec ng test --list-tests`.

## Structure And Imports

- Path aliases are defined in `tsconfig.json`: `@app/*`, `@core/*`, `@shared/*`, `@features/*`, `@env/*`, `@layouts/*`, and `@models/*`.
- Main app bootstrap is `src/main.ts`; providers live in `src/app/app.config.ts`.
- Auth-related state, models, and guards are under `src/app/core/auth/`; role dashboards live under `src/app/features/{coordinador,profesor,padre}/`.
- Existing services use Angular v22 `@Service()` from `@angular/core`; follow that convention unless a failing verification shows it must change.
- Coordinator API calls currently target relative `/api` endpoints from `src/app/features/coordinador/services/coordinador-api.service.ts`; there is no environment file in the repo.

## Style Constraints

- ESLint enforces Angular selectors: components `app-*` in kebab-case and attribute directives `app*` in camelCase.
- ESLint enforces `type` aliases over `interface` via `@typescript-eslint/consistent-type-definitions`.
- Prefer the existing Angular patterns: `input()`/`output()` over decorators, signals/computed for local state, `inject()` over constructor injection, native template control flow, and no `ngClass`/`ngStyle`.
- Use `host` metadata instead of `@HostBinding`/`@HostListener`.
- Preserve strict TypeScript settings from `tsconfig.json` (`noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `isolatedModules`).

## UI And Accessibility

- `DESIGN.md` is the source for the institutional incident-management visual language; `src/styles.css` already exposes the matching CSS variables and utility classes.
- Keep UI in the existing Inter-based, card/table/dashboard style with the blue/orange status palette from `DESIGN.md`.
- Angular template accessibility rules are enabled through `angular.configs.templateAccessibility`; keep focus states, labels, ARIA, and color contrast WCAG AA-safe.

## Testing Notes

- Specs are colocated as `*.spec.ts` under `src/app/`; no e2e framework or CI workflow is configured in this repo.
- Tests run in jsdom unless browser flags are provided to `ng test`.
