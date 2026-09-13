import React from 'react';

/**
 * Interactive Wasted/Idle Hardware Infographic representing node capacity provider inefficiencies.
 * @returns {React.JSX.Element}
 */
export default function WastedHardwareInfographic() {
  return (
    <div className="centralized-infographic-container wasted-container">
      <svg viewBox="0 0 200 260" fill="none" width="100%" height="100%" className="centralized-svg" aria-label="Wasted Hardware Infographic">
        <defs>
          <radialGradient id="wastedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="260" rx="16" fill="rgba(245, 158, 11, 0.01)" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1.5" />
        <circle cx="100" cy="130" r="90" fill="url(#wastedGlow)" />
        
        {/* Computer Monitor */}
        <rect x="36" y="45" width="128" height="90" rx="6" fill="#010807" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <rect x="42" y="51" width="116" height="78" rx="3" fill="#010c0a" />
        <path d="M85 135h30l4 25h-38z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <rect x="68" y="160" width="64" height="6" rx="2" fill="rgba(255,255,255,0.08)" />

        {/* Sleeper indicator visual letters */}
        <path d="M80 92 A 15 15 0 0 1 120 92" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <text x="122" y="78" fill="#f59e0b" fontSize="16" fontFamily="monospace" fontWeight="bold" className="sleep-z1">Z</text>
        <text x="133" y="66" fill="#f59e0b" fontSize="11" fontFamily="monospace" fontWeight="bold" className="sleep-z2">z</text>

        {/* Speedometer Gauge at zero capacity */}
        <circle cx="100" cy="205" r="26" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <path d="M78 208a22 22 0 0 1 44 0" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="100" y1="205" x2="82" y2="195" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" className="wasted-needle" />
        
        <text x="100" y="222" fill="rgba(255,255,255,0.3)" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.08em">0% UTILIZATION</text>
      </svg>
      <div className="centralized-badge wasted-badge">Idle local disk</div>
    </div>
  );
}
