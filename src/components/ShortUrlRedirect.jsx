import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { eventsApi } from '../api/client';
import { findEventBySlug, countEventsByDate, getSameDateCount, buildEventSlug } from '../utils/eventSlug';

/**
 * ShortUrlRedirect Component
 * Resolves date-based short URLs (/e/:slug) to event detail pages
 *
 * Slug formats:
 * - DD-MM-YY (e.g., /e/25-12-24)
 * - DD-MM-YY-HHMM (e.g., /e/25-12-24-1930)
 * - DD-MM-YY-idFragment (e.g., /e/25-12-24-abc123)
 */
export const ShortUrlRedirect = () => {
  const { slug } = useParams();
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function resolveSlug() {
      try {
        // Fetch all events
        const response = await eventsApi.list();
        const events = response?.data || [];

        if (!mounted) return;

        if (events.length === 0) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Calculate date counts for proper slug matching
        const dateCounts = countEventsByDate(events);

        // First, try direct slug match
        const directMatch = events.find(event => {
          const count = getSameDateCount(event, dateCounts);
          const eventSlug = buildEventSlug(event, { sameDateCount: count });
          return eventSlug === slug;
        });

        if (directMatch) {
          setEventId(directMatch.slug || directMatch.id);
          setLoading(false);
          return;
        }

        // Try to find by parsing the slug
        const match = findEventBySlug(slug, events);

        if (match) {
          setEventId(match.slug || match.id);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error resolving short URL:', error);
        if (mounted) {
          setNotFound(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    resolveSlug();

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        color: '#fff'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '2px solid #333',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            Загрузка события...
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Not found - redirect to events archive
  if (notFound) {
    return <Navigate to="/events" replace />;
  }

  // Found - redirect to event page
  if (eventId) {
    return <Navigate to={`/event/${eventId}`} replace />;
  }

  // Fallback
  return <Navigate to="/events" replace />;
};

export default ShortUrlRedirect;
