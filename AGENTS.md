# Repository Instructions

## Project Facts

- Single Angular application named `rise`; source root is `src/` and routes are wired in `src/app/app.routes.ts`.
- Use `pnpm` only. The repo declares `packageManager: pnpm@11.8.0`, Angular CLI is configured with `packageManager: pnpm`, and `.npmrc` has `engine-strict=true` plus dependency script controls.
- Angular is **v22** and all components/directives/pipes are **standalone by default**. Do not add `standalone: true` to component/directive/pipe metadata — it is already the default and the property is omitted across the codebase.
- The root component is `App` in `src/app/app.ts` (selector `app-root`); providers live in `src/app/app.config.ts` and bootstrap is `src/main.ts`.

## Architecture And Conventions

- **Lazy loading:** every route is lazily loaded. Use `loadComponent` for single-page routes and `loadChildren` for feature route files (`coordinador.routes.ts`, `profesor.routes.ts`, `padre.routes.ts`). Add `@defer` blocks for above-the-fold-heavy subcomponents when possible. Do not statically import page/component modules into the root bundle.
- **Signals:** prefer `signal`/`computed` for local component state and derived values (see `auth.service.ts`, `dashboard-layout.component.ts`, `incidencia-form.component.ts`). Expose internal state via `asReadonly()` and derive read-only views with `computed`. Use functional guards (`CanActivateFn`) with `inject()` rather than class guards.
- **Reactive Forms:** use `ReactiveFormsModule` with `FormBuilder` (injected) and typed validators for all data-entry forms (see `incidencia-form.component.ts`). Use `signal` to drive auxiliary UI state (e.g. search filtering), and bridge form value changes with `computed` where helpful. Avoid template-driven (`ngModel`) forms for anything beyond trivial single-field cases.
- **Modern APIs:** use `input()`/`output()`, `inject()`, `host` metadata (not `@HostBinding`/`@HostListener`), `effect()` for side-effectful derivations, and native template control flow (`@if`/`@for`/`@switch`). Avoid `ngClass`/`ngStyle`, `ngIf`/`@Input`/`@Output` decorators, and constructor injection.
- Models are declared as `type` aliases (ESLint `@typescript-eslint/consistent-type-definitions: type`). Do not use `interface`.

## Services And Dependency Injection

Angular v22 introduced the `@Service()` decorator as a replacement for `@Injectable({ providedIn: 'root' })`. The codebase uses it exclusively — never use `@Injectable`.

### Creating Services

- Decorate services with `@Service()` from `@angular/core` (see `auth.service.ts`, `coordinador-api.service.ts`). `@Service()` is tree-shakable and registers the service at root by default, so **do not** add `providedIn` or register it again in `app.config.ts` unless overriding the default.
- Name service files `<feature>.service.ts` and colocate them under the feature `services/` folder (`features/<feature>/services/`) or `core/` for cross-cutting concerns (`core/auth/services/auth.service.ts`).
- Inject dependencies with the `inject()` function as private readonly fields — never constructor injection. Example pattern:

```ts
import { Service, inject } from '@angular/core';

@Service()
export class ExampleService {
  private readonly http = inject(HttpClient);
  // ...
}
```

### State Services (Store Pattern)

- For session/global state use a signal-backed store: keep a private `signal` and expose it via `asReadonly()`, plus `computed` derived views (see `AuthService`: `sessionState` → `session`, `user`, `role`, `isAuthenticated`).
- Keep mutation methods explicit (`setSession`, `clearSession`); do not expose the writable signal directly.

## API Connections

- The backend uses an `ApiResponse<T>` envelope: `{ success: boolean; message?: string; data: T }` (see `api-response.model.ts`). Type all HTTP calls against this wrapper: `this.http.get<ApiResponse<UserResponse[]>>`.
- HttpClient is provided globally via `provideHttpClient()` in `app.config.ts`; no per-feature providers needed.
- Service pattern for API access (see `coordinador-api.service.ts`): inject `HttpClient`, keep a `private readonly baseUrl` field, and expose one typed method per endpoint returning `Observable<ApiResponse<T>>`.
- There is no environment file committed yet; `baseUrl` is the relative `/api` string. When wiring real APIs, create `src/environments/environment.ts`/`.prod.ts` (use `@env/*` alias) and replace the hard-coded string with the environment base URL.
- Colocate request/response models in the feature `models/` folder as `type` aliases (see `IncidentResponse`, `CreateIncidentRequest`, `UpdateIncidentRequest`). Use `as const` objects for enum-like values (see `IncidentStatus`).
- For authenticated requests, attach the bearer token from `AuthService` via a functional HTTP interceptor (`HttpInterceptorFn` + `inject()`), not a class interceptor.

