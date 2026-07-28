-- 20260729000009_store.sql
-- חנות בסגנון האקדמיה הישנה: מחיר עוגן (מקורי/מבצע), קופונים, והצעות נלוות (order bumps).

-- ---------- מחיר עוגן + קופי מכירה על המוצר ----------
alter table course_products add column if not exists regular_price numeric(10,2);
alter table course_products add column if not exists short_description text;
alter table course_products add column if not exists image_url text;

-- ---------- קופונים ----------
create table if not exists coupons (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  discount_type text not null default 'percent' check (discount_type in ('percent','fixed')),
  amount        numeric(10,2) not null check (amount > 0),
  is_active     boolean not null default true,
  expires_at    timestamptz,
  max_uses      int,
  used_count    int not null default 0,
  created_at    timestamptz not null default now()
);

alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists discount_amount numeric(10,2) not null default 0;
alter table orders add column if not exists bump_course_ids uuid[] not null default '{}';

-- ---------- הצעות נלוות בעמוד התשלום ----------
create table if not exists order_bumps (
  id             uuid primary key default gen_random_uuid(),
  -- כשקונים את הקורס הזה...
  trigger_course_id uuid references courses(id) on delete cascade,
  -- ...מציעים את הקורס הזה בהנחה
  offer_course_id   uuid not null references courses(id) on delete cascade,
  headline       text not null,
  description    text not null default '',
  bump_price     numeric(10,2) not null,
  is_active      boolean not null default true,
  order_index    int not null default 1,
  created_at     timestamptz not null default now()
);

-- ---------- RLS ----------
alter table coupons     enable row level security;
alter table order_bumps enable row level security;

-- קופונים: קריאה רק לפעילים (אימות בפועל בצד שרת), כתיבה לצוות
create policy coupons_select on coupons for select to authenticated using (is_active);
create policy coupons_staff  on coupons for all to authenticated using (is_staff()) with check (is_staff());
create policy bumps_select on order_bumps for select to authenticated using (is_active);
create policy bumps_staff  on order_bumps for all to authenticated using (is_staff()) with check (is_staff());

-- ---------- seed: מחירי עוגן בסגנון האתר הישן + הצעה נלווית + קופון ----------
update course_products cp set
  regular_price = case c.slug
    when 'campaigner-ai-beginners'     then 1490.00
    when 'landing-pages-that-sell'     then 1290.00
    when 'ai-automations-for-business' then 1690.00
    when 'copywriting-24-steps'        then 2490.00
  end,
  short_description = case c.slug
    when 'campaigner-ai-beginners'     then 'המסלול המלא לבניית קמפיין ראשון שמביא לקוחות — מהרעיון ועד ההעלאה, בעזרת כלי AI. בלי רקע טכני, צעד אחרי צעד.'
    when 'landing-pages-that-sell'     then 'איך בונים דף נחיתה שממיר — מבנה, קופי, עיצוב ובדיקות. כולל תבניות מוכנות ליישום מיידי.'
    when 'ai-automations-for-business' then 'לחבר את העסק לאוטומציות חכמות: לידים, מיילים, וואטסאפ ותהליכים — בלי מפתח ובלי ידע טכני.'
    when 'copywriting-24-steps'        then 'שיטת הכתיבה של חופית וגוני — 24 הצעדים שהופכים טקסט למכונת מכירה.'
  end
from courses c where c.id = cp.course_id;

-- הצעה נלווית: כל מי שקונה את קורס הקמפיינר מקבל את הקופי בהנחה
insert into order_bumps (trigger_course_id, offer_course_id, headline, description, bump_price)
select t.id, o.id,
  'כן! תוסיפו לי גם את "כתיבת קופי בשיטת 24 הצעדים" ב-70% הנחה!',
  'הקורס שהופך כל טקסט למכונת מכירה — הכי משלים לקמפיין שאתם עומדים לבנות. במקום ₪990, רק היום בעמוד הזה:',
  297.00
from courses t, courses o
where t.slug = 'campaigner-ai-beginners' and o.slug = 'copywriting-24-steps'
  and not exists (select 1 from order_bumps b where b.trigger_course_id = t.id and b.offer_course_id = o.id);

insert into coupons (code, discount_type, amount) values ('WELCOME10', 'percent', 10)
on conflict (code) do nothing;
