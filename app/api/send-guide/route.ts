import {NextResponse} from 'next/server'
// The existing PDF is directly downloadable; email dispatch is intentionally disabled
// until the sending domain, SMTP provider and consent are configured.
export function GET(request:Request){
 return NextResponse.redirect(new URL('/guide-internet-maroc.pdf',request.url),307)
}
export function POST(){
 return NextResponse.json({
  success:false,email_sent:false,
  download_url:'/guide-internet-maroc.pdf',
  message:'Envoi par email non configuré. Vous pouvez consulter gratuitement le guide PDF.'
 },{status:503,headers:{'Cache-Control':'no-store'}})
}
