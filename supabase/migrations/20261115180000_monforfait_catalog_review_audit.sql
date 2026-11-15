-- Audited operator source maintenance. Additive and already applied to
-- MonForfait production on 2026-11-15. Replaying is safe.
alter table public.plans add column if not exists source_checked_by uuid;
create table if not exists public.monforfait_catalog_audit(
 id bigint generated always as identity primary key,
 plan_id uuid not null references public.plans(id) on delete cascade,
 action text not null,
 old_title text,
 new_title text,
 old_price_dh numeric,
 new_price_dh numeric,
 old_active boolean,
 new_active boolean,
 source_url text,
 verified_by uuid,
 created_at timestamptz not null default now()
);
alter table public.monforfait_catalog_audit enable row level security;
revoke all on public.monforfait_catalog_audit from public,anon,authenticated;
create index if not exists monforfait_catalog_audit_plan_idx
 on public.monforfait_catalog_audit(plan_id,created_at desc);
create or replace function public.monforfait_audit_catalog_change()
returns trigger language plpgsql set search_path=public as $$
begin
 if tg_op='INSERT' then
  insert into public.monforfait_catalog_audit
   (plan_id,action,new_title,new_price_dh,new_active,source_url,verified_by)
  values(new.id,'created',new.title,new.price_dh,new.is_active,new.source_url,new.source_checked_by);
 elsif old.title is distinct from new.title or old.price_dh is distinct from new.price_dh
  or old.is_active is distinct from new.is_active or old.source_url is distinct from new.source_url then
  insert into public.monforfait_catalog_audit
   (plan_id,action,old_title,new_title,old_price_dh,new_price_dh,
    old_active,new_active,source_url,verified_by)
  values(new.id,case when new.is_active=false then 'archived' else 'updated' end,
   old.title,new.title,old.price_dh,new.price_dh,old.is_active,new.is_active,
   new.source_url,new.source_checked_by);
 end if;
 return new;
end $$;
revoke all on function public.monforfait_audit_catalog_change() from public,anon,authenticated;
drop trigger if exists monforfait_catalog_audit_trigger on public.plans;
create trigger monforfait_catalog_audit_trigger after insert or update
on public.plans for each row execute function public.monforfait_audit_catalog_change();
-- Do not grant client browser roles write access to the catalog or audit;
-- editing requires an explicit server-side administrator allowlist check.
