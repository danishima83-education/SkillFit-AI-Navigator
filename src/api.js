// The waiter: every call from React to the server goes through here.
async function request(path, options = {}) {
  const { signal: externalSignal, timeoutMs = 32000, ...restOptions } = options;
  const controller = new AbortController();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const res = await fetch(`/api${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...restOptions,
      signal: controller.signal,
      body: restOptions.body ? JSON.stringify(restOptions.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    if (timedOut) {
      throw new Error('The AI request timed out after 32 seconds. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}

export const api = {
  health: () => request('/health'),
  skills: () => request('/skills'),
  navigate: (body, options = {}) => request('/navigate', { method: 'POST', body, ...options }),
  photos: (keyword) => request(`/photos?${new URLSearchParams({ keyword })}`),
  chat: (body) => request('/chat', { method: 'POST', body }),
  resources: ({ search = '', category = '' } = {}) =>
    request(`/resources?${new URLSearchParams({ search, category })}`),
  addResource: (body) => request('/resources', { method: 'POST', body }),
};
