import { useState } from 'react';
import { project } from '../../shared/project.config.js';
import { MARCUS_SAMPLE } from '../data/marcusProfile.js';

export default function HeroSection({ onStartIntake, onQuickDemo, isSubmitting, error }) {
  const [isHoveringTeaser, setIsHoveringTeaser] = useState(false);

  const handleDemoClick = () => {
    if (isSubmitting) return;
    onQuickDemo(MARCUS_SAMPLE);
  };

  return (
    <section className="hero-stage" aria-labelledby="hero-title">
      <div className="hero-mesh-background" aria-hidden="true" />

      {error && (
        <div className="hero-alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="hero-grid">
        {/* Left Column: Monumental Copy & CTAs */}
        <div className="hero-content">
          <div className="hero-eyebrow-pill">
            <span className="pulse-dot" aria-hidden="true" />
            <span>AI WORKFORCE TRANSLATION ENGINE · CODESQUAD 2026</span>
          </div>

          <h1 id="hero-title" className="hero-title-monumental">
            Stop Fearing Replacement.<br />
            <span className="gradient-brand-text">Start Steering the Tools.</span>
          </h1>

          <p className="hero-lead-text">
            Translate your messy, everyday frontline work experience into <strong>3 realistic, AI-augmented career directions</strong> backed by verified free tools and copy-paste action prompts in under 5 minutes.
          </p>

          <div className="hero-cta-cluster">
            <button
              type="button"
              className="btn-primary-hero"
              onClick={onStartIntake}
              disabled={isSubmitting}
            >
              <span>Mapear Mis Habilidades</span>
              <span className="btn-arrow" aria-hidden="true">➔</span>
            </button>

            <button
              type="button"
              className="btn-instant-demo"
              onClick={handleDemoClick}
              disabled={isSubmitting}
              title="Carga el perfil de Marcus (Recepcionista Médico) y ejecuta la síntesis de IA en 1 clic"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-inline" aria-hidden="true" />
                  <span>Sintetizando con Gemini 3.8...</span>
                </>
              ) : (
                <>
                  <span className="demo-lightning" aria-hidden="true">⚡</span>
                  <span>Probar Perfil de Marcus (Demo 1-Click)</span>
                </>
              )}
            </button>
          </div>

          <div className="hero-feature-tags">
            <div className="feature-tag">
              <span className="tag-icon">🎯</span>
              <span><strong>O*NET 2026</strong> Taxonomy Match</span>
            </div>
            <div className="feature-tag">
              <span className="tag-icon">⚡</span>
              <span><strong>Gemini 3.8 Flash</strong> Synthesis</span>
            </div>
            <div className="feature-tag">
              <span className="tag-icon">🔒</span>
              <span><strong>100% Ephemeral</strong> Zero-DB Privacy</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Perspective Visual Teaser (Pure CSS Abstract Skeleton) */}
        <div className="hero-visual-stage">
          <div
            className={`perspective-card-wrapper ${isHoveringTeaser ? 'card-hovered' : ''}`}
            onMouseEnter={() => setIsHoveringTeaser(true)}
            onMouseLeave={() => setIsHoveringTeaser(false)}
            aria-label="Vista previa interactiva de la tarjeta de roles"
          >
            <div className="teaser-card-halo" aria-hidden="true" />

            <div className="perspective-card">
              <div className="card-glass-header">
                <div className="card-window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="card-preview-badge">SÍNTESIS GENERADA · 3 ROLES</span>
              </div>

              <div className="card-preview-body">
                <div className="preview-role-header">
                  <div className="role-avatar-skeleton">🩺</div>
                  <div className="role-title-group">
                    <span className="role-badge-pill">O*NET 43-4171.00</span>
                    <h3 className="role-preview-name">AI-Augmented Patient Intake Coordinator</h3>
                  </div>
                </div>

                <div className="role-preview-workflows">
                  <div className="workflow-item">
                    <span className="workflow-check">✓</span>
                    <span>Triage clínico de pacientes con asistencia de voz</span>
                  </div>
                  <div className="workflow-item">
                    <span className="workflow-check">✓</span>
                    <span>Transcripción EHR con Whisper + SOAP formatting</span>
                  </div>
                </div>

                <div className="role-preview-tools">
                  <span className="tool-chip">⚡ OpenAI Whisper Free</span>
                  <span className="tool-chip">✦ ChatGPT Free</span>
                </div>

                <div className="role-preview-footer">
                  <div className="human-edge-preview">
                    <span className="edge-spark">★</span>
                    <span><strong>Human Edge:</strong> Empatía real ante pacientes en crisis</span>
                  </div>
                </div>
              </div>

              <div className="teaser-interactive-overlay">
                <span className="teaser-hint-text">Vista previa de Diagnóstico · Clic en Demo para ver los 3 roles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-bottom-ticker">
        <div className="ticker-label">AUDIENCIA OBJETIVO:</div>
        <div className="ticker-text">{project.targetUser}</div>
        <div className="ticker-badge">AIISMYFRIEND · DANILO ANDIEL</div>
      </div>
    </section>
  );
}
