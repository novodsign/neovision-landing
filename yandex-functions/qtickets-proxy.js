// Yandex Cloud Function for Qtickets API proxy
// Deploy to Yandex Cloud Functions

const https = require('https');

// Qtickets API configuration
const QTICKETS_API_KEY = process.env.QTICKETS_API_KEY || 'b2XdRH8Uxj1vCFb7lKKQZHTLWlCUNCZ1';
const QTICKETS_API_URL = 'https://qtickets.ru/api/rest/v1';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

// Cache for events (simple in-memory, refreshes each cold start)
let eventsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Make HTTPS request helper
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

// Fetch events from Qtickets
async function fetchQticketsEvents() {
  const now = Date.now();

  // Return cached if fresh
  if (eventsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return eventsCache;
  }

  const url = new URL(`${QTICKETS_API_URL}/events`);
  url.searchParams.set('per_page', '50');

  const response = await makeRequest({
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${QTICKETS_API_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (response.statusCode === 200) {
    eventsCache = JSON.parse(response.body);
    cacheTimestamp = now;
    return eventsCache;
  }

  throw new Error(`Qtickets API error: ${response.statusCode}`);
}

// Fetch single event details
async function fetchQticketsEvent(eventId) {
  const url = new URL(`${QTICKETS_API_URL}/events/${eventId}`);

  const response = await makeRequest({
    hostname: url.hostname,
    path: url.pathname,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${QTICKETS_API_KEY}`,
      'Accept': 'application/json'
    }
  });

  if (response.statusCode === 200) {
    return JSON.parse(response.body);
  }

  throw new Error(`Event not found: ${eventId}`);
}

// Transform Qtickets event to frontend format
function transformEvent(event) {
  return {
    id: event.id,
    title: event.name,
    description: event.description || '',
    shortDescription: event.short_description || '',
    city: event.city?.name || event.place_name?.split(',')[0] || '',
    venue: event.place_name || '',
    address: event.place_address || '',
    posterUrl: event.image || null,
    bannerUrl: event.banner || null,
    ageRestriction: event.age_restriction || null,
    shows: (event.shows || []).map(show => ({
      id: show.id,
      date: show.date,
      doorsOpen: show.doors_open,
      startTime: show.start_time,
      minPrice: show.min_price,
      maxPrice: show.max_price,
      currency: show.currency || 'RUB',
      availableSeats: show.available_seats,
      totalSeats: show.total_seats,
      status: show.status || 'ON_SALE',
      ticketUrl: `https://qtickets.ru/event/${event.id}/show/${show.id}`
    })),
    ticketUrl: `https://qtickets.ru/event/${event.id}`
  };
}

// Main handler for Yandex Cloud Functions
module.exports.handler = async function (event, context) {
  const { httpMethod, path, queryStringParameters } = event;

  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Parse path - handle /api/events, /api/events/:id, /api/events/upcoming
    const pathParts = (path || '').replace(/^\/+|\/+$/g, '').split('/');
    const resource = pathParts[1] || pathParts[0]; // 'events'
    const subResource = pathParts[2]; // event ID or 'upcoming'

    // GET /api/events - List all events
    if (resource === 'events' && !subResource) {
      const data = await fetchQticketsEvents();
      const events = (data.data || []).map(transformEvent);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: events,
          total: events.length
        })
      };
    }

    // GET /api/events/upcoming - Get upcoming events
    if (resource === 'events' && subResource === 'upcoming') {
      const limit = parseInt(queryStringParameters?.limit) || 4;
      const data = await fetchQticketsEvents();

      const now = new Date();
      const upcomingEvents = (data.data || [])
        .map(transformEvent)
        .filter(event => {
          // Filter events with future shows
          return event.shows.some(show => new Date(show.date) > now);
        })
        .sort((a, b) => {
          // Sort by earliest show date
          const dateA = a.shows[0]?.date ? new Date(a.shows[0].date) : new Date(0);
          const dateB = b.shows[0]?.date ? new Date(b.shows[0].date) : new Date(0);
          return dateA - dateB;
        })
        .slice(0, limit);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(upcomingEvents)
      };
    }

    // GET /api/events/:id - Get single event
    if (resource === 'events' && subResource && subResource !== 'upcoming') {
      const eventId = parseInt(subResource);
      const data = await fetchQticketsEvent(eventId);
      const event = transformEvent(data.data || data);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      };
    }

    // 404 for unknown routes
    return {
      statusCode: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Not found', path })
    };

  } catch (error) {
    console.error('Qtickets proxy error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'API error',
        details: error.message
      })
    };
  }
};
