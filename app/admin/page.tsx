"use client"

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { supabase } from '@/lib/supabaseClient'
import { Download, Filter, TrendingUp, Users, DollarSign, Search, Lock } from 'lucide-react'

type Lead = {
    id: string
    user_name: string
    user_email: string
    user_phone: string
    city: string
    category: string
    user_type: string
    priority: string
    status: string
    is_pro: boolean
    created_at: string
    needs_details?: any
}

const ADMIN_PASSWORD = 'AdminMaroc2026!' // CHANGEZ CE MOT DE PASSE !

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'new_qualified' | 'new_pro' | 'speedtest_captured'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [stats, setStats] = useState({
        total: 0,
        qualified: 0,
        pro: 0,
        speedtest: 0,
        totalValue: 0
    })

    useEffect(() => {
        const auth = localStorage.getItem('monforfait_admin_auth')
        if (auth === 'authenticated') {
            setIsAuthenticated(true)
        }
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            loadLeads()
        }
    }, [filter, isAuthenticated])

    async function loadLeads() {
        setLoading(true)

        let query = supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })

        if (filter !== 'all') {
            query = query.eq('status', filter)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error loading leads:', error)
            setLoading(false)
            return
        }

        if (data) {
            setLeads(data)

            const qualified = data.filter(l => l.status === 'new_qualified').length
            const pro = data.filter(l => l.status === 'new_pro').length
            const speedtest = data.filter(l => l.status === 'speedtest_captured').length

            const value = data.reduce((sum, lead) => {
                if (lead.status === 'new_pro') return sum + 150
                if (lead.status === 'new_qualified') return sum + 40
                if (lead.status === 'speedtest_captured') return sum + 10
                return sum
            }, 0)

            setStats({ total: data.length, qualified, pro, speedtest, totalValue: value })
        }

        setLoading(false)
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('monforfait_admin_auth', 'authenticated')
            setIsAuthenticated(true)
        } else {
            alert('Mot de passe incorrect ❌')
            setPassword('')
        }
    }

    function handleLogout() {
        localStorage.removeItem('monforfait_admin_auth')
        setIsAuthenticated(false)
    }

    function exportToCSV() {
        const headers = ['Date', 'Nom', 'Email', 'Tel', 'Ville', 'Catégorie', 'Type', 'Priorité', 'Statut', 'B2B', 'Valeur (DH)']

        const rows = leads.map(lead => {
            const value = lead.status === 'new_pro' ? 150 : lead.status === 'new_qualified' ? 40 : 10
            return [
                new Date(lead.created_at).toLocaleDateString('fr-MA'),
                lead.user_name,
                lead.user_email,
                lead.user_phone,
                lead.city,
                lead.category || 'N/A',
                lead.user_type || 'N/A',
                lead.priority || 'N/A',
                lead.status,
                lead.is_pro ? 'Oui' : 'Non',
                value
            ]
        })

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-monforfait-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    const filteredLeads = leads.filter(lead =>
        searchQuery === '' ||
        lead.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.user_phone.includes(searchQuery) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Login screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-zinc-200 dark:border-zinc-800 shadow-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 mx-auto">
                            <Lock className="w-7 h-7 text-white" />
                        </div>

                        <h1 className="text-2xl font-black text-center mb-2 text-zinc-900 dark:text-white">
                            Admin Access
                        </h1>
                        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">

                            Accès restreint • Dashboard MonForfait.ma
                        </p>

                        <form onSubmit={handleLogin}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500 mb-4 text-center"
                                autoFocus
                            />

                            <button
                                type="submit"
                                className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                            >
                                Se connecter
                            </button>
                        </form>

                        <p className="text-xs text-center text-zinc-400 dark:text-zinc-600 mt-8">
                            Dashboard privé • MonForfait.ma
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Main dashboard
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header with Logout */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black mb-2 text-zinc-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Gestion des leads MonForfait.ma
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800 rounded-xl"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-bold text-zinc-500">TOTAL</span>
                        </div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.total}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Leads totaux</div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-bold text-zinc-500">QUALIFIÉS</span>
                        </div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.qualified}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Hot leads</div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            <span className="text-xs font-bold text-zinc-500">B2B</span>
                        </div>
                        <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.pro}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">Pro leads</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-5 h-5 text-white" />
                            <span className="text-xs font-bold text-white/70">VALEUR</span>
                        </div>
                        <div className="text-3xl font-black text-white">{stats.totalValue} DH</div>
                        <div className="text-sm text-white/80">Valeur totale</div>
                    </div>
                </div>

                {/* Filters & Export */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, email, tel, ville..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-medium focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="new_qualified">Qualifiés</option>
                            <option value="new_pro">Professionnels</option>
                            <option value="speedtest_captured">Speed Test</option>
                        </select>

                        <button
                            onClick={exportToCSV}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-zinc-600 dark:text-zinc-400">Chargement...</p>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-20 text-center">
                            <Filter className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Aucun lead trouvé</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Modifiez vos filtres</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase">Nom</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase">Ville</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase">Besoin</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase">Valeur</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {filteredLeads.map((lead) => {
                                        const value = lead.status === 'new_pro' ? 150 : lead.status === 'new_qualified' ? 40 : 10
                                        const quality = lead.status === 'new_pro' ? 'Pro' : lead.status === 'new_qualified' ? 'Hot' : 'Cold'
                                        const qualityColor = lead.status === 'new_pro' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : lead.status === 'new_qualified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'

                                        return (
                                            <tr key={lead.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white whitespace-nowrap">
                                                    {new Date(lead.created_at).toLocaleDateString('fr-MA')}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white">{lead.user_name}</td>
                                                <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <div>{lead.user_email}</div>
                                                    <div className="text-xs">{lead.user_phone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{lead.city}</td>
                                                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">
                                                    <div className="font-medium">{lead.category || 'N/A'}</div>
                                                    <div className="text-xs text-zinc-500">{lead.priority || ''}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${qualityColor}`}>
                                                        {quality}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-zinc-900 dark:text-white">{value} DH</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    Valeurs: Pro = 150 DH • Qualifié = 40 DH • Cold = 10 DH
                </div>
            </div>
        </div>
    )
}
