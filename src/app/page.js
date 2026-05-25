"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('ai-modal-open');
    } else {
      document.body.classList.remove('ai-modal-open');
    }
    return () => document.body.classList.remove('ai-modal-open');
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError('');
    setResponse('');
    setIsModalOpen(true);

    try {
      console.log('[AI Client] Sending query to /api/chat...');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (res.status === 429) {
        console.warn(`[AI Client] Rate limited.`);
        setError(`⏳ Free-tier quota reached. AI will be available again soon.`);
        return;
      }

      if (!res.ok) {
        console.error('[AI Client] Server error response:', {
          status: res.status,
          serverError: data.error,
          serverDetails: data.details,
        });
        throw new Error(data.details || data.error || 'Unknown server error');
      }

      console.log('[AI Client] Success. Response received.');
      setResponse(data.text);
    } catch (err) {
      console.error('[AI Client] Caught error:', err.message);
      setError(`Error connecting to AI: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Basic, safe markdown-like renderer for AI responses.
  // - Escapes HTML
  // - Converts triple-backtick blocks to <pre><code>
  // - Converts inline `code` to <code>
  // - Converts **bold** to <strong>
  // - Preserves line breaks
  function renderAIResponse(raw) {
    if (!raw) return '';
    // escape HTML
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let out = String(raw);

    // code blocks ```
    out = out.replace(/```([\s\S]*?)```/g, (m, code) => `<pre><code>${esc(code)}</code></pre>`);
    // inline code `code`
    out = out.replace(/`([^`]+)`/g, (m, code) => `<code>${esc(code)}</code>`);
    // bold **text** -> <strong>
    out = out.replace(/\*\*([^*]+)\*\*/g, (m, t) => `<strong>${esc(t)}</strong>`);
    // escape remaining HTML and restore tags we intentionally added
    out = esc(out)
      .replace(/&lt;pre&gt;/g, '<pre>')
      .replace(/&lt;\/pre&gt;/g, '</pre>')
      .replace(/&lt;code&gt;/g, '<code>')
      .replace(/&lt;\/code&gt;/g, '</code>')
      .replace(/&lt;strong&gt;/g, '<strong>')
      .replace(/&lt;\/strong&gt;/g, '</strong>');

    // convert double newlines to paragraph breaks, single newlines to <br>
    out = out.replace(/\r/g, '');
    out = out.replace(/\n{2,}/g, '</div><div>');
    out = `<div>${out}</div>`;
    out = out.replace(/\n/g, '<br/>');

    return out;
  }

  return (
    <>
      <div id="loader" className="loader">
        <div className="loader-bg"></div>
        <div className="loader-content">
          <div className="mario-cap-container">
            <div className="mario-cap">A</div>
          </div>
          <div className="loader-ui">
            <div className="loader-text-wrap">
              <span className="loader-main-text">INITIALIZING ADVENTURE</span>
              <span className="loader-percentage">0%</span>
            </div>
            <div className="loader-bar-wrap">
              <div className="loader-bar"></div>
            </div>
          </div>
          <div className="loader-sub-status">WORLD_01: ADITYA_TAKHARYA</div>
        </div>
      </div>

      <div className="world-bg">
        <div className="sky-gradient"></div>
        <div className="floating-elements">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="floating-island island-1"></div>
          <div className="floating-island island-2"></div>
        </div>
      </div>

      <nav className="game-nav">
        <div className="nav-container">
          <a href="#hero" className="nav-brand">ADITYA.</a>

          <div className="nav-menu">
            <a href="#projects" className="nav-item">Projects</a>
            <a href="#tech" className="nav-item">Skills</a>
            <a href="#experience" className="nav-item">Experience</a>
          </div>

          <div className="nav-actions">
            <div className="dropdown-wrap" id="desktop-dropdown">
              <button id="links-toggle" className="nintendo-btn pink small">
                <span className="btn-inner">CONNECT ▼</span>
              </button>
              <div id="links-dropdown" className="links-dropdown">
                <a href="https://github.com/adityatakharya" target="_blank" rel="noreferrer" className="dropdown-item">GitHub</a>
                <a href="https://www.linkedin.com/in/aditya-takharya/" target="_blank" rel="noreferrer" className="dropdown-item">LinkedIn</a>
                <a href="https://twitter.com/adityatakharya" target="_blank" rel="noreferrer" className="dropdown-item">Twitter</a>
                <a href="mailto:adityatakharya@gmail.com" className="dropdown-item">Email</a>
              </div>
            </div>

            <button id="hamburger-btn" className="nintendo-btn pink small mobile-menu-btn" aria-label="Open menu">
              <span className="btn-inner">MENU ☰</span>
            </button>
          </div>
        </div>
      </nav>

      <div id="mobile-menu" className="mobile-menu-overlay" aria-hidden="true">
        <button id="mobile-menu-close" className="mobile-close-btn" aria-label="Close menu">✕</button>
        <a href="#projects" className="mobile-nav-item">Projects</a>
        <a href="#tech" className="mobile-nav-item">Stack</a>
        <a href="#experience" className="mobile-nav-item">Experience</a>
        <div className="mobile-menu-divider"></div>
        <a href="https://github.com/adityatakharya" target="_blank" rel="noreferrer" className="mobile-nav-item secondary">GitHub</a>
        <a href="https://www.linkedin.com/in/aditya-takharya/" target="_blank" rel="noreferrer" className="mobile-nav-item secondary">LinkedIn</a>
        <a href="mailto:adityatakharya@gmail.com" className="mobile-nav-item secondary">Email</a>
      </div>


          <section id="hero" className="hero-world">
            <div className="container hero-wrap">
              <div className="hero-float-content">
                <div className="hero-badge">READY FOR DEPLOYMENT</div>
                <h1 className="hero-main-title">
                  <span className="word-reveal">Architecting</span>
                  <span className="word-reveal color-shift">Scalable</span>
                  <span className="word-reveal">Solutions.</span>
                </h1>
                <p className="hero-subtitle">Application Engineer I @ CVENT. Expert in distributed systems, real-time infrastructure, and high-performance full-stack architecture.</p>
                <div className="hero-buttons">
                  <a href="#projects" className="nintendo-btn yellow">
                    <span className="btn-inner">EXPLORE PROJECTS</span>
                  </a>
                  <a href="https://drive.google.com/drive/folders/1G-HPYW4VGTEH2gMwhHEp0faqgiOHq_05?usp=sharing" target="_blank" rel="noreferrer" className="nintendo-btn red">
                    <span className="btn-inner">JUMP TO RESUME</span>
                  </a>
                </div>

                <div className="hero-ai-search">
                  <div className="ai-input-wrap">
                    <input
                      type="text"
                      id="ai-search-input"
                      placeholder="Ask AI about my projects or experience..."
                      aria-label="Ask AI"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button id="ai-search-btn" className="nintendo-btn blue small" onClick={handleSearch} disabled={loading}>
                      <span className="btn-inner">
                        {loading ? 'THINKING...' : 'ASK AI'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="hero-environment">
                <div className="hero-platform">
                  <img src="/assets/images/hero-banner.jpg" alt="Hero" className="hero-img" />
                </div>
                <div className="floating-blocks">
                  <div className="block b-1">?</div>
                  <div className="block b-2"></div>
                  <div className="block b-3"></div>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="world-section projects-world">
            <div className="container">
              <div className="world-header">
                <h2 className="world-title">PROJECT SELECT</h2>
                <p className="world-desc">Deep-dives into my production-grade architectures and engineering challenges.</p>
              </div>

              <div className="world-grid">
                <div className="world-card invoxio-zone" id="invoxio">
                  <div className="zone-visual">
                      <div className="zone-bg"></div>
                      <div className="pixel-icon-wrap">
                        <img src="/assets/images/project-8.png" alt="Invoxio" className="project-thumb" />
                      </div>
                    </div>
                  <div className="zone-info">
                    <span className="zone-label">REAL-TIME MESSAGING APP</span>
                    <h3>Invoxio</h3>
                    <p>Engineered a horizontally scalable real-time messaging core handling 1M+ concurrent users. Implemented event-driven processing via Kafka and distributed state management with Redis.</p>
                    <div className="zone-tech expanded">
                      <span>NEXT.JS</span><span>TYPESCRIPT</span><span>WEBSOCKETS</span><span>KAFKA</span><span>REDIS</span><span>DOCKER</span><span>PYTHON</span><span>FASTAPI</span>
                    </div>
                    <a href="https://invoxio.vercel.app" target="_blank" rel="noreferrer" className="nintendo-btn blue small">
                      <span className="btn-inner">LIVE WEBSITE</span>
                    </a>
                  </div>
                </div>

                <div className="world-card dilemma-zone" id="dilemma">
                  <div className="zone-visual">
                      <div className="zone-bg"></div>
                      <div className="pixel-icon-wrap">
                        <img src="/assets/images/dilemma.png" alt="Dilemma" className="project-thumb" />
                      </div>
                    </div>
                  <div className="zone-info">
                    <span className="zone-label">AI-MODERATED SOCIAL PLATFORM</span>
                    <h3>Dilemma</h3>
                    <p>AI-driven decision platform featuring automated content moderation and high-engagement social loops. Optimized for low-latency AI responses and seamless user interactions.</p>
                    <div className="zone-tech expanded">
                      <span>NEXT.JS 14</span><span>PRISMA</span><span>POSTGRESQL</span><span>AI APIs</span><span>TAILWIND</span><span>NODE.JS</span>
                    </div>
                    <a href="https://dilemmaa.vercel.app" target="_blank" rel="noreferrer" className="nintendo-btn yellow small">
                      <span className="btn-inner">LIVE WEBSITE</span>
                    </a>
                  </div>
                </div>

                <div className="world-card nilam-zone" id="nilam">
                  <div className="zone-visual">
                      <div className="zone-bg"></div>
                      <div className="pixel-icon-wrap">
                        <img src="/assets/images/project-9.png" alt="Nilam3" className="project-thumb" />
                      </div>
                    </div>
                  <div className="zone-info">
                    <span className="zone-label">BLOCKCHAIN-BASED AUCTION</span>
                    <h3>Nilam3</h3>
                    <p>A Web3-integrated auction protocol ensuring immutable digital asset exchange. Leverages smart contracts for trustless bidding and transparent ownership verification.</p>
                    <div className="zone-tech expanded">
                      <span>SOLIDITY</span><span>HARDHAT</span><span>ETHEREUM</span><span>WEB3.JS</span><span>NEXT.JS</span><span>PRISMA</span>
                    </div>
                    <a href="https://nilam3.vercel.app/" target="_blank" rel="noreferrer" className="nintendo-btn cyan small">
                      <span className="btn-inner">LIVE WEBSITE</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="tech" className="world-section tech-world">
            <div className="container">
              <h2 className="world-title text-center">ITEM INVENTORY</h2>
              <p className="world-desc text-center">Comprehensive technical stack curated for high-performance engineering.</p>
              <div className="inventory-grid">
                <div className="inventory-category">
                  <div className="category-header">FRONTEND POWER-UPS</div>
                  <div className="item-grid">
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" width="32" /></div><div className="item-label">Next.js 14</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="32" /></div><div className="item-label">ReactJS</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind" width="32" /></div><div className="item-label">Tailwind</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap" width="32" /></div><div className="item-label">Bootstrap</div></div>
                  </div>
                </div>
                <div className="inventory-category">
                  <div className="category-header">BACKEND ARSENAL</div>
                  <div className="item-grid">
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="32" /></div><div className="item-label">Node.js</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" width="32" /></div><div className="item-label">Express.js</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="32" /></div><div className="item-label">TypeScript</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="32" /></div><div className="item-label">JavaScript</div></div>
                  </div>
                </div>
                <div className="inventory-category">
                  <div className="category-header">DISTRIBUTED INFRA</div>
                  <div className="item-grid">
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg" alt="Kafka" width="32" /></div><div className="item-label">Kafka</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" width="32" /></div><div className="item-label">Redis</div></div>
                    <div className="item-box"><div className="item-icon">🔗</div><div className="item-label">WebSockets</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width="32" /></div><div className="item-label">Docker</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" alt="Kubernetes" width="32" /></div><div className="item-label">Kubernetes</div></div>
                  </div>
                </div>
                <div className="inventory-category">
                  <div className="category-header">DATABASE MASTERY</div>
                  <div className="item-grid">
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="Postgres" width="32" /></div><div className="item-label">Postgres</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="32" /></div><div className="item-label">MongoDB</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/couchbase/couchbase-original.svg" alt="Couchbase" width="32" /></div><div className="item-label">Couchbase</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" width="32" /></div><div className="item-label">MySQL</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" width="32" /></div><div className="item-label">AWS</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub Actions" width="32" /></div><div className="item-label">Actions</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" width="32" /></div><div className="item-label">Git</div></div>
                    <div className="item-box"><div className="item-icon"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" alt="Prisma" width="32" /></div><div className="item-label">Prisma</div></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="experience" className="world-section experience-world">
            <div className="container">
              <h2 className="world-title text-center">ACHIEVEMENTS</h2>
              <div className="stats-board">
                <div className="stat-card work-card">
                  <div className="stat-icon-wrap">
                    <svg className="achievement-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="var(--red)" strokeWidth="2" strokeLinejoin="round" />
                      <rect x="3" y="10" width="18" height="10" rx="2" stroke="var(--red)" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h4>Application Engineer I</h4>
                    <p className="stat-sub">CVENT | Jan 2025 - Present</p>
                    <ul className="stat-list">
                      <li><strong>2 Rockstar Awards:</strong> Recognized for identifying critical bugs and delivering production-ready code-level fixes.</li>
                      <li><strong>1 POB Award:</strong> Developed a critical data recovery solution restoring 80,000+ database records.</li>
                      <li>Consistently reduced resolution time for high-priority client escalations.</li>
                    </ul>
                  </div>
                </div>
                <div className="stat-card edu-card">
                  <div className="stat-icon-wrap">
                    <svg className="achievement-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 10L12 5L2 10L12 15L22 10Z" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 12V17C6 17 8 20 12 20C16 20 18 17 18 17V12" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h4>B.Tech Information Technology</h4>
                    <p className="stat-sub">GGSIPU | 2021 - 2025 | GPA: 9.0</p>
                    <ul className="stat-list">
                      <li><strong>University Rank:</strong> Achieved Top 3 rank in a semester examination across the entire University.</li>
                      <li><strong>Project Nilam3:</strong> Engineered a decentralized auction protocol (Web3) as a core academic project.</li>
                      <li>Mastered distributed systems and full-stack development through rigorous coursework.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="connect" className="world-section cta-world">
            <div className="container text-center">
              <div className="cta-box">
                <div className="hero-badge">READY FOR PLAYER 2</div>
                <h2 className="world-title text-center">START A MISSION TOGETHER</h2>
                <p className="world-desc text-center">Looking for a high-performance engineer to join your team or project? Let's connect.</p>
                <div className="cta-buttons">
                  <a href="https://www.linkedin.com/in/aditya-takharya/" target="_blank" rel="noreferrer" className="nintendo-btn blue">
                    <span className="btn-inner">LINKEDIN CONNECT</span>
                  </a>
                  <a href="mailto:adityatakharya@gmail.com" className="nintendo-btn pink">
                    <span className="btn-inner">SEND AN EMAIL</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <footer className="game-footer">
            <div className="container">
              <div className="footer-simple">
                <p className="footer-brand">ADITYA TAKHARYA.</p>
                <p className="footer-msg">BUILT WITH PRECISION & PLAYFULNESS. 2025.</p>
              </div>
            </div>
          </footer>

      <div id="game-cursor" className="game-cursor">
        <div className="cursor-inner"></div>
      </div>

      {isModalOpen && (
        <div className="ai-modal-overlay" onClick={closeModal} data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()}>
          <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="ai-modal-title">
                {loading && (
                  <div className="ai-loader" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="pixel-spinner"></div>
                    <span>SEARCHING PORTFOLIO...</span>
                  </div>
                )}
                {!loading && (
                  <span>AI INSIGHT</span>
                )}
              </div>
              <button className="ai-modal-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <div className="ai-modal-body" data-lenis-prevent="true">
              {response && (
                <div
                  className="ai-response-text"
                  dangerouslySetInnerHTML={{ __html: renderAIResponse(response) }}
                />
              )}
              {error && <div className="ai-response-text" style={{ color: error.includes('⏳') ? 'var(--dark)' : 'red' }}>{error}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
