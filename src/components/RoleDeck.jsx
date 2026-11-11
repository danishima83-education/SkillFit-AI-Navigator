import RoleCard from './RoleCard.jsx';

export default function RoleDeck({ results, onAdjustFocus, onStartOver }) {
  const { summary, transferableSkills, roles } = results;

  return (
    <section className="results-section">
      <div className="results-header-banner">
        <div className="banner-top-row">
          <span className="results-badge">⚡ Career Direction Analysis</span>
          <div className="deck-actions-top">
            <button type="button" className="action-btn-outline" onClick={onAdjustFocus}>
              ✏️ Adjust My Focus
            </button>
            <button type="button" className="action-btn-subtle" onClick={onStartOver}>
              ↺ Start Over
            </button>
          </div>
        </div>

        <h2 className="results-headline">3 Realistic AI-Augmented Career Paths</h2>
        <p className="results-summary">{summary}</p>

        {transferableSkills && transferableSkills.length > 0 && (
          <div className="skills-cluster">
            <span className="skills-cluster-label">Validated Transferable Competencies:</span>
            <div className="skill-pills">
              {transferableSkills.map((skill, i) => (
                <span key={i} className="skill-pill-tag">
                  ★ {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="cards-grid">
        {roles.map((role, index) => (
          <RoleCard key={role.id || index} role={role} index={index} />
        ))}
      </div>

      <div className="results-footer-bar">
        <div className="footer-bar-inner">
          <div className="footer-bar-text">
            <strong>Next Step:</strong> Pick one direction above, copy its Action Prompt, and paste it into ChatGPT or Claude to draft 3 high-impact resume bullet points.
          </div>
          <div className="footer-bar-buttons">
            <button type="button" className="action-btn-outline" onClick={onAdjustFocus}>
              ✏️ Adjust My Focus
            </button>
            <button type="button" className="action-btn-primary" onClick={onStartOver}>
              ↺ Explore Another Job
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
