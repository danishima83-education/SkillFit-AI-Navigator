import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { aiMode } from '../config.js';
import { invokeWithCascade } from '../ai/model.js';
import { loadSkills } from './skills.js';
import { fetchRolePhoto } from '../services/unsplash.js';
import { NavigatorOutput, firstError } from '../validation.js';
import { MARCUS_GOLDEN_MASTER } from '../../shared/marcus.fixture.js';

// Single canonical fallback/mock fixture shared with client Golden Master
export const MOCK_MARCUS_RESULTS = MARCUS_GOLDEN_MASTER;

export async function runNavigator(intakeData) {
  const skills = await loadSkills();
  const guardSkill = skills.get('safety-guardrail');

  // Scrub personal details from all freeform intake fields
  const cleanRole = guardSkill.tool.run({ message: intakeData.currentRole || '' }).redacted;
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
      `Current/Past Role: ${cleanRole}`,
      `Everyday Work Tasks: ${cleanDaily}`,
      `Natural Superpowers & Strengths: ${cleanSuperpowers || 'Not specified'}`,
      `Repetitive Draining Tasks: ${cleanDrainers || 'Not specified'}`,
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
      const parsed = JSON.parse(rawText);
      const validated = NavigatorOutput.safeParse(parsed);
      if (!validated.success) {
        throw new Error(`Invalid navigator JSON schema: ${firstError(validated)}`);
      }
      parsedResults = validated.data;
    } catch (err) {
      console.warn('[navigator] Live inference failed. Falling back to deterministic mock:', err.message);
      parsedResults = JSON.parse(JSON.stringify(MOCK_MARCUS_RESULTS));
      modelUsed = 'mock-fallback';
    }
  } else {
    parsedResults = JSON.parse(JSON.stringify(MOCK_MARCUS_RESULTS));
  }

  // Cap at 3 roles and attach Unsplash photos concurrently
  const safeRoles = (parsedResults?.roles || []).slice(0, 3);
  const enrichedRoles = await Promise.all(
    safeRoles.map(async (role, idx) => {
      const photo = role.photo?.url ? role.photo : await fetchRolePhoto(role.imageKeyword, idx);
      return {
        ...role,
        id: role.id || `role-${idx + 1}`,
        photo,
      };
    })
  );

  const isFallback = mode === 'live' && modelUsed === 'mock-fallback';

  return {
    ok: true,
    data: {
      summary: parsedResults.summary,
      transferableSkills: parsedResults.transferableSkills || [],
      roles: enrichedRoles,
    },
    modelUsed,
    mode: isFallback || mode !== 'live' ? 'mock' : 'live',
    isFallback,
  };
}

function cleanJsonText(content) {
  let str = '';
  if (typeof content === 'string') str = content;
  else if (Array.isArray(content)) str = content.map((c) => (c && c.text) || '').join('');
  else str = String(content || '');

  // Strip optional markdown code fences and isolate the outermost JSON object
  str = str.trim();
  if (str.startsWith('```')) {
    str = str.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    str = str.slice(firstBrace, lastBrace + 1);
  }
  return str.trim();
}
