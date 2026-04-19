# Frontend tests (`buero-frontend/test`)

- **`setup.ts`**, **`constants.ts`**, **`mocks/`**, **`utils/`** — спільна інфраструктура Vitest + MSW.
- **`integration/`** — unit + integration тести (дзеркало домену: `redux/`, `features/`, `api/`). Є блок **course-management** (форма курсу, payload-и, матеріали, `courseManagementApi` + MSW). Запуск: `npm run test` або `npm run test:integration`.
- **`e2e/`** — Playwright. Запуск: `npm run test:e2e` (потрібні браузери: `npx playwright install chromium`).

Vitest **не** сканує `test/e2e` (див. `vite.config.ts` → `exclude`).
