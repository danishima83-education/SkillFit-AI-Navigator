import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { aiMode } from '../config.js';
import { invokeWithCascade } from '../ai/model.js';
import { loadSkills } from './skills.js';
import { fetchRolePhoto } from '../services/unsplash.js';

// Deterministic mock data for Marcus (Medical Receptionist, Greater New York)
export const MOCK_MARCUS_RESULTS = {
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
      imageKeyword: 'medical clinic reception',
    },
    {
      id: 'role-2',
      roleTitle: 'Medical Records & AI Documentation Specialist',
      onetCluster: '29-9021.00 - Health Information Specialists',
      summary: 'Bridging healthcare providers and billing databases by reviewing AI-extracted diagnosis codes and coordinating prior authorizations.',
      keyTasks: [
        'Validate automated EHR (Electronic Health Record) clinical summaries against physician audio logs',
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
          freeTier: 'Free tier via Google AI Studio',
          useCase: 'Extracts billing codes and procedure dates from scanned medical referral letters.',
        },
      ],
      starterPrompt: 'I am preparing for an interview as a Health Information & AI Documentation Specialist coming from a clinic front desk background. My core human strength is catching conflicting doctor notes and upholding patient privacy ethics. Draft 3 persuasive interview talking points explaining why human clinical judgment is indispensable alongside automated AI documentation tools.',
      imageKeyword: 'electronic medical records',
    },
    {
      id: 'role-3',
      roleTitle: 'Clinical Flow & Patient Scheduling Strategist',
      onetCluster: '43-6013.00 - Medical Administrative Coordinators',
      summary: 'Optimizes outpatient provider calendars and minimizes appointment no-shows using predictive booking workflows and automated multilingual patient messaging.',
      keyTasks: [
        'Coordinate complex multi-doctor referral schedules across outpatient clinics',
        'Configure automated, personalized SMS and email appointment reminders using AI templates',
        'Analyze clinic arrival patterns to prevent provider overbooking and lobby crowding',
      ],
      humanEdge: 'Navigating physician scheduling quirks, accommodating emergency walk-ins, and reassuring vulnerable patients over the phone requires deep interpersonal diplomacy and organizational trust.',
      aiTools: [
        {
          name: 'Google Workspace Gemini / Copilot',
          freeTier: 'Free tier / standard add-on',
          useCase: 'Identifies scheduling overlaps across multiple physician calendars and drafts email updates.',
        },
        {
          name: 'Perplexity Free',
          freeTier: '100% Free tier',
          useCase: 'Quickly verifies insurance policy guidelines and specialty clinic referral requirements.',
        },
      ],
      starterPrompt: 'I want to transition into an Outpatient Flow & Patient Scheduling Strategist role. I am planning to use free AI tools like Google Workspace AI templates and OpenAI Whisper to streamline clinic operations. Outline a 30-day workflow strategy for using these tools to reduce appointment no-shows without overloading doctors.',
      imageKeyword: 'hospital administration team',
    },
  ],
};

