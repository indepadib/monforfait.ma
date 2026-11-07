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
export async function captureLead(lead: NewLead): Promise<{id: string | null; duplicate: boolean}> {
  if (!lead.consent_to_share) throw new Error('Veuillez accepter la mise en relation pour envoyer la demande.')
  const { data, error } = await supabase.functions.invoke('leads-gateway', {body:{action:'capture',lead}})
  if (error) throw new Error('Votre demande n’a pas pu être enregistrée. Réessayez.')
  if (!data?.success) throw new Error(data?.error || 'Enregistrement impossible.')
  return {id:data.lead_id || null, duplicate:Boolean(data.duplicate)}
}
