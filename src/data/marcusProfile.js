/**
 * Canonical Marcus Vance Profile & Golden Master Fixture
 * Single Source of Truth for Demo Day & EGM Architecture
 */

export const MARCUS_SAMPLE = {
  currentRole: 'Medical Receptionist & Clinic Coordinator',
  dailyTasks: 'Check in anxious patients, answer frantic phone queues, calm down angry billing disputes, juggle doctor schedules on paper, coordinate urgent walk-ins with nurses.',
  superpowers: 'Staying calm when patients are scared or furious, remembering patient family names, spotting scheduling bottlenecks before they blow up.',
  drainers: 'Entering insurance codes manually into the computer, making 40 repetitive appointment confirmation calls every afternoon.',
  workPreference: 'Hybrid',
  techComfort: 'Everyday user',
};

export const MARCUS_GOLDEN_MASTER = {
  summary: 'Your frontline experience balancing patient triage, frantic phone queues, and billing conflicts demonstrates high emotional resilience, logistical coordination, and fast problem-solving. AI handles the rote transcription and form-filling, amplifying your human judgment.',
  transferableSkills: [
    'High-pressure de-escalation and patient rapport',
    'Cross-departmental schedule and provider coordination',
    'Complex insurance authorization and dispute triage',
  ],
  roles: [
    {
      id: 'role-1',
      roleTitle: 'AI-Augmented Patient Intake Coordinator',
      onetCluster: '43-4171.00 - Healthcare Support & Client Intake',
      summary: 'Streamlines walk-in check-ins and clinical triage records using automated speech-to-text intake templates, cutting registration backlog by 60%.',
      keyTasks: [
        'Manage lobby check-in flow and identify urgent patient symptoms for immediate nurse review',
        'Audit AI-transcribed intake audio notes for clinical terminology accuracy',
        'Resolve insurance coverage discrepancies before patients enter exam rooms',
      ],
      humanEdge: 'Calming an anxious elderly patient or de-escalating a furious family member in the waiting room requires authentic human empathy, body language reading, and situational judgment that no automated system can provide.',
      aiTools: [
        {
          name: 'OpenAI Whisper',
          freeTier: 'Free open-source / Web tier',
          useCase: 'Converts spoken intake interviews and voicemail triage into organized draft notes.',
        },
        {
          name: 'ChatGPT Free',
          freeTier: '100% Free tier',
          useCase: 'Auto-formats raw patient responses into standard SOAP intake templates in seconds.',
        },
      ],
      starterPrompt: 'I have 8 years of experience as a Medical Receptionist managing busy outpatient check-ins and patient triage. I am targeting an AI-Augmented Patient Intake Coordinator role. Help me rewrite my resume summary and 3 bullet points to highlight how my patient empathy and automated EHR transcription oversight qualify me for this position.',
      photo: {
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        photographer: 'Martha Dominguez',
        photographerUrl: 'https://unsplash.com',
      },
    },
    {
      id: 'role-2',
      roleTitle: 'Medical Records & AI Documentation Specialist',
      onetCluster: '29-9021.00 - Health Information Specialists',
      summary: 'Bridging healthcare providers and billing databases by reviewing AI-extracted diagnosis codes and coordinating prior authorizations.',
      keyTasks: [
        'Validate automated EHR clinical summaries against physician audio logs',
        'Draft and submit insurance pre-authorization appeal packets using structured LLM templates',
        'Maintain strict patient privacy compliance (HIPAA) during record digitization',
      ],
      humanEdge: 'Discerning clinical context—such as catching contradictory doctor notes or unstated patient symptoms—demands trained human skepticism and medical ethics that automated extraction models routinely miss.',
      aiTools: [
        {
          name: 'Claude 3.5 Sonnet (Free)',
          freeTier: 'Free web tier with daily quota',
          useCase: 'Synthesizes dense, multi-page diagnostic records into clean insurance appeal summaries.',
        },
        {
          name: 'Gemini 2.5 Flash Free',
          freeTier: 'Free tier in Google AI Studio',
          useCase: 'Cross-checks insurance policy denial letters against submitted patient claims.',
        },
      ],
      starterPrompt: 'I am a Medical Receptionist with extensive clinic workflow experience transitioning into a Medical Records & AI Documentation Specialist role. Draft 3 compelling interview talking points demonstrating how my HIPAA background and prompt engineering verification keep automated health records error-free.',
      photo: {
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        photographer: 'National Cancer Institute',
        photographerUrl: 'https://unsplash.com',
      },
    },
    {
      id: 'role-3',
      roleTitle: 'Client Operations & AI Automation Lead',
      onetCluster: '11-1021.00 - General and Operations Managers',
      summary: 'Designing automated scheduling bots, SMS appointment reminders, and clinic workflow automations that eliminate administrative overhead.',
      keyTasks: [
        'Build multi-channel SMS and WhatsApp appointment confirmation bots using no-code platforms',
        'Analyze clinic cancellation patterns and automate waitlist priority notifications',
        'Train frontline administrative staff on ethical AI tool usage and prompt safety protocols',
      ],
      humanEdge: 'Designing a clinic bot is technical; knowing how real, stressed human beings react to automated texts requires years of handling real phone queues and understanding patient vulnerabilities.',
      aiTools: [
        {
          name: 'Make.com Free Tier',
          freeTier: 'Free tier (1,000 operations/month)',
          useCase: 'Connects Google Calendar, Twilio SMS, and Google Sheets without code.',
        },
        {
          name: 'Perplexity AI Free',
          freeTier: 'Free tier with web search',
          useCase: 'Researches local compliance guidelines for automated SMS patient outreach.',
        },
      ],
      starterPrompt: 'Act as a Senior Health Operations Director onboarding a new Client Operations & AI Automation Lead. Give me a 30-day onboarding checklist focused on identifying clinic scheduling bottlenecks, deploying a no-code SMS reminder system, and tracking reduction in missed appointments.',
      photo: {
        url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        photographer: 'Amy Hirschi',
        photographerUrl: 'https://unsplash.com',
      },
    },
  ],
};
