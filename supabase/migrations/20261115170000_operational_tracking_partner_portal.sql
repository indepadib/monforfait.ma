-- MonForfait operational product schema
-- Production rollout: 15 November 2026. Safe additive migration.
-- Keep all old leads and their UUIDs. No historical data is re-consented.
alter table public.leads
  add column if not exists tracking_token_hash text,
  add column if not exists sales_status_note text,
  add column if not exists sales_status_changed_at timestamptz,
  add column if not exists sales_status_changed_by uuid;
create unique index if not exists monforfait_lead_tracking_token_hash_key
  on public.leads(tracking_token_hash) where tracking_token_hash is not null;
create index if not exists monforfait_lead_sales_status_date_idx
  on public.leads(sales_status,created_at desc);
create index if not exists monforfait_lead_city_date_idx
  on public.leads(city,created_at desc);

alter table public.monforfait_lead_sales
  add column if not exists shared_at timestamptz,
  add column if not exists shared_by uuid,
  add column if not exists contract_reference text,
  add column if not exists access_expires_at timestamptz;
create index if not exists monforfait_shared_sales_idx
  on public.monforfait_lead_sales(partner_id,shared_at) where shared_at is not null;

alter table public.monforfait_partners
  add column if not exists contract_reference text,
  add column if not exists contract_verified_at timestamptz,
  add column if not exists contract_verified_by uuid;
create index if not exists monforfait_partners_contracted_idx
  on public.monforfait_partners(sales_status,contract_verified_at);

create table if not exists public.monforfait_partner_users(
  user_id uuid primary key references auth.users(id) on delete cascade,
  partner_id uuid not null references public.monforfait_partners(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.monforfait_partner_users enable row level security;
revoke all on public.monforfait_partner_users from public,anon,authenticated;
create index if not exists monforfait_partner_users_partner_idx
  on public.monforfait_partner_users(partner_id);

create table if not exists public.monforfait_partner_feedback(
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.monforfait_lead_sales(id) on delete cascade,
  partner_id uuid not null references public.monforfait_partners(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  outcome text not null check(outcome in ('received','contacted','no_answer','not_eligible','activated','rejected')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.monforfait_partner_feedback enable row level security;
revoke all on public.monforfait_partner_feedback from public,anon,authenticated;
create index if not exists monforfait_partner_feedback_sale_idx
  on public.monforfait_partner_feedback(sale_id,created_at desc);

create table if not exists public.monforfait_lead_activity(
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  old_status text,
  new_status text not null,
  status_note text,
  changed_by uuid,
  created_at timestamptz not null default now()
);
alter table public.monforfait_lead_activity enable row level security;
revoke all on public.monforfait_lead_activity from public,anon,authenticated;
create index if not exists monforfait_lead_activity_lead_idx
  on public.monforfait_lead_activity(lead_id,created_at desc);

create or replace function public.monforfait_audit_lead_stage()
returns trigger language plpgsql set search_path=public as $$
begin
 if old.sales_status is distinct from new.sales_status then
   insert into public.monforfait_lead_activity(lead_id,old_status,new_status,status_note,changed_by)
   values(new.id,old.sales_status,new.sales_status,new.sales_status_note,new.sales_status_changed_by);
 end if;
 return new;
end $$;
revoke all on function public.monforfait_audit_lead_stage() from public,anon,authenticated;
drop trigger if exists monforfait_lead_stage_audit_trigger on public.leads;
create trigger monforfait_lead_stage_audit_trigger
after update of sales_status on public.leads
for each row execute function public.monforfait_audit_lead_stage();

-- Security-invoker views for internal reporting.
create or replace view public.monforfait_daily_metrics with (security_invoker=true) as
select date_trunc('day',created_at)::date as day,
 count(*)::integer as leads,
 count(*) filter(where consent_to_share=true)::integer as consented,
 count(*) filter(where is_pro=true)::integer as professional,
 count(*) filter(where sales_status in ('qualified','contacted','partner_proposed'))::integer as in_progress
from public.leads where created_at is not null group by 1;

create or replace view public.monforfait_source_metrics with (security_invoker=true) as
select coalesce(nullif(left(needs_details->>'source',80),''),
  nullif(left(needs_details->>'lead_source',80),''),'unknown') as source,
 count(*)::integer as leads,
 count(*) filter(where consent_to_share=true)::integer as consented,
 count(*) filter(where is_pro=true)::integer as professional
from public.leads where created_at>=now()-interval '30 days' group by 1;

revoke all on public.monforfait_daily_metrics from public,anon,authenticated;
revoke all on public.monforfait_source_metrics from public,anon,authenticated;
grant select on public.monforfait_daily_metrics to service_role;
grant select on public.monforfait_source_metrics to service_role;

-- Never enable public SELECT on leads, partner access lists or financial records.
-- Access is restricted to explicit role checks in the Supabase Edge Function.
