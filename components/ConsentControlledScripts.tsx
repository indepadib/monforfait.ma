'use client'
import {useEffect,useState} from 'react'
import Script from 'next/script'

export function ConsentControlledScripts(){
 const [approved,setApproved]=useState(false)
 useEffect(()=>{
   const refresh=()=>setApproved(window.localStorage.getItem('monforfait_cookie_consent')==='accepted')
   refresh()
   window.addEventListener('monforfait:analytics-consent-changed',refresh)
   return()=>window.removeEventListener('monforfait:analytics-consent-changed',refresh)
 },[])
 const ga=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
 if(!approved)return null
 return <>
  {ga&&<>
   <Script id="monforfait-ga-config" strategy="afterInteractive">{`
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);}
    window.gtag=gtag;
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
    gtag('js',new Date());
    gtag('config',${JSON.stringify(ga)});
   `}</Script>
   <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`} strategy="afterInteractive"/>
  </>}
  <Script
   id="monforfait-adsense-consented"
   src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5443016381737012"
   crossOrigin="anonymous" strategy="lazyOnload"
  />
 </>
}
