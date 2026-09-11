import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Title, Text, Button } from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import NetworkDiagramPreview from '../components/NetworkDiagramPreview';
import NodeDashboardPreview from '../components/NodeDashboardPreview';
import CentralizedServerInfographic from '../components/CentralizedServerInfographic';
import WastedHardwareInfographic from '../components/WastedHardwareInfographic';
import StepGraphic from '../components/StepGraphic';
import { landingContent } from '../constants/landingContent';
import '../styles/theme.css';
import '../styles/landing.css';

/**
 * Shardize Landing Page - Modular & Solid Frontend architecture.
 * Renders product landing features, problem infographics, how-it-works cards,
 * dynamic provider/consumer state transitions, and interactive alerts.
 * @returns {React.JSX.Element}
 */
export default function Landing() {
  const [role, setRole] = useState('consumer');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const active = landingContent[role];

  // Sends the visitor into the signup flow, pre-selecting the
  // matching account type (storage user vs. node operator).
  const handleTryItClick = (targetRole) => {
    setIsDropdownOpen(false);
    if (user) {
      navigate(targetRole === 'provider' ? '/provider' : '/dashboard');
    } else {
      navigate(`/register?role=${targetRole}`);
    }
  };

  // Card slide autoplay loop
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handleRoleChange = (newRole) => {
    if (newRole === role || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setRole(newRole);
      setActiveStep(0);
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <div className={`landing-page theme-${role}`}>
      <div className="grain-overlay" aria-hidden="true" />
      
      <nav className="landing-nav" role="navigation">
        <div className="brand-logo">
          <div className="brand-logo-mark">S</div>
          <span>Shardize</span>
        </div>

        {/* Role toggle in navigation header */}
        <div className="role-toggle nav-role-toggle" role="group" aria-label="Role selector switch">
          <button
            className={`role-toggle-btn ${role === 'consumer' ? 'active' : ''}`}
            onClick={() => handleRoleChange('consumer')}
            aria-pressed={role === 'consumer'}
          >
            Storage user
          </button>
          <button
            className={`role-toggle-btn ${role === 'provider' ? 'active' : ''}`}
            onClick={() => handleRoleChange('provider')}
            aria-pressed={role === 'provider'}
          >
            Node operator
          </button>
        </div>

        {user ? (
          <Button
            radius="xl"
            className="auth-submit-button landing-nav-btn"
            onClick={() => navigate('/dashboard')}
          >
            Go to dashboard
          </Button>
        ) : (
          <div className="try-it-dropdown-container">
            <Link to="/login" className="landing-nav-btn landing-signin-link">
              Sign in
            </Link>

            <Button 
              radius="xl" 
              className="auth-submit-button landing-nav-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
              Try it
            </Button>

            {isDropdownOpen && (
              <>
                <div 
                  className="dropdown-overlay" 
                  onClick={() => setIsDropdownOpen(false)} 
                  aria-hidden="true" 
                />
                <div className="try-it-dropdown-menu" role="menu">
                  <div 
                    className="dropdown-item" 
                    onClick={() => handleTryItClick('consumer')}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTryItClick('consumer')}
                  >
                    <div className="dropdown-item-header">
                      <span className="dropdown-item-dot dot-cyan" aria-hidden="true"></span>
                      <span className="dropdown-item-title">Store Files (User)</span>
                    </div>
                    <div className="dropdown-item-desc">Upload, encrypt, and shard files across the network.</div>
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => handleTryItClick('provider')}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleTryItClick('provider')}
                  >
                    <div className="dropdown-item-header">
                      <span className="dropdown-item-dot dot-emerald" aria-hidden="true"></span>
                      <span className="dropdown-item-title">Host Node (Provider)</span>
                    </div>
                    <div className="dropdown-item-desc">Offer spare storage capacity and solve proofs to earn crypto.</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      <div className={`landing-transition-container ${isTransitioning ? 'transition-out' : 'transition-in'}`}>
        <section className="landing-hero" aria-label="Introduction Area">
          <Badge className="brand-pill">{active.badge}</Badge>
          <Title className="landing-headline">{active.headline}</Title>
          <Text className="landing-hero-sub">{active.sub}</Text>
          
          {role === 'consumer' ? <NetworkDiagramPreview /> : <NodeDashboardPreview />}
        </section>

        {/* Split Infographic layout for Problem Section */}
        <section className="landing-section problem-section" aria-label="Problem Context">
          <div className="problem-split-grid">
            <div className="problem-visual-col">
              {role === 'consumer' ? <CentralizedServerInfographic /> : <WastedHardwareInfographic />}
            </div>
            
            <div className="problem-content-col">
              <Text className="section-eyebrow">The problem</Text>
              <Title order={2} className="section-title">
                {role === 'consumer' 
                  ? 'Centralized storage was never built for privacy' 
                  : 'Your hardware is working, but only for big tech'}
              </Title>
              <div className="pain-grid">
                {active.painPoints.map((p) => (
                  <div className="pain-card" key={p.title}>
                    <div className="pain-title">{p.title}</div>
                    <div className="pain-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Glass Cards Slider Section */}
        <section className="landing-section how-it-works-slider-section" aria-label="Workflow Guide">
          <Text className="section-eyebrow">How it works</Text>
          <Title order={2} className="section-title">
            {role === 'consumer'
              ? 'Decentralized data flow in five secure steps'
              : 'Earn and audit storage in five automated steps'}
          </Title>

          <div className="slider-container">
            <div className="slider-viewport">
              <div 
                className="slider-track" 
                style={{ transform: `translateX(calc(50% - 150px - ${activeStep * 310}px))` }}
              >
                {active.steps.map((s, idx) => (
                  <div 
                    className={`slider-card ${activeStep === idx ? 'card-active' : ''}`}
                    key={s.n}
                    onClick={() => {
                      setActiveStep(idx);
                      setIsAutoplay(false);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && (setActiveStep(idx) || setIsAutoplay(false))}
                    aria-label={`Step ${s.n}: ${s.title}`}
                  >
                    <div className="card-graphic-wrap">
                      <StepGraphic role={role} stepIndex={idx} />
                    </div>
                    <div className="card-info">
                      <div className="card-step-badge">Step 0{s.n}</div>
                      <div className="card-title">{s.title}</div>
                      <div className="card-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <div className="slider-controls" role="group" aria-label="Carousel navigation controls">
              <button 
                className="slider-arrow-btn" 
                onClick={() => {
                  setActiveStep(prev => (prev - 1 + 5) % 5);
                  setIsAutoplay(false);
                }}
                aria-label="Previous step"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="slider-pills" role="tablist">
                {active.steps.map((s, idx) => (
                  <span 
                    key={idx} 
                    className={`slider-pill-dot ${activeStep === idx ? 'active' : ''}`}
                    onClick={() => {
                      setActiveStep(idx);
                      setIsAutoplay(false);
                    }}
                    role="tab"
                    aria-selected={activeStep === idx}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                className="slider-arrow-btn" 
                onClick={() => {
                  setActiveStep(prev => (prev + 1) % 5);
                  setIsAutoplay(false);
                }}
                aria-label="Next step"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                className="slider-autoplay-toggle"
                onClick={() => setIsAutoplay(!isAutoplay)}
              >
                {isAutoplay ? 'Pause Loop' : 'Play Loop'}
              </button>
            </div>
          </div>
        </section>

        {/* Features Layout */}
        <section className="landing-section" aria-label="Core Features">
          <Text className="section-eyebrow">
            {role === 'consumer' ? 'What makes it secure' : 'What you get as a node'}
          </Text>
          <Title order={2} className="section-title">
            {role === 'consumer'
              ? 'Built for privacy, resilience, and trustless verification'
              : 'Earn from your idle storage, verified and rewarded'}
          </Title>
          <div className="feature-grid">
            {active.features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.visual}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Stack */}
        <section className="landing-section" aria-label="System Architecture">
          <Text className="section-eyebrow">Architecture</Text>
          <Title order={2} className="section-title">{active.architecture.title}</Title>
          <Text className="arch-sub">{active.architecture.sub}</Text>
          
          <div className="arch-stack-container">
            {active.architecture.flow.map((stepName, idx) => (
              <div className="arch-stack-layer" key={stepName}>
                <div className="arch-layer-glass">
                  <span className="arch-layer-number">0{idx + 1}</span>
                  <div className="arch-layer-content">
                    <div className="arch-layer-title">{stepName}</div>
                    <div className="arch-layer-indicator">
                      <span className="indicator-pulse"></span>
                      <span>ACTIVE LAYER</span>
                    </div>
                  </div>
                </div>
                {idx < active.architecture.flow.length - 1 && (
                  <div className="arch-stack-connector">
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none" aria-hidden="true">
                      <path d="M0,10 H32" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx="16" cy="10" r="3.5" fill="var(--accent)" className="packet-pulse" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="landing-footer" role="contentinfo">
        <Text>Decentralized Cloud Storage — built on IPFS.</Text>
      </footer>
    </div>
  );
}