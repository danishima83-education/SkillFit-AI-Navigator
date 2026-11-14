import { Component, useState, useEffect, useRef } from 'react';
import { api } from './api.js';
import ProjectHeader from './components/ProjectHeader.jsx';
import HeroSection from './components/HeroSection.jsx';
import QuestionnaireIntake from './components/QuestionnaireIntake.jsx';
import LoadingTransition from './components/LoadingTransition.jsx';
import RoleDeck from './components/RoleDeck.jsx';
import { MARCUS_GOLDEN_MASTER } from './data/marcusProfile.js';

class DeckErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.error('[role-deck-render-error]', err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="hero-alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>Unable to render generated career directions cleanly. Please start over and try again.</span>
          <button
            type="button"
            className="action-btn-outline"
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset?.();
            }}
          >
            ↺ Start Over
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [stage, setStage] = useState('hero'); // 'hero' | 'intake' | 'loading' | 'results'
  const [sourceStage, setSourceStage] = useState('hero');
  const [formData, setFormData] = useState(null);
  const [results, setResults] = useState(null);
  const [contingencyNotice, setContingencyNotice] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    api.health()
      .then(setHealth)
      .catch(() => setHealth({ ok: false, ai: 'mock' }));
  }, []);

  const cancelInflightNavigation = () => {
    requestIdRef.current += 1;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    submittingRef.current = false;
    setIsSubmitting(false);
  };

  const executeNavigation = async (data, invokedFrom) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    const reqId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSubmitting(true);
    setSourceStage(invokedFrom);
    setFormData(data);
    setStage('loading');
    setError(null);
    setContingencyNotice(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await api.navigate(data, { signal: controller.signal });
      if (reqId !== requestIdRef.current || controller.signal.aborted) return;

      if (response?.ok && response?.data) {
        if (response.isFallback) {
          setContingencyNotice('Live AI timed out or returned an incomplete format. Showing cached reference directions instead.');
        } else if (response.mode === 'mock') {
          setContingencyNotice('Running in deterministic Mock Mode (no active live Gemini key). Showing sample career directions.');
        }
        setResults(response.data);
        setStage('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(response?.error || 'Could not map career directions. Please try again.');
      }
    } catch (err) {
      if (reqId !== requestIdRef.current || controller.signal.aborted || err?.name === 'AbortError') {
        return;
      }
      console.error('[navigate-error]', err);

      // EGM TRIZ Circuit Breaker: If 1-Click Demo fails at network/HTTP layer, hydrate Golden Master cushion
      if (invokedFrom === 'hero') {
        console.warn('[EGM Circuit Breaker] Hydrating Marcus Golden Master contingency result.');
        setContingencyNotice('Live API connection failed during quick demo. Showing verified Golden Master directions for Marcus.');
        setResults(MARCUS_GOLDEN_MASTER);
        setStage('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(err.message || 'Unable to connect to AI Navigator. Please check your connection or try again.');
        setStage('intake');
      }
    } finally {
      if (reqId === requestIdRef.current) {
        abortControllerRef.current = null;
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    }
  };

  const handleStartIntake = () => {
    setError(null);
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
    cancelInflightNavigation();
    setError(null);
    setStage('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdjustFocus = () => {
    setError(null);
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
    cancelInflightNavigation();
    setFormData(null);
    setResults(null);
    setContingencyNotice(null);
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
          <DeckErrorBoundary onReset={handleStartOver}>
            <RoleDeck
              results={results}
              inputProfile={formData}
              contingencyNotice={contingencyNotice}
              onAdjustFocus={handleAdjustFocus}
              onStartOver={handleStartOver}
            />
          </DeckErrorBoundary>
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
