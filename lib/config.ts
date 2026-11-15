/**
 * MonForfait.ma Application Configuration
 * Centralized business constants to avoid hardcoded placeholders.
 */
export const CONFIG = {
  // Support & Sales WhatsApp number (Morocco code: +212)
  // Can be configured via NEXT_PUBLIC_SUPPORT_WHATSAPP environment variable.
  // No fabricated support number. Configure an actual owned/verified line before offering WhatsApp.
  SUPPORT_WHATSAPP: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '',
  
  // Support Email contact
  SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'contact@monforfait.ma',
  
  // Business hours info for response time copy
  BUSINESS_HOURS_LEAD_RESPONSE_TIME: 'non garanti',
};
