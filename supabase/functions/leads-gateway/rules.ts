// Pure domain rules shared by the production Edge Function and Deno tests.
export function normalizeMoroccanPhone(value:unknown):string|null{
 const raw=typeof value==='string'?value.trim().slice(0,32):''
 const digits=raw.replace(/\D/g,'')
 const phone=digits.startsWith('00212')?'0'+digits.slice(5):
   digits.startsWith('212')?'0'+digits.slice(3):digits
 return /^0[567]\d{8}$/.test(phone)?phone:null
}
const statuses:Record<string,string>={
 unreviewed:'Demande reçue',
 needs_verification:'Vérification en cours',
 qualified:'Demande qualifiée',
 contacted:'Prise de contact en cours',
 partner_proposed:'Étude de mise en relation',
 activated:'Activation à confirmer',
 invoiced:'Dossier en cours',
 paid:'Dossier finalisé',
 lost:'Demande clôturée',
 invalid:'Demande non retenue'
}
export function publicProgressLabel(internalStatus:unknown):string{
 return typeof internalStatus==='string'?(statuses[internalStatus]||statuses.unreviewed):statuses.unreviewed
}
export function isTerminalStatus(internalStatus:unknown):boolean{
 return ['lost','invalid','paid'].includes(String(internalStatus||''))
}
export function mayAdvanceCommercialStage(current:string,next:string):boolean{
 const transitions:Record<string,string[]>={
  proposed:['accepted','rejected'],
  accepted:['activated','invoiced','rejected'],
  activated:['invoiced','rejected'],
  invoiced:['paid','rejected'],
  paid:[],rejected:[]
 }
 return (transitions[current]||[]).includes(next)
}
