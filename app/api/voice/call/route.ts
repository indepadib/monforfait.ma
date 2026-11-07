import { NextResponse } from 'next/server'
export async function POST(){return NextResponse.json({error:'Ce traitement automatique est suspendu en attente d’une authentification et d’une validation de sécurité.'},{status:403})}
