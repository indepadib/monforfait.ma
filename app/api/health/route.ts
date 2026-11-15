import {NextResponse} from 'next/server'
import {supabase} from '@/lib/supabaseClient'
export const dynamic='force-dynamic'
export async function GET(){
 try{
  const {count,error}=await supabase.from('plans')
   .select('id',{count:'exact',head:true}).eq('is_active',true)
  if(error)return NextResponse.json({status:'degraded',catalog:'unavailable'},{status:503,
   headers:{'Cache-Control':'no-store'}})
  return NextResponse.json({status:'ok',catalog:'available',active_offers:count||0,
    checked_at:new Date().toISOString()},{
    headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex'}
  })
 }catch{
  return NextResponse.json({status:'degraded',catalog:'unavailable'},
    {status:503,headers:{'Cache-Control':'no-store'}})
 }
}
