import { useState } from 'react';

const MARCUS_SAMPLE = {
  currentRole: 'Medical Receptionist & Clinic Coordinator',
  dailyTasks: 'Check in anxious patients, answer frantic phone queues, calm down angry billing disputes, juggle doctor schedules on paper, coordinate urgent walk-ins with nurses.',
  superpowers: 'Staying calm when patients are scared or furious, remembering patient family names, spotting scheduling bottlenecks before they blow up.',
  drainers: 'Entering insurance codes manually into the computer, making 40 repetitive appointment confirmation calls every afternoon.',
  workPreference: 'Hybrid',
  techComfort: 'Everyday user',
};

export default function QuestionnaireIntake({ initialValues, onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    currentRole: initialValues?.currentRole || '',
    dailyTasks: initialValues?.dailyTasks || '',
    superpowers: initialValues?.superpowers || '',
    drainers: initialValues?.drainers || '',
    workPreference: initialValues?.workPreference || 'Hybrid',
    techComfort: initialValues?.techComfort || 'Everyday user',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError('');
  };

  const handleLoadMarcus = () => {
    setFormData(MARCUS_SAMPLE);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.currentRole.trim()) {
      setValidationError('Please tell us your current or recent job title.');
      return;
    }
    if (!formData.dailyTasks.trim() || formData.dailyTasks.trim().length < 5) {
      setValidationError('Please describe at least one or two daily tasks you do.');
      return;
    }
    setValidationError('');
    onSubmit(formData);
  };

  return (
    <section className="intake-section">
      <div className="intake-header">
        <div className="intake-title-group">
          <h2>5-Minute Career Navigator</h2>
          <p>Tell us what you actually do all day. No tech buzzwords needed—honest, messy descriptions work best.</p>
        </div>
        <button
          type="button"
          className="demo-case-btn"
          onClick={handleLoadMarcus}
          title="Pre-fill with Marcus (Medical Receptionist, New York) to test instantly"
        >
          ⚡ Load Marcus Persona (Demo)
        </button>
      </div>

      {(validationError || error) && (
        <div className="alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{validationError || error}</span>
        </div>
      )}

      <form className="intake-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentRole">
            <span className="question-number">1</span>
            What is your current or most recent job title?
          </label>
          <input
            id="currentRole"
            name="currentRole"
            type="text"
            className="form-input"
            placeholder="e.g., Medical Receptionist, Retail Associate, Front Desk Coordinator, Call Center Agent"
            value={formData.currentRole}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dailyTasks">
            <span className="question-number">2</span>
            What chaotic, messy tasks do you handle on a typical day?
            <span className="label-hint">List the real work: dealing with upset customers, messy schedules, fixing errors, tracking down info.</span>
          </label>
          <textarea
            id="dailyTasks"
            name="dailyTasks"
            rows={3}
            className="form-textarea"
            placeholder="e.g., Checking in walk-in patients, de-escalating billing arguments, answering phones constantly, scheduling appointments across 4 doctors..."
            value={formData.dailyTasks}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="superpowers">
            <span className="question-number">3</span>
            What are you naturally good at with people or tricky situations?
            <span className="label-hint">Your human superpowers: staying calm under pressure, making people feel heard, organizing chaos.</span>
          </label>
          <textarea
            id="superpowers"
            name="superpowers"
            rows={2}
            className="form-textarea"
            placeholder="e.g., Keeping people calm when they are angry, remembering names, untangling messy schedules..."
            value={formData.superpowers}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="drainers">
            <span className="question-number">4</span>
            What repetitive busywork drains your energy the most?
            <span className="label-hint">The boring rote tasks that feel like a robot should be doing them instead of you.</span>
          </label>
          <textarea
            id="drainers"
            name="drainers"
            rows={2}
            className="form-textarea"
            placeholder="e.g., Typing the same insurance codes over and over, calling 30 people to confirm appointments..."
            value={formData.drainers}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-row-grid">
          <div className="form-group">
            <label htmlFor="workPreference">
              <span className="question-number">5a</span>
              Preferred Work Environment
            </label>
            <select
              id="workPreference"
              name="workPreference"
              className="form-select"
              value={formData.workPreference}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="Hybrid">Hybrid (In-Office + Remote)</option>
              <option value="In-Person">In-Person Only</option>
              <option value="Fully Remote">Fully Remote</option>
              <option value="Any">Flexible / Any</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="techComfort">
              <span className="question-number">5b</span>
              Technology Comfort Level
            </label>
            <select
              id="techComfort"
              name="techComfort"
              className="form-select"
              value={formData.techComfort}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="Everyday user">Everyday User (Email, Google, Office)</option>
              <option value="Beginner">Beginner (Prefer simple, step-by-step tools)</option>
              <option value="Curious & adventurous">Tech Curious (Love experimenting with new apps)</option>
              <option value="Power user / Tech nerd">Power User / Tech Nerd (Comfortable with prompts, settings & code)</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-content">
                <span className="spinner" aria-hidden="true" />
                Navigating AI Opportunities...
              </span>
            ) : (
              <span className="btn-content">
                Map My 3 AI-Augmented Career Directions ➔
              </span>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
