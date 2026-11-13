import { project } from '../../shared/project.config.js';

function formatModelLabel(modelId) {
  if (!modelId) return 'Gemini 3.5 Flash-Lite';
  return modelId
    .split('-')
    .map((part) => (part === 'flash' ? 'Flash' : part === 'lite' ? 'Lite' : part === 'gemini' ? 'Gemini' : part))
    .join(' ')
    .replace('Flash Lite', 'Flash-Lite');
}

export default function ProjectHeader({ health, onLogoClick }) {
  const isAiLive = health?.ai === 'live';
  const modelLabel = formatModelLabel(health?.model);

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
              {isAiLive ? `${modelLabel} (Live)` : 'Mock Mode'}
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
