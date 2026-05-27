import { Lead, LeadTemperature } from '@/types/lead';

export function calculateLeadScore(leadData: Partial<Lead>): { score: number; temperature: LeadTemperature } {
  let score = 0;

  // 1. Intent Timeline (High weight)
  if (leadData.intent_timeline === 'immédiat') {
    score += 40;
  } else if (leadData.intent_timeline === 'dans_le_mois') {
    score += 20;
  } else if (leadData.intent_timeline === 'plus_tard') {
    score += 5;
  }

  // 2. Budget (Medium weight)
  if (leadData.budget) {
    if (leadData.budget >= 400) {
      score += 30; // High budget
    } else if (leadData.budget >= 200) {
      score += 20; // Medium budget
    } else {
      score += 10; // Low budget
    }
  }

  // 3. Fiber Eligibility (Bonus)
  if (leadData.fiber_eligible) {
    score += 15;
  }

  // 4. B2B Premium (Bonus for B2B)
  if (leadData.type === 'B2B') {
    score += 15;
    if (leadData.company_size && leadData.company_size !== '1-5') {
      score += 10;
    }
  }

  // Ensure score is within 0-100 (or slightly above if B2B, but let's cap at 100)
  const finalScore = Math.min(Math.max(score, 0), 100);

  let temperature: LeadTemperature = 'cold';
  if (finalScore >= 70) {
    temperature = 'hot';
  } else if (finalScore >= 40) {
    temperature = 'warm';
  }

  return { score: finalScore, temperature };
}

// Function to calculate dynamic price based on score and type
export function calculateLeadPrice(score: number, type: 'B2C' | 'B2B'): number {
  let basePrice = type === 'B2B' ? 300 : 100;
  
  if (score >= 80) {
    basePrice *= 1.5; // Premium for very hot leads
  } else if (score < 40) {
    basePrice *= 0.5; // Discount for cold leads
  }

  return Math.round(basePrice);
}
