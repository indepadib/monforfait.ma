/**
 * MonForfait.ma Application Configuration
 * Centralized business constants to avoid hardcoded placeholders.
 */
export const CONFIG = {
  // Support & Sales WhatsApp number (Morocco code: +212)
  // Can be configured via NEXT_PUBLIC_SUPPORT_WHATSAPP environment variable.
  // Fallback to the default MonForfait.ma customer relationship line.
  SUPPORT_WHATSAPP: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '212600000000',
  
  // Support Email contact
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contact@monforfait.ma',
  
  // Business hours info for response time copy
  BUSINESS_HOURS_LEAD_RESPONSE_TIME: '2h',
};
