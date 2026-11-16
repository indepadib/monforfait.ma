/**
 * A shared Supabase Auth project must NOT choose the callback domain for us:
 * Auth > URL Configuration has only one Site URL, which may belong to another app.
 * Each application explicitly supplies its own allowlisted callback URL.
 */
export const MONFORFAIT_AUTH_ORIGIN='https://monforfait.ma'

export type PrivateArea='admin'|'partner'

export function privateDestination(area:PrivateArea):'/admin'|'/espace-partenaire'{
  return area==='partner'?'/espace-partenaire':'/admin'
}

/** Only these exact private routes may follow successful authentication. */
export function allowedAuthDestination(value:string|null):'/admin'|'/espace-partenaire'|null{
  if(value==='/admin'||value==='/espace-partenaire')return value
  return null
}

/** Localhost is allowed for development only. Never trust a user-supplied host. */
export function authCallbackUrl(destination:'/admin'|'/espace-partenaire', currentOrigin?:string):string{
  let origin=MONFORFAIT_AUTH_ORIGIN
  if(process.env.NODE_ENV==='development' && currentOrigin){
    try{
      const url=new URL(currentOrigin)
      if(['localhost','127.0.0.1'].includes(url.hostname) && ['http:','https:'].includes(url.protocol))
        origin=url.origin
    }catch{}
  }
  const url=new URL('/auth/callback',origin)
  url.searchParams.set('next',destination)
  return url.toString()
}
