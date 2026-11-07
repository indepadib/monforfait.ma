import { NextResponse } from 'next/server'
export async function POST(){return NextResponse.json({error:'Paiement en ligne indisponible : aucun prélèvement effectué. Contactez le service commercial.'},{status:503})}
