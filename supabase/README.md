# Supabase backend — Hachamama (החממה)

This turns the app from a localStorage/in-memory mock into a **stateless** Supabase
backend. The app talks to it only through the `DataClient` contract
(`src/lib/data/types.ts`); the Supabase implementation lives in
`src/lib/data/supabase/`. Selected via `VITE_DATA_MODE` in `src/lib/data/index.ts`.

## Layout

```
supabase/
  migrations/
    20260712000001_schema.sql     -- enums + 27 tables + indexes
    20260712000002_functions.sql  -- triggers, XP ledger, streaks, RPCs
    20260712000003_rls.sql        -- Row-Level Security on every table
    20260712000004_storage.sql    -- avatars / post-images / submissions buckets
  seed.sql                        -- config data, course tree, 6 demo accounts
```

## Apply to a hosted project

1. Get the project's **DB connection string** (Dashboard → Project Settings →
   Database → Connection string → URI) and export it:

   ```bash
   export SUPABASE_DB_URL="postgresql://postgres:[PASSWORD]@db.<ref>.supabase.co:5432/postgres"
   ```

2. Push all migrations:

   ```bash
   npm run db:push          # supabase db push --db-url "$SUPABASE_DB_URL"
   ```

3. Load the seed (config + demo content + demo accounts):

   ```bash
   npm run db:seed          # node scripts/db-seed.mjs
   ```

4. Point the frontend at the project — copy `.env.example` → `.env.local` and fill
   `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` (Settings → API Keys;
   the `sb_publishable_...` key — legacy anon JWT also works via
   `VITE_SUPABASE_ANON_KEY`), then:

   ```bash
   npm run dev
   ```

## Demo accounts (seed)

All demo passwords are **`password123`**. `new@example.com` starts with a forced
password reset → onboarding flow.

| email | role | note |
|---|---|---|
| noa@example.com | student | default demo user (340 XP) |
| daniel@example.com | student | 1240 XP |
| ron@example.com | student | 4780 XP |
| new@example.com | student | must reset password |
| hofit@hofitgoni.com | super-admin | |
| goni@hofitgoni.com | super-admin | |

## Notes

- **XP is a ledger.** `xp_events` is the source of truth; a trigger keeps
  `profiles.xp_total` + `growth_stage` in sync and emits a level-up notification.
- **Answer keys never leave the DB.** `quiz_options.is_correct` is staff-only;
  students read the `quiz_options_public` view and grading happens in the
  `submit_quiz` RPC.
- **Multi-step writes are RPCs** (`award_xp`, `mark_lesson_complete`,
  `toggle_reaction`, `submit_quiz`, `admin_*`) so they're atomic and
  authorization is enforced server-side.
- **Local dev** (optional, needs Docker): `supabase start` then
  `npm run db:reset:local` applies migrations + seed automatically.
