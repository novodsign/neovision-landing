// API Client for NeoVision
// Supports: Direct Qtickets API, Yandex Cloud Functions, or local backend

const QTICKETS_API_KEY = 'b2XdRH8Uxj1vCFb7lKKQZHTLWlCUNCZ1';

// In development, use Vite proxy to bypass CORS
// In production, use Vercel serverless function to proxy API requests
const IS_DEV = import.meta.env.DEV;
const QTICKETS_API_URL = IS_DEV
  ? '/qtickets-api'  // Vite proxy handles auth headers
  : '/api/qtickets'; // Vercel serverless function

// API mode: 'direct' (Qtickets), 'serverless' (Yandex), or 'backend' (local)
const API_MODE = import.meta.env.VITE_API_MODE || 'direct';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Direct Qtickets API request
async function qticketsRequest(endpoint) {
  const url = `${QTICKETS_API_URL}${endpoint}`;

  // In development, Vite proxy handles auth headers
  const headers = IS_DEV
    ? { 'Accept': 'application/json' }
    : {
        'Authorization': `Bearer ${QTICKETS_API_KEY}`,
        'Accept': 'application/json',
      };

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new ApiError(`Qtickets API error`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Network error', 0);
  }
}

// Backend/Serverless request
async function backendRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error || 'An error occurred', response.status, data.details);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Network error', 0);
  }
}

// City ID to name mapping for Qtickets
const CITY_NAMES = {
  1: 'Москва',
  2: 'Московская область',
  3: 'Санкт-Петербург',
  4: 'Краснодар',
  5: 'Сочи',
  6: 'Новосибирск',
  7: 'Екатеринбург',
  8: 'Нижний Новгород',
  9: 'Казань',
  10: 'Челябинск',
  11: 'Самара',
  12: 'Уфа',
  13: 'Ростов-на-Дону',
  14: 'Красноярск',
  15: 'Пермь',
  16: 'Воронеж',
  17: 'Волгоград',
  18: 'Саратов',
  19: 'Омск',
  20: 'Тюмень',
};

// Extract city from event name or use city_id mapping
function extractCity(event) {
  // Try to extract from event name (e.g., "VSN7 + Asenssia | Санкт-Петербург")
  const nameParts = event.name?.split('|');
  if (nameParts && nameParts.length > 1) {
    return nameParts[nameParts.length - 1].trim();
  }
  // Fallback to city_id mapping
  return CITY_NAMES[event.city_id] || event.place_name?.split(',')[0] || '';
}