export async function runNavigator(intakeData) {
  const skills = await loadSkills();
  const guardSkill = skills.get('safety-guardrail');

  // Scrub personal details from freeform fields
  const cleanDaily = guardSkill.tool.run({ message: intakeData.dailyTasks || '' }).redacted;
  const cleanSuperpowers = guardSkill.tool.run({ message: intakeData.superpowers || '' }).redacted;
  const cleanDrainers = guardSkill.tool.run({ message: intakeData.drainers || '' }).redacted;

  const mode = aiMode();

  let parsedResults = null;
  let modelUsed = 'mock-engine';

  if (mode === 'live') {
    const navSkill = skills.get('skill-navigator');
    const systemPrompt = [
      'You are SkillFit Navigator, an expert AI workforce career transition strategist.',
      navSkill.body,
      '',
      'OUTPUT REQUIREMENTS:',
      'You must respond ONLY with a valid JSON object matching this exact structure:',
      '{',
      '  "summary": "2-3 encouraging sentences synthesizing their transferable strength and why AI augments them",',
      '  "transferableSkills": ["skill 1", "skill 2", "skill 3"],',
      '  "roles": [',
      '    {',
      '      "id": "role-1",',
      '      "roleTitle": "Realistic Occupational Title",',
      '      "onetCluster": "O*NET Code and Standard Occupational Group",',
      '      "summary": "1-2 sentence description of what they do with AI",',
      '      "keyTasks": ["concrete task 1", "concrete task 2", "concrete task 3"],',
      '      "humanEdge": "Why human empathy, tact, or judgment cannot be replaced by AI in this role",',
      '      "aiTools": [',
      '        { "name": "Tool Name", "freeTier": "Free tier info", "useCase": "Exact practical workflow" },',
      '        { "name": "Tool Name 2", "freeTier": "Free tier info", "useCase": "Exact practical workflow" }',
      '      ],',
      '      "starterPrompt": "Personalized action prompt ready to paste into ChatGPT/Claude without placeholders",',
      '      "imageKeyword": "short 2-3 word search query for photo"',
      '    }',
      '  ]',
      '}',
      '',
      'CRITICAL RULES FOR starterPrompt:',
      'Do NOT use brackets or placeholders like [PASTE NOTES] or [INSERT TEXT].',
      'The user wants to copy and paste this into ChatGPT or Claude immediately to get instant value.',
      '- Role 1 prompt MUST be a Resume Translation prompt: "I worked as <currentRole> doing <their tasks>. Help me write 3 bullet points targeting a <roleTitle> role..."',
      '- Role 2 prompt MUST be an Interview Advantage prompt: "I am interviewing for <roleTitle> coming from <currentRole>. My human superpower is <superpowers>. Draft 3 talking points on why human judgment is indispensable..."',
      '- Role 3 prompt MUST be a Day-1 AI Toolkit Onboarding prompt: "I am starting as <roleTitle>. Give me a practical workflow to use free tools like <aiTools> to handle <their tasks> efficiently."',
      '',
      'Do NOT include markdown backticks or any conversational text outside the JSON object.',
    ].join('\n');

    const userPrompt = [
      `Current/Past Role: ${intakeData.currentRole}`,
      `Everyday Work Tasks: ${cleanDaily}`,
      `Natural Superpowers & Strengths: ${cleanSuperpowers}`,
      `Repetitive Draining Tasks: ${cleanDrainers}`,
      `Work Preference: ${intakeData.workPreference || 'Hybrid'}`,
      `Technology Comfort Level: ${intakeData.techComfort || 'Everyday user'}`,
    ].join('\n');

    try {
      const { response, modelUsed: used } = await invokeWithCascade([
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ]);
      modelUsed = used;
      const rawText = cleanJsonText(response.content);
      parsedResults = JSON.parse(rawText);
    } catch (err) {
      console.warn('[navigator] Live inference failed. Falling back to deterministic mock:', err.message);
      parsedResults = JSON.parse(JSON.stringify(MOCK_MARCUS_RESULTS));
      modelUsed = 'mock-fallback';
    }
  } else {
    parsedResults = JSON.parse(JSON.stringify(MOCK_MARCUS_RESULTS));
  }

  // Ensure 3 roles exist and attach Unsplash photos concurrently
  if (!parsedResults?.roles || !Array.isArray(parsedResults.roles) || parsedResults.roles.length === 0) {
    parsedResults = JSON.parse(JSON.stringify(MOCK_MARCUS_RESULTS));
  }

  const enrichedRoles = await Promise.all(
    parsedResults.roles.map(async (role, idx) => {
      const photo = await fetchRolePhoto(role.imageKeyword, idx);
      return {
        ...role,
        photo,
      };
    })
  );

  return {
    ok: true,
    data: {
      summary: parsedResults.summary,
      transferableSkills: parsedResults.transferableSkills || [],
      roles: enrichedRoles,
    },
    modelUsed,
    mode: mode === 'live' && modelUsed !== 'mock-fallback' ? 'live' : 'mock',
  };
}

function cleanJsonText(content) {
  let str = '';
  if (typeof content === 'string') str = content;
  else if (Array.isArray(content)) str = content.map((c) => c.text || '').join('');
  else str = String(content || '');

  // Strip ```json ... ``` wrapper if model emitted it
  str = str.trim();
  if (str.startsWith('```')) {
    str = str.replace(/^```(?:json)?\r?\n/, '').replace(/\r?\n```$/, '');
  }
  return str.trim();
}
