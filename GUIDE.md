# Adding new model for `dashboard` (ex: `cars`)

1. Create `lib/models/cars.model.ts` from `lib/models/user.model.ts`
2. Duplicate `src/dashboard/users` > `src/dashboard/cars` & rename files
    1. page.tsx
    2. cars.definition.ts
    3. data-table-cars.component.tsx
    4. form-cars-manage.component.tsx
    5. data-table-cars-filters.component.tsx
3. Update data-source.ts
    - export type DataSourceType = {
    - export const DataSourceConfig: {
4. Add `cars` to `src/config/lang.ts`
5. Update `Routes.group('dashboard')` in `src/config/routes.ts`
6. Create `lib/services/cars.service.ts` from `lib/services/users.service.ts`