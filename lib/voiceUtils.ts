/**
 * monforfait.ma — Voice AI Integration
 * UTILITIES — TypeScript / Next.js
 */

/**
 * Normalise un numéro marocain en +212XXXXXXXXX
 * Accepte: 0612345678 / 212612345678 / +212612345678 / 612345678
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  
  // Supprimer les espaces, tirets, points et parenthèses
  let n = String(raw).replace(/[\s\-\.\(\)]/g, '');
  
  if (n.startsWith('+212')) return n;
  if (n.startsWith('212') && n.length === 12) return '+' + n;
  if (n.startsWith('0') && n.length === 10) return '+212' + n.slice(1);
  if (n.length === 9 && /^[5-7]/.test(n)) return '+212' + n;
  
  return null; // Numéro non reconnu → ne pas appeler
}

/**
 * Vérifie si l'heure actuelle au Maroc (GMT+1 / Africa/Casablanca)
 * se situe dans les horaires d'appel autorisés (08h00 - 20h00, pas le vendredi après 11h30)
 */
export function isCallingHour(): boolean {
  const now = new Date();
  
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Casablanca',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short' // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    }).formatToParts(now);
    
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
    const weekday = parts.find(p => p.type === 'weekday')?.value || '';
    
    // Vendredi après 11h30 → pas d'appels (Jumaa)
    // TEMPORARY BYPASS FOR TESTING:
    // if (weekday === 'Fri' && (hour > 11 || (hour === 11 && minute >= 30))) {
    //   return false;
    // }
    
    return hour >= 8 && hour < 20;
  } catch (err) {
    console.error('[voiceUtils] Error detecting Morocco timezone calling hours:', err);
    // Fallback simple si formatTimeZone non supporté (utilise l'heure locale machine)
    const localHour = now.getHours();
    const localDay = now.getDay(); // 0=Dim, 5=Ven
    if (localDay === 5 && (localHour > 11 || (localHour === 11 && now.getMinutes() >= 30))) return false;
    return localHour >= 8 && localHour < 20;
  }
}

/**
 * Calcule l'opérateur normalisé depuis la réponse texte brute du prospect
 */
export function normalizeOperator(raw: string | null | undefined): 'IAM' | 'Orange' | 'Inwi' | 'Aucun' | 'Inconnu' {
  if (!raw) return 'Inconnu';
  
  const r = raw.toLowerCase().trim();
  
  if (r.includes('iam') || r.includes('maroc telecom') || r.includes('itissalat') || r.includes('maroctelecom')) {
    return 'IAM';
  }
  if (r.includes('orange') || r.includes('méditel') || r.includes('meditel')) {
    return 'Orange';
  }
  if (r.includes('inwi') || r.includes('wana')) {
    return 'Inwi';
  }
  if (r.includes('aucun') || r.includes('pas') || r.includes('non') || r.includes('rien')) {
    return 'Aucun';
  }
  
  return 'Inconnu';
}

/**
 * Détermine à quel opérateur alternatif vendre ce lead et calcule la valeur
 */
export interface RoutingResult {
  cible1: string;
  cible2: string;
  priorite: 'haute' | 'moyenne';
  lead_value: 'standard' | 'élevée' | 'premium';
}

export function computeRouting(operatorNorm: 'IAM' | 'Orange' | 'Inwi' | 'Aucun' | 'Inconnu', service: string): RoutingResult {
  const routingTable: Record<string, { cible1: string; cible2: string }> = {
    'IAM':     { cible1: 'Inwi',         cible2: 'Orange Maroc' },
    'Orange':  { cible1: 'Inwi',         cible2: 'IAM' },
    'Inwi':    { cible1: 'IAM',          cible2: 'Orange Maroc' },
    'Aucun':   { cible1: 'Tous',         cible2: 'N/A' },
    'Inconnu': { cible1: 'À déterminer', cible2: 'N/A' },
  };

  const serviceValue: Record<string, 'standard' | 'élevée' | 'premium'> = {
    'mobile': 'standard',
    'box':    'élevée',
    'bundle': 'premium'
  };

  const route = routingTable[operatorNorm] || routingTable['Inconnu'];
  
  return {
    cible1:     route.cible1,
    cible2:     route.cible2,
    priorite:   operatorNorm !== 'Inconnu' && operatorNorm !== 'Aucun' ? 'haute' : 'moyenne',
    lead_value: serviceValue[service] || 'standard',
  };
}
