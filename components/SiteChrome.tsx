'use client'
import {usePathname} from 'next/navigation'
import {AgentChatbot} from '@/components/AgentChatbot'
import {Footer} from '@/components/Footer'
import {CookieConsent} from '@/components/CookieConsent'
import {ConsentControlledScripts} from '@/components/ConsentControlledScripts'
import {CompareBar} from '@/components/CompareBar'
import {StickyMobileFooter} from '@/components/StickyMobileFooter'
// The public embeddable comparison widget must not mutate the document to remove
// the regular website shell, otherwise it breaks React hydration and leaks UI.
export function SiteChrome(){
 const pathname=usePathname()
 if(pathname==='/widget')return null
 return <>
  <AgentChatbot/>
  <Footer/>
  <CookieConsent/>
  <ConsentControlledScripts/>
  <CompareBar/>
  <StickyMobileFooter/>
 </>
}
