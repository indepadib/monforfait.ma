import { NextResponse } from 'next/server'
export async function POST(){return NextResponse.json({error:'Dispatch automatique désactivé jusqu’à validation des partenaires et consentements.'},{status:403})}
