export default function NetworkDiagramPreview() {
  return (
    <div className="hero-dashboard-preview" aria-hidden>
      <div className="preview-console">
        <div className="console-topbar">
          <div className="card-dot-group">
            <span className="card-dot red"></span>
            <span className="card-dot yellow"></span>
            <span className="card-dot green"></span>
          </div>
          <span className="console-title">Shardize Node Monitor</span>
        </div>
        
        <div className="console-body" style={{ gridTemplateColumns: '1.45fr 0.55fr' }}>
          {/* Left Column: Mini network node layout */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(1, 10, 8, 0.25)', border: '1px solid rgba(0, 255, 204, 0.06)', borderRadius: '12px', padding: '10px', minHeight: '210px', boxSizing: 'border-box' }}>
            <svg className="hero-wires" width="100%" height="100%" viewBox="0 45 460 226" fill="none" style={{ display: 'block' }}>
              <defs>
                <pattern id="dotGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.6" fill="rgba(0, 255, 204, 0.08)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)" />

              {/* Wires (Paths) drawn first so they lay under the node cards */}
              <path className="wire" d="M 52,110 H 116 V 70 H 180" />
              <path className="wire" d="M 52,110 H 116 V 190 H 180" />
              <path className="wire" d="M 52,110 V 250" />
              <path className="wire" d="M 52,250 H 116 V 190 H 180" />
              <path className="wire" d="M 180,70 H 235 V 64 H 291" />
              <path className="wire" d="M 180,190 H 235 V 174 H 291" />
              
              {/* Mesh connections */}
              <path className="wire" d="M 291,64 L 423,114" />
              <path className="wire" d="M 291,64 L 291,174" />
              <path className="wire" d="M 291,64 L 423,224" />
              <path className="wire" d="M 291,174 L 423,114" />
              <path className="wire" d="M 291,174 L 423,224" />
              <path className="wire" d="M 423,114 L 423,224" />

              {/* Animated lightning pulses */}
              <path className="wire-pulse delay-1" d="M 52,110 H 116 V 70 H 180" />
              <path className="wire-pulse delay-2" d="M 52,110 H 116 V 190 H 180" />
              <path className="wire-pulse delay-3" d="M 52,110 V 250" />
              
              <path className="wire-pulse delay-4" d="M 180,70 H 235 V 64 H 291" />
              <path className="wire-pulse delay-5" d="M 180,190 H 235 V 174 H 291" />
              
              {/* Mesh animated pulses */}
              <path className="wire-pulse delay-6" d="M 291,64 L 423,114" />
              <path className="wire-pulse delay-1" d="M 291,174 L 423,114" />
              <path className="wire-pulse delay-2" d="M 291,174 L 423,224" />
              <path className="wire-pulse delay-3" d="M 423,114 L 423,224" />

              {/* Client Node */}
              <g className="svg-node" transform="translate(1, 93)">
                <rect width="102" height="34" rx="6" className="svg-card-bg" />
                <g transform="translate(8, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <rect x="2" y="3" width="14" height="9" rx="1.2" ry="1.2"></rect>
                  <line x1="5" y1="15" x2="11" y2="15"></line>
                  <line x1="8" y1="12" x2="8" y2="15"></line>
                </g>
                <text x="32" y="21" className="svg-card-text">Client</text>
              </g>

              {/* Metadata Node */}
              <g className="svg-node" transform="translate(1, 233)">
                <rect width="102" height="34" rx="6" className="svg-card-bg" />
                <g transform="translate(8, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <ellipse cx="9" cy="4" rx="6" ry="2"></ellipse>
                  <path d="M3 4v4c0 1.1 2.7 2 6 2s6-0.9 6-2V4"></path>
                  <path d="M3 8v4c0 1.1 2.7 2 6 2s6-0.9 6-2V8"></path>
                </g>
                <text x="32" y="21" className="svg-card-text">Metadata</text>
              </g>

              {/* Encryption Node */}
              <g className="svg-node" transform="translate(119, 53)">
                <rect width="102" height="34" rx="6" className="svg-card-bg" />
                <g transform="translate(8, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <rect x="3" y="7" width="10" height="7" rx="1"></rect>
                  <path d="M5 7V4a3 3 0 0 1 6 0v3"></path>
                </g>
                <text x="32" y="21" className="svg-card-text">Encryption</text>
              </g>

              {/* Sharding Node */}
              <g className="svg-node" transform="translate(119, 173)">
                <rect width="102" height="34" rx="6" className="svg-card-bg" />
                <g transform="translate(8, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <rect x="2" y="2" width="4" height="4" rx="0.5"></rect>
                  <rect x="8" y="2" width="4" height="4" rx="0.5"></rect>
                  <rect x="8" y="8" width="4" height="4" rx="0.5"></rect>
                  <rect x="2" y="8" width="4" height="4" rx="0.5"></rect>
                </g>
                <text x="32" y="21" className="svg-card-text">Sharding</text>
              </g>

              {/* Node A */}
              <g className="svg-node" transform="translate(274, 48)">
                <rect width="34" height="32" rx="6" className="svg-card-bg" />
                <g transform="translate(4, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <ellipse cx="7" cy="4" rx="5" ry="1.8"></ellipse>
                  <path d="M2 4v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V4"></path>
                  <path d="M2 8v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V8"></path>
                </g>
                <text x="21" y="20" className="svg-card-text">A</text>
              </g>

              {/* Node B */}
              <g className="svg-node" transform="translate(406, 98)">
                <rect width="34" height="32" rx="6" className="svg-card-bg" />
                <g transform="translate(4, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <ellipse cx="7" cy="4" rx="5" ry="1.8"></ellipse>
                  <path d="M2 4v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V4"></path>
                  <path d="M2 8v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V8"></path>
                </g>
                <text x="21" y="20" className="svg-card-text">B</text>
              </g>

              {/* Node C */}
              <g className="svg-node" transform="translate(274, 158)">
                <rect width="34" height="32" rx="6" className="svg-card-bg" />
                <g transform="translate(4, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <ellipse cx="7" cy="4" rx="5" ry="1.8"></ellipse>
                  <path d="M2 4v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V4"></path>
                  <path d="M2 8v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V8"></path>
                </g>
                <text x="21" y="20" className="svg-card-text">C</text>
              </g>

              {/* Node D */}
              <g className="svg-node" transform="translate(406, 208)">
                <rect width="34" height="32" rx="6" className="svg-card-bg" />
                <g transform="translate(4, 9)" stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="node-svg-icon">
                  <ellipse cx="7" cy="4" rx="5" ry="1.8"></ellipse>
                  <path d="M2 4v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V4"></path>
                  <path d="M2 8v4c0 1 2.2 1.8 5 1.8s5-0.8 5-1.8V8"></path>
                </g>
                <text x="21" y="20" className="svg-card-text">D</text>
              </g>
            </svg>
          </div>

          {/* Right Column: Sharding Grid and active nodes list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Section 1: Sharding Grid */}
            <div className="console-section shards-section" style={{ padding: '10px 12px' }}>
              <div className="sharding-grid" style={{ marginBottom: '6px', gap: '3px' }}>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block active"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
                <div className="shard-block"></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', color: 'rgba(255, 255, 255, 0.4)' }}>
                <span>Shards: 10/24</span>
                <span style={{ color: 'var(--accent)' }}>99.98% Up</span>
              </div>
            </div>

            {/* Section 2: Active Swarm Peers & Mini sparkline traffic */}
            <div className="console-section swarm-section" style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="card-title-text" style={{ display: 'block', marginBottom: '6px', fontSize: '9px' }}>Swarm Active</span>
                <div className="node-item" style={{ marginBottom: '4px' }}>
                  <span className="status-indicator online"></span>
                  <span className="node-name" style={{ fontSize: '10.5px' }}>Node #2041</span>
                </div>
                <div className="node-item" style={{ marginBottom: '4px' }}>
                  <span className="status-indicator online"></span>
                  <span className="node-name" style={{ fontSize: '10.5px' }}>Node #0849</span>
                </div>
              </div>
              
              <div className="sparkline-container" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '4px', marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '2px' }}>
                  <span>Sync Speed</span>
                  <span style={{ color: 'var(--accent)' }}>98.4 MB/s</span>
                </div>
                <svg width="100%" height="16" viewBox="0 0 200 30" fill="none">
                  <path d="M0,25 Q15,10 30,22 T60,5 T90,25 T120,12 T150,20 T180,8 T200,15" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none" className="sparkline-path" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
