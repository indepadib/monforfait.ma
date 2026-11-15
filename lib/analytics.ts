export const GA_MEASUREMENT_ID=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
type GTagEvent={action:string;category:string;label:string;value?:number}

function enabled():boolean{
 return typeof window!=='undefined' &&
   window.localStorage.getItem('monforfait_cookie_consent')==='accepted' &&
   typeof (window as any).gtag==='function'
}
export const pageview=(url:string)=>{
 if(enabled()&&GA_MEASUREMENT_ID)(window as any).gtag('config',GA_MEASUREMENT_ID,{page_path:url})
}
export const event=({action,category,label,value}:GTagEvent)=>{
 if(enabled())(window as any).gtag('event',action,{event_category:category,event_label:label,value})
}
export const trackEvent=(name:string,params?:Record<string,unknown>)=>{
 if(enabled())(window as any).gtag('event',name,params)
}
