import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Footer } from '../sections/Footer';
import { MagneticButton } from '../components/MagneticButton';
import { eventsApi } from '../api/client';
import { buildEventSlug, countEventsByDate, getSameDateCount } from '../utils/eventSlug';

// Format date from ISO to display format
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
}

// Format full date for display
function formatFullDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

const ITEMS_PER_PAGE = 8;

export const EventsArchivePage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const navigate = useNavigate();



    useEffect(() => {
        let mounted = true;

        async function fetchEvents() {
            setLoading(true);
            try {
                const response = await eventsApi.list({ per_page: 100 });
                const allEvents = response?.data || [];

                if (mounted) {
                    setTotalEvents(allEvents.length);
                    setEvents(allEvents);
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

    // Calculate date counts for short URL generation
    const dateCounts = useMemo(() => countEventsByDate(events), [events]);

    // Helper to get short URL for an event
    const getEventUrl = (event) => {
        const sameDateCount = getSameDateCount(event, dateCounts);
        const slug = buildEventSlug(event, { sameDateCount });
        return slug ? `/e/${slug}` : `/event/${event.slug || event.id}`;
    };

    // Sort events
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = a.shows?.[0]?.date ? new Date(a.shows[0].date) : new Date(0);
        const dateB = b.shows?.[0]?.date ? new Date(b.shows[0].date) : new Date(0);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Paginate
    const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = sortedEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#fff' }}>
            <Navbar />

            <main className="container" style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px' }}>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px' }}
                >
                    <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                        &larr; НА ГЛАВНУЮ
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '3rem',
                        flexWrap: 'wrap',
                        gap: '1.5rem'
                    }}
                >
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontFamily: 'var(--font-header)',
                            margin: 0,
                            lineHeight: 1
                        }}>
                            АРХИВ СОБЫТИЙ
                        </h1>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            color: '#666',
                            marginTop: '1rem',
                            fontSize: '1rem'
                        }}>
                            Всего событий: {totalEvents}
                        </p>
                    </div>

                    {/* Sort Controls */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}>
                        <span style={{ color: '#666', fontSize: '0.9rem', marginRight: '0.5rem' }}>
                            Сортировка:
                        </span>
                        <button
                            onClick={() => setSortOrder('newest')}
                            style={{
                                background: sortOrder === 'newest' ? '#fff' : 'transparent',
                                color: sortOrder === 'newest' ? '#000' : '#888',
                                border: '1px solid #333',
                                padding: '0.5rem 1rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            СНАЧАЛА НОВЫЕ
                        </button>
                        <button
                            onClick={() => setSortOrder('oldest')}
                            style={{
                                background: sortOrder === 'oldest' ? '#fff' : 'transparent',
                                color: sortOrder === 'oldest' ? '#000' : '#888',
                                border: '1px solid #333',
                                padding: '0.5rem 1rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            СНАЧАЛА СТАРЫЕ
                        </button>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px'
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

                {/* Events Grid */}
                {!loading && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem',
                        width: '100%'
                    }}>
                        {paginatedEvents.map((event, i) => {
                            const firstShow = event.shows?.[0];
                            const isPast = firstShow?.date && new Date(firstShow.date) < new Date();

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigate(getEventUrl(event))}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: '#0a0a0a',
                                        border: '1px solid #222',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}
                                    whileHover={{
                                        borderColor: '#444',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* Past Event Badge */}
                                    {isPast && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            left: '1rem',
                                            background: 'rgba(0,0,0,0.8)',
                                            color: '#666',
                                            padding: '0.25rem 0.5rem',
                                            fontSize: '0.7rem',
                                            letterSpacing: '0.1em',
                                            zIndex: 10,
                                            border: '1px solid #333'
                                        }}>
                                            ПРОШЕДШЕЕ
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '3/4',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        backgroundColor: '#111'
                                    }}>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundImage: `url(${event.posterUrl || '/assets/event_poster.png'})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                filter: isPast ? 'grayscale(100%)' : 'grayscale(50%)',
                                                opacity: isPast ? 0.7 : 1,
                                                transition: 'transform 0.5s ease, filter 0.5s ease'
                                            }}
                                            className="archive-event-image"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div style={{
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.75rem',
                                        borderTop: '1px solid #222',
                                        flex: 1
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{
                                                fontFamily: 'var(--font-body)',
                                                color: '#888',
                                                fontSize: '0.9rem'
                                            }}>
                                                {firstShow ? formatDate(firstShow.date) : '—'}
                                            </span>
                                            <span style={{
                                                fontFamily: 'var(--font-body)',
                                                color: '#666',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase'
                                            }}>
                                                {event.venue || '—'}
                                            </span>
                                        </div>

                                        <h3 style={{
                                            fontFamily: 'var(--font-header)',
                                            fontSize: '1.3rem',
                                            margin: 0,
                                            lineHeight: 1.1,
                                            textTransform: 'uppercase'
                                        }}>
                                            {event.city || event.title}
                                        </h3>

                                        <p style={{
                                            fontFamily: 'var(--font-body)',
                                            color: '#666',
                                            fontSize: '0.85rem',
                                            margin: 0,
                                            lineHeight: 1.4,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {event.title}
                                        </p>

                                        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }} onClick={(e) => e.stopPropagation()}>
                                            <MagneticButton
                                                href={getEventUrl(event)}
                                                variant="secondary"
                                                style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.6rem 1rem'
                                                }}
                                            >
                                                Подробнее
                                            </MagneticButton>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '4rem'
                    }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                background: 'transparent',
                                color: currentPage === 1 ? '#333' : '#888',
                                border: '1px solid #333',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            &larr;
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                style={{
                                    background: page === currentPage ? '#fff' : 'transparent',
                                    color: page === currentPage ? '#000' : '#888',
                                    border: '1px solid #333',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-body)',
                                    minWidth: '40px'
                                }}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                background: 'transparent',
                                color: currentPage === totalPages ? '#333' : '#888',
                                border: '1px solid #333',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            &rarr;
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && events.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 0',
                        color: '#666'
                    }}>
                        <p style={{ fontSize: '1.2rem' }}>Событий пока нет</p>
                    </div>
                )}

            </main>

            {/* CSS for hover effects */}
            <style>{`
                .archive-event-image:hover {
                    transform: scale(1.05);
                    filter: grayscale(0%) !important;
                }
                @media (max-width: 1024px) {
                    .container > div:nth-of-type(3) {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 600px) {
                    .container > div:nth-of-type(3) {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <Footer />
        </div>
    );
};

export default EventsArchivePage;