## Mobile First And Styling

- **Mobile first:** all base styles target the smallest viewport, then progressively enhance via `min-width` media queries (`@media (min-width: 768px)` in `src/styles.css`). Always author the mobile/single-column layout first and layer tablet/desktop enhancements on top — never the reverse.
- **Per-component CSS:** every component and page owns an independent stylesheet paired via `styleUrl: './name.component.css'` (all existing pages/components follow this). Do not inline styles in the template or place component-specific styling in `src/styles.css`. Keep `src/styles.css` reserved for global resets, design tokens (CSS variables in `:root`), and shared utility classes (`app-card`, `app-button`, `app-table`, `app-chip`, etc.).
- Component style budgets are enforced in production builds (`anyComponentStyle` warning at 8kB, error at 16kB in `angular.json`); keep per-component CSS lean and rely on shared tokens/utilities for repeated patterns.
- Layout containers (`auth-layout`, `dashboard-layout`) provide the responsive shell; inner pages (`app-page` grid) plug into them. The dashboard sidebar is fixed on desktop and collapses to a hamburger on mobile via the `isSidebarOpen` signal.

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

Path aliases are defined in `tsconfig.json` and must be used in place of deep relative imports:

| Alias | Resolves to | Use for |
| --- | --- | --- |
| `@app/*` | `./src/app/*` | Cross-feature app imports |
| `@core/*` | `./src/app/core/*` | Auth state, models, guards, cross-cutting services |
| `@shared/*` | `./src/app/shared/*` | Reusable components, pipes, directives |
| `@features/*` | `./src/app/features/*` | Role/feature pages and components |
| `@env/*` | `./src/environments/*` | Environment configs (none committed yet) |
| `@layouts/*` | `./src/app/layouts/*` | Auth + dashboard layout shells |
| `@models/*` | `./src/app/shared/models/*` | Shared domain model `type` aliases |

Layout of `src/app/`:

- `layouts/` — `auth-layout` (login/register shell) and `dashboard-layout` (sidebar + content shell) consumed by top-level routes.
- `features/` — one folder per role/feature: `auth`, `coordinador`, `profesor`, `padre`, `settings`, plus `forbidden`/`not-found` pages. Each feature has its own `*.routes.ts`, `pages/`, optional `components/`, `services/`, and `models/`.
- `core/auth/` — session store (`auth.service.ts`), guards (`guest.guard.ts`, `role.guard.ts`), and auth models.
- `shared/` — presentational components (`sidebar`), pipes (`role-label.pipe.ts`).

API integration: `CoordinadorApiService` targets relative `/api` endpoints; there is no environment file in the repo yet. When wiring real APIs, create `src/environments/environment.ts`/`.prod.ts` and consume the base URL via `@env/*`.

## Style Constraints

- ESLint enforces Angular selectors: components `app-*` in kebab-case and attribute directives `app*` in camelCase.
- ESLint enforces `type` aliases over `interface` via `@typescript-eslint/consistent-type-definitions`.
- Preserve strict TypeScript settings from `tsconfig.json` (`noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `isolatedModules`) and Angular strict options (`strictInjectionParameters`, `strictInputAccessModifiers`).
- Keep files `isolatedModules`-safe: use `type`-only imports for types (`import type { ... }`) and avoid `export =`.

## UI And Accessibility

- `DESIGN.md` is the authoritative source for the institutional incident-management visual language (Corporate Modernism, Inter font, Educational Blue / Alert Orange status palette). `src/styles.css` exposes the matching CSS variables and utility classes; reference tokens (`var(--color-...)`) instead of hard-coded hex values in component CSS.
- Keep UI in the existing Inter-based, card/table/dashboard style with the blue/orange status palette from `DESIGN.md`.
- Angular template accessibility rules are enabled through `angular.configs.templateAccessibility`; keep focus states (`:focus-visible` ring), labels, ARIA roles/attributes, and color contrast WCAG AA-safe. Interactive overlays (modals/search suggestions) must trap focus and restore it on close.

## Testing Notes

- Specs are colocated as `*.spec.ts` under `src/app/`; no e2e framework or CI workflow is configured in this repo.
- Tests run in jsdom unless browser flags are provided to `ng test`.
- Follow the existing spec patterns: inject the component under test, drive `signal`/form APIs, and assert against rendered template output.
