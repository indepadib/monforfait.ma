import { NextResponse } from 'next/server'
export async function POST() {
 return NextResponse.json({error:'Le guide par email est temporairement indisponible. Consultez les offres sur /offers.'},{status:503,headers:{'Cache-Control':'no-store'}})
}
