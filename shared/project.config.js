// =============================================================
// YOUR TEAM AND PROJECT: fill this in first!
// The web page AND the AI agent both read this file, so the app
// introduces your team and the agent knows what problem it serves.
// Anything still starting with "TODO" shows up highlighted on the page.
// =============================================================

export const project = {
  teamName: 'AIisMyFriend',
  appName: 'SkillFit AI Navigator',
  tagline: 'Translate everyday frontline work into 3 AI-augmented career directions in under 5 minutes.',

  // One or two sentences. Who is hurting, and how?
  problemStatement:
    'Frontline and administrative workers fear AI displacement and waste hours on generic career quizzes that suggest outdated clerical roles or irrelevant tech jobs instead of practical AI tool workflows.',

  // One specific person. Give them a name, an age, and a situation.
  targetUser: 'Marcus, 38, medical receptionist and office coordinator at an outpatient clinic in Greater New York.',

  community: 'National / Frontline Workforce (Retail, Healthcare Admin, Hospitality)',
  theme: 'Workforce Transition & Future of Work',

  // How you will know it works. Make it measurable.
  successMeasure: 'A frontline worker maps their daily tasks to 3 realistic AI-augmented roles with free tools and copyable prompts in under 5 minutes.',

  teamMembers: [
    { name: 'Danilo Andiel', role: 'Product Owner, Architect & AI Engineer' },
  ],

  // The personality of your AI agent. Used in its system prompt.
  agent: {
    name: 'SkillFit Navigator',
    voice: 'sharp, encouraging, realistic, and practical like a veteran career strategist',
    readingLevel: '8th grade',
  },
};

// True if a value still needs to be filled in.
export const isTodo = (value) => typeof value === 'string' && value.trim().startsWith('TODO');
