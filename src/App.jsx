import { useState, useEffect } from 'react';
import { api } from './api.js';
import ProjectHeader from './components/ProjectHeader.jsx';
import HeroSection from './components/HeroSection.jsx';
import QuestionnaireIntake from './components/QuestionnaireIntake.jsx';
import LoadingTransition from './components/LoadingTransition.jsx';
import RoleDeck from './components/RoleDeck.jsx';
import { MARCUS_GOLDEN_MASTER } from './data/marcusProfile.js';

export default function App() {
  const [health, setHealth] = useState(null);
  const [stage, setStage] = useState('hero'); // 'hero' | 'intake' | 'loading' | 'results'
  const [sourceStage, setSourceStage] = useState('hero');
  const [formData, setFormData] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.health()
      .then(setHealth)
      .catch(() => setHealth({ ok: false, ai: 'mock' }));
  }, []);

  const executeNavigation = async (data, invokedFrom) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSourceStage(invokedFrom);
    setFormData(data);
    setStage('loading');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await api.navigate(data);
      if (response?.ok && response?.data) {
        setResults(response.data);
        setStage('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(response?.error || 'Could not map career directions. Please try again.');
      }
    } catch (err) {
      console.error('[navigate-error]', err);

      // EGM TRIZ Circuit Breaker: If 1-Click Demo failed due to rate limit/network, hydrate Golden Master cushion
      if (invokedFrom === 'hero') {
        console.warn('[EGM Circuit Breaker] Hydrating Marcus Golden Master contingency result.');
        setResults(MARCUS_GOLDEN_MASTER);
        setStage('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(err.message || 'Unable to connect to AI Navigator. Please check your connection or try again.');
        setStage('intake');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartIntake = () => {
    setStage('intake');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickDemo = (sample) => {
    executeNavigation(sample, 'hero');
  };

  const handleSubmitIntake = (data) => {
    executeNavigation(data, 'intake');
  };

  const handleLogoClick = () => {
    setStage('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdjustFocus = () => {
    setStage('intake');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewExistingResults = () => {
    if (results) {
      setStage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartOver = () => {
    setFormData(null);
    setResults(null);
    setError(null);
    setStage('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ProjectHeader health={health} onLogoClick={handleLogoClick} />

      <main className="app-container">
        {stage === 'hero' && (
          <HeroSection
            onStartIntake={handleStartIntake}
            onQuickDemo={handleQuickDemo}
            isSubmitting={isSubmitting}
            error={sourceStage === 'hero' ? error : null}
          />
        )}

        {stage === 'intake' && (
          <QuestionnaireIntake
            initialValues={formData}
            onSubmit={handleSubmitIntake}
            onBackToHero={handleLogoClick}
            onViewExistingResults={handleViewExistingResults}
            hasExistingResults={Boolean(results)}
            isLoading={isSubmitting}
            error={sourceStage === 'intake' ? error : null}
          />
        )}

        {stage === 'loading' && <LoadingTransition />}

        {stage === 'results' && results && (
          <RoleDeck
            results={results}
            inputProfile={formData}
            onAdjustFocus={handleAdjustFocus}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>
          SkillFit AI Navigator · Built for the CodeSquad AI Community Sprint by Danilo Andiel (Team AIisMyFriend).
          <br />
          100% Ephemeral Session Memory · Zero database overhead · Your work descriptions are never saved or sold.
        </p>
      </footer>
    </>
  );
}
