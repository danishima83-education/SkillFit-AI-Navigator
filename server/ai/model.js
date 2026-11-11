import { config } from '../config.js';

// Restaurant analogy: the outside supplier. LangChain's ChatGoogle talks to Gemini.
// The key is read here, on the server, and never sent to the browser.

let modelCache = new Map();

export async function createChatModel(modelName = config.model) {
  if (!config.geminiApiKey) {
    throw new Error('No GEMINI_API_KEY. Add it in Replit Secrets (or your .env file).');
  }
  if (!modelCache.has(modelName)) {
    const { ChatGoogle } = await import('@langchain/google/node');
    const instance = new ChatGoogle({
      model: modelName,
      apiKey: config.geminiApiKey,
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
    });
    modelCache.set(modelName, instance);
  }
  return modelCache.get(modelName);
}

export async function getModel() {
  return createChatModel(config.model);
}

// 4-tier fallback cascade: 3.8 Flash -> 3.5 Flash Lite -> 3.1 Flash Lite
export async function invokeWithCascade(messages) {
  const cascadeList = [
    config.model || 'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
  ];

  // Remove duplicates while preserving order
  const modelsToTry = [...new Set(cascadeList)];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = await createChatModel(modelName);
      const res = await model.invoke(messages);
      return { response: res, modelUsed: modelName, isMock: false };
    } catch (err) {
      lastError = err;
      const status = err?.status ?? err?.response?.status;
      console.warn(`[ai-cascade] Model ${modelName} returned status ${status || err.message}. Shifting to next cascade tier...`);
    }
  }

  throw lastError || new Error('All models in cascade failed.');
}

// Turn provider errors into messages a student can act on.
export function friendlyAiError(err) {
  const status = err?.status ?? err?.response?.status;
  const text = String(err?.message ?? '');
  if (status === 429 || /quota|rate/i.test(text)) return 'Too many requests. Free Gemini keys have a rate limit, so wait a minute.';
  if (status === 400 || status === 401 || status === 403 || /api key/i.test(text)) return 'Gemini rejected the key or model. Check GEMINI_API_KEY and GEMINI_MODEL.';
  if (status === 404 || /not found/i.test(text)) return 'That Gemini model was not found. Set GEMINI_MODEL to a model listed in Google AI Studio.';
  return 'The AI could not answer right now. Try again in a moment.';
}
