import React from 'react';

/**
 * Interactive Centralized Server Infographic representing storage vulnerabilities (data leaks, chain bounds, alert blinking).
 * @returns {React.JSX.Element}
 */
export default function CentralizedServerInfographic() {
  return (
    <div className="centralized-infographic-container">
      <svg viewBox="0 0 200 260" fill="none" width="100%" height="100%" className="centralized-svg" aria-label="Centralized Server Infographic">
        <defs>
          <radialGradient id="serverGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="260" rx="16" fill="rgba(239, 68, 68, 0.01)" stroke="rgba(239, 68, 68, 0.08)" strokeWidth="1.5" />
        <circle cx="100" cy="130" r="90" fill="url(#serverGlow)" />
        
        {/* Server Rack Drawer Stack */}
        <rect x="52" y="30" width="96" height="190" rx="6" fill="#010807" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <line x1="52" y1="78" x2="148" y2="78" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <line x1="52" y1="126" x2="148" y2="126" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <line x1="52" y1="174" x2="148" y2="174" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />

        {/* Drawer 1: Online Status */}
        <g className="server-drawer">
          <rect x="60" y="40" width="80" height="26" rx="4" fill="rgba(259, 68, 68, 0.04)" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1" />
          <circle cx="70" cy="53" r="2.5" fill="#ef4444" className="server-blink-slow" />
          <line x1="80" y1="50" x2="130" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="80" y1="56" x2="110" y2="56" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        </g>

        {/* Drawer 2: High Latency Uptime */}
        <g className="server-drawer">
          <rect x="60" y="88" width="80" height="26" rx="4" fill="rgba(239, 68, 68, 0.04)" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="1" />
          <circle cx="70" cy="101" r="2.5" fill="#ef4444" className="server-blink-fast" />
          <line x1="80" y1="98" x2="120" y2="98" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
          <line x1="80" y1="104" x2="130" y2="104" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 2" />
        </g>

        {/* Drawer 3: Breached Status Warning */}
        <g className="server-drawer drawer-hacked">
          <rect x="60" y="136" width="80" height="26" rx="4" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="70" cy="149" r="3" fill="#ef4444" className="server-blink-alert" />
          <line x1="80" y1="146" x2="124" y2="146" stroke="#ef4444" strokeWidth="2" />
          <text x="80" y="156" fill="#ef4444" fontSize="6.5" fontFamily="monospace" fontWeight="bold">BREACHED</text>
        </g>

        {/* Drawer 4: Offline Status */}
        <g className="server-drawer">
          <rect x="60" y="184" width="80" height="26" rx="4" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="70" cy="197" r="2.5" fill="rgba(255,255,255,0.15)" />
          <line x1="80" y1="194" x2="130" y2="194" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        </g>

        {/* Outer Chain links restricting data access */}
        <path d="M25 65 C 60 70, 140 70, 175 65" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="2" strokeDasharray="6 6" fill="none" className="chain-line" />
        <path d="M25 195 C 60 190, 140 190, 175 195" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="2" strokeDasharray="6 6" fill="none" className="chain-line" />

        {/* Floating escape data leak particles */}
        <circle cx="152" cy="146" r="3" fill="#ef4444" className="leak-particle-1" />
        <circle cx="168" cy="138" r="2" fill="#ef4444" className="leak-particle-2" />
      </svg>
      <div className="centralized-badge">Centralized server</div>
    </div>
  );
}
