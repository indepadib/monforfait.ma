-- Snapshot of official operator prices inspected 2026-11-15.
-- Historical plan IDs are retained, never delete plans referenced by leads.
-- When provider prices change: re-check primary sources and create a new migration.
alter table public.plans add column if not exists source_url text;
alter table public.plans add column if not exists source_checked_at timestamptz;
update public.plans set is_active=false,is_sponsored=false,highlight_badge=null
where source_checked_at is null;
with verified(op,old_title,new_title,amount,down,up,kind,gb,minutes,source) as (
 values
 ('Inwi','Fibre 20M','Fibre 20M',249,20,20,'internet',NULL,NULL,'https://inwi.ma/fr/particuliers/offres-internet/wifi-a-la-maison/fibre-optique'),
 ('Inwi','Fibre 50M','Fibre 50M',299,50,50,'internet',NULL,NULL,'https://inwi.ma/fr/particuliers/offres-internet/wifi-a-la-maison/fibre-optique'),
 ('Inwi','Fibre 100M','Fibre 100M',349,100,100,'internet',NULL,NULL,'https://inwi.ma/fr/particuliers/offres-internet/wifi-a-la-maison/fibre-optique'),
 ('Inwi','Fibre 200M Famille','Fibre 200M',449,200,200,'internet',NULL,NULL,'https://inwi.ma/fr/particuliers/offres-internet/wifi-a-la-maison/fibre-optique'),
 ('Inwi','Fibre 500M 4K','Fibre 500M',749,500,500,'internet',NULL,NULL,'https://inwi.ma/fr/particuliers/offres-internet/wifi-a-la-maison/fibre-optique'),
 ('Inwi','Fibre 1G Flex','Fibre 1 Giga',949,1000,500,'internet',NULL,NULL,'https://inwi.ma/fr/particuliers/offres-internet/wifi-a-la-maison/fibre-optique'),
 ('Orange Morocco','Fibre 20M','Fibre 20M',249,20,20,'internet',NULL,NULL,'https://boutique.orange.ma/fibre-d-orange'),
 ('Orange Morocco','Fibre 50M','Fibre 50M',299,50,50,'internet',NULL,NULL,'https://boutique.orange.ma/fibre-d-orange'),
 ('Orange Morocco','Fibre 100M','Fibre 100M',349,100,100,'internet',NULL,NULL,'https://boutique.orange.ma/fibre-d-orange'),
 ('Orange Morocco','Fibre 200M Gaming','Fibre 200M',449,200,200,'internet',NULL,NULL,'https://boutique.orange.ma/fibre-d-orange'),
 ('Orange Morocco','Fibre 500M Premium','Fibre 500M',749,500,500,'internet',NULL,NULL,'https://boutique.orange.ma/fibre-d-orange'),
 ('Orange Morocco','Fibre 1 Giga','Fibre 1 Giga',949,1000,500,'internet',NULL,NULL,'https://boutique.orange.ma/fibre-d-orange'),
 ('Maroc Telecom','Fibre 100M','Fibre 100M',400,100,NULL,'internet',NULL,NULL,'https://www.iam.ma/fr/web/iam-portal/fibre-optique'),
 ('Maroc Telecom','Fibre 200M Confort','Fibre 200M',500,200,NULL,'internet',NULL,NULL,'https://www.iam.ma/fr/web/iam-portal/fibre-optique'),
 ('Maroc Telecom','Fibre 500M Premium','Fibre 500M',800,500,NULL,'internet',NULL,NULL,'https://www.iam.ma/fr/web/iam-portal/fibre-optique'),
 ('Inwi','Win 11Go','FLEXI 11Go + 1H',49,NULL,NULL,'mobile',11,60,'https://inwi.ma/fr/particuliers/offres-mobiles/forfait-mobile'),
 ('Inwi','Win 30Go Social+','30Go + 1H WhatsApp',99,NULL,NULL,'mobile',30,60,'https://inwi.ma/fr/particuliers/offres-mobiles/forfait-mobile'),
 ('Inwi','Win 50Go Streamer','40Go + 4H WhatsApp',149,NULL,NULL,'mobile',40,240,'https://inwi.ma/fr/particuliers/offres-mobiles/forfait-mobile'),
 ('Inwi','Win 80Go','Appels illimités + 35Go',199,NULL,NULL,'mobile',35,-1,'https://inwi.ma/fr/particuliers/offres-mobiles/forfait-mobile'),
 ('Inwi','Win 100Go Ultimate','Appels illimités + 60Go',249,NULL,NULL,'mobile',60,-1,'https://inwi.ma/fr/particuliers/offres-mobiles/forfait-mobile'),
 ('Maroc Telecom','Liberté 15Go','Liberté 3Go + 3H',59,NULL,NULL,'mobile',3,180,'https://www.iam.ma/'),
 ('Maroc Telecom','Liberté 25Go','Liberté 29Go + 1H',119,NULL,NULL,'mobile',29,60,'https://www.iam.ma/'),
 ('Maroc Telecom','Liberté 50Go','Liberté Plus 50Go',199,NULL,NULL,'mobile',50,90,'https://www.iam.ma/'),
 ('Maroc Telecom','Liberté 70Go','Liberté Plus 65Go',259,NULL,NULL,'mobile',65,180,'https://www.iam.ma/')
)
update public.plans as p set
 title=verified.new_title,
 price_dh=verified.amount,
 download_speed_mbps=verified.down,
 upload_speed_mbps=verified.up,
 category=verified.kind::public.plan_category,
 technology=case when verified.kind='internet' then 'FTTH'::public.technology_type else null end,
 mobile_data_gb=verified.gb,
 voice_minutes=verified.minutes,
 source_url=verified.source,
 source_checked_at='2026-11-15 00:00:00+00'::timestamptz,
 is_active=true,
 is_sponsored=false,
 highlight_badge=null,
 setup_fee_dh=null,
 commitment_months=null,
 router_model=null,
 features='{"source":"official","checked_on":"2026-11-15","subject_to_eligibility":true}'::jsonb
from public.operators as o,verified
where p.operator_id=o.id and o.name=verified.op and p.title=verified.old_title;
insert into public.plans(operator_id,title,price_dh,download_speed_mbps,upload_speed_mbps,
 technology,category,target_audience,is_active,is_sponsored,setup_fee_dh,commitment_months,
 source_url,source_checked_at,features)
select o.id,'Fibre 1 Giga',1000,1000,null,'FTTH'::public.technology_type,'internet'::public.plan_category,
'individual'::public.target_audience,true,false,null,null,
'https://www.iam.ma/fr/web/iam-portal/fibre-optique','2026-11-15 00:00:00+00'::timestamptz,
 '{"source":"official","checked_on":"2026-11-15","subject_to_eligibility":true}'::jsonb
from public.operators o
where o.name='Maroc Telecom'
and not exists (select 1 from public.plans p where p.operator_id=o.id and p.title='Fibre 1 Giga');
revoke insert,update,delete,truncate,trigger,references on public.plans from anon,authenticated;
revoke insert,update,delete,truncate,trigger,references on public.operators from anon,authenticated;
