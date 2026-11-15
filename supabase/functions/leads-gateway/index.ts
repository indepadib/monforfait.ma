import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
const normalizePhone = (raw: unknown) => {
  const digits = text(raw, 32).replace(/\D/g, "");
  let phone = digits.startsWith("00212") ? "0" + digits.slice(5) : digits.startsWith("212") ? "0" + digits.slice(3) : digits;
  return /^0[567]\d{8}$/.test(phone) ? phone : null;
};
function restHeaders(prefer?: string) {
  return {"apikey":serviceKey, "Authorization":"Bearer "+serviceKey, "Content-Type":"application/json", ...(prefer ? {"Prefer":prefer}: {})};
}
async function rest(path: string, init: RequestInit = {}) {
  return fetch(supabaseUrl + "/rest/v1/" + path, {...init, headers:{...restHeaders(), ...(init.headers as Record<string,string> || {})}});
}
async function authorize(req: Request): Promise<boolean> {
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i,"");
  if (!token || !serviceKey || !anonKey) return false;
  const userRes = await fetch(supabaseUrl+"/auth/v1/user", {
    headers: {"apikey":anonKey, "Authorization":"Bearer "+token}
  });
  if (!userRes.ok) return false;
  const user = await userRes.json();
  if (!user?.id || !idPattern.test(user.id)) return false;
  const rows = await rest("monforfait_admins?user_id=eq."+encodeURIComponent(user.id)+"&select=user_id&limit=1");
  return rows.ok && (await rows.json()).length === 1;
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
      needs_details:{...details, source, consent_to_share:true, consent_at:now, consent_version:"partner-referral-v1-2026-11-07", consent_voice:lead.consent_voice===true}
    };
    const inserted=await rest("leads?select=id", {method:"POST",headers:restHeaders("return=representation"),body:JSON.stringify(record)});
    if (!inserted.ok) {
      console.error("capture-lead storage error", inserted.status);
      return response({error:"Impossible d'enregistrer la demande."},503,origin);
    }
    const rows=await inserted.json();
    return response({success:true,lead_id:rows?.[0]?.id||null,duplicate:false},200,origin);
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
  if (!(await authorize(req))) return response({error:"Access denied"},403,origin);
  if (body.action === "admin.list") {
    const limit=Math.max(1,Math.min(250,Number(body.limit)||150));
    const r=await rest("leads?select=id,user_name,user_phone,user_email,city,status,sales_status,consent_to_share,created_at,is_pro,needs_details&order=created_at.desc&limit="+limit,{
      headers:restHeaders("count=exact")
    });
    if (!r.ok) return response({error:"Database unavailable"},503,origin);
    return response({success:true,leads:await r.json(),count:r.headers.get("content-range")},200,origin);
  }
  if (body.action === "admin.update") {
    const leadId=text(body.lead_id);
    const stage=text(body.sales_status);
    const allowed=["unreviewed","needs_verification","qualified","contacted","partner_proposed","activated","invoiced","paid","lost","invalid"];
    if (!idPattern.test(leadId) || !allowed.includes(stage)) return response({error:"Invalid update"},422,origin);
    const r=await rest("leads?id=eq."+encodeURIComponent(leadId),{
      method:"PATCH",headers:restHeaders("return=minimal"),body:JSON.stringify({sales_status:stage})
    });
    return response(r.ok?{success:true}:{error:"Update failed"},r.ok?200:503,origin);
  }
  if (body.action === "admin.partners") {
    const r=await rest("monforfait_partners?select=id,business_name,business_email,contact_name,contact_phone,partner_type,regions,services,estimated_volume,sales_status,source,created_at&order=created_at.desc&limit=150");
    return response(r.ok?{success:true,partners:await r.json()}:{error:"Database unavailable"},r.ok?200:503,origin);
  }
  if (body.action === "admin.update_partner") {
    const partnerId=text(body.partner_id);
    const status=text(body.sales_status);
    const allowed=["prospect","inbound","contacted","pilot","contracted","active","rejected"];
    if (!idPattern.test(partnerId)||!allowed.includes(status)) return response({error:"Invalid partner status"},422,origin);
    const r=await rest("monforfait_partners?id=eq."+encodeURIComponent(partnerId),{
      method:"PATCH",headers:restHeaders("return=minimal"),body:JSON.stringify({sales_status:status})
    });
    return response(r.ok?{success:true}:{error:"Update failed"},r.ok?200:503,origin);
  }

  // Revenue is counted only when proof of invoicing/payment is recorded;
  // "proposed", "accepted" and "activated" are not cash receipts.
  if (body.action === "admin.sales.list") {
    const r=await rest("monforfait_lead_sales?select=id,lead_id,partner_id,commercial_model,sales_stage,agreed_amount_dh,invoice_reference,payment_reference,evidence_notes,created_at,activated_at,invoiced_at,paid_at,updated_at&order=created_at.desc&limit=500");
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
      rest("leads?id=eq."+encodeURIComponent(leadId)+"&select=id,consent_to_share&limit=1"),
      rest("monforfait_partners?id=eq."+encodeURIComponent(partnerId)+"&select=id,sales_status&limit=1")
    ]);
    if (!leadRes.ok || !partnerRes.ok) return response({error:"Impossible de vérifier l'éligibilité commerciale."},503,origin);
    const [leads,partners]=await Promise.all([leadRes.json(),partnerRes.json()]);
    if (!leads[0]?.consent_to_share) return response({error:"Prospect sans consentement documenté : proposition refusée."},403,origin);
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
    const oldRes=await rest("monforfait_lead_sales?id=eq."+encodeURIComponent(saleId)+"&select=id,sales_stage,invoice_reference,activated_at,invoiced_at,paid_at&limit=1");
    if(!oldRes.ok)return response({error:"Suivi indisponible"},503,origin);
    const before=(await oldRes.json())[0];
    if(!before)return response({error:"Dossier inconnu"},404,origin);
    const moves:Record<string,string[]>={
      proposed:["accepted","rejected"],
      accepted:["activated","invoiced","rejected"],
      activated:["invoiced","rejected"],
      invoiced:["paid","rejected"],
      paid:[],rejected:[]
    };
    if(!moves[before.sales_stage]?.includes(next))
      return response({error:"Transition non autorisée depuis l'étape actuelle"},422,origin);
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