import { project } from '../../shared/project.config.js';

export default function ProjectHeader({ health, onLogoClick }) {
  const isAiLive = health?.ai === 'live';

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-top">
          <button
            type="button"
            className="brand brand-btn"
            onClick={onLogoClick}
            title={`${project.appName} — Back to Home`}
          >
            <span className="brand-logo" aria-hidden="true">⚡</span>
            <span className="brand-title">{project.appName}</span>
            <span className="team-badge">{project.teamName}</span>
          </button>

          <div className="status-cluster" aria-label="System status">
            <span className={`status-pill ${isAiLive ? 'status-live' : 'status-mock'}`}>
              <span className="status-dot" aria-hidden="true" />
              {isAiLive ? 'Gemini 3.8 Flash (Live)' : 'Mock Mode'}
            </span>
            <span className="status-pill status-secure">
              <span className="status-dot" aria-hidden="true" />
              Session Memory (100% Private)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
