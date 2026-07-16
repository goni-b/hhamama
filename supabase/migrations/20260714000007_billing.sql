-- 20260714000007_billing.sql
-- Billing & monetization (Cardcom): courses are paid products, locked until entitled.
-- Tokens (J5), orders, invoices, tiered plans, admin control. Client writes go through
-- the app server (API routes) or staff RLS; students get read-own access.

-- ---------- products: price per course ----------
create table if not exists course_products (
  course_id     uuid primary key references courses(id) on delete cascade,
  price_amount  numeric(10,2) not null check (price_amount >= 0),
  iso_coin_id   int not null default 1,            -- 1 = ILS (Cardcom ISOCoinId)
  is_active     boolean not null default true,     -- ניתן לרכישה עצמית
  updated_at    timestamptz not null default now()
);

-- ---------- tiered plans ----------
create table if not exists billing_plans (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text not null default '',
  price_amount  numeric(10,2) not null,
  billing_interval text not null check (billing_interval in ('monthly','yearly','one_time')),
  is_active     boolean not null default true,
  order_index   int not null default 1,
  created_at    timestamptz not null default now()
);

create table if not exists plan_courses (
  plan_id   uuid not null references billing_plans(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  primary key (plan_id, course_id)
);

-- ---------- entitlements: מי פתח איזה קורס ----------
create table if not exists course_entitlements (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  course_id  uuid not null references courses(id) on delete cascade,
  source     text not null check (source in ('purchase','plan','admin_grant','seed')),
  order_id   uuid,
  granted_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, course_id)
);
create index if not exists idx_entitlements_user on course_entitlements(user_id) where revoked_at is null;

-- ---------- saved charge tokens (Cardcom J5) ----------
create table if not exists payment_tokens (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  token        text not null,
  card_last4   text not null default '',
  card_month   int,
  card_year    int,
  token_expires date,
  is_default   boolean not null default false,
  created_at   timestamptz not null default now(),
  revoked_at   timestamptz
);
create index if not exists idx_tokens_user on payment_tokens(user_id) where revoked_at is null;

-- ---------- orders: כל תשלום/חיוב במערכת ----------
create table if not exists orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  kind         text not null check (kind in ('course','plan','manual','card_setup')),
  course_id    uuid references courses(id),
  plan_id      uuid references billing_plans(id),
  description  text not null default '',
  amount       numeric(10,2) not null,
  iso_coin_id  int not null default 1,
  status       text not null default 'pending'
               check (status in ('pending','paid','failed','refunded','partially_refunded','canceled')),
  low_profile_id          text,
  cardcom_transaction_id  bigint,
  token_id     uuid references payment_tokens(id),
  document_type   text,
  document_number text,
  document_url    text,
  error_description text,
  refunded_amount numeric(10,2) not null default 0,
  created_by_admin uuid references profiles(id),
  created_at   timestamptz not null default now(),
  paid_at      timestamptz,
  refunded_at  timestamptz
);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_lp on orders(low_profile_id);

-- ---------- plan subscriptions (tier של כל משתמש) ----------
create table if not exists plan_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  plan_id    uuid not null references billing_plans(id),
  status     text not null default 'active' check (status in ('active','past_due','canceled')),
  token_id   uuid references payment_tokens(id),
  current_period_start timestamptz not null default now(),
  current_period_end   timestamptz,
  canceled_at timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists idx_plan_subs_user on plan_subscriptions(user_id);

-- ---------- RLS ----------
alter table course_products     enable row level security;
alter table billing_plans       enable row level security;
alter table plan_courses        enable row level security;
alter table course_entitlements enable row level security;
alter table payment_tokens      enable row level security;
alter table orders              enable row level security;
alter table plan_subscriptions  enable row level security;

-- מחירים ותוכניות: כולם קוראים; צוות כותב
create policy products_select on course_products for select to authenticated using (true);
create policy products_staff  on course_products for all to authenticated using (is_staff()) with check (is_staff());
create policy plans_select on billing_plans for select to authenticated using (true);
create policy plans_staff  on billing_plans for all to authenticated using (is_staff()) with check (is_staff());
create policy plan_courses_select on plan_courses for select to authenticated using (true);
create policy plan_courses_staff  on plan_courses for all to authenticated using (is_staff()) with check (is_staff());

-- זכאויות/טוקנים/הזמנות/מנויים: קריאה עצמית; צוות רואה ושולט בהכל
create policy entitlements_own   on course_entitlements for select to authenticated using (user_id = auth.uid() or is_staff());
create policy entitlements_staff on course_entitlements for all to authenticated using (is_staff()) with check (is_staff());
create policy tokens_own   on payment_tokens for select to authenticated using (user_id = auth.uid() or is_staff());
create policy tokens_staff on payment_tokens for all to authenticated using (is_staff()) with check (is_staff());
create policy orders_own   on orders for select to authenticated using (user_id = auth.uid() or is_staff());
create policy orders_staff on orders for all to authenticated using (is_staff()) with check (is_staff());
create policy plan_subs_own   on plan_subscriptions for select to authenticated using (user_id = auth.uid() or is_staff());
create policy plan_subs_staff on plan_subscriptions for all to authenticated using (is_staff()) with check (is_staff());

-- ---------- seed: מחירים לקורסים הקיימים + שתי תוכניות + זכאויות לתלמידי הדמו ----------
insert into course_products (course_id, price_amount)
select c.id, v.price from courses c join (values
  ('campaigner-ai-beginners', 349.00),
  ('landing-pages-that-sell', 449.00),
  ('ai-automations-for-business', 549.00),
  ('copywriting-24-steps', 990.00)
) as v(slug, price) on c.slug = v.slug
on conflict (course_id) do nothing;

insert into billing_plans (slug, title, description, price_amount, billing_interval, order_index) values
  ('greenhouse-monthly', 'מקום קבוע בחממה — חודשי', 'גישה לכל הקורסים, הלייבים והקהילה', 149.00, 'monthly', 1),
  ('greenhouse-yearly',  'מקום קבוע בחממה — שנתי', 'כל מה שבחודשי, בתשלום שנתי משתלם', 1490.00, 'yearly', 2)
on conflict (slug) do nothing;

insert into plan_courses (plan_id, course_id)
select p.id, c.id from billing_plans p cross join courses c
on conflict do nothing;

-- תלמידי הדמו ממשיכים לגשת לקורס שהם באמצעו
insert into course_entitlements (user_id, course_id, source)
select p.id, c.id, 'seed' from profiles p
join courses c on c.slug = 'campaigner-ai-beginners'
where p.role = 'student'
on conflict (user_id, course_id) do nothing;
