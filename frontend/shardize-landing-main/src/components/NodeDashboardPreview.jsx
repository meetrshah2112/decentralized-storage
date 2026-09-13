import { useState, useEffect } from 'react';

export default function NodeDashboardPreview() {
  const [logs, setLogs] = useState([
    '[SYSTEM] Shardize Node daemon v1.4.0 started.',
    '[PEER] Peer ID registered: QmPf8wZ...3d9yK',
    '[NETWORK] Connected to IPFS Swarm. 34 active peers.',
    '[OK] Proof-of-Storage challenge #2908 solved.',
    '[REWARD] +0.048 SHARD credited to local wallet.',
  ]);

  const logTemplates = [
    () => `[SYNC] Fetching encrypted shard Qm${Math.random().toString(36).substring(2, 8)}...`,
    () => `[STORAGE] Shard stored successfully. Disk usage: ${(50 + Math.random() * 20).toFixed(1)}%`,
    () => `[CHALLENGE] incoming proof-of-storage challenge for epoch #${Math.floor(Math.random() * 9000 + 1000)}`,
    () => `[MATH] SHA-256 hash verified. generating cryptographic proof...`,
    () => `[OK] Challenge solved successfully in ${Math.floor(Math.random() * 150 + 50)}ms`,
    () => `[REWARD] +0.0${Math.floor(Math.random() * 8 + 1)} SHARD rewarded to wallet.`,
    () => `[UPTIME] Heartbeat sent. Latency: ${Math.floor(Math.random() * 30 + 10)}ms. Status: healthy.`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prevLogs) => {
        const nextLog = logTemplates[Math.floor(Math.random() * logTemplates.length)]();
        // Keep the last 5 logs
        return [...prevLogs.slice(1), nextLog];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-dashboard-preview" aria-hidden>
      <div className="preview-console node-console">
        <div className="console-topbar">
          <div className="card-dot-group">
            <span className="card-dot red"></span>
            <span className="card-dot yellow"></span>
            <span className="card-dot green"></span>
          </div>
          <span className="console-title">Shardize Node Operator Dashboard</span>
        </div>
        
        <div className="console-body" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
          {/* Left Column: Storage Disk Allocator & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(1, 10, 8, 0.25)', border: '1px solid rgba(16, 185, 129, 0.06)', borderRadius: '12px', padding: '16px', boxSizing: 'border-box' }}>
            
            {/* Storage Circular Gauge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.08)"
                    strokeWidth="5"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="5"
                    strokeDasharray="213.6"
                    strokeDashoffset="75"
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 0 4px var(--accent))',
                      transition: 'stroke-dashoffset 1s ease',
                      animation: 'node-ring-pulse 3s infinite alternate'
                    }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-1)' }}>65%</span>
                  <span style={{ fontSize: '7.5px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Used</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                <span className="card-title-text" style={{ fontSize: '9px' }}>Disk Space Allocation</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', fontFamily: 'Space Grotesk, sans-serif' }}>648.2 GB <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '400' }}>/ 1 TB</span></span>
                <span style={{ fontSize: '10px', color: 'var(--text-2)' }}>Spare bandwidth: 100 Mbps</span>
              </div>
            </div>

            {/* Live Heartbeat ECG Monitor */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-2)', marginBottom: '6px' }}>
                <span>Uptime Heartbeat</span>
                <span style={{ color: 'var(--accent)', fontWeight: '700' }}>99.98% (Excellent)</span>
              </div>
              <svg width="100%" height="34" viewBox="0 0 250 50" fill="none">
                {/* Background grid lines */}
                <line x1="0" y1="12" x2="250" y2="12" stroke="rgba(16, 185, 129, 0.04)" strokeWidth="0.5" />
                <line x1="0" y1="25" x2="250" y2="25" stroke="rgba(16, 185, 129, 0.04)" strokeWidth="0.5" />
                <line x1="0" y1="38" x2="250" y2="38" stroke="rgba(16, 185, 129, 0.04)" strokeWidth="0.5" />
                
                {/* Heartbeat pulse path */}
                <path
                  d="M0,25 L40,25 L50,10 L58,40 L66,25 L100,25 L110,5 L118,45 L126,25 L170,25 L180,15 L188,35 L196,25 L250,25"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="heartbeat-path"
                  style={{
                    filter: 'drop-shadow(0 0 4px var(--accent))'
                  }}
                />
              </svg>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '8px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Latency</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-1)' }}>14 ms</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '8px', color: 'var(--text-3)', textTransform: 'uppercase' }}>Peer Score</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent)' }}>9.82/10</span>
              </div>
            </div>

          </div>

          {/* Right Column: Earnings & Terminal console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Earnings Tracker */}
            <div className="console-section" style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.12)', borderRadius: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="card-title-text" style={{ fontSize: '9px', color: 'var(--text-2)' }}>Estimated Rewards</span>
                <span className="status-indicator online" style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>1,842.50</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)' }}>SHARD</span>
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                ~ $184.25 USD earned this month
              </div>
            </div>

            {/* Terminal Log */}
            <div className="console-section" style={{ flex: 1, padding: '12px', background: 'rgba(0, 0, 0, 0.35)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '12px', fontFamily: 'Consolas, Monaco, monospace', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '8.5px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '4px' }}>Daemon Output</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5px', flex: 1, fontSize: '9.5px', color: 'rgba(255, 255, 255, 0.75)', overflow: 'hidden', minHeight: '92px' }}>
                {logs.map((log, index) => {
                  let color = 'rgba(255, 255, 255, 0.85)';
                  if (log.includes('[SYSTEM]')) color = 'var(--text-3)';
                  else if (log.includes('[PEER]')) color = 'rgba(255, 255, 255, 0.6)';
                  else if (log.includes('[OK]')) color = '#00ffcc';
                  else if (log.includes('[REWARD]')) color = '#10b981';
                  else if (log.includes('[CHALLENGE]')) color = '#f59e0b';
                  
                  return (
                    <div key={index} style={{ color, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', animation: 'fadeInLog 0.3s ease' }}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
