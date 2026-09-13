import React from 'react';

// Common SVG Filters and Gradients definitions helper to avoid repetition
const renderDefs = (colorAccent = 'var(--accent)', colorSecondary = 'var(--accent-2)') => (
  <defs>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={colorAccent} stopOpacity="0.8" />
      <stop offset="100%" stopColor={colorSecondary} stopOpacity="0.2" />
    </linearGradient>
    <linearGradient id="portalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={colorAccent} stopOpacity="0.3" />
      <stop offset="100%" stopColor={colorAccent} stopOpacity="0" />
    </linearGradient>
  </defs>
);

/* Consumer (Storage User) Step Graphics */
const UploadStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <ellipse cx="90" cy="135" rx="45" ry="12" fill="url(#portalGrad)" />
    <ellipse cx="90" cy="135" rx="35" ry="8" stroke="var(--accent)" strokeWidth="2" filter="url(#neonGlow)" />
    <ellipse cx="90" cy="135" rx="20" ry="4" stroke="var(--accent-2)" strokeWidth="1" />
    <line x1="65" y1="135" x2="65" y2="70" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
    <line x1="115" y1="135" x2="115" y2="70" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
    <circle cx="80" cy="110" r="1.5" fill="var(--accent)" opacity="0.6" className="float-particle-1" />
    <circle cx="100" cy="120" r="2" fill="var(--accent-2)" opacity="0.8" className="float-particle-2" />
    <g className="upload-file-slide">
      <rect x="72" y="25" width="36" height="46" rx="4" fill="#010807" stroke="var(--accent)" strokeWidth="1.8" filter="url(#neonGlow)" />
      <path d="M98 25 L108 35 L98 35 Z" fill="var(--accent-2)" />
      <line x1="80" y1="40" x2="94" y2="40" stroke="var(--text-3)" strokeWidth="1.5" />
      <line x1="80" y1="48" x2="100" y2="48" stroke="var(--text-3)" strokeWidth="1.5" />
      <line x1="80" y1="56" x2="90" y2="56" stroke="var(--text-3)" strokeWidth="1.5" />
    </g>
  </svg>
);

const EncryptStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <circle cx="90" cy="90" r="60" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
    <circle cx="90" cy="90" r="50" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="8 4 2 4" className="rotate-clockwise" />
    <circle cx="90" cy="90" r="42" stroke="var(--accent-2)" strokeWidth="1" strokeDasharray="4 6" className="rotate-counter" />
    <g className="lock-spin-group">
      <rect x="76" y="80" width="28" height="22" rx="3" fill="#010807" stroke="var(--accent)" strokeWidth="2.2" filter="url(#neonGlow)" />
      <path d="M81 80v-8a9 9 0 0 1 18 0v8" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="90" cy="90" r="2.5" fill="var(--accent-2)" />
      <path d="M90 92.5v6" stroke="var(--accent-2)" strokeWidth="1.5" />
    </g>
    <circle cx="90" cy="30" r="3" fill="var(--accent)" filter="url(#neonGlow)" className="orbit-particle-1" />
    <circle cx="90" cy="150" r="3.5" fill="var(--accent-2)" filter="url(#neonGlow)" className="orbit-particle-2" />
  </svg>
);

const DistributeStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <circle cx="90" cy="90" r="14" fill="#010807" stroke="var(--accent)" strokeWidth="2.2" filter="url(#neonGlow)" />
    <circle cx="90" cy="90" r="6" fill="var(--accent-2)" />
    <g opacity="0.6">
      <line x1="90" y1="90" x2="40" y2="50" stroke="var(--line)" strokeWidth="1.5" />
      <line x1="90" y1="90" x2="140" y2="50" stroke="var(--line)" strokeWidth="1.5" />
      <line x1="90" y1="90" x2="90" y2="150" stroke="var(--line)" strokeWidth="1.5" />
    </g>
    <circle cx="40" cy="50" r="8" fill="#010807" stroke="var(--accent)" strokeWidth="1.5" />
    <circle cx="140" cy="50" r="8" fill="#010807" stroke="var(--accent)" strokeWidth="1.5" />
    <circle cx="90" cy="150" r="8" fill="#010807" stroke="var(--accent)" strokeWidth="1.5" />
    <circle cx="0" cy="0" r="4" fill="var(--accent)" filter="url(#neonGlow)" className="comet-track-1" />
    <circle cx="0" cy="0" r="4" fill="var(--accent-2)" filter="url(#neonGlow)" className="comet-track-2" />
    <circle cx="0" cy="0" r="4.5" fill="#ffb800" filter="url(#neonGlow)" className="comet-track-3" />
  </svg>
);

const VerifyStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <circle cx="90" cy="90" r="65" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
    <circle cx="90" cy="90" r="50" stroke="var(--line)" strokeWidth="1.5" />
    <circle cx="90" cy="90" r="30" stroke="var(--line)" strokeWidth="1.5" />
    <line x1="90" y1="90" x2="135" y2="45" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" filter="url(#neonGlow)" className="radar-sweep-ray" />
    <g className="verify-beacons">
      <g className="beacon-1">
        <circle cx="60" cy="65" r="7" fill="#010807" stroke="var(--accent-2)" strokeWidth="1.5" filter="url(#neonGlow)" />
        <path d="M58 65l1.5 1.5 2.5-3" stroke="var(--accent-2)" strokeWidth="1.2" />
      </g>
      <g className="beacon-2">
        <circle cx="120" cy="115" r="7" fill="#010807" stroke="var(--accent-2)" strokeWidth="1.5" filter="url(#neonGlow)" />
        <path d="M118 115l1.5 1.5 2.5-3" stroke="var(--accent-2)" strokeWidth="1.2" />
      </g>
    </g>
  </svg>
);

const RetrieveStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <ellipse cx="90" cy="130" rx="35" ry="10" fill="url(#portalGrad)" />
    <path d="M55 90 v40 C55 135, 125 135, 125 130 v-40" stroke="var(--line)" strokeWidth="1.5" />
    <ellipse cx="90" cy="90" rx="35" ry="9" stroke="var(--line)" strokeWidth="1.5" />
    <ellipse cx="90" cy="110" rx="35" ry="9" stroke="var(--line)" strokeWidth="1.2" strokeDasharray="3 3" />
    <g className="file-retrieve-rise">
      <rect x="75" y="42" width="30" height="38" rx="3" fill="#010807" stroke="var(--accent)" strokeWidth="2.2" filter="url(#neonGlow)" />
      <path d="M80 50h20M80 58h20M80 66h12" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <circle cx="90" cy="30" r="3" fill="var(--accent)" filter="url(#neonGlow)" />
    </g>
  </svg>
);

/* Provider (Node Operator) Step Graphics */
const DaemonStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <rect x="30" y="35" width="120" height="110" rx="8" fill="#010807" stroke="var(--accent)" strokeWidth="2" filter="url(#neonGlow)" />
    <line x1="30" y1="58" x2="150" y2="58" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
    <circle cx="42" cy="47" r="2.5" fill="#ef4444" />
    <circle cx="51" cy="47" r="2.5" fill="#f59e0b" />
    <circle cx="60" cy="47" r="2.5" fill="#10b981" />
    <text x="42" y="78" fill="var(--accent)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">&gt; daemon init</text>
    <text x="42" y="94" fill="var(--text-2)" fontSize="8" fontFamily="monospace">[OK] Node bound to 40 nodes</text>
    <text x="42" y="110" fill="var(--accent-2)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">&gt; run --audit</text>
    <rect x="108" y="102" width="6" height="10" fill="var(--accent-2)" className="console-cursor-blink" />
  </svg>
);

const DiskStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <circle cx="90" cy="90" r="55" stroke="rgba(255,255,255,0.02)" strokeWidth="6" />
    <circle cx="90" cy="90" r="55" stroke="var(--accent)" strokeWidth="6.5" strokeDasharray="345.5" strokeDashoffset="95" strokeLinecap="round" filter="url(#neonGlow)" className="disk-sector-pulse" />
    <text x="90" y="86" fill="var(--text-1)" fontSize="15" fontWeight="bold" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">1.2 TB</text>
    <text x="90" y="104" fill="var(--text-3)" fontSize="7.5" textAnchor="middle" letterSpacing="0.08em">RESERVED</text>
  </svg>
);

const ReceiveStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <rect x="40" y="90" width="100" height="42" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--line)" strokeWidth="1.5" />
    <rect x="40" y="40" width="100" height="42" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--line)" strokeWidth="1.5" />
    <rect x="50" y="47" width="22" height="28" rx="2" fill="rgba(16, 185, 129, 0.12)" stroke="var(--accent)" strokeWidth="1.8" filter="url(#neonGlow)" className="disk-slide-arrive-1" />
    <rect x="79" y="47" width="22" height="28" rx="2" fill="rgba(16, 185, 129, 0.12)" stroke="var(--accent)" strokeWidth="1.8" filter="url(#neonGlow)" className="disk-slide-arrive-2" />
    <rect x="108" y="47" width="22" height="28" rx="2" fill="rgba(16, 185, 129, 0.12)" stroke="var(--accent)" strokeWidth="1.8" filter="url(#neonGlow)" className="disk-slide-arrive-3" />
  </svg>
);

const ChallengeStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <rect x="35" y="45" width="110" height="90" rx="6" fill="#010807" stroke="var(--line)" strokeWidth="1.5" />
    <line x1="35" y1="75" x2="145" y2="75" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
    <text x="45" y="64" fill="var(--text-3)" fontSize="7.5" fontFamily="monospace">ZK CHALLENGE</text>
    <text x="45" y="98" fill="var(--accent)" fontSize="8.5" fontFamily="monospace" fontWeight="bold">PROOF_OK</text>
    <text x="45" y="112" fill="var(--accent-2)" fontSize="7" fontFamily="monospace">Hash solved (3ms)</text>
    <circle cx="118" cy="98" r="9" fill="#010807" stroke="var(--accent-2)" strokeWidth="1.8" filter="url(#neonGlow)" />
    <path d="M115 98l2 2 4-4" stroke="var(--accent-2)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="90" cy="45" r="4" fill="var(--accent)" filter="url(#neonGlow)" className="challenge-wave-pulse" />
  </svg>
);

const RewardsStepSvg = () => (
  <svg className="step-card-svg" viewBox="0 0 180 180" fill="none">
    {renderDefs('var(--accent)', 'var(--accent-2)')}
    <circle cx="90" cy="55" r="30" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 3" className="rotate-clockwise" />
    <circle cx="90" cy="55" r="16" fill="var(--accent)" filter="url(#neonGlow)" className="token-payout-heartbeat" />
    <text x="90" y="60" fill="#010807" fontSize="13" fontWeight="bold" fontFamily="Space Grotesk, sans-serif" textAnchor="middle">S</text>
    <rect x="65" y="110" width="50" height="12" rx="3" fill="var(--accent-2)" stroke="var(--accent)" strokeWidth="1" className="reward-stack-1" />
    <rect x="65" y="120" width="50" height="12" rx="3" fill="var(--accent-2)" stroke="var(--accent)" strokeWidth="1" className="reward-stack-2" />
    <rect x="65" y="130" width="50" height="12" rx="3" fill="var(--accent-2)" stroke="var(--accent)" strokeWidth="1" className="reward-stack-3" />
  </svg>
);

// Map mapping roles & step indices directly to custom vector components to satisfy SRP and OCP
const GRAPHICS_REGISTRY = {
  consumer: {
    0: UploadStepSvg,
    1: EncryptStepSvg,
    2: DistributeStepSvg,
    3: VerifyStepSvg,
    4: RetrieveStepSvg,
  },
  provider: {
    0: DaemonStepSvg,
    1: DiskStepSvg,
    2: ReceiveStepSvg,
    3: ChallengeStepSvg,
    4: RewardsStepSvg,
  },
};

/**
 * StepGraphic router matching active roles and active slide index to render neon loops.
 * @param {Object} props
 * @param {string} props.role - Current active landing page role ('consumer' | 'provider')
 * @param {number} props.stepIndex - Active card slide index (0 to 4)
 * @returns {React.JSX.Element}
 */
export default function StepGraphic({ role, stepIndex }) {
  const RoleRegistry = GRAPHICS_REGISTRY[role];
  if (!RoleRegistry) return null;

  const VectorGraphicComponent = RoleRegistry[stepIndex];
  if (!VectorGraphicComponent) return null;

  return <VectorGraphicComponent />;
}