// Get min price from show prices
function getMinPrice(show) {
  if (!show.prices || show.prices.length === 0) return null;
  const prices = show.prices.map(p => p.default_price).filter(p => p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

// Transform Qtickets event to our format
function transformQticketsEvent(event) {
  const shows = (event.shows || []).map(show => ({
    id: show.id,
    date: show.start_date || show.open_date,  // Qtickets uses start_date
    doorsOpen: show.open_date,
    startTime: show.start_date,
    minPrice: getMinPrice(show),
    maxPrice: getMinPrice(show),  // Same for now
    currency: event.currency_id || 'RUB',
    availableSeats: null,
    totalSeats: null,
    status: show.is_active ? 'ON_SALE' : 'SOLD_OUT',
    ticketUrl: `https://qtickets.ru/event/${event.id}/show/${show.id}`
  }));

  const firstShow = shows[0];

  return {
    id: event.id,
    slug: `event-${event.id}`,
    title: event.name,
    description: event.description || '',
    shortDescription: event.description?.substring(0, 200) || '',
    city: extractCity(event),
    venue: event.place_name || '',
    address: event.place_address || '',
    posterUrl: event.poster?.url || event.image?.url || event.poster || event.image || null,
    bannerUrl: event.banner || null,
    ageRestriction: event.age || null,
    status: event.is_active ? 'PUBLISHED' : 'DRAFT',
    isFeatured: false,
    shows,
    nextShow: firstShow ? {
      date: firstShow.date,
      minPrice: firstShow.minPrice,
      ticketUrl: firstShow.ticketUrl
    } : null,
    ticketUrl: event.site_url || `https://qtickets.ru/event/${event.id}`,
    lineup: []
  };
}

// Fetch all pages from Qtickets API
async function fetchAllQticketsEvents() {
  const allEvents = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const query = new URLSearchParams({ page: String(page) }).toString();
    const data = await qticketsRequest(`/events?${query}`);
    const events = data.data || [];

    console.log(`Qtickets page ${page}:`, events.length, 'events');

    if (events.length === 0) {
      hasMore = false;
    } else {
      allEvents.push(...events);
      page++;
      // Safety limit to prevent infinite loops
      if (page > 50) {
        console.warn('Reached page limit, stopping pagination');
        hasMore = false;
      }
    }
  }

  console.log('Total events fetched from all pages:', allEvents.length);
  return allEvents;
}

// Events API
export const eventsApi = {
  list: async (params = {}) => {
    if (API_MODE === 'direct') {
      const rawEvents = await fetchAllQticketsEvents();
      const events = rawEvents.map(transformQticketsEvent);
      return { data: events, pagination: { total: events.length } };
    }
    const query = new URLSearchParams(params).toString();
    return backendRequest(`/events${query ? `?${query}` : ''}`);
  },

  upcoming: async (limit = 4) => {
    if (API_MODE === 'direct') {
      const rawEvents = await fetchAllQticketsEvents();
      const now = new Date();
      const allEvents = rawEvents.map(transformQticketsEvent);

      // Filter for upcoming events (shows in the future)
      const upcoming = allEvents
        .filter(e => e.shows.some(s => new Date(s.date) > now))
        .sort((a, b) => {
          const dateA = a.shows[0]?.date ? new Date(a.shows[0].date) : new Date(0);
          const dateB = b.shows[0]?.date ? new Date(b.shows[0].date) : new Date(0);
          return dateA - dateB;
        })
        .slice(0, limit);

      // If no upcoming events, return most recent events instead
      if (upcoming.length === 0 && allEvents.length > 0) {
        return allEvents
          .sort((a, b) => {
            const dateA = a.shows[0]?.date ? new Date(a.shows[0].date) : new Date(0);
            const dateB = b.shows[0]?.date ? new Date(b.shows[0].date) : new Date(0);
            return dateB - dateA; // Most recent first
          })
          .slice(0, limit);
      }

      return upcoming;
    }
    return backendRequest(`/events/upcoming?limit=${limit}`);
  },

  featured: async () => {
    if (API_MODE === 'direct') {
      const rawEvents = await fetchAllQticketsEvents();
      return rawEvents.slice(0, 4).map(transformQticketsEvent);
    }
    return backendRequest('/events/featured');
  },

  getById: async (id) => {
    if (API_MODE === 'direct') {
      const data = await qticketsRequest(`/events/${id}`);
      return transformQticketsEvent(data.data || data);
    }
    return backendRequest(`/events/${id}`);
  },

  getBySlug: (slug) => {
    // Extract ID from slug if it's our format
    const id = slug.startsWith('event-') ? slug.replace('event-', '') : slug;
    return eventsApi.getById(id);
  },

  getShows: async (eventId) => {
    if (API_MODE === 'direct') {
      const event = await eventsApi.getById(eventId);
      return event.shows;
    }
    return backendRequest(`/events/${eventId}/shows`);
  },

  getSeats: (eventId, showId) => {
    return backendRequest(`/events/${eventId}/shows/${showId}/seats`);
  },
};

// Gallery API (static data in direct mode)
export const galleryApi = {
  list: async (params = {}) => {
    if (API_MODE === 'direct') {
      // Return empty - gallery managed separately
      return { data: [], pagination: { total: 0 } };
    }
    const query = new URLSearchParams(params).toString();
    return backendRequest(`/gallery${query ? `?${query}` : ''}`);
  },

  getById: (id) => backendRequest(`/gallery/${id}`),
};

// Releases API (static data in direct mode)
export const releasesApi = {
  list: async (params = {}) => {
    if (API_MODE === 'direct') {
      return { data: [], pagination: { total: 0 } };
    }
    const query = new URLSearchParams(params).toString();
    return backendRequest(`/releases${query ? `?${query}` : ''}`);
  },

  getById: (id) => backendRequest(`/releases/${id}`),
};

// Contact API
export const contactApi = {
  submit: (data) => {
    if (API_MODE === 'direct') {
      // In direct mode, just log - would need serverless function
      console.log('Contact form submission:', data);
      return Promise.resolve({ success: true });
    }
    return backendRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Admin API (requires backend)
export const adminApi = {
  login: (email, password) => backendRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  getSyncStatus: () => backendRequest('/admin/sync/status'),
  triggerSync: () => backendRequest('/admin/sync/trigger', { method: 'POST' }),

  createEvent: (data) => backendRequest('/admin/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => backendRequest(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => backendRequest(`/admin/events/${id}`, { method: 'DELETE' }),

  createGalleryImage: (data) => backendRequest('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryImage: (id, data) => backendRequest(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryImage: (id) => backendRequest(`/admin/gallery/${id}`, { method: 'DELETE' }),

  createRelease: (data) => backendRequest('/admin/releases', { method: 'POST', body: JSON.stringify(data) }),
  updateRelease: (id, data) => backendRequest(`/admin/releases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRelease: (id) => backendRequest(`/admin/releases/${id}`, { method: 'DELETE' }),

  listContacts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return backendRequest(`/admin/contacts${query ? `?${query}` : ''}`);
  },

  updateContactStatus: (id, status, notes) => backendRequest(`/admin/contacts/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  }),
};

export { ApiError };
export default { eventsApi, galleryApi, releasesApi, contactApi, adminApi };
