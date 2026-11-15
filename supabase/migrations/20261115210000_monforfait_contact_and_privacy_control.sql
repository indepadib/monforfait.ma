-- MonForfait customer-service inbox and privacy controls.
-- Applied to production on 15 Nov 2026; replayable without changing existing lead consent.
create table if not exists public.monforfait_contact_messages(
 id uuid primary key default gen_random_uuid(),
 name text not null check(char_length(name) between 2 and 120),
 email text not null check(char_length(email) between 5 and 200),
 subject text not null check(char_length(subject) between 3 and 180),
 message text not null check(char_length(message) between 10 and 5000),
 category text not null default 'general',
 status text not null default 'new' check(status in ('new','in_progress','answered','closed')),
 status_note text,
 handled_by uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.monforfait_contact_messages enable row level security;
revoke all on public.monforfait_contact_messages from public,anon,authenticated;
create index if not exists monforfait_contact_messages_status_date_idx
 on public.monforfait_contact_messages(status,created_at desc);
create index if not exists monforfait_contact_messages_email_idx
 on public.monforfait_contact_messages(lower(email),created_at desc);

alter table public.leads add column if not exists consent_withdrawn_at timestamptz,
 add column if not exists consent_withdrawal_method text;
create index if not exists monforfait_consent_withdrawal_idx
 on public.leads(consent_withdrawn_at)
 where consent_withdrawn_at is not null;

-- The service-role-only RPC atomically stops lead distribution after the user
-- presents the original 192-bit random tracking token (SHA-256 hash in the DB).
create or replace function public.monforfait_withdraw_consent(p_hash text)
returns boolean language plpgsql security definer set search_path=public
as $$
declare v_lead_id uuid;
begin
 if p_hash is null or p_hash !~ '^[a-f0-9]{64}$' then return false; end if;
 select id into v_lead_id from public.leads
  where tracking_token_hash=p_hash for update;
 if v_lead_id is null then return false; end if;
 update public.leads
 set consent_to_share=false,
  consent_withdrawn_at=coalesce(consent_withdrawn_at,now()),
  consent_withdrawal_method='tracking_receipt',
  sales_status=case when sales_status in ('paid','invoiced','activated')
   then sales_status else 'lost' end,
  sales_status_note='Accord retiré par le titulaire de la référence'
 where id=v_lead_id;
 update public.monforfait_lead_sales set access_expires_at=now(),updated_at=now()
 where lead_id=v_lead_id and shared_at is not null
  and (access_expires_at is null or access_expires_at>now());
 return true;
end $$;
revoke all on function public.monforfait_withdraw_consent(text) from public,anon,authenticated;
grant execute on function public.monforfait_withdraw_consent(text) to service_role;
