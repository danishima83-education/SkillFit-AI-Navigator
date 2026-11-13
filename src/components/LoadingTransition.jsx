import { useState, useEffect } from 'react';

const INITIAL_STEPS = [
  'Deconstructing everyday task descriptions into core functional workflows...',
  'Extracting your unique human judgment and interpersonal superpowers...',
  'Mapping transferable skills against O*NET occupational clusters...',
  'Curating verified free/low-cost AI tools (Whisper, Claude, ChatGPT, Gemini)...',
  'Connecting to Unsplash API for high-resolution workplace imagery...',
];

const ONGOING_THOUGHTS = [
  'Gemini 3.5 Flash-Lite is drafting your personalized Resume Translation prompt...',
  'Formulating Interview Advantage talking points to prove your Human Edge...',
  'Assembling your Day-1 AI Toolkit onboarding workflow...',
  'Polishing your 3 custom career directions...',
];

export default function LoadingTransition() {
  const [stepIndex, setStepIndex] = useState(0);
  const [ongoingIndex, setOngoingIndex] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < INITIAL_STEPS.length) return prev + 1;
        return prev;
      });
    }, 900);

    const thoughtTimer = setInterval(() => {
      setOngoingIndex((prev) => (prev + 1) % ONGOING_THOUGHTS.length);
    }, 2200);

    return () => {
      clearInterval(stepTimer);
      clearInterval(thoughtTimer);
    };
  }, []);

  const isDeepThinking = stepIndex >= INITIAL_STEPS.length;
  const progressPercent = isDeepThinking ? 92 : Math.round(((stepIndex + 1) / (INITIAL_STEPS.length + 1)) * 100);

  return (
    <div className="loading-card" role="status" aria-live="polite">
      <div className="loading-pulse-ring">
        <span className="loading-pulse-icon">⚡</span>
      </div>

      <h3 className="loading-title">Navigating Career Directions</h3>
      <p className="loading-subtitle">AI workforce model is synthesizing your real-world experience...</p>

      <div className="progress-track">
        <div
          className={`progress-bar ${isDeepThinking ? 'progress-pulse' : ''}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="current-step-label">
        {!isDeepThinking ? (
          <>
            <span className="step-count">Step {stepIndex + 1} of {INITIAL_STEPS.length}:</span>{' '}
            {INITIAL_STEPS[stepIndex]}
          </>
        ) : (
          <>
            <span className="step-count">Deep Synthesis:</span>{' '}
            {ONGOING_THOUGHTS[ongoingIndex]}
          </>
        )}
      </p>
    </div>
  );
}
