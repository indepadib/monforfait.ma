import React from 'react';

interface VoiceConsentCheckboxProps {
  consentVoice: boolean;
  setConsentVoice: React.Dispatch<React.SetStateAction<boolean>>;
  label?: string;
}

// Reusable checkbox for voice verification consent.
// Default label is in French (can be overridden via `label`).
export default function VoiceConsentCheckbox({
  consentVoice,
  setConsentVoice,
  label = "J'accepte la validation téléphonique automatisée (appel vocal)"
}: VoiceConsentCheckboxProps) {
  return (
    <div className="flex items-center mt-4">
      <input
        type="checkbox"
        id="voiceConsent"
        checked={consentVoice}
        onChange={(e) => setConsentVoice(e.target.checked)}
        className="mr-2"
      />
      <label htmlFor="voiceConsent" className="text-sm text-zinc-400">
        {label}
      </label>
    </div>
  );
}
