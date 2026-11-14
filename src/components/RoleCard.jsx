import { useState } from 'react';

export default function RoleCard({ role, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    const promptText = role?.starterPrompt || '';
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = promptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const photoUrl = role?.photo?.url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1080&q=80';
  const photographer = role?.photo?.photographer || 'Unsplash';
  const keyTasks = Array.isArray(role?.keyTasks) ? role.keyTasks : [];
  const aiTools = Array.isArray(role?.aiTools) ? role.aiTools : [];

  return (
    <article className="role-card">
      <div className="card-media">
        <img
          src={photoUrl}
          alt={role?.photo?.alt || role?.roleTitle || 'Career direction workspace'}
          className="card-image"
          loading="lazy"
        />
        <div className="card-badge-row">
          <span className="card-index-badge">Direction #{index + 1}</span>
          <span className="photo-credit">Photo by {photographer}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-header-group">
          <span className="onet-cluster">{role?.onetCluster || 'AI-Augmented Career Direction'}</span>
          <h3 className="role-title">{role?.roleTitle || 'Career Direction'}</h3>
          <p className="role-summary">{role?.summary || ''}</p>
        </div>

        <div className="card-section">
          <h4 className="section-label">Key Daily Workflows</h4>
          <ul className="tasks-list">
            {keyTasks.map((task, i) => (
              <li key={i} className="task-item">
                <span className="task-bullet">✓</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-section human-edge-box">
          <div className="human-edge-header">
            <span className="human-icon">🛡️</span>
            <h4 className="human-edge-title">Your Human Edge (Why AI Can't Replace You)</h4>
          </div>
          <p className="human-edge-text">{role?.humanEdge || ''}</p>
        </div>

        <div className="card-section">
          <h4 className="section-label">Verified Free AI Toolkit</h4>
          <div className="tools-grid">
            {aiTools.map((tool, i) => (
              <div key={i} className="tool-card">
                <div className="tool-top">
                  <span className="tool-name">{tool?.name || 'AI Tool'}</span>
                  <span className="tool-free-tier">{tool?.freeTier || 'Free tier'}</span>
                </div>
                <p className="tool-usecase">{tool?.useCase || ''}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-section prompt-box">
          <div className="prompt-header">
            <span className="prompt-label">Ready-to-Use Action Prompt</span>
            <button
              type="button"
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyPrompt}
              title="Copy to clipboard to use on ChatGPT, Claude or Gemini"
            >
              {copied ? '✓ Copied!' : '📋 Copy Prompt'}
            </button>
          </div>
          <pre className="prompt-code">
            <code>{role.starterPrompt}</code>
          </pre>
          <p className="prompt-hint">Paste into ChatGPT, Claude, or Gemini to immediately draft resume bullets or prep for interviews.</p>
        </div>
      </div>
    </article>
  );
}
