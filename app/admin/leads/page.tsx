"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Navigation } from "@/components/Navigation"
import { 
  Download, Users, Phone, MapPin, Mail, RefreshCcw, 
  Search, Filter, ExternalLink, Calendar, Zap, 
  BarChart3, Clock, AlertCircle, X,
  TrendingUp, ThumbsUp, AlertTriangle, Star, Crown
} from "lucide-react"

interface Plan {
  title: string;
  price_dh: number;
  operator?: {
    name: string;
  };
}

interface Lead {
  id: string;
  created_at: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  city: string;
  address: string;
  status: string;
  is_pro: boolean;
  needs_details: {
    source?: string;
    lead_source?: string;
    installation_timing?: 'asap' | '1_month' | 'compare';
    preferred_operator?: string;
    speedtest?: {
      isp: string;
      downloadMbps: number;
      uploadMbps: number;
      ping: number;
    };
    quiz_answers?: Record<string, any>;
  };
  plan?: Plan;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  
  // Filter States
  const [filterCity, setFilterCity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  async function fetchLeads() {
    setLoading(true)
    try {
      // Try to fetch with join first
      // We use !selected_plan_id to specify the foreign key if Supabase is confused
      let { data, error } = await supabase
        .from('leads')
        .select('*, plan:plans!selected_plan_id(title, price_dh, operator:operators(name))')
        .order('created_at', { ascending: false })

      // Fallback: if join fails (e.g. relationship not defined in DB), fetch leads only
      if (error) {
        console.warn("Join failed, fetching leads without plans:", error)
        const { data: simpleData, error: simpleError } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (!simpleError && simpleData) {
          setLeads(simpleData as any[])
        } else if (simpleError) {
          console.error("Simple fetch failed:", simpleError)
        }
      } else if (data) {
        setLeads(data as any[])
      }
    } catch (err) {
      console.error("Critical fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  // Filtered Leads
  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesCity = filterCity === "all" || lead.city?.toLowerCase() === filterCity.toLowerCase()
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus
    const source = lead.needs_details?.source || lead.needs_details?.lead_source || "direct"
    const matchesSource = filterSource === "all" || source === filterSource
    const matchesSearch = searchTerm === "" || 
      lead.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.user_phone?.includes(searchTerm) ||
      lead.city?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCity && matchesStatus && matchesSource && matchesSearch
  })

  // Stats calculation
  const stats = {
    total: leads.length,
    hot: leads.filter((l: Lead) => l.needs_details?.installation_timing === 'asap').length,
    new: leads.filter((l: Lead) => l.status === 'new' || l.status === 'new_qualified').length,
    pro: leads.filter((l: Lead) => l.is_pro || l.status === 'new_pro').length,
    cities: [...new Set(leads.map((l: Lead) => l.city).filter(Boolean))].length
  }

  function exportToCSV() {
    if (filteredLeads.length === 0) return

    const headers = [
      "ID", "Date", "Nom", "Téléphone", "Email", "Ville", "Adresse", 
      "Statut", "Source", "Forfait Voulu", "Délai", "Opérateur Préféré", "Opérateur Actuel", "Vitesse Download", "Vitesse Upload"
    ]
    
    const rows = filteredLeads.map((lead: Lead) => {
      const date = new Date(lead.created_at).toLocaleString('fr-FR')
      return [
        lead.id,
        `"${date}"`,
        `"${lead.user_name || 'N/A'}"`,
        `"${lead.user_phone || ''}"`,
        `"${lead.user_email || ''}"`,
        `"${lead.city || ''}"`,
        `"${lead.address || ''}"`,
        lead.status || 'new',
        lead.needs_details?.source || lead.needs_details?.lead_source || 'direct',
        `"${lead.plan?.operator?.name || ''} ${lead.plan?.title || ''}"`,
        `"${lead.needs_details?.installation_timing || ''}"`,
        `"${lead.needs_details?.preferred_operator || ''}"`,
        `"${lead.needs_details?.speedtest?.isp || ''}"`,
        lead.needs_details?.speedtest?.downloadMbps || '',
        lead.needs_details?.speedtest?.uploadMbps || ''
      ].map(val => (val === null || val === undefined) ? '' : val).join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', `monforfait_leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24 text-zinc-900 dark:text-white">
        
        {/* Header & Main Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-3">
              <Users className="w-10 h-10 text-blue-600" />
              CRM Prospecteurs
            </h1>
            <p className="text-zinc-500 mt-1">Transformez vos leads en contrats. Données qualifiées en temps réel.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={fetchLeads}
              className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 transition-colors"
              title="Actualiser"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''} text-zinc-600 dark:text-zinc-400`} />
            </button>
            <button 
              onClick={exportToCSV}
              className="px-6 py-3 bg-zinc-900 dark:bg-white dark:text-black text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', val: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'LEADS HOT 🔥', val: stats.hot, icon: Zap, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'PRO / B2B', val: stats.pro, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Villes', val: stats.cities, icon: MapPin, color: 'text-green-600', bg: 'bg-green-50' }
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${s.bg} dark:bg-opacity-10 ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-zinc-900 dark:text-white mb-1">{s.val}</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 mb-6 flex flex-wrap gap-4 items-center shadow-sm">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Chercher par nom, tel, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex gap-2 items-center text-sm font-bold text-zinc-500">
            <Filter className="w-4 h-4" /> Filtres :
          </div>

          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm font-semibold outline-none text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">Toutes les villes</option>
            {[...new Set(leads.map(l => l.city).filter(Boolean))].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm font-semibold outline-none text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveau (Brut)</option>
            <option value="new_qualified">Qualifié (Particulier)</option>
            <option value="new_pro">Pro (B2B)</option>
            <option value="speedtest_captured">Speedtest Only</option>
          </select>

          <select 
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm font-semibold outline-none text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">Toutes sources</option>
            <option value="quiz_pre_results">Quiz</option>
            <option value="speedtest">Speedtest</option>
            <option value="eligibility">Éligibilité</option>
            <option value="web_v2">Direct (Modal)</option>
          </select>
        </div>

        {/* Main Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold">
                <tr>
                  <th className="px-6 py-5">Prospect</th>
                  <th className="px-6 py-5">Offre / Intention</th>
                  <th className="px-6 py-5">Délai / Score</th>
                  <th className="px-6 py-5">Statut</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-6 h-20 bg-zinc-50/50 dark:bg-zinc-800/20"></td>
                    </tr>
                  ))
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      Aucun lead correspondant à vos critères.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead: Lead) => (
                    <tr 
                      key={lead.id} 
                      className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs
                            ${lead.is_pro ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}
                          `}>
                            {lead.user_name?.substring(0, 2).toUpperCase() || 'AN'}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white capitalize">{lead.user_name || 'Anonyme'}</div>
                            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                              <MapPin className="w-3 h-3" /> {lead.city || 'Ville?'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {lead.plan ? (
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white">
                              {lead.plan?.operator?.name} {lead.plan.title}
                            </div>
                            <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                               <Zap className="w-3 h-3" /> Préférence : {lead.needs_details?.preferred_operator || 'Match'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-zinc-400 italic">Comparaison libre</div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          {lead.needs_details?.installation_timing === 'asap' ? (
                            <span className="inline-flex items-center gap-1 text-red-600 font-black text-[10px] bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full w-fit">
                              <Zap className="w-3 h-3" /> HOT / IMMÉDIAT
                            </span>
                          ) : lead.needs_details?.installation_timing === '1_month' ? (
                            <span className="inline-flex items-center gap-1 text-orange-600 font-black text-[10px] bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full w-fit">
                              <Clock className="w-3 h-3" /> WARM / 1 MOIS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-zinc-500 font-black text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full w-fit">
                              COLD / PRIX
                            </span>
                          )}
                          <div className="text-[10px] text-zinc-400 font-bold ml-1">
                            {lead.needs_details?.speedtest?.isp ? `Actuel: ${lead.needs_details.speedtest.isp}` : 'Nouveau client'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${lead.status === 'new' ? 'bg-zinc-100 text-zinc-600' : ''}
                          ${lead.status === 'new_qualified' ? 'bg-green-100 text-green-700' : ''}
                          ${lead.status === 'new_pro' ? 'bg-purple-100 text-purple-700' : ''}
                        `}>
                          {lead.status?.replace('_', ' ') || 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <button className="p-2 text-zinc-400 group-hover:text-blue-600 transition-colors">
                            <ExternalLink className="w-5 h-5" />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
              <button 
                onClick={() => setSelectedLead(null)}
                className="absolute top-6 right-6 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white">
                    {selectedLead.user_name?.[0] || 'A'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white capitalize">{selectedLead.user_name || 'Prospect Anonyme'}</h2>
                    <div className="flex items-center gap-2 text-zinc-500 mt-1">
                      <Calendar className="w-4 h-4" /> 
                      Inscrit le {new Date(selectedLead.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-900 dark:text-white">
                  {/* Contact Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Coordonnées</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="font-bold">{selectedLead.user_phone || 'N/A'}</span>
                        </div>
                        {selectedLead.user_email && (
                          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span className="font-bold truncate">{selectedLead.user_email}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                          <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                          <div>
                            <div className="font-bold">{selectedLead.city || 'Ville non spécifiée'}</div>
                            <div className="text-xs text-zinc-500">{selectedLead.address || 'Pas d\'adresse précise'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Historique Speedtest</h4>
                      {selectedLead.needs_details?.speedtest ? (
                        <div className="p-4 border-2 border-green-100 dark:border-green-900/30 rounded-2xl bg-green-50/30">
                           <div className="flex justify-between items-center mb-4">
                             <div className="font-bold text-green-700">{selectedLead.needs_details.speedtest.isp}</div>
                             <div className="text-[10px] bg-green-200 text-green-700 px-2 py-0.5 rounded-full font-bold">ACTUEL</div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] text-zinc-500 font-bold">DOWNLOAD</div>
                                <div className="text-xl font-black">{selectedLead.needs_details.speedtest.downloadMbps} <span className="text-xs">Mb</span></div>
                              </div>
                              <div>
                                <div className="text-[10px] text-zinc-500 font-bold">PING</div>
                                <div className="text-xl font-black">{selectedLead.needs_details.speedtest.ping} <span className="text-xs">ms</span></div>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-400 italic">Aucun test de vitesse effectué.</p>
                      )}
                    </div>
                  </div>

                  {/* Requirements Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Besoin Identifié</h4>
                      <div className="p-5 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-600/20">
                         {selectedLead.plan ? (
                           <>
                              <div className="text-xs text-blue-100 uppercase font-bold tracking-widest mb-1">Cible : {selectedLead.plan?.operator?.name}</div>
                              <div className="text-2xl font-black leading-tight mb-4">{selectedLead.plan.title}</div>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center bg-white/10 p-2 rounded-lg backdrop-blur-sm text-xs">
                                  <span>Délai souhaité</span>
                                  <span className="font-black uppercase">{selectedLead.needs_details?.installation_timing || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/10 p-2 rounded-lg backdrop-blur-sm text-xs">
                                  <span>Opérateur Préféré</span>
                                  <span className="font-black uppercase">{selectedLead.needs_details?.preferred_operator || 'Aucun'}</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                                <span className="text-sm font-bold">Coût estimé</span>
                                <span className="text-xl font-black">{selectedLead.plan.price_dh} DH</span>
                              </div>
                           </>
                         ) : (
                           <div className="text-center py-4 text-white">
                              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <div className="font-bold">En attente de choix</div>
                              <div className="text-xs text-blue-100">Visiteur en phase de comparaison</div>
                           </div>
                         )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">Profil Quiz</h4>
                      {selectedLead.needs_details?.quiz_answers ? (
                        <div className="space-y-2">
                           {Object.entries(selectedLead.needs_details.quiz_answers).map(([key, value]: [string, any]) => (
                             <div key={key} className="flex justify-between p-3 border-b border-zinc-100 dark:border-zinc-800 text-sm">
                               <span className="text-zinc-500 capitalize">{key.replace('_', ' ')}</span>
                               <span className="font-bold capitalize">{String(value)?.replace('_', ' ')}</span>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-bold">Pas de questionnaire rempli</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-10 flex gap-4">
                  <a 
                    href={`tel:${selectedLead.user_phone}`}
                    className="flex-1 py-4 bg-green-500 text-white font-black rounded-2xl text-center hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" /> Appeler
                  </a>
                  {selectedLead.user_email && (
                    <a 
                      href={`mailto:${selectedLead.user_email}`}
                      className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl text-center hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-5 h-5" /> Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
