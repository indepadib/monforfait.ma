-- Serialize partner lead release with consent withdrawal.
-- Locks lead row first, then sale, to prevent a post-withdrawal release.
create or replace function public.monforfait_release_sale(
 p_sale_id uuid,p_admin_user uuid,p_contract text
) returns jsonb
language plpgsql security definer set search_path=public
as $$
declare
 v_pair record;
 v_sale record;
 v_lead record;
 v_partner record;
 v_now timestamptz:=now();
begin
 if p_sale_id is null or p_admin_user is null or length(trim(coalesce(p_contract,'')))<6 then
  return jsonb_build_object('success',false,'error','Dossier ou référence contractuelle invalide');
 end if;
 if not exists(select 1 from public.monforfait_admins where user_id=p_admin_user) then
  return jsonb_build_object('success',false,'error','Accès administrateur refusé');
 end if;
 select lead_id,partner_id into v_pair from public.monforfait_lead_sales where id=p_sale_id;
 if not found then return jsonb_build_object('success',false,'error','Dossier introuvable'); end if;
 select id,consent_to_share,consent_at,consent_version,consent_withdrawn_at,sales_status into v_lead
 from public.leads where id=v_pair.lead_id for update;
 if not found or not v_lead.consent_to_share or v_lead.consent_at is null
  or v_lead.consent_version is null or v_lead.consent_withdrawn_at is not null
  or v_lead.sales_status not in ('qualified','contacted','partner_proposed') then
  return jsonb_build_object('success',false,'error','Consentement ou qualification invalide');
 end if;
 select id,partner_id,lead_id,sales_stage,shared_at into v_sale
 from public.monforfait_lead_sales where id=p_sale_id for update;
 if not found or v_sale.shared_at is not null or v_sale.sales_stage<>'accepted'
    or v_sale.partner_id<>v_pair.partner_id or v_sale.lead_id<>v_pair.lead_id then
  return jsonb_build_object('success',false,'error','Dossier non accepté ou déjà transmis');
 end if;
 select id,sales_status,contract_verified_at into v_partner
 from public.monforfait_partners where id=v_pair.partner_id for share;
 if not found or v_partner.sales_status not in ('contracted','active')
  or v_partner.contract_verified_at is null then
  return jsonb_build_object('success',false,'error','Partenaire sans contrat vérifié');
 end if;
 if not exists(select 1 from public.monforfait_partner_users where partner_id=v_partner.id) then
  return jsonb_build_object('success',false,'error','Le partenaire doit d’abord disposer d’un compte autorisé');
 end if;
 update public.monforfait_lead_sales set shared_at=v_now,shared_by=p_admin_user,
  contract_reference=trim(p_contract),access_expires_at=v_now+interval '30 days',
  updated_at=v_now where id=p_sale_id;
 return jsonb_build_object('success',true,'shared_at',v_now,
  'expires_at',v_now+interval '30 days');
end $$;
revoke all on function public.monforfait_release_sale(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.monforfait_release_sale(uuid,uuid,text) to service_role;
