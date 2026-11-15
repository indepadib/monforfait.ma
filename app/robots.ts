import {MetadataRoute} from 'next'
export default function robots():MetadataRoute.Robots{
 return {
  rules:{userAgent:'*',allow:'/',disallow:[
   '/admin','/login','/espace-partenaire','/suivi',
   '/client/dashboard','/operateurs/dashboard',
   '/api/'
  ]},
  sitemap:'https://monforfait.ma/sitemap.xml'
 }
}
