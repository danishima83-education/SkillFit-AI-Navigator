import { config } from '../config.js';

// In-memory cache for Unsplash photo results to preserve API rate limits (50 req/hr).
const photoCache = new Map();

// Curated high-resolution fallback photos if API limit is reached or key is missing.
const FALLBACK_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1080&q=80',
    photographer: 'Martha Dominguez de Gouveia',
    alt: 'Modern medical clinic reception desk',
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1080&q=80',
    photographer: 'National Cancer Institute',
    alt: 'Healthcare coordinator reviewing electronic patient records',
  },
  {
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1080&q=80',
    photographer: 'Amy Hirschi',
    alt: 'Administrative team coordinating schedules and workflows',
  },
];

export async function fetchRolePhoto(keyword, index = 0) {
  const fallback = FALLBACK_PHOTOS[index % FALLBACK_PHOTOS.length];
  const query = (keyword || 'healthcare administration').trim();

  if (photoCache.has(query)) {
    return photoCache.get(query);
  }

  const apiKey = config.unsplashApiKey;
  if (!apiKey) {
    return fallback;
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
        'Accept-Version': 'v1',
      },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) {
      console.warn(`[unsplash] API returned status ${res.status}. Using curated fallback.`);
      return fallback;
    }

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const first = data.results[0];
      const result = {
        url: first.urls?.regular || first.urls?.small || fallback.url,
        photographer: first.user?.name || 'Unsplash Contributor',
        alt: first.alt_description || query,
      };
      photoCache.set(query, result);
      return result;
    }

    return fallback;
  } catch (err) {
    console.warn('[unsplash] fetch error:', err.message);
    return fallback;
  }
}
