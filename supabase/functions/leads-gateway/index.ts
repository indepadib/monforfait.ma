import {normalizeMoroccanPhone,publicProgressLabel,isTerminalStatus,mayAdvanceCommercialStage} from './rules.ts';
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const ALLOWED = new Set([
  "https://monforfait.ma", "https://www.monforfait.ma",
  "https://monforfait.netlify.app", "http://localhost:3000", "http://localhost:8888"
]);
const headersFor = (origin: string | null) => ({
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin",
  ...(origin && ALLOWED.has(origin) ? {"Access-Control-Allow-Origin":origin} : {}),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store"
});
function response(data: Record<string, unknown>, status: number, origin: string | null) {
  return new Response(JSON.stringify(data), {status, headers:headersFor(origin)});
}
const text = (value: unknown, max = 200) => typeof value === "string" ? value.trim().slice(0,max) : "";
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const normalizePhone = normalizeMoroccanPhone;
function restHeaders(prefer?: string) {
  return {"apikey":serviceKey, "Authorization":"Bearer "+serviceKey, "Content-Type":"application/json", ...(prefer ? {"Prefer":prefer}: {})};
}
async function rest(path: string, init: RequestInit = {}) {
  return fetch(supabaseUrl + "/rest/v1/" + path, {...init, headers:{...restHeaders(), ...(init.headers as Record<string,string> || {})}});
}
async function authUserId(req: Request): Promise<string|null> {
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i,"");
  if (!token || !serviceKey || !anonKey) return null;
  const userRes = await fetch(supabaseUrl+"/auth/v1/user", {
    headers: {"apikey":anonKey, "Authorization":"Bearer "+token}
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  return user?.id && idPattern.test(user.id) ? user.id : null;
}
async function authorize(req: Request): Promise<string|null> {
  const userId=await authUserId(req);
  if(!userId)return null;
  const rows = await rest("monforfait_admins?user_id=eq."+encodeURIComponent(userId)+"&select=user_id&limit=1");
  return rows.ok && (await rows.json()).length === 1 ? userId : null;
}
async function authorizePartner(req:Request):Promise<{userId:string,partnerId:string}|null>{
  const userId=await authUserId(req);
  if(!userId)return null;
  const r=await rest("monforfait_partner_users?user_id=eq."+encodeURIComponent(userId)+"&select=partner_id&limit=1");
  if(!r.ok)return null;
  const row=(await r.json())[0];
  return row?.partner_id&&idPattern.test(row.partner_id)?{userId,partnerId:row.partner_id}:null;
}

function verifiedSource(url:unknown,operator:string){
  const raw=text(url,500);
  try{
    const parsed=new URL(raw);
    if(parsed.protocol!=="https:" || parsed.username || parsed.password || parsed.port)return null;
    const host=parsed.hostname.toLowerCase();
    const allowed:Record<string,string[]>={
      "Inwi":["inwi.ma"],"Orange Morocco":["orange.ma"],
      "Maroc Telecom":["iam.ma"]
    };
    if(!(allowed[operator]||[]).some(domain=>host===domain||host.endsWith("."+domain)))return null;
    return parsed.toString();
  }catch{return null}
}

async function sha256(input:string):Promise<string>{
  const bytes=new TextEncoder().encode(input);
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",bytes)),
    b=>b.toString(16).padStart(2,"0")).join("");
}
function randomTrackingToken(){
  const bytes=crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
}
function countFromRange(header:string|null){
  const v=header?.split("/").at(-1);
  return v&&/^\d+$/.test(v)?Number(v):null;
}

