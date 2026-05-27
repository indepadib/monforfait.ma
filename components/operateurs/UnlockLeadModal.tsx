import React from 'react';
import { Lead } from '@/types/lead';
import { X, Unlock, CreditCard, ShieldCheck } from 'lucide-react';

interface UnlockLeadModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UnlockLeadModal({ lead, isOpen, onClose, onConfirm }: UnlockLeadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Débloquer le prospect</h3>
              <p className="text-sm text-slate-500">Ref: {lead.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-500">Score de qualification</span>
              <span className="font-semibold text-slate-900">{lead.score}/100</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-500">Type de profil</span>
              <span className="font-semibold text-slate-900">{lead.type === 'B2B' ? 'Entreprise (Premium)' : 'Particulier'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
              <span className="font-semibold text-slate-900">Prix du déblocage</span>
              <span className="text-xl font-bold text-blue-600">{lead.unlock_price} DH</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p>
              En débloquant ce prospect, vous accéderez instantanément à son numéro de téléphone et son email. Le montant sera déduit de votre solde prépayé.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20"
          >
            <CreditCard className="w-4 h-4" />
            Confirmer l'achat
          </button>
        </div>

      </div>
    </div>
  );
}
