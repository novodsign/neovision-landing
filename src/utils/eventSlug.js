/**
 * Event Slug Utility
 * Generates and parses date-based short URLs for events
 * Format: DD-MM-YY (e.g., 25-12-24 for Dec 25, 2024)
 * With time: DD-MM-YY-HHMM (e.g., 25-12-24-1930)
 * With ID fragment: DD-MM-YY-abc123 (fallback when no specific time)
 */

const BASE_YEAR = 2000;
const MOSCOW_TIMEZONE = 'Europe/Moscow';

/**
 * Convert a date to Moscow timezone
 */
export function toMoscowDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return new Date(d.toLocaleString('en-US', { timeZone: MOSCOW_TIMEZONE }));
}

/**
 * Get a date key for grouping events (YYYY-MM-DD format)
 */
export function getEventDateKey(event) {
  const date = getEventDate(event);
  if (!date) return null;

  const moscowDate = toMoscowDate(date);
  const year = moscowDate.getFullYear();
  const month = String(moscowDate.getMonth() + 1).padStart(2, '0');
  const day = String(moscowDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Extract the primary date from an event
 */
export function getEventDate(event) {
  // Try different date sources from Qtickets transformed data
  if (event.shows?.[0]?.date) {
    return new Date(event.shows[0].date);
  }
  if (event.nextShow?.date) {
    return new Date(event.nextShow.date);
  }
  return null;
}

/**
 * Extract time string (HHMM) from event
 */
export function getEventTime(event) {
  const date = getEventDate(event);
  if (!date) return null;

  const moscowDate = toMoscowDate(date);
  const hours = String(moscowDate.getHours()).padStart(2, '0');
  const minutes = String(moscowDate.getMinutes()).padStart(2, '0');

  // Only return time if it's not midnight (which usually means "time unknown")
  if (hours === '00' && minutes === '00') {
    return null;
  }

  return `${hours}${minutes}`;
}

/**
 * Build a short slug for an event
 * @param {Object} event - The event object
 * @param {Object} options - Options
 * @param {number} options.sameDateCount - Number of events on the same date
 * @returns {string|null} - The slug or null if unable to generate
 */
export function buildEventSlug(event, options = {}) {
  const { sameDateCount = 1 } = options;

  const date = getEventDate(event);
  if (!date) return null;

  const moscowDate = toMoscowDate(date);
  const day = String(moscowDate.getDate()).padStart(2, '0');
  const month = String(moscowDate.getMonth() + 1).padStart(2, '0');
  const year = String(moscowDate.getFullYear() - BASE_YEAR).padStart(2, '0');

  let slug = `${day}-${month}-${year}`;

  // If multiple events on same date, add disambiguator
  if (sameDateCount > 1) {
    const time = getEventTime(event);
    if (time) {
      slug += `-${time}`;
    } else {
      // Use ID fragment as fallback
      const idFragment = String(event.id).slice(-6);
      slug += `-${idFragment}`;
    }
  }

  return slug;
}

/**
 * Parse an event slug
 * @param {string} slug - The slug to parse
 * @returns {Object|null} - Parsed data or null if invalid
 */
export function parseEventSlug(slug) {
  if (!slug) return null;

  // Basic format: DD-MM-YY
  // Extended format: DD-MM-YY-HHMM or DD-MM-YY-idFragment
  const parts = slug.split('-');

  if (parts.length < 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10) + BASE_YEAR;

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;

  const result = { day, month, year };

  // Check for additional disambiguator
  if (parts.length >= 4) {
    const extra = parts.slice(3).join('-');

    // Check if it's a time (4 digits)
    if (/^\d{4}$/.test(extra)) {
      result.time = extra;
      result.hours = parseInt(extra.slice(0, 2), 10);
      result.minutes = parseInt(extra.slice(2, 4), 10);
    } else {
      // It's an ID fragment
      result.idFragment = extra;
    }
  }

  return result;
}

/**
 * Find an event by slug from a list of events
 * @param {string} slug - The slug to find
 * @param {Array} events - List of events
 * @returns {Object|null} - The matching event or null
 */
export function findEventBySlug(slug, events) {
  if (!slug || !events?.length) return null;

  const parsed = parseEventSlug(slug);
  if (!parsed) return null;

  // Create target date in Moscow timezone
  const targetDateStr = `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;

  // Filter events on the target date
  const matchingEvents = events.filter(event => {
    const dateKey = getEventDateKey(event);
    return dateKey === targetDateStr;
  });

  if (matchingEvents.length === 0) return null;
  if (matchingEvents.length === 1) return matchingEvents[0];

  // Multiple events - try to match by time or ID fragment
  if (parsed.time) {
    const targetTime = parsed.time;
    const timeMatch = matchingEvents.find(event => {
      const eventTime = getEventTime(event);
      return eventTime === targetTime;
    });
    if (timeMatch) return timeMatch;
  }

  if (parsed.idFragment) {
    const idMatch = matchingEvents.find(event => {
      return String(event.id).endsWith(parsed.idFragment) ||
             String(event.id).includes(parsed.idFragment);
    });
    if (idMatch) return idMatch;
  }

  // Return first match as fallback
  return matchingEvents[0];
}

/**
 * Count events per date for determining if time suffix is needed
 * @param {Array} events - List of events
 * @returns {Map} - Map of date keys to counts
 */
export function countEventsByDate(events) {
  const counts = new Map();

  for (const event of events) {
    const key = getEventDateKey(event);
    if (key) {
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }

  return counts;
}

/**
 * Get the same-date count for an event
 * @param {Object} event - The event
 * @param {Map} dateCounts - Map of date counts
 * @returns {number} - Number of events on the same date
 */
export function getSameDateCount(event, dateCounts) {
  const key = getEventDateKey(event);
  return dateCounts?.get(key) || 1;
}

/**
 * Generate a shareable short URL for an event
 * @param {Object} event - The event
 * @param {number} sameDateCount - Number of events on same date
 * @param {string} baseUrl - Base URL (defaults to current origin)
 * @returns {string} - Full shareable URL
 */
export function getShareableUrl(event, sameDateCount = 1, baseUrl = '') {
  const slug = buildEventSlug(event, { sameDateCount });

  if (slug) {
    return `${baseUrl}/e/${slug}`;
  }

  // Fallback to ID-based URL
  return `${baseUrl}/event/${event.slug || event.id}`;
}
