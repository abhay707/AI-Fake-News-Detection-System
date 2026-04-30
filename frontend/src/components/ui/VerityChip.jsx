import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

export default function VerityChip({ status = 'UNCERTAIN' }) {
  const normalizedStatus = status.toUpperCase();
  
  let config = {
    bg: 'bg-amber-500/20',
    text: 'text-amber-500',
    icon: <HelpCircle className="w-4 h-4" />,
    label: 'Uncertain'
  };

  if (normalizedStatus === 'REAL') {
    config = {
      // Subdued green/teal tones as requested
      bg: 'bg-[#143329]',
      text: 'text-[#9ce8c9]',
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: 'Verified Real'
    };
  } else if (normalizedStatus === 'FAKE') {
    config = {
      bg: 'bg-error-container',
      text: 'text-on-error-container',
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Detected Fake'
    };
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text} text-xs font-semibold tracking-wide uppercase shadow-sm`}>
      {config.icon}
      {config.label}
    </div>
  );
}
