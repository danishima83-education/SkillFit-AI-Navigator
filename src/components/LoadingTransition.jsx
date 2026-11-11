import { useState, useEffect } from 'react';

const STEPS = [
  'Deconstructing everyday task descriptions into core functional workflows...',
  'Extracting your unique human judgment and interpersonal superpowers...',
  'Mapping transferable skills against O*NET occupational clusters...',
  'Curating verified free/low-cost AI tools (Whisper, Claude, ChatGPT, Gemini)...',
  'Drafting copy-paste action prompts for immediate interview and resume prep...',
  'Connecting to Unsplash API for high-resolution workplace imagery...',
];

export default function LoadingTransition() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 850);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-card" role="status" aria-live="polite">
      <div className="loading-pulse-ring">
        <span className="loading-pulse-icon">⚡</span>
      </div>

      <h3 className="loading-title">Navigating Career Directions</h3>
      <p className="loading-subtitle">Gemini 3.8 Flash is analyzing your real-world workplace experience...</p>

      <div className="progress-track">
        <div
          className="progress-bar"
          style={{ width: `${Math.round(((currentStep + 1) / STEPS.length) * 100)}%` }}
        />
      </div>

      <p className="current-step-label">
        <span className="step-count">Step {currentStep + 1} of {STEPS.length}:</span>{' '}
        {STEPS[currentStep]}
      </p>
    </div>
  );
}
