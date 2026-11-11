import { project } from '../../shared/project.config.js';

export default function ProjectHeader({ health }) {
  const isAiLive = health?.ai === 'live';

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="brand">
          <span className="brand-logo" aria-hidden="true">⚡</span>
          <span className="brand-title">{project.appName}</span>
          <span className="team-badge">{project.teamName}</span>
        </div>
        <div className="status-cluster" aria-label="System status">
          <span className={`status-pill ${isAiLive ? 'status-live' : 'status-mock'}`}>
            <span className="status-dot" aria-hidden="true" />
            {isAiLive ? `Gemini 3.8 Flash (Live)` : `Mock Mode`}
          </span>
          <span className="status-pill status-secure">
            <span className="status-dot" aria-hidden="true" />
            Session Memory (100% Private)
          </span>
        </div>
      </div>

      <div className="hero-banner">
        <p className="hero-eyebrow">WORKFORCE AI TRANSLATION ENGINE · CODESQUAD 2026</p>
        <h1 className="hero-headline">
          Stop Fearing Replacement.<br />
          <span className="gradient-text">Start Steering the Tools.</span>
        </h1>
        <p className="hero-subline">
          Translate your messy, everyday frontline work experience into 3 realistic, AI-augmented career directions
          backed by verified free tools and copy-paste action prompts in under 5 minutes.
        </p>

        <div className="hero-meta">
          <span className="meta-item">
            <strong>Target User:</strong> {project.targetUser}
          </span>
          <span className="meta-separator">·</span>
          <span className="meta-item">
            <strong>Author:</strong> Danilo Andiel
          </span>
          <span className="meta-separator">·</span>
          <span className="meta-item">
            <strong>Runtime:</strong> Zero Database Overhead
          </span>
        </div>
      </div>
    </header>
  );
}
