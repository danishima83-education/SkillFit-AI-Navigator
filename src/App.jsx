import { useState, useEffect } from 'react';
import { api } from './api.js';
import ProjectHeader from './components/ProjectHeader.jsx';
import QuestionnaireIntake from './components/QuestionnaireIntake.jsx';
import LoadingTransition from './components/LoadingTransition.jsx';
import RoleDeck from './components/RoleDeck.jsx';

export default function App() {
  const [health, setHealth] = useState(null);
  const [stage, setStage] = useState('intake'); // 'intake' | 'loading' | 'results'
  const [formData, setFormData] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.health()
      .then(setHealth)
      .catch(() => setHealth({ ok: false, ai: 'mock' }));
  }, []);

  const handleSubmitIntake = async (data) => {
    setFormData(data);
    setStage('loading');
    setError(null);

    try {
      const response = await api.navigate(data);
      if (response?.ok && response?.data) {
        setResults(response.data);
        setStage('results');
        window.scrollTo({ top: 380, behavior: 'smooth' });
      } else {
        throw new Error(response?.error || 'Could not map career directions. Please try again.');
      }
    } catch (err) {
      console.error('[navigate-error]', err);
      setError(err.message || 'Unable to connect to AI Navigator. Please check your connection or try again.');
      setStage('intake');
    }
  };

  const handleAdjustFocus = () => {
    setStage('intake');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleStartOver = () => {
    setFormData(null);
    setResults(null);
    setError(null);
    setStage('intake');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ProjectHeader health={health} />
      <main className="app-container">
        {stage === 'intake' && (
          <QuestionnaireIntake
            initialValues={formData}
            onSubmit={handleSubmitIntake}
            isLoading={false}
            error={error}
          />
        )}

        {stage === 'loading' && <LoadingTransition />}

        {stage === 'results' && results && (
          <RoleDeck
            results={results}
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
