import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagneticButton } from '../components/MagneticButton';
import { eventsApi } from '../api/client';

// Format date from ISO to display format
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
}

// Transform API response to component format
function transformEvents(apiEvents) {
    return apiEvents.map(event => ({
        id: event.id,
        date: event.nextShow ? formatDate(event.nextShow.date) : '',
        city: event.city,
        venue: event.venue,
        link: `/event/${event.slug || event.id}`,
        image: event.posterUrl || '/assets/event_poster.png',
        isFeature: event.isFeatured,
        title: event.isFeatured ? event.title : undefined,
        subtitle: event.isFeatured ? 'СЛУШАТЬ МИКСЫ' : undefined,
        ticketUrl: event.nextShow?.ticketUrl,
    }));
}

export const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasUpcoming, setHasUpcoming] = useState(false);
    const [totalEvents, setTotalEvents] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;

        async function fetchEvents() {
            try {
                // Get all events to check totals
                const allResponse = await eventsApi.list({ per_page: 50 });
                const allEvents = allResponse?.data || [];

                if (mounted) {
                    setTotalEvents(allEvents.length);
                }

                // Check for upcoming events
                const now = new Date();
                const upcomingEvents = allEvents
                    .filter(e => e.shows?.some(s => new Date(s.date) > now))
                    .sort((a, b) => {
                        const dateA = a.shows?.[0]?.date ? new Date(a.shows[0].date) : new Date(0);
                        const dateB = b.shows?.[0]?.date ? new Date(b.shows[0].date) : new Date(0);
                        return dateA - dateB;
                    });

                if (mounted) {
                    if (upcomingEvents.length > 0) {
                        setHasUpcoming(true);
                        setEvents(transformEvents(upcomingEvents.slice(0, 4)));
                    } else {
                        // No upcoming - show most recent past events
                        setHasUpcoming(false);
                        const recentEvents = [...allEvents]
                            .sort((a, b) => {
                                const dateA = a.shows?.[0]?.date ? new Date(a.shows[0].date) : new Date(0);
                                const dateB = b.shows?.[0]?.date ? new Date(b.shows[0].date) : new Date(0);
                                return dateB - dateA; // Most recent first (descending)
                            })
                            .slice(0, 4);
                        console.log('Recent events (sorted most recent first):', recentEvents.map(e => ({
                            title: e.title,
                            date: e.shows?.[0]?.date
                        })));
                        setEvents(transformEvents(recentEvents));
                    }
                }
            } catch (error) {
                console.warn('Failed to fetch events:', error.message);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchEvents();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <section id="events" className="container" style={{ padding: '120px 4vw' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '3rem',
                    paddingBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}
            >
                <h2 style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontFamily: 'var(--font-header)',
                    margin: 0
                }}>
                    {hasUpcoming ? 'БЛИЖАЙШИЕ СОБЫТИЯ' : 'ПОСЛЕДНИЕ СОБЫТИЯ'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {!hasUpcoming && (
                        <span style={{
                            fontFamily: 'var(--font-body)',
                            color: '#666',
                            fontSize: '0.9rem'
                        }}>
                            Нет запланированных событий
                        </span>
                    )}
                    {totalEvents > 4 && (
                        <Link
                            to="/events"
                            style={{
                                fontFamily: 'var(--font-body)',
                                color: '#888',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                borderBottom: '1px solid #444',
                                paddingBottom: '2px',
                                transition: 'color 0.3s, border-color 0.3s'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.color = '#fff';
                                e.target.style.borderColor = '#fff';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.color = '#888';
                                e.target.style.borderColor = '#444';
                            }}
                        >
                            ВСЕ СОБЫТИЯ ({totalEvents})
                        </Link>
                    )}
                </div>
            </motion.div>

            {loading && events.length === 0 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px',
                    color: '#666'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '2px solid #333',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem',
                width: '100%',
            }}>
                {events.map((evt, i) => (
                    <motion.div
                        key={evt.id || i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => navigate(evt.link)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#0a0a0a',
                            border: '1px solid #222',
                            overflow: 'hidden',
                            position: 'relative',
                            opacity: loading ? 0.5 : 1,
                            transition: 'opacity 0.3s ease',
                            cursor: 'pointer'
                        }}
                        whileHover={{
                            borderColor: '#444',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* Image Container */}
                        <div style={{
                            width: '100%',
                            aspectRatio: '3/4',
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#111'
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${evt.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: evt.isFeature ? 'invert(1) grayscale(100%)' : 'grayscale(100%)',
                                opacity: evt.isFeature ? 0.8 : 1,
                                transition: 'transform 0.5s ease, filter 0.5s ease'
                            }}
                                className="event-image"
                            />
                            {evt.isFeature && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        border: '2px solid #000',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{
                                            width: 0,
                                            height: 0,
                                            borderTop: '10px solid transparent',
                                            borderBottom: '10px solid transparent',
                                            borderLeft: '16px solid #000',
                                            marginLeft: '4px'
                                        }} />
                                    </div>
                                </div>
                            )}
                            <style>{`
                                .event-row:hover .event-image,
                                div:hover > div > .event-image {
                                    transform: scale(1.05);
                                    filter: grayscale(0%);
                                }
                             `}</style>
                        </div>

                        {/* Content */}
                        <div style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            borderTop: '1px solid #222',
                            flex: 1
                        }}>
                            {!evt.isFeature ? (
                                <>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            fontFamily: 'var(--font-body)',
                                            color: '#888',
                                            fontSize: '0.9rem',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {evt.date}
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-body)',
                                            color: '#666',
                                            fontSize: '0.8rem',
                                            textTransform: 'uppercase'
                                        }}>
                                            {evt.venue}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        fontFamily: 'var(--font-header)',
                                        fontSize: '1.5rem',
                                        margin: 0,
                                        lineHeight: 1,
                                        textTransform: 'uppercase'
                                    }}>
                                        {evt.city}
                                    </h3>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        fontFamily: 'var(--font-body)',
                                        color: '#888',
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {evt.subtitle}
                                    </div>
                                    <h3 style={{
                                        fontFamily: 'var(--font-header)',
                                        fontSize: '1.5rem',
                                        margin: 0,
                                        lineHeight: 1,
                                        textTransform: 'uppercase'
                                    }}>
                                        {evt.title}
                                    </h3>
                                </>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                                <MagneticButton
                                    href={evt.ticketUrl || evt.link}
                                    variant="secondary"
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.6rem 1rem'
                                    }}
                                >
                                    {evt.isFeature ? 'СЛУШАТЬ' : 'Подробнее'}
                                </MagneticButton>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Responsive Grid Fix */}
            <style>{`
                @media (max-width: 1024px) {
                    #events > div:nth-of-type(2) {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 600px) {
                    #events > div:nth-of-type(2) {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
};
