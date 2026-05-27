import React from 'react';
import { LeadVolumeChart, LeadTypeChart } from '@/components/operateurs/DashboardCharts';
import { ArrowUpRight, Users, Target, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OperatorDashboardPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tableau de bord</h1>
        <p className="text-slate-500 mt-2">Bienvenue sur LeadCenter Pro. Voici l'état de votre pipeline aujourd'hui.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Nouveaux Leads (7j)</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">119</span>
            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Leads B2B (Premium)</h3>
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">23</span>
            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +5%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Leads Très Chauds</h3>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">45</span>
            <span className="text-sm text-slate-500">Score &gt; 70</span>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-6 shadow-md text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="20" />
            </svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-blue-100 mb-4">Opportunités en attente</h3>
            <div className="text-3xl font-bold mb-2">18</div>
            <Link href="/operateurs/dashboard/leads" className="inline-flex items-center text-sm font-medium text-white hover:text-blue-100 transition-colors">
              Explorer le marché <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Volume de Leads</h2>
            <p className="text-sm text-slate-500">Évolution sur les 7 derniers jours</p>
          </div>
          <LeadVolumeChart />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Répartition par Segment</h2>
            <p className="text-sm text-slate-500">Comparaison B2C vs B2B Premium</p>
          </div>
          <LeadTypeChart />
        </div>
      </div>

    </div>
  );
}
