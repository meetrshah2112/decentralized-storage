import React from 'react';

/**
 * Static content structure defining all copywriting, features lists, step titles,
 * and vector graphic outlines for both Consumer (Storage User) and Provider (Node Operator) roles.
 */
export const landingContent = {
  consumer: {
    badge: 'For storage users',
    headline: (
      <>Your files, <span className="accent-text">everywhere</span>.<br />Owned by no one.</>
    ),
    sub: 'Upload your files to a peer-to-peer network built on IPFS — encrypted on your device, split into pieces, and scattered across independent nodes. No single company, server, or person can read your data.',
    cta: 'Store your files',
    features: [
      { 
        title: 'End-to-end encryption', 
        desc: 'AES-256 encryption happens before a file ever leaves your device. Storage nodes only ever see ciphertext.',
        visual: (
          <svg className="feature-illustration-svg" viewBox="0 0 100 100" fill="none" width="60" height="60" aria-hidden="true">
            <circle cx="50" cy="50" r="40" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 6" className="rotate-slow" />
            <rect x="35" y="45" width="30" height="24" rx="4" stroke="var(--accent)" strokeWidth="2.5" fill="rgba(0, 255, 204, 0.05)" />
            <path d="M42 45V35a8 8 0 0 1 16 0v10" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="57" r="3" fill="var(--accent)" />
          </svg>
        )
      },
      { 
        title: 'Sharding & erasure coding', 
        desc: 'Large files split into redundant chunks — only a fraction are needed to fully reconstruct the original.',
        visual: (
          <svg className="feature-illustration-svg" viewBox="0 0 100 100" fill="none" width="60" height="60" aria-hidden="true">
            <rect x="40" y="40" width="20" height="20" rx="3" stroke="var(--accent)" strokeWidth="2.5" className="shard-center" />
            <line x1="50" y1="50" x2="20" y2="20" stroke="var(--accent-2)" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="50" y1="50" x2="80" y2="20" stroke="var(--accent-2)" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="50" y1="50" x2="50" y2="80" stroke="var(--accent-2)" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="12" y="12" width="12" height="12" rx="2" fill="var(--accent)" className="shard-float-1" />
            <rect x="76" y="12" width="12" height="12" rx="2" fill="var(--accent-2)" className="shard-float-2" />
            <rect x="44" y="74" width="12" height="12" rx="2" fill="#ffb800" className="shard-float-3" />
          </svg>
        )
      },
      { 
        title: 'Share & revoke access instantly', 
        desc: 'Proxy Re-Encryption lets you grant or cut off access to a file without ever exposing your private key.',
        visual: (
          <svg className="feature-illustration-svg" viewBox="0 0 100 100" fill="none" width="60" height="60" aria-hidden="true">
            <circle cx="25" cy="50" r="8" stroke="var(--accent)" strokeWidth="2" />
            <circle cx="75" cy="50" r="8" stroke="var(--accent-2)" strokeWidth="2" />
            <path d="M33 50h34" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M43 45l7-7m0 0l7 7m-7-7v24" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-pulse" />
            <circle cx="50" cy="50" r="14" stroke="var(--accent)" strokeWidth="2" fill="#010a08" className="rotate-fast" />
          </svg>
        )
      },
    ],
    painPoints: [
      { title: 'Single point of failure', desc: 'One data center goes down, one breach happens — and every file stored there is gone or exposed.' },
      { title: "You don't hold the keys", desc: 'Centralized providers can read, scan, or hand over your files. Privacy depends entirely on their policy, not on math.' },
      { title: 'Paying premium for idle hardware', desc: "Millions of gigabytes sit unused on personal machines, while everyone still pays monthly rates to rent someone else's data center." },
    ],
    steps: [
      { n: '01', title: 'Upload your file', desc: 'You select a file from the client app. Nothing leaves your device unprotected.' },
      { n: '02', title: 'Encrypt & shard', desc: 'The file is encrypted client-side (AES-256) and, if large, split into chunks using erasure coding.' },
      { n: '03', title: 'Distribute to nodes', desc: 'Encrypted chunks are pushed across independent storage nodes on the IPFS network — no single node holds the whole file.' },
      { n: '04', title: 'Verify & monitor', desc: 'Nodes are pinged for uptime and issued periodic Proof-of-Storage hash challenges, confirming your data is still intact.' },
      { n: '05', title: 'Retrieve anytime', desc: 'Request your file back — chunks are pulled from the network, reconstructed, and decrypted locally for you.' },
    ],
    architecture: {
      title: 'A hybrid model — decentralized storage, lightweight coordination',
      sub: 'Files are never stored on a central server. A lightweight backend only tracks metadata and Content Identifiers (CIDs), and continuously monitors the health of the storage node network — while the actual encrypted data lives entirely across independent peer nodes.',
      flow: ['Client App', 'Backend Orchestration', 'IPFS Network', 'Storage Nodes']
    }
  },
  provider: {
    badge: 'For node operators',
    headline: (
      <>Your storage, <span className="accent-text">your income</span>.<br />Idle no more.</>
    ),
    sub: 'Turn spare disk space into a live storage node. Host encrypted shards for other users, get verified for uptime, and earn rewards — without ever seeing the actual data you\'re storing.',
    cta: 'Become a node',
    features: [
      { 
        title: 'Incentivized node economy', 
        desc: 'Anyone can turn spare disk space into income by hosting encrypted shards and maintaining uptime.',
        visual: (
          <svg className="feature-illustration-svg" viewBox="0 0 100 100" fill="none" width="60" height="60" aria-hidden="true">
            <circle cx="50" cy="45" r="22" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" className="rotate-slow" />
            <path d="M40 45h20M50 35v20" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="36" y="58" width="28" height="18" rx="2" stroke="var(--accent-2)" strokeWidth="2" fill="rgba(16, 185, 129, 0.1)" />
            <circle cx="43" cy="67" r="2" fill="var(--accent-2)" />
            <circle cx="57" cy="67" r="2" fill="var(--accent-2)" />
          </svg>
        )
      },
      { 
        title: 'Proof-of-Storage verification', 
        desc: 'Nodes must respond to periodic cryptographic hash challenges, proving they still hold your data intact.',
        visual: (
          <svg className="feature-illustration-svg" viewBox="0 0 100 100" fill="none" width="60" height="60" aria-hidden="true">
            <path d="M50 15L80 30v30c0 18-30 25-30 25s-30-7-30-25V30l30-15z" stroke="var(--accent)" strokeWidth="2.5" fill="rgba(16, 185, 129, 0.05)" />
            <path d="M38 50l8 8 16-16" stroke="var(--accent-2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="draw-check" />
          </svg>
        )
      },
      { 
        title: 'Private IPFS network', 
        desc: 'Storage runs across a trusted, monitored set of nodes — not the open public IPFS swarm.',
        visual: (
          <svg className="feature-illustration-svg" viewBox="0 0 100 100" fill="none" width="60" height="60" aria-hidden="true">
            <polygon points="50,15 80,35 80,68 50,88 20,68 20,35" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="15" r="5" fill="var(--accent)" className="swarm-node-1" />
            <circle cx="80" cy="35" r="5" fill="var(--accent-2)" className="swarm-node-2" />
            <circle cx="80" cy="68" r="5" fill="var(--accent)" className="swarm-node-3" />
            <circle cx="50" cy="88" r="5" fill="var(--accent-2)" className="swarm-node-4" />
            <circle cx="20" cy="68" r="5" fill="var(--accent)" className="swarm-node-5" />
            <circle cx="20" cy="35" r="5" fill="var(--accent-2)" className="swarm-node-6" />
            <line x1="50" y1="15" x2="50" y2="88" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            <line x1="80" y1="35" x2="20" y2="68" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
            <line x1="20" y1="35" x2="80" y2="68" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
          </svg>
        )
      },
    ],
    painPoints: [
      { title: 'Wasted computing capital', desc: 'Hard drives and fiber connections sit completely idle for 90% of the day, earning absolutely nothing.' },
      { title: 'Monopoly over storage revenue', desc: 'A few tech giants control the cloud storage market, dictating pricing while hosting your data in vulnerable data centers.' },
      { title: 'Complex node setup elsewhere', desc: 'Other decentralized networks require high staking limits or complex enterprise setups just to host small storage shares.' },
    ],
    steps: [
      { n: '01', title: 'Install Shardize daemon', desc: 'Download our lightweight background client. It runs quietly on Windows, macOS, or Linux.' },
      { n: '02', title: 'Allocate disk & network', desc: 'Select how many gigabytes or terabytes of spare space you want to share, and limit bandwidth usage.' },
      { n: '03', title: 'Receive encrypted shards', desc: 'The network automatically routes encrypted, anonymized file fragments from storage users to your disk.' },
      { n: '04', title: 'Solve storage challenges', desc: 'Your node automatically responds to periodic cryptographic audits (proof-of-storage) to verify files are intact.' },
      { n: '05', title: 'Collect SHARD rewards', desc: 'Receive continuous token payouts based on storage volume and verified uptime, redeemable instantly.' },
    ],
    architecture: {
      title: 'Swarm-based hosting with automated network auditing',
      sub: 'Your node joins the decentralized swarm using libp2p. Shardize handles automated connection tunneling, challenge execution, and wallet payouts. You remain in control of your machine, with data fully insulated.',
      flow: ['Your Idle Storage', 'Shardize Daemon', 'Cryptographic Audit', 'Wallet Payouts']
    }
  },
};
