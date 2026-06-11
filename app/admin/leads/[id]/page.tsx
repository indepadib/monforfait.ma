"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Navigation } from "@/components/Navigation"
import { 
  ChevronLeft, User, Phone, MapPin, Mail, Calendar, 
  Activity, Star, Clock, AlertCircle, Edit, Trash2, 
  CheckCircle, Briefcase, Network, ServerCrash
} from "lucide-react"

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
  score: number;
  thermal_status: string;
  voice_status: string;
  consent_voice: boolean;
  voice_called_at: string;
  voice_retry_count: number;
  needs_details: any;
  plan?: {
    title: string;
    price_dh: number;
    operator?: {
      name: string;
    };
  };
}

export default function LeadDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const isLogged = localStorage.getItem('admin_logged_in') === 'true'
    if (!isLogged) {
      router.push('/login?tab=admin')
    } else {
      setAuthorized(true)
    }
  }, [router])

  useEffect(() => {
    if (authorized && id) {
      fetchLead()
    }
  }, [authorized, id])

  async function fetchLead() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          plan:plans(
            title,
            price_dh,
            operator:operators(name)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setLead(data)
    } catch (err: any) {
      console.error("Error fetching lead:", err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!lead) return
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', lead.id)
      
      if (error) throw error
      setLead({ ...lead, status: newStatus })
    } catch (err: any) {
      console.error("Error updating status:", err.message)
      alert("Erreur lors de la mise à jour.")
    } finally {
      setUpdating(false)
    }
  }

  if (authorized === null || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-zinc-600 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-sm font-semibold">Chargement de la fiche...</p>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans">
        <Navigation />
        <div className="max-w-7xl mx-auto p-6 text-center mt-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Lead Introuvable</h1>
          <p className="text-zinc-500 mb-6">Le lead avec l'identifiant {id} n'existe pas ou a été supprimé.</p>
          <Link href="/admin/leads" className="text-blue-600 font-medium hover:underline flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'contacted': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'qualified': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'converted': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'lost': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white font-sans pb-20">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/leads" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              Fiche Lead: {lead.user_name || "Anonyme"}
              {lead.is_pro && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded font-bold tracking-wide">B2B PRO</span>}
            </h1>
            <p className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" /> 
              Créé le {new Date(lead.created_at).toLocaleString('fr-MA')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> Informations Personnelles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Nom Complet</p>
                  <p className="font-medium">{lead.user_name || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Téléphone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <a href={`tel:${lead.user_phone}`} className="hover:text-blue-500 transition-colors">
                      {lead.user_phone}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Localisation</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {lead.city || "Ville non précisée"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Adresse Exacte</p>
                  <p className="font-medium">{lead.address || "Non spécifiée"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-500" /> Détails du Besoin
              </h2>
              
              {lead.plan ? (
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl">
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-2">Offre Ciblée</p>
                  <p className="font-bold text-lg">{lead.plan.title}</p>
                  <p className="text-zinc-600 dark:text-zinc-400">{lead.plan.operator?.name} • {lead.plan.price_dh} DH/mois</p>
                </div>
              ) : null}

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="text-zinc-500">Raison de la recherche</div>
                  <div className="col-span-2 font-medium">{lead.needs_details?.reason || "Non spécifiée"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="text-zinc-500">Délai d'installation</div>
                  <div className="col-span-2 font-medium">
                    {lead.needs_details?.installation_timing === 'asap' ? "Dès que possible" :
                     lead.needs_details?.installation_timing === '1_month' ? "Dans un mois" :
                     lead.needs_details?.installation_timing === 'compare' ? "Juste pour comparer" : "Non spécifié"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="text-zinc-500">Opérateur Souhaité</div>
                  <div className="col-span-2 font-medium">{lead.needs_details?.preferred_operator || "Aucun / Peu importe"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 pb-2">
                  <div className="text-zinc-500">Source d'acquisition</div>
                  <div className="col-span-2 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded inline-block w-max">
                    {lead.needs_details?.lead_source || lead.needs_details?.source || "Direct"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Speedtest Results if available */}
            {lead.needs_details?.speedtest && (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" /> Diagnostic Speedtest (Effectué)
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Download</p>
                    <p className="text-xl font-bold text-emerald-600">{lead.needs_details.speedtest.downloadMbps} <span className="text-sm font-normal">Mbps</span></p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Upload</p>
                    <p className="text-xl font-bold text-blue-600">{lead.needs_details.speedtest.uploadMbps} <span className="text-sm font-normal">Mbps</span></p>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Ping</p>
                    <p className="text-xl font-bold text-amber-600">{lead.needs_details.speedtest.ping} <span className="text-sm font-normal">ms</span></p>
                  </div>
                </div>
                <p className="text-center text-sm text-zinc-500 mt-4">FAI actuel détecté : <span className="font-bold">{lead.needs_details.speedtest.isp}</span></p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Manager */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">Gestion du Lead</h3>
              
              <div className="mb-6">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2 block">Statut Actuel</label>
                <select 
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className={`w-full p-3 rounded-xl border-none outline-none font-bold text-sm appearance-none cursor-pointer ${getStatusColor(lead.status)}`}
                >
                  <option value="new">Nouveau Lead</option>
                  <option value="contacted">Contacté</option>
                  <option value="qualified">Qualifié (Chaud)</option>
                  <option value="converted">Converti (Vendu)</option>
                  <option value="lost">Perdu / Pas intéressé</option>
                </select>
              </div>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-zinc-500 font-medium">Score Thermique</span>
                  <span className={`font-bold ${lead.score >= 70 ? 'text-red-500' : lead.score >= 40 ? 'text-amber-500' : 'text-blue-500'}`}>
                    {lead.score}%
                  </span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${lead.score >= 70 ? 'bg-red-500' : lead.score >= 40 ? 'bg-amber-500' : 'bg-blue-500'}`}
                    style={{ width: `${lead.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center mt-2 text-zinc-500 uppercase tracking-widest">{lead.thermal_status || "Inconnu"}</p>
              </div>
            </div>

            {/* Voice AI Status */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500" /> Assistant Vocal IA
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Consentement :</span>
                  <span className={lead.consent_voice ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                    {lead.consent_voice ? "Accordé" : "Refusé"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Statut IA :</span>
                  <span className="font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {lead.voice_status || "PENDING"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Tentatives :</span>
                  <span className="font-medium">{lead.voice_retry_count || 0} / 3</span>
                </div>
                {lead.voice_called_at && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Dernier appel :</span>
                    <span className="font-medium">{new Date(lead.voice_called_at).toLocaleTimeString('fr-MA')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
