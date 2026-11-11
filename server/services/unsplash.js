import { config } from '../config.js';

// In-memory cache for Unsplash photo results to preserve API rate limits (50 req/hr).
const photoCache = new Map();

// Curated high-resolution fallback photos categorized by domain
const DOMAIN_FALLBACKS = {
  salon: {
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1080&q=80',
    photographer: 'Adam Winger',
    alt: 'Modern creative salon and consultation studio',
  },
  tech: {
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1080&q=80',
    photographer: 'Danial Igdery',
    alt: 'Professional software quality assurance and coordination workspace',
  },
  remote: {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1080&q=80',
    photographer: 'Annie Spratt',
    alt: 'Remote project team collaborating on digital workflows',
  },
  customer: {
    url: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1080&q=80',
    photographer: 'Blake Wisz',
    alt: 'Customer insights and client experience specialist',
  },
  healthcare: {
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1080&q=80',
    photographer: 'Martha Dominguez de Gouveia',
    alt: 'Modern outpatient healthcare clinic reception desk',
  },
};

const DEFAULT_FALLBACKS = [
  DOMAIN_FALLBACKS.healthcare,
  DOMAIN_FALLBACKS.tech,
  DOMAIN_FALLBACKS.remote,
];

function pickIntelligentFallback(query, index = 0) {
  const q = (query || '').toLowerCase();
  if (/hair|salon|style|beauty|barber|esthetician/i.test(q)) return DOMAIN_FALLBACKS.salon;
  if (/qa|software|test|code|developer|tech|data|analyst/i.test(q)) return DOMAIN_FALLBACKS.tech;
  if (/remote|project|coordinator|operations|agile/i.test(q)) return DOMAIN_FALLBACKS.remote;
  if (/customer|client|insights|support|service/i.test(q)) return DOMAIN_FALLBACKS.customer;
  if (/health|clinic|doctor|patient|medical|hospital/i.test(q)) return DOMAIN_FALLBACKS.healthcare;
  return DEFAULT_FALLBACKS[index % DEFAULT_FALLBACKS.length];
}

export async function fetchRolePhoto(keyword, index = 0) {
  const query = (keyword || 'workforce professional').trim();
  const fallback = pickIntelligentFallback(query, index);

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
      signal: AbortSignal.timeout(2500),
    });

    if (!res.ok) {
      console.warn(`[unsplash] API returned status ${res.status}. Using intelligent fallback.`);
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
