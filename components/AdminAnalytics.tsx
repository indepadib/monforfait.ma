'use client'
import {useCallback,useEffect,useMemo,useState} from 'react'
import {supabase} from '@/lib/supabaseClient'
import {AreaChart,Area,CartesianGrid,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts'
import {BarChart3,RefreshCcw} from 'lucide-react'

type Day={day:string;leads:number;consented:number;professional:number;in_progress:number}
type Source={source:string;leads:number;consented:number;professional:number}
export function AdminAnalytics(){
 const [daily,setDaily]=useState<Day[]>([])
 const [sources,setSources]=useState<Source[]>([])
 const [ready,setReady]=useState(false)
 const [error,setError]=useState('')
 const reload=useCallback(async()=>{
  const {data,error:e}=await supabase.functions.invoke('leads-gateway',{body:{action:'admin.analytics'}})
  setReady(true)
  if(e||!data?.success){setError(data?.error||'Reporting non disponible.');return}
  setDaily(data.daily||[]);setSources(data.sources||[]);setError('')
 },[])
 useEffect(()=>{void reload()},[reload])
 const chart=useMemo(()=>[...daily].reverse().slice(-30).map(row=>({
    ...row,day:new Date(row.day+'T12:00:00').toLocaleDateString('fr-MA',{day:'2-digit',month:'2-digit'})
  })),[daily])
 const last30=sources.reduce((n,s)=>n+s.leads,0)
 const consent=sources.reduce((n,s)=>n+s.consented,0)
 return <section className="rounded-2xl border border-zinc-200 bg-white p-5 md:p-7 space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-xs uppercase tracking-wider text-blue-700 font-bold">Acquisition réelle</p>
    <h2 className="text-xl md:text-2xl font-bold mt-1">Sources et performance</h2>
    <p className="mt-1 text-sm text-zinc-500">Demandes enregistrées, pas des installations ni des ventes. Données issues de Supabase.</p>
   </div>
   <button type="button" onClick={()=>void reload()} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"><RefreshCcw className="w-4 h-4"/>Actualiser</button>
  </div>
  {error&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  {!ready?<p className="text-zinc-500">Chargement des métriques…</p>:<>
   <div className="grid sm:grid-cols-3 gap-3">
    <div className="rounded-xl bg-zinc-50 border p-4"><p className="text-xs text-zinc-500">Demandes sur 30 jours</p><p className="text-3xl font-bold mt-2">{last30}</p></div>
    <div className="rounded-xl bg-zinc-50 border p-4"><p className="text-xs text-zinc-500">Avec accord de mise en relation</p><p className="text-3xl font-bold mt-2">{consent}</p></div>
    <div className="rounded-xl bg-zinc-50 border p-4"><p className="text-xs text-zinc-500">Part consentie</p><p className="text-3xl font-bold mt-2">{last30?((100*consent)/last30).toFixed(1)+'%':'—'}</p></div>
   </div>
   {chart.length>0?<div className="rounded-xl border border-zinc-200 p-3">
    <h3 className="mb-4 flex items-center gap-2 font-bold text-sm"><BarChart3 className="w-4 h-4"/> Historique des 30 derniers jours</h3>
    <div className="w-full h-[245px]"><ResponsiveContainer width="100%" height="100%">
     <AreaChart data={chart} margin={{top:5,left:-25,right:5,bottom:5}}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey="day" tick={{fontSize:11}} minTickGap={25}/>
      <YAxis tick={{fontSize:11}} allowDecimals={false}/>
      <Tooltip/>
      <Area type="monotone" dataKey="leads" stroke="#2563eb" fill="#bfdbfe" name="Demandes"/>
      <Area type="monotone" dataKey="consented" stroke="#16a34a" fill="#bbf7d0" name="Consentements"/>
     </AreaChart>
    </ResponsiveContainer></div>
   </div>:<p className="text-zinc-500 text-sm">Aucun historique disponible.</p>}
   <div>
    <h3 className="font-bold mb-3">Sources des demandes — 30 jours</h3>
    <div className="overflow-x-auto"><table className="min-w-full text-sm text-left">
     <thead className="bg-zinc-100 text-zinc-600"><tr><th className="p-3">Source</th><th className="p-3 text-right">Demandes</th><th className="p-3 text-right">Consentements</th><th className="p-3 text-right">Part</th></tr></thead>
     <tbody>{sources.map(s=><tr key={s.source} className="border-t"><td className="p-3 break-all">{s.source}</td><td className="p-3 text-right">{s.leads}</td><td className="p-3 text-right">{s.consented}</td><td className="p-3 text-right">{s.leads?((100*s.consented)/s.leads).toFixed(1)+'%':'—'}</td></tr>)}</tbody>
    </table></div>
   </div>
  </>}
 </section>
}
