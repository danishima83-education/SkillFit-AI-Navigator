import RoleCard from './RoleCard.jsx';

export default function RoleDeck({ results, inputProfile, contingencyNotice, onAdjustFocus, onStartOver }) {
  const summary = results?.summary || '';
  const transferableSkills = Array.isArray(results?.transferableSkills) ? results.transferableSkills : [];
  const roles = Array.isArray(results?.roles) ? results.roles.filter(Boolean) : [];

  const handleExportRoadmap = () => {
    const lines = [
      '=================================================================',
      'SKILLFIT AI NAVIGATOR — CAREER ROADMAP & ACTION PROMPTS',
      'Team AIisMyFriend · Built for CodeSquad AI Community Sprint',
      '=================================================================',
      '',
      'SUMMARY & TRANSFERABLE STRENGTHS:',
      summary,
      '',
      'TRANSFERABLE COMPETENCIES:',
      ...transferableSkills.map((s) => `  ★ ${s}`),
      '',
      '=================================================================',
      '3 AI-AUGMENTED CAREER DIRECTIONS',
      '=================================================================',
      '',
    ];

    roles.forEach((r, idx) => {
      const tasks = Array.isArray(r.keyTasks) ? r.keyTasks : [];
      const tools = Array.isArray(r.aiTools) ? r.aiTools : [];
      lines.push(
        `[DIRECTION ${idx + 1}] ${r.roleTitle || 'Career Direction'}`,
        `O*NET Classification: ${r.onetCluster || 'N/A'}`,
        `Summary: ${r.summary || ''}`,
        '',
        'Daily Workflows:',
        ...tasks.map((t) => `  - ${t}`),
        '',
        'Your Human Edge (Why AI Cannot Replace You):',
        `  ${r.humanEdge || ''}`,
        '',
        'Verified Free AI Toolkit:',
        ...tools.map((t) => `  - ${t?.name || 'AI Tool'} (${t?.freeTier || 'Free'}): ${t?.useCase || ''}`),
        '',
        'READY-TO-USE ACTION PROMPT (Paste into ChatGPT / Claude):',
        '-----------------------------------------------------------------',
        r.starterPrompt || '',
        '-----------------------------------------------------------------',
        '',
        '-----------------------------------------------------------------',
        ''
      );
    });

    lines.push(
      'Exported from SkillFit AI Navigator on ' + new Date().toLocaleDateString(),
      '100% Ephemeral Session Memory · Zero Personal Data Saved on Servers'
    );

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillFit-Career-Roadmap-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="results-section">
      {contingencyNotice && (
        <div className="contingency-banner" role="status">
          <span aria-hidden="true">ℹ️</span>
          <span>{contingencyNotice}</span>
        </div>
      )}

      <div className="results-header-banner">
        <div className="banner-top-row">
          <span className="results-badge">⚡ Career Direction Analysis</span>
          <div className="deck-actions-top">
            <button type="button" className="action-btn-primary" onClick={handleExportRoadmap} title="Download clean text roadmap of your 3 directions">
              📥 Export Roadmap (.txt)
            </button>
            <button type="button" className="action-btn-outline" onClick={onAdjustFocus}>
              ✏️ Adjust My Focus
            </button>
            <button type="button" className="action-btn-subtle" onClick={onStartOver}>
              ↺ Start Over
            </button>
          </div>
        </div>

        {inputProfile?.currentRole && (
          <div className="profile-context-anchor" aria-label="Analyzed profile context">
            <span className="anchor-label">Diagnosis Based On:</span>
            <span className="anchor-pill">💼 {inputProfile.currentRole}</span>
            <span className="anchor-pill">⚙️ {inputProfile.techComfort || 'Everyday user'}</span>
            <span className="anchor-pill">📍 {inputProfile.workPreference || 'Hybrid'}</span>
          </div>
        )}

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
