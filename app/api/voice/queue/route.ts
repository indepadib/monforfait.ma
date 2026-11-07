import { NextResponse } from 'next/server'
export async function POST(){return NextResponse.json({error:'Appels automatisés suspendus jusqu’à vérification des consentements.'},{status:403})}