Deno.serve(async req => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response(null, {status:204,headers:headersFor(origin)});
  if (req.method !== "POST") return response({error:"Method not allowed"},405,origin);
  if (origin && !ALLOWED.has(origin)) return response({error:"Origin not allowed"},403,origin);
  if (!serviceKey || !supabaseUrl) return response({error:"Service temporarily unavailable"},503,origin);
  if (Number(req.headers.get("Content-Length") || "0") > 16000) return response({error:"Too large"},413,origin);
  let body:Record<string,any>;
  try {body = await req.json();} catch {return response({error:"Invalid JSON"},400,origin);}
  // Public inquiries go to a dedicated private inbox, not the lead-sales table.
  // Never claim that an email was delivered when it has only been stored.
  if (body.action === "contact.submit") {
    if(text(body.website,100))return response({success:true},200,origin);
    if(body.consent_to_contact!==true)return response({error:"Veuillez confirmer que nous pouvons traiter votre message."},422,origin);
    const name=text(body.name,120),email=text(body.email,200).toLowerCase();
    const subject=text(body.subject,180),message=text(body.message,5000);
    const category=text(body.category,32);
    if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
       subject.length<3 || message.length<10 || message.length>5000)
      return response({error:"Complétez votre nom, un email valide, le sujet et le message."},422,origin);
    const since=new Date(Date.now()-5*60*1000).toISOString();
    const previous=await rest("monforfait_contact_messages?email=eq."+encodeURIComponent(email)+
      "&created_at=gte."+encodeURIComponent(since)+"&select=id&limit=1");
    if(!previous.ok)return response({error:"Le formulaire est momentanément indisponible."},503,origin);
    if((await previous.json()).length)return response({error:"Une demande avec cet email a déjà été envoyée récemment. Réessayez plus tard."},429,origin);
    const saved=await rest("monforfait_contact_messages?select=id",{
      method:"POST",headers:restHeaders("return=representation"),
      body:JSON.stringify({name,email,subject,message,
        category:["general","technical","privacy","billing","partnership"].includes(category)?category:"general"})
    });
    if(!saved.ok){console.error("contact submit error",saved.status);return response({error:"Message non enregistré."},503,origin);}
    const result=await saved.json();
    return response({success:true,reference:result[0]?.id?.slice(0,8)||null},200,origin);
  }
  if(body.action==="tracking.withdraw"){
    const code=text(body.tracking_token,64).toLowerCase();
    if(!/^[a-f0-9]{48}$/.test(code))return response({error:"Référence invalide."},422,origin);
    const hash=await sha256(code);
    const r=await rest("rpc/monforfait_withdraw_consent",{
      method:"POST",body:JSON.stringify({p_hash:hash})
    });
    if(!r.ok)return response({error:"Retrait momentanément indisponible."},503,origin);
    const success=await r.json();
    return response(success?{success:true}:{error:"Référence inconnue."},success?200:404,origin);
  }

  if (body.action === "capture") {
    const lead=body.lead ?? {};
    if (lead.consent_to_share !== true) return response({error:"Consentement explicite requis pour une demande de mise en relation."},422,origin);
    const phone=normalizePhone(lead.user_phone);
    const name=text(lead.user_name,120);
    if (!phone || name.length < 2) return response({error:"Nom ou numéro marocain invalide."},422,origin);
    const email=text(lead.user_email,150);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response({error:"Email invalide."},422,origin);
    const details=lead.needs_details && typeof lead.needs_details === "object" && !Array.isArray(lead.needs_details) ? lead.needs_details : {};
    if (JSON.stringify(details).length > 7000) return response({error:"Données trop volumineuses"},413,origin);
    const statusAllowed=["new","new_qualified","new_pro","eligibility_qualified","hot_lead","speedtest_captured"];
    const now=new Date().toISOString();
    const trackingToken=randomTrackingToken();
    const trackingHash=await sha256(trackingToken);
    // Limit repeated submissions. Never reveal existing IDs to unauthenticated callers.
    const since=new Date(Date.now()-10*60*1000).toISOString();
    const prior=await rest("leads?phone_normalized=eq."+encodeURIComponent(phone)+"&created_at=gte."+encodeURIComponent(since)+"&select=id&limit=1");
    if (prior.ok && (await prior.json()).length > 0) {
      return response({success:true,lead_id:null,duplicate:true},200,origin);
    }
    const source=text(details.source || details.lead_source,100) || "unspecified";
    const record={
      user_name:name, user_phone:phone, phone_normalized:phone,
      user_email:email || null,
      city:text(lead.city,100) || null,
      address:text(lead.address,240) || null,
      is_pro:lead.is_pro === true,
      status:statusAllowed.includes(lead.status) ? lead.status : "new",
      selected_plan_id:idPattern.test(text(lead.selected_plan_id)) ? lead.selected_plan_id : null,
      consent_to_share:true, consent_at:now, consent_version:"partner-referral-v1-2026-11-07",
       tracking_token_hash:trackingHash,
      needs_details:{...details, source, consent_to_share:true, consent_at:now, consent_version:"partner-referral-v1-2026-11-07", consent_voice:lead.consent_voice===true}
    };
    const inserted=await rest("leads?select=id", {method:"POST",headers:restHeaders("return=representation"),body:JSON.stringify(record)});
    if (!inserted.ok) {
      console.error("capture-lead storage error", inserted.status);
      return response({error:"Impossible d'enregistrer la demande."},503,origin);
    }
    const rows=await inserted.json();
    return response({success:true,lead_id:rows?.[0]?.id||null,tracking_token:trackingToken,duplicate:false},200,origin);
  }

  if (body.action === "tracking.status") {
    const code=text(body.tracking_token,64).toLowerCase();
    if(!/^[a-f0-9]{48}$/.test(code))return response({error:"Référence de suivi invalide."},422,origin);
    const hash=await sha256(code);
    const r=await rest("leads?tracking_token_hash=eq."+hash+"&select=created_at,sales_status,consent_withdrawn_at&limit=1");
    if(!r.ok)return response({error:"Suivi momentanément indisponible."},503,origin);
    const lead=(await r.json())[0];
    if(!lead)return response({error:"Référence inconnue ou expirée."},404,origin);
    // Never return client PII, partner pricing, or internal notes through a public receipt.
    return response({success:true,created_at:lead.created_at,
      status:lead.consent_withdrawn_at?"Accord de mise en relation retiré":publicProgressLabel(lead.sales_status),
      finished:Boolean(lead.consent_withdrawn_at)||isTerminalStatus(lead.sales_status)},200,origin);
  }


  if (body.action === "tracking.select") {
    const code=text(body.tracking_token,64).toLowerCase();
    const offerId=text(body.selected_plan_id,64);
    if(!/^[a-f0-9]{48}$/.test(code)||!idPattern.test(offerId))
      return response({error:"Référence ou offre invalide."},422,origin);
    const hash=await sha256(code);
    const r=await rest("leads?tracking_token_hash=eq."+hash+
      "&select=id,created_at,sales_status,consent_to_share&limit=1");
    if(!r.ok)return response({error:"Service indisponible"},503,origin);
    const lead=(await r.json())[0];
    if(!lead||!lead.consent_to_share)return response({error:"Référence inconnue."},404,origin);
    if(Date.now()-new Date(lead.created_at).getTime()>7*86400*1000
       ||["lost","invalid","activated","invoiced","paid"].includes(lead.sales_status))
       return response({error:"Ce dossier n'est plus modifiable. Contactez-nous."},403,origin);
    const plan=await rest("plans?id=eq."+offerId+"&is_active=eq.true&select=id&limit=1");
    if(!plan.ok||!(await plan.json()).length)return response({error:"Offre indisponible ou non vérifiée."},422,origin);
    const updated=await rest("leads?id=eq."+lead.id,{
      method:"PATCH",headers:restHeaders("return=representation"),
      body:JSON.stringify({selected_plan_id:offerId})
    });
    if(!updated.ok)return response({error:"Sélection non enregistrée."},503,origin);
    return response((await updated.json()).length===1?{success:true}:{error:"Dossier introuvable."},200,origin);
  }

  // Private administrative actions require an authenticated Supabase user in the
  // server-side allowlist; client-set cookies and localStorage are never trusted.

  if (body.action === "partner.request") {
    // Public B2B partnership enquiry. It never exposes consumer leads.
    if (text(body.website)) return response({success:true},200,origin); // Honeypot
    if (body.consent_to_contact !== true) return response({error:"Merci de confirmer votre demande de contact."},422,origin);
    const company=text(body.business_name,150);
    const email=text(body.business_email,150).toLowerCase();
    const name=text(body.contact_name,120);
    const phone=normalizePhone(body.contact_phone);
    if (company.length<2 || name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return response({error:"Renseignez le nom, le contact et un email professionnel valide."},422,origin);
    const ptype=text(body.partner_type,40);
    const partnerType=["operator","distributor","call_center","integrator","other"].includes(ptype)?ptype:"other";
    const since=new Date(Date.now()-24*60*60*1000).toISOString();
    const exists=await rest("monforfait_partners?business_email=eq."+encodeURIComponent(email)+"&submitted_at=gte."+encodeURIComponent(since)+"&select=id&limit=1");
    if (exists.ok && (await exists.json()).length>0) return response({success:true},200,origin);
    const inserted=await rest("monforfait_partners",{
      method:"POST",headers:restHeaders("return=minimal"),
      body:JSON.stringify({
        business_name:company,business_email:email,contact_name:name,
        contact_phone:phone,partner_type:partnerType,
        regions:text(body.regions,240),services:text(body.services,140),
        estimated_volume:text(body.estimated_volume,60),
        consent_to_contact:true,submitted_at:new Date().toISOString(),
        sales_status:"inbound",source:"partner_form"
      })
    });
    if (!inserted.ok) {
      console.error("partner request storage error",inserted.status);
      return response({error:"Impossible d'enregistrer votre demande."},503,origin);
    }
    return response({success:true},200,origin);
  }

  // Partner identity is attached by an administrator after contract verification.
  // Authentication never uses a caller-supplied email, company ID or browser cookie.
  if(["partner.profile","partner.list","partner.feedback"].includes(body.action)){
    const access=await authorizePartner(req);
    if(!access)return response({error:"Compte partenaire non autorisé."},403,origin);
    const partnerRes=await rest("monforfait_partners?id=eq."+access.partnerId+
      "&select=id,business_name,partner_type,sales_status,business_email,contract_verified_at&limit=1");
    if(!partnerRes.ok)return response({error:"Partenaire indisponible"},503,origin);
    const partner=(await partnerRes.json())[0];
    if(!partner||!["contracted","active"].includes(partner.sales_status)||!partner.contract_verified_at)
      return response({error:"Accès partenaire en attente de contrat."},403,origin);
    if(body.action==="partner.profile")return response({success:true,partner},200,origin);
    const now=new Date().toISOString();
    if(body.action==="partner.list"){
      const q="monforfait_lead_sales?partner_id=eq."+access.partnerId+
        "&shared_at=not.is.null&access_expires_at=gt."+encodeURIComponent(now)+
        "&sales_stage=neq.rejected&select=id,lead_id,commercial_model,sales_stage,shared_at,access_expires_at,created_at&order=shared_at.desc&limit=100";
      const r=await rest(q);
      if(!r.ok)return response({error:"Dossiers momentanément indisponibles."},503,origin);
      const sales=await r.json();
      const leadIds=sales.map((v:Record<string,unknown>)=>v.lead_id).filter((v:unknown)=>typeof v==="string"&&idPattern.test(v as string));
      if(!leadIds.length)return response({success:true,partner,sales:[]},200,origin);
      const ids=leadIds.join(",");
      const l=await rest("leads?id=in.("+ids+")&select=id,user_name,user_phone,user_email,city,address,status,needs_details&limit=100");
      if(!l.ok)return response({error:"Détails momentanément indisponibles."},503,origin);
      const leadMap=new Map((await l.json()).map((v:Record<string,unknown>)=>[v.id,v]));
      return response({success:true,partner,sales:sales.map((sale:Record<string,unknown>)=>{
        const lead=leadMap.get(sale.lead_id) as Record<string,unknown>|undefined;
        // Only the minimum required for qualification is shared.
        const detail=lead?.needs_details && typeof lead.needs_details==="object" ? lead.needs_details as Record<string,unknown> : {};
        return {...sale,lead:lead?{
          name:lead.user_name,phone:lead.user_phone,email:lead.user_email,
          city:lead.city,address:lead.address,need:text(detail.interest||detail.reason||detail.need,180)
        }:null};
      })},200,origin);
    }
    const saleId=text(body.sale_id),outcome=text(body.outcome,30),note=text(body.notes,400);
    if(!idPattern.test(saleId)||!["received","contacted","no_answer","not_eligible","activated","rejected"].includes(outcome)
      ||note.length<8)return response({error:"Merci de documenter le retour sur ce dossier (8 caractères minimum)."},422,origin);
    const saleRes=await rest("monforfait_lead_sales?id=eq."+saleId+"&partner_id=eq."+access.partnerId+
      "&shared_at=not.is.null&access_expires_at=gt."+encodeURIComponent(now)+"&sales_stage=neq.rejected&select=id&limit=1");
    if(!saleRes.ok)return response({error:"Dossier indisponible."},503,origin);
    if((await saleRes.json()).length===0)return response({error:"Dossier non attribué ou accès expiré."},403,origin);
    const recent=await rest("monforfait_partner_feedback?sale_id=eq."+saleId+"&created_at=gte."+
      encodeURIComponent(new Date(Date.now()-24*3600*1000).toISOString())+"&select=id&limit=20");
    if(recent.ok && (await recent.json()).length>=20)return response({error:"Trop de retours sur ce dossier aujourd'hui."},429,origin);
    const posted=await rest("monforfait_partner_feedback",{
      method:"POST",headers:restHeaders("return=minimal"),
      body:JSON.stringify({sale_id:saleId,partner_id:access.partnerId,author_id:access.userId,outcome,notes:note})
    });
    return response(posted.ok?{success:true}:{error:"Retour non enregistré."},posted.ok?200:503,origin);
  }

  const adminUserId=await authorize(req);
  if(!adminUserId)return response({error:"Access denied"},403,origin);

  if(body.action==="admin.contact.list"){
    const stage=text(body.status,32),valid=["new","in_progress","answered","closed"];
    const limit=Math.max(1,Math.min(100,Math.floor(Number(body.limit)||50)));
    const offset=Math.max(0,Math.min(10000,Math.floor(Number(body.offset)||0)));
    let q="monforfait_contact_messages?select=id,name,email,subject,message,category,status,status_note,created_at,updated_at&order=created_at.desc&limit="+limit+"&offset="+offset;
    if(valid.includes(stage))q+="&status=eq."+stage;
    const r=await rest(q,{headers:restHeaders("count=exact")});
    return response(r.ok?{success:true,messages:await r.json(),total:countFromRange(r.headers.get("content-range")),limit,offset}:{error:"Boîte de réception indisponible."},r.ok?200:503,origin);
  }
  if(body.action==="admin.contact.update"){
    const id=text(body.message_id,64),status=text(body.status,32),note=text(body.status_note,400);
    if(!idPattern.test(id)||!["in_progress","answered","closed"].includes(status)||note.length<8)
      return response({error:"Veuillez renseigner une étape et une note vérifiable."},422,origin);
    const r=await rest("monforfait_contact_messages?id=eq."+id,{
      method:"PATCH",headers:restHeaders("return=representation"),
      body:JSON.stringify({status,status_note:note,handled_by:adminUserId,updated_at:new Date().toISOString()})
    });
    if(!r.ok)return response({error:"Mise à jour refusée."},503,origin);
    return response((await r.json()).length?{success:true}:{error:"Message introuvable."},200,origin);
  }

  if (body.action === "admin.stats") {
    const stages=["unreviewed","needs_verification","qualified","contacted","partner_proposed","activated","invoiced","paid","lost","invalid"];
    const since=new Date(Date.now()-30*86400*1000).toISOString();
    const q=["","&consent_to_share=eq.true","&created_at=gte."+encodeURIComponent(since),
      ...stages.map(stage=>"&sales_status=eq."+stage)];
    const r=await Promise.all(q.map(suffix=>rest("leads?select=id&limit=1"+suffix,{
      headers:restHeaders("count=exact")
    })));
    if(r.some(v=>!v.ok))return response({error:"Statistiques indisponibles"},503,origin);
    const n=r.map(x=>countFromRange(x.headers.get("content-range"))??0);
    return response({success:true,total:n[0],consented:n[1],last_30_days:n[2],
      by_stage:Object.fromEntries(stages.map((stage,i)=>[stage,n[i+3]]))},200,origin);
  }

  if(body.action==="admin.analytics"){
    const [daily,sources]=await Promise.all([
      rest("monforfait_daily_metrics?select=day,leads,consented,professional,in_progress&order=day.desc&limit=90"),
      rest("monforfait_source_metrics?select=source,leads,consented,professional&order=leads.desc&limit=30")
    ]);
    if(!daily.ok||!sources.ok)return response({error:"Reporting indisponible."},503,origin);
    return response({success:true,daily:await daily.json(),sources:await sources.json()},200,origin);
  }

  if (body.action === "admin.list") {
    const limit=Math.max(1,Math.min(100,Math.floor(Number(body.limit)||50)));
    const offset=Math.max(0,Math.min(10000,Math.floor(Number(body.offset)||0)));
    const stage=text(body.sales_status,40);
    const stages=["unreviewed","needs_verification","qualified","contacted","partner_proposed","activated","invoiced","paid","lost","invalid"];
    const term=text(body.search,80).replace(/[^\p{L}\p{N}\s-]/gu,"").trim();
    let q="leads?select=id,user_name,user_phone,user_email,city,status,sales_status,consent_to_share,consent_at,created_at,is_pro,needs_details&order=created_at.desc&limit="+limit+"&offset="+offset;
    if(stages.includes(stage))q+="&sales_status=eq."+stage;
    if(body.consented_only===true)q+="&consent_to_share=eq.true";
    if(term.length>=2){
      const needle=term.split(/\s+/).join("*");
      q+="&or="+encodeURIComponent("(user_name.ilike.*"+needle+"*,city.ilike.*"+needle+"*,phone_normalized.ilike.*"+needle+"*)");
    }
    const r=await rest(q,{headers:restHeaders("count=exact")});
    if(!r.ok)return response({error:"Database unavailable"},503,origin);
    return response({success:true,leads:await r.json(),total:countFromRange(r.headers.get("content-range")),limit,offset},200,origin);
  }
  if (body.action === "admin.lead.activity"){
    const leadId=text(body.lead_id);
    if(!idPattern.test(leadId))return response({error:"Référence invalide"},422,origin);
    const r=await rest("monforfait_lead_activity?lead_id=eq."+leadId+
      "&select=old_status,new_status,status_note,created_at&order=created_at.desc&limit=50");
    return response(r.ok?{success:true,activity:await r.json()}:{error:"Historique indisponible"},r.ok?200:503,origin);
  }
  if (body.action === "admin.update") {
    const leadId=text(body.lead_id);
    const stage=text(body.sales_status);
    const allowed=["unreviewed","needs_verification","qualified","contacted","partner_proposed","lost","invalid"];
    const note=text(body.sales_status_note,400);
    if (!idPattern.test(leadId) || !allowed.includes(stage)) return response({error:"Invalid update"},422,origin);
    if (["contacted","partner_proposed","lost","invalid"].includes(stage) && note.length<8)
      return response({error:"Justifiez cette étape avec une note d'au moins 8 caractères."},422,origin);
    const r=await rest("leads?id=eq."+encodeURIComponent(leadId),{
      method:"PATCH",headers:restHeaders("return=representation"),
      body:JSON.stringify({sales_status:stage,sales_status_note:note||null,
        sales_status_changed_at:new Date().toISOString(),sales_status_changed_by:adminUserId})
    });
    if(!r.ok)return response({error:"Update failed"},503,origin);
    const changed=await r.json();
    return response(changed.length?{success:true}:{error:"Dossier introuvable"},
      changed.length?200:404,origin);
  }
  if (body.action === "admin.partners") {
    const r=await rest("monforfait_partners?select=id,business_name,business_email,contact_name,contact_phone,partner_type,regions,services,estimated_volume,sales_status,source,created_at,contract_reference,contract_verified_at&order=created_at.desc&limit=150");
    return response(r.ok?{success:true,partners:await r.json()}:{error:"Database unavailable"},r.ok?200:503,origin);
  }
  if (body.action === "admin.update_partner") {
    const partnerId=text(body.partner_id);
    const status=text(body.sales_status);
    const allowed=["prospect","inbound","contacted","pilot","contracted","active","rejected"];
    const contractReference=text(body.contract_reference,180);
    if (!idPattern.test(partnerId)||!allowed.includes(status)) return response({error:"Invalid partner status"},422,origin);
    if(["contracted","active"].includes(status)&&contractReference.length<6)
      return response({error:"Référence du contrat signé obligatoire avant activation."},422,origin);
    const changes:Record<string,unknown>={sales_status:status};
    if(["contracted","active"].includes(status)){
      changes.contract_reference=contractReference;
      changes.contract_verified_at=new Date().toISOString();
      changes.contract_verified_by=adminUserId;
    }
    const r=await rest("monforfait_partners?id=eq."+encodeURIComponent(partnerId),{
      method:"PATCH",headers:restHeaders("return=minimal"),body:JSON.stringify(changes)
    });
    return response(r.ok?{success:true}:{error:"Update failed"},r.ok?200:503,origin);
  }

  // Revenue is counted only when proof of invoicing/payment is recorded;
  // "proposed", "accepted" and "activated" are not cash receipts.
  if (body.action === "admin.sales.list") {
    const r=await rest("monforfait_lead_sales?select=id,lead_id,partner_id,commercial_model,sales_stage,agreed_amount_dh,invoice_reference,payment_reference,evidence_notes,created_at,activated_at,invoiced_at,paid_at,updated_at,shared_at,access_expires_at,contract_reference&order=created_at.desc&limit=500");
    return response(r.ok?{success:true,sales:await r.json()}:{error:"Could not load commercial pipeline"},r.ok?200:503,origin);
  }
  if (body.action === "admin.sales.propose") {
    const leadId=text(body.lead_id), partnerId=text(body.partner_id);
    const model=text(body.commercial_model);
    const amount=Number(body.agreed_amount_dh);
    const note=text(body.evidence_notes,400);
    if (!idPattern.test(leadId) || !idPattern.test(partnerId) || !["cpl","activation"].includes(model) ||
        !Number.isFinite(amount) || amount<=0 || amount>50000 || Math.abs(Math.round(amount*100)-amount*100)>0.00001)
      return response({error:"Paramètres de proposition invalides"},422,origin);
    const [leadRes,partnerRes]=await Promise.all([
      rest("leads?id=eq."+encodeURIComponent(leadId)+"&select=id,consent_to_share,consent_at,consent_version,sales_status&limit=1"),
      rest("monforfait_partners?id=eq."+encodeURIComponent(partnerId)+"&select=id,sales_status,contract_verified_at&limit=1")
    ]);
    if (!leadRes.ok || !partnerRes.ok) return response({error:"Impossible de vérifier l'éligibilité commerciale."},503,origin);
    const [leads,partners]=await Promise.all([leadRes.json(),partnerRes.json()]);
    if (!leads[0]?.consent_to_share||!leads[0]?.consent_at||!leads[0]?.consent_version) return response({error:"Prospect sans consentement documenté : proposition refusée."},403,origin);
    if(!["qualified","contacted","partner_proposed"].includes(leads[0]?.sales_status))
      return response({error:"Le prospect doit être qualifié avant une proposition commerciale."},403,origin);
    if (!["pilot","contracted","active"].includes(partners[0]?.sales_status))
      return response({error:"Le partenaire doit être en pilote, sous contrat ou actif."},403,origin);
    const r=await rest("monforfait_lead_sales",{
      method:"POST",headers:restHeaders("return=minimal"),
      body:JSON.stringify({lead_id:leadId,partner_id:partnerId,commercial_model:model,
        agreed_amount_dh:amount,sales_stage:"proposed",evidence_notes:note||null})
    });
    return response(r.ok?{success:true}:{error:"Proposition non enregistrée ou déjà existante."},r.ok?200:409,origin);
  }
  if (body.action === "admin.sales.update") {
    const saleId=text(body.sale_id),next=text(body.sales_stage);
    const note=text(body.evidence_notes,400);
    const invoice=text(body.invoice_reference,140),payment=text(body.payment_reference,140);
    if (!idPattern.test(saleId) || !["accepted","activated","invoiced","paid","rejected"].includes(next))
      return response({error:"Étape commerciale invalide"},422,origin);
    const oldRes=await rest("monforfait_lead_sales?id=eq."+encodeURIComponent(saleId)+"&select=id,lead_id,sales_stage,shared_at,invoice_reference,activated_at,invoiced_at,paid_at&limit=1");
    if(!oldRes.ok)return response({error:"Suivi indisponible"},503,origin);
    const before=(await oldRes.json())[0];
    if(!before)return response({error:"Dossier inconnu"},404,origin);
    const currentLead=await rest("leads?id=eq."+before.lead_id+"&select=id,consent_to_share,consent_withdrawn_at&limit=1");
    if(!currentLead.ok)return response({error:"Vérification du consentement indisponible."},503,origin);
    const consent=(await currentLead.json())[0];
    if((!consent?.consent_to_share||consent?.consent_withdrawn_at)&&next!=="rejected")
      return response({error:"Accord retiré ou invalide : la vente ne peut plus avancer."},403,origin);
    if(!mayAdvanceCommercialStage(before.sales_stage,next))
      return response({error:"Transition non autorisée depuis l'étape actuelle"},422,origin);
    if(["activated","invoiced","paid"].includes(next)&&!before.shared_at)
      return response({error:"Une mise en relation validée sous contrat est nécessaire avant activation ou facturation."},403,origin);
    if(next==="activated" && note.length<8)
      return response({error:"Renseignez la preuve de l'activation (référence ou note vérifiable)."},422,origin);
    if(next==="invoiced" && invoice.length<3)
      return response({error:"Référence de facture obligatoire."},422,origin);
    if(next==="paid" && (!before.invoiced_at || payment.length<3))
      return response({error:"Facturation préalable et référence de règlement obligatoires."},422,origin);
    const now=new Date().toISOString();
    const patch:Record<string,unknown>={sales_stage:next,updated_at:now,evidence_notes:note||null};
    if(next==="activated")patch.activated_at=now;
    if(next==="invoiced"){patch.invoiced_at=now;patch.invoice_reference=invoice;}
    if(next==="paid"){patch.paid_at=now;patch.payment_reference=payment;}
    const r=await rest("monforfait_lead_sales?id=eq."+encodeURIComponent(saleId),{
      method:"PATCH",headers:restHeaders("return=minimal"),body:JSON.stringify(patch)
    });
    return response(r.ok?{success:true}:{error:"Transition non enregistrée"},r.ok?200:503,origin);
  }

  if(body.action==="admin.partner.link"){
    const partnerId=text(body.partner_id);
    if(!idPattern.test(partnerId))return response({error:"Partenaire invalide."},422,origin);
    const r=await rest("monforfait_partners?id=eq."+partnerId+
      "&select=id,business_name,business_email,sales_status,contract_verified_at&limit=1");
    if(!r.ok)return response({error:"Partenaire indisponible."},503,origin);
    const partner=(await r.json())[0];
    if(!partner||!["contracted","active"].includes(partner.sales_status)
      ||!text(partner.business_email)||!partner.contract_verified_at)return response({error:"Un partenaire sous contrat avec email vérifié est requis."},422,origin);
    const users=await fetch(supabaseUrl+"/auth/v1/admin/users?page=1&per_page=200",{
      headers:{"apikey":serviceKey,"Authorization":"Bearer "+serviceKey}
    });
    if(!users.ok)return response({error:"Service d'identité indisponible."},503,origin);
    const found=(await users.json()).users?.find((u:Record<string,unknown>)=>
      typeof u.email==="string"&&u.email.toLowerCase()===partner.business_email.toLowerCase()
      &&Boolean(u.email_confirmed_at));
    if(!found||!idPattern.test(found.id))return response({
      error:"Le contact doit d'abord se connecter avec son email professionnel et confirmer l'adresse."
    },422,origin);
    const exists=await rest("monforfait_partner_users?user_id=eq."+found.id+"&select=partner_id&limit=1");
    if(!exists.ok)return response({error:"Vérification du compte impossible."},503,origin);
    const mapped=(await exists.json())[0];
    if(mapped&&mapped.partner_id!==partnerId)return response({error:"Ce compte est déjà affecté à un autre partenaire."},409,origin);
    if(mapped)return response({success:true,already_linked:true},200,origin);
    const granted=await rest("monforfait_partner_users",{
      method:"POST",headers:restHeaders("return=minimal"),
      body:JSON.stringify({user_id:found.id,partner_id:partnerId})
    });
    return response(granted.ok?{success:true}:{error:"Activation partenaire impossible."},
      granted.ok?200:503,origin);
  }
  if(body.action==="admin.partner.feedback"){
    const r=await rest("monforfait_partner_feedback?select=id,sale_id,partner_id,outcome,notes,created_at&order=created_at.desc&limit=250");
    return response(r.ok?{success:true,feedback:await r.json()}:{error:"Retours indisponibles."},r.ok?200:503,origin);
  }
  if(body.action==="admin.sales.release"){
    const saleId=text(body.sale_id),contract=text(body.contract_reference,180);
    if(!idPattern.test(saleId)||contract.length<6)
      return response({error:"Contrat de distribution signé et référence nécessaires."},422,origin);
    const r=await rest("monforfait_lead_sales?id=eq."+saleId+
      "&select=id,lead_id,partner_id,sales_stage,shared_at&limit=1");
    if(!r.ok)return response({error:"Dossier indisponible."},503,origin);
    const sale=(await r.json())[0];
    if(!sale||sale.sales_stage!=="accepted"||sale.shared_at)
      return response({error:"Seul un dossier accepté et non partagé peut être transmis."},403,origin);
    const [lr,pr]=await Promise.all([
      rest("leads?id=eq."+sale.lead_id+"&select=id,consent_to_share,consent_at,consent_version,sales_status&limit=1"),
      rest("monforfait_partners?id=eq."+sale.partner_id+"&select=id,sales_status&limit=1")
    ]);
    if(!lr.ok||!pr.ok)return response({error:"Vérification indisponible."},503,origin);
    const lead=(await lr.json())[0],partner=(await pr.json())[0];
    if(!lead?.consent_to_share||!lead.consent_at||!lead.consent_version
      ||!["qualified","contacted","partner_proposed"].includes(lead.sales_status)
      ||!partner||!["contracted","active"].includes(partner.sales_status)||!partner.contract_verified_at)
      return response({error:"Consentement documenté et partenaire sous contrat indispensables."},403,origin);
    const now=new Date(),expiry=new Date(now.getTime()+30*86400*1000);
    const update=await rest("monforfait_lead_sales?id=eq."+saleId+"&shared_at=is.null&sales_stage=eq.accepted",{
      method:"PATCH",headers:restHeaders("return=representation"),
      body:JSON.stringify({shared_at:now.toISOString(),shared_by:adminUserId,
        contract_reference:contract,access_expires_at:expiry.toISOString()})
    });
    if(!update.ok)return response({error:"Transmission non enregistrée."},503,origin);
    const updated=await update.json();
    return response(updated.length===1?{success:true,shared_at:now.toISOString(),expires_at:expiry.toISOString()}
      :{error:"Dossier déjà modifié."},updated.length===1?200:409,origin);
  }


  if(body.action==="admin.catalog.list"){
    const [plans,operators,audit]=await Promise.all([
      rest("plans?select=id,title,operator_id,category,technology,download_speed_mbps,mobile_data_gb,voice_minutes,price_dh,is_active,source_url,source_checked_at,operators(id,name)&order=source_checked_at.desc.nullslast&limit=200"),
      rest("operators?select=id,name&order=name.asc"),
      rest("monforfait_catalog_audit?select=id,plan_id,action,old_price_dh,new_price_dh,created_at&order=created_at.desc&limit=70")
    ]);
    if(!plans.ok||!operators.ok||!audit.ok)return response({error:"Catalogue interne indisponible"},503,origin);
    return response({success:true,plans:await plans.json(),operators:await operators.json(),audit:await audit.json()},200,origin);
  }
  if(body.action==="admin.catalog.create"||body.action==="admin.catalog.update"){
    const id=text(body.plan_id,64),operatorId=text(body.operator_id,64);
    const title=text(body.title,140),amount=Number(body.price_dh);
    const category=text(body.category,20);
    const speed=Number(body.download_speed_mbps),dataGb=Number(body.mobile_data_gb);
    if(title.length<3||!Number.isFinite(amount)||amount<=0||amount>3000||
       Math.abs(amount*100-Math.round(amount*100))>0.00001)
      return response({error:"Nom et prix valide obligatoires."},422,origin);
    let existing:Record<string,unknown>|null=null;
    if(body.action==="admin.catalog.update"){
      if(!idPattern.test(id))return response({error:"Référence invalide."},422,origin);
      const r=await rest("plans?id=eq."+id+"&select=id,title,operator_id,category&limit=1");
      if(!r.ok)return response({error:"Offre introuvable."},503,origin);
      existing=(await r.json())[0]||null;
      if(!existing)return response({error:"Offre introuvable."},404,origin);
      if(existing.category!==category)return response({error:"La catégorie d'une offre historique n'est pas modifiable."},422,origin);
    }else{
      if(!idPattern.test(operatorId)||!["internet","mobile"].includes(category))
        return response({error:"Opérateur et catégorie requis."},422,origin);
    }
    if(category==="internet"&&(!Number.isInteger(speed)||speed<1||speed>2000))
      return response({error:"Débit fibre valide requis."},422,origin);
    if(category==="mobile"&&(!Number.isInteger(dataGb)||dataGb<1||dataGb>1000))
      return response({error:"Data mobile valide requise."},422,origin);
    const operator=await rest("operators?id=eq."+(existing?.operator_id||operatorId)+"&select=id,name&limit=1");
    if(!operator.ok)return response({error:"Opérateur introuvable."},503,origin);
    const op=(await operator.json())[0];
    if(!op)return response({error:"Opérateur inconnu."},404,origin);
    const url=verifiedSource(body.source_url,op.name);
    if(!url)return response({error:"Une URL officielle HTTPS du bon opérateur est obligatoire."},422,origin);
    const now=new Date().toISOString();
    const changed=body.action==="admin.catalog.update"
      ? await rest("plans?id=eq."+id,{
          method:"PATCH",headers:restHeaders("return=representation"),
          body:JSON.stringify({title,price_dh:amount,source_url:url,source_checked_at:now,
            source_checked_by:adminUserId,is_active:true,is_sponsored:false,highlight_badge:null,
            download_speed_mbps:category==="internet"?speed:null,
            mobile_data_gb:category==="mobile"?dataGb:null})
        })
      : await rest("plans?select=id",{
          method:"POST",headers:restHeaders("return=representation"),
          body:JSON.stringify({operator_id:operatorId,title,price_dh:amount,category,
            technology:category==="internet"?"FTTH":null,
            download_speed_mbps:category==="internet"?speed:null,
            mobile_data_gb:category==="mobile"?dataGb:null,
            target_audience:"individual",is_active:true,is_sponsored:false,
            source_url:url,source_checked_at:now,source_checked_by:adminUserId,
            setup_fee_dh:null,commitment_months:null,
            features:{source:"official",checked_on:now.slice(0,10),subject_to_eligibility:true}})
        });
    if(!changed.ok)return response({error:"Enregistrement du tarif impossible."},503,origin);
    const result=await changed.json();
    return response(result.length?{success:true,plan_id:result[0].id}:{error:"Offre introuvable."},result.length?200:404,origin);
  }
  if(body.action==="admin.catalog.archive"){
    const id=text(body.plan_id,64);
    if(!idPattern.test(id))return response({error:"Offre invalide"},422,origin);
    const r=await rest("plans?id=eq."+id,{
      method:"PATCH",headers:restHeaders("return=representation"),
      body:JSON.stringify({is_active:false,is_sponsored:false,highlight_badge:null,
        source_checked_by:adminUserId})
    });
    if(!r.ok)return response({error:"Archivage impossible"},503,origin);
    const rows=await r.json();
    return response(rows.length?{success:true}:{error:"Offre introuvable"},rows.length?200:404,origin);
  }

  if (body.action === "admin.create_partner") {
    const name=text(body.business_name,150), email=text(body.business_email,150);
    if (name.length<2 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return response({error:"Invalid partner"},422,origin);
    const r=await rest("monforfait_partners",{
      method:"POST", headers:restHeaders("return=minimal"),
      body:JSON.stringify({business_name:name,business_email:email||null,partner_type:"distributor",sales_status:"prospect"})
    });
    return response(r.ok?{success:true}:{error:"Could not create partner"},r.ok?200:503,origin);
  }
  return response({error:"Unknown operation"},404,origin);
});