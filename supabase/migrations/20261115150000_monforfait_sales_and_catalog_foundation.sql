-- Reconcile MonForfait catalog and revenue schemas with the production changes
-- initially applied through Supabase MCP on 2026-11-07 and 2026-11-15.
-- Preserve all previously captured lead UUIDs and historical plans.

alter table public.leads
 add column if not exists consent_to_share boolean not null default false,
 add column if not exists consent_at timestamptz,
 add column if not exists consent_version text,
 add column if not exists sales_status text not null default 'unreviewed',
 add column if not exists phone_normalized text;
create index if not exists monforfait_leads_created_at_idx on public.leads(created_at desc);
create index if not exists monforfait_leads_phone_normalized_idx on public.leads(phone_normalized);
alter table public.leads enable row level security;
drop policy if exists "Enable insert for everyone" on public.leads;
drop policy if exists "monforfait_contact_only_anon_insert" on public.leads;
revoke all on public.leads from public,anon,authenticated;
grant insert on public.leads to anon,authenticated;
create policy "monforfait_contact_only_anon_insert"
 on public.leads for insert to anon,authenticated with check (
  status='message'
  and user_phone='Formulaire Contact'
  and consent_to_share=false
  and phone_normalized is null
  and coalesce(needs_details->>'type','')='contact_form'
 );

create table if not exists public.monforfait_admins(
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.monforfait_admins enable row level security;
revoke all on public.monforfait_admins from public,anon,authenticated;
-- Provision administrators by explicit authenticated UUID, separately in your secure SQL editor.
-- Never grant admin based on editable user_metadata or on email in a public client.

create table if not exists public.monforfait_partners(
 id uuid primary key default gen_random_uuid(),
 business_name text not null,
 business_email text,
 contact_name text,
 partner_type text not null default 'distributor',
 sales_status text not null default 'prospect',
 created_at timestamptz not null default now(),
 contact_phone text,
 regions text,
 services text,
 estimated_volume text,
 consent_to_contact boolean not null default false,
 submitted_at timestamptz,
 source text not null default 'manual'
);
alter table public.monforfait_partners enable row level security;
revoke all on public.monforfait_partners from public,anon,authenticated;
create index if not exists monforfait_partner_inquiries_date_idx
 on public.monforfait_partners(submitted_at desc);

create table if not exists public.monforfait_lead_sales(
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.leads(id),
 partner_id uuid not null references public.monforfait_partners(id),
 sales_stage text not null default 'proposed',
 commercial_model text not null default 'cpl',
 agreed_amount_dh numeric(12,2) not null default 0,
 invoiced_at timestamptz,
 paid_at timestamptz,
 activated_at timestamptz,
 created_at timestamptz not null default now(),
 invoice_reference text,
 payment_reference text,
 evidence_notes text,
 updated_at timestamptz not null default now(),
 unique (lead_id,partner_id)
);
alter table public.monforfait_lead_sales
 add column if not exists invoice_reference text,
 add column if not exists payment_reference text,
 add column if not exists evidence_notes text,
 add column if not exists updated_at timestamptz not null default now();
alter table public.monforfait_lead_sales enable row level security;
revoke all on public.monforfait_lead_sales from public,anon,authenticated;
create index if not exists monforfait_lead_sales_partner_idx
 on public.monforfait_lead_sales(partner_id,sales_stage);

create table if not exists public.monforfait_sales_audit(
 id bigint generated always as identity primary key,
 sale_id uuid not null references public.monforfait_lead_sales(id) on delete cascade,
 old_stage text,
 new_stage text not null,
 evidence_notes text,
 happened_at timestamptz not null default now()
);
alter table public.monforfait_sales_audit enable row level security;
revoke all on public.monforfait_sales_audit from public,anon,authenticated;
create index if not exists monforfait_sales_audit_sale_idx
 on public.monforfait_sales_audit(sale_id,happened_at desc);

create or replace function public.monforfait_audit_sale_change()
returns trigger language plpgsql set search_path=public as $$
begin
 if tg_op='INSERT' then
  insert into public.monforfait_sales_audit(sale_id,old_stage,new_stage,evidence_notes)
  values(new.id,null,new.sales_stage,new.evidence_notes);
 elsif new.sales_stage is distinct from old.sales_stage then
  insert into public.monforfait_sales_audit(sale_id,old_stage,new_stage,evidence_notes)
  values(new.id,old.sales_stage,new.sales_stage,new.evidence_notes);
 end if;
 return new;
end;
$$;
revoke all on function public.monforfait_audit_sale_change() from public,anon,authenticated;
drop trigger if exists monforfait_sales_history_trigger on public.monforfait_lead_sales;
create trigger monforfait_sales_history_trigger after insert or update
on public.monforfait_lead_sales for each row execute function public.monforfait_audit_sale_change();

alter table public.plans
 add column if not exists source_url text,
 add column if not exists source_checked_at timestamptz;
revoke insert,update,delete,truncate,trigger,references on public.plans from anon,authenticated;
revoke insert,update,delete,truncate,trigger,references on public.operators from anon,authenticated;

-- The verified tariff data from 2026-11-15 is preserved in production and backed by
-- source URLs; see the companion seed SQL. All other historical offers stay inactive.
