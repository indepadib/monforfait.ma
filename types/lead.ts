export type LeadType = 'B2C' | 'B2B';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadTemperature = 'hot' | 'warm' | 'cold';

export interface Lead {
  id: string;
  created_at: string;
  type: LeadType;
  
  // Client Info (strict validation)
  first_name: string;
  last_name: string;
  phone: string;
  email: string; // Made mandatory for better quality
  city: string;
  address?: string;
  
  // Qualification Data
  current_operator?: string;
  budget?: number; // in DH
  intent_timeline?: 'immédiat' | 'dans_le_mois' | 'plus_tard';
  fiber_eligible?: boolean;
  needs?: string[];
  
  // B2B specific
  company_name?: string;
  company_size?: string;
  industry?: string;

  // System
  score: number;
  temperature: LeadTemperature;
  status: LeadStatus;
  is_unlocked: boolean;
  unlock_price: number; // in DH
}

export interface OperatorDashboardMetrics {
  totalLeads: number;
  unlockedLeads: number;
  conversionRate: number;
  revenueGenerated: number;
  b2bCount: number;
  b2cCount: number;
}
