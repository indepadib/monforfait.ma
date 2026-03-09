"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Navigation } from "@/components/Navigation"
import { Download, Users, Phone, MapPin, Mail, RefreshCcw } from "lucide-react"

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchLeads() {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setLeads(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  function exportToCSV() {
    if (leads.length === 0) return

    // Create CSV headers
    const headers = ["ID", "Date", "Nom", "Téléphone", "Email", "Ville", "Adresse", "Statut", "Source", "Besoins (JSON)"]
    
    // Create CSV rows
    const rows = leads.map(lead => {
      const date = new Date(lead.created_at).toLocaleString('fr-FR')
      return [
        lead.id,
        `"${date}"`,
        `"${lead.user_name || ''}"`,
        `"${lead.phone || lead.user_phone || ''}"`,
        `"${lead.user_email || ''}"`,
        `"${lead.city || ''}"`,
        `"${lead.address || ''}"`,
        lead.status || 'new',
        lead.needs_details?.source || 'inconnue',
        `"${JSON.stringify(lead.needs_details || {}).replace(/"/g, '""')}"` // Escape quotes for CSV
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }) // BOM for Excel UTF-8
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              Tableau de bord Leads
            </h1>
            <p className="text-zinc-500 mt-1">Gérez et exportez vos contacts B2B obtenus via les formulaires.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={fetchLeads}
              className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button 
              onClick={exportToCSV}
              disabled={leads.length === 0}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter (CSV)
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Localisation</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      <RefreshCcw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Chargement des leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                      Aucun lead trouvé. Les nouveaux leads apparaîtront ici.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-900 dark:text-zinc-300">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 dark:text-white">{lead.user_name || 'Anonyme'}</div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                          <Phone className="w-3 h-3" /> {lead.phone || lead.user_phone || 'N/A'}
                        </div>
                        {lead.user_email && (
                           <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                             <Mail className="w-3 h-3" /> {lead.user_email}
                           </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {(lead.city || lead.address) ? (
                          <>
                            <div className="font-medium text-zinc-900 dark:text-white capitalize">{lead.city || 'Ville inconnue'}</div>
                            <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1 truncate max-w-[200px]" title={lead.address}>
                              <MapPin className="w-3 h-3 shrink-0" /> {lead.address || 'Pas d\'adresse'}
                            </div>
                          </>
                        ) : (
                          <span className="text-zinc-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${lead.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                          ${lead.status === 'new_qualified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${lead.status === 'new_pro' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                        `}>
                          {lead.status?.replace('_', ' ') || 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-500 dark:text-zinc-400 text-xs capitalize">
                        {lead.needs_details?.source || 'Direct'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
