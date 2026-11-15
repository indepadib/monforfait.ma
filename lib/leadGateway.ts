import { supabase } from '@/lib/supabaseClient'

export type NewLead = {
  user_name: string
  user_phone: string
  user_email?: string
  city?: string
  address?: string
  status?: string
  is_pro?: boolean
  selected_plan_id?: string
  needs_details?: Record<string, unknown>
  consent_to_share: boolean
  consent_voice?: boolean
}
export async function captureLead(lead: NewLead): Promise<{id: string | null; duplicate: boolean; tracking_token: string | null}> {
  if (!lead.consent_to_share) throw new Error('Veuillez accepter la mise en relation pour envoyer la demande.')
  const { data, error } = await supabase.functions.invoke('leads-gateway', {body:{action:'capture',lead}})
  if (error) throw new Error('Votre demande n’a pas pu être enregistrée. Réessayez.')
  if (!data?.success) throw new Error(data?.error || 'Enregistrement impossible.')
  const token=typeof data.tracking_token==='string' && /^[a-f0-9]{48}$/.test(data.tracking_token)
    ? data.tracking_token : null
  // No personal data is stored in the receipt. A random reference can later query
  // only the public progress label, never contact details.
  if(token && typeof window!=='undefined'){
    try{window.localStorage.setItem('monforfait_tracking_token',token)}catch{}
  }
  return {id:data.lead_id || null, duplicate:Boolean(data.duplicate),tracking_token:token}
}

export async function selectOfferFromReceipt(selectedPlanId:string):Promise<void>{
  const token=typeof window!=='undefined' ? window.localStorage.getItem('monforfait_tracking_token') : null
  if(!token)throw new Error('Référence introuvable : veuillez remplir une nouvelle demande.')
  const {data,error}=await supabase.functions.invoke('leads-gateway',{
    body:{action:'tracking.select',tracking_token:token,selected_plan_id:selectedPlanId}
  })
  if(error||!data?.success)throw new Error(data?.error||'La sélection de cette offre n’a pas été enregistrée.')
}
