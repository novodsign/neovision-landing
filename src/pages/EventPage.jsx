import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Footer } from '../sections/Footer';
import { MagneticButton } from '../components/MagneticButton';
import { eventsApi } from '../api/client';
import { toMoscowDate, getEventDate, buildEventSlug } from '../utils/eventSlug';

const MOSCOW_TIMEZONE = 'Europe/Moscow';

/**
 * Check if an event is archived (past 7 AM Moscow time the next day)
 */
function isEventArchived(event) {
    const eventDate = getEventDate(event);
    if (!eventDate) return false;

    // Get current time in Moscow
    const nowMoscow = new Date(new Date().toLocaleString('en-US', { timeZone: MOSCOW_TIMEZONE }));

    // Archive cutoff: 7 AM Moscow time the day after the event
    const eventMoscow = toMoscowDate(eventDate);
    const archiveCutoff = new Date(eventMoscow);
    archiveCutoff.setDate(archiveCutoff.getDate() + 1);
    archiveCutoff.setHours(7, 0, 0, 0);

    return nowMoscow > archiveCutoff;
}

// Fallback Mock Data
const fallbackEventsData = [
    {
        id: 1,
        date: '21.10.25',
        city: 'МОСКВА',
        venue: 'MUTABOR',
        image: '/assets/event_poster.png',
        description: 'Ночь глубокого техно и тяжелой индустриальной эстетики. Присоединяйтесь к нам в Mutabor для иммерсивного опыта с участием наших резидентов и специальных гостей. Приготовьтесь к звуковому путешествию сквозь андерграунд.',
        lineup: ['DJ ALPHA', 'BETA PROTOCOL', 'GAMMA WAVE', 'NEOVISION SOUNDSYSTEM']
    },
    {
        id: 2,
        date: '15.11.25',
        city: 'САНКТ-ПЕТЕРБУРГ',
        venue: 'BLANK',
        image: '/assets/event_poster.png',
        description: 'Neovision прибывает в Санкт-Петербург. Blank примет наш фирменный аудиовизуальный перформанс. Ждите необузданную энергию, минималистичные световые шоу и чистый звук.',
        lineup: ['NORTHERN ECHO', 'VOID WALKER', 'NEOVISION SOUNDSYSTEM']
    },
    {
        id: 3,
        date: '05.12.25',
        city: 'ЕКАТЕРИНБУРГ',
        venue: 'TELE-CLUB',
        image: '/assets/event_poster.png',
        description: 'Завершающий этап тура. Екатеринбург, мы везем Бункер к вам. Мощный звук, неумолимые ритмы и полный опыт Neovision.',
        lineup: ['URAL BASS', 'INDUSTRIAL CORE', 'NEOVISION SOUNDSYSTEM']
    },
    {
        id: 4,
        isFeature: true,
        title: 'NEOVISION SOUND',
        subtitle: 'СЛУШАТЬ МИКСЫ',
        image: '/assets/event_poster.png',
        description: 'Исследуйте звучание Neovision онлайн. Курируемые миксы от наших резидентов и друзей.',
        lineup: []
    }
];

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
function transformEvent(apiEvent) {
    const nextShow = apiEvent.shows?.[0];
    const isArchived = isEventArchived(apiEvent);

    return {
        id: apiEvent.id,
        slug: apiEvent.slug,
        date: nextShow ? formatDate(nextShow.date) : '',
        city: apiEvent.city,
        venue: apiEvent.venue,
        address: apiEvent.address,
        image: apiEvent.posterUrl || '/assets/event_poster.png',
        description: apiEvent.description || apiEvent.shortDescription,
        lineup: apiEvent.lineup?.map(a => a.name) || [],
        isFeature: apiEvent.isFeatured,
        title: apiEvent.title,
        ticketUrl: nextShow?.ticketUrl,
        shows: apiEvent.shows || [],
        isArchived,
        rawEvent: apiEvent, // Keep raw event for slug generation
    };
}

export const EventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        let mounted = true;

        async function fetchEvent() {
            setLoading(true);
            setError(null);

            try {
                // Try to fetch from API first
                const apiEvent = await eventsApi.getBySlug(id);
                if (mounted && apiEvent) {
                    setEvent(transformEvent(apiEvent));
                }
            } catch (err) {
                // If API fails, try to find in fallback data
                console.warn('Failed to fetch event from API:', err.message);

                const numericId = parseInt(id);
                const fallbackEvent = fallbackEventsData.find(e =>
                    e.id === numericId || e.id === id
                );

                if (fallbackEvent) {
                    setEvent(fallbackEvent);
                } else {
                    setError('Событие не найдено');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchEvent();

        return () => {
            mounted = false;
        };
    }, [id]);

    const handleBack = () => {
        const from = location.state?.from;

        if (from === 'home') {
            // Navigate to home and try to scroll to events
            navigate('/');
            setTimeout(() => {
                const eventsSection = document.getElementById('events');
                if (eventsSection) {
                    eventsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else if (from === 'archive') {
            navigate('/events');
        } else {
            navigate(-1);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#fff' }}>
                <Navbar />
                <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '2px solid #333',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }} />
                    <p style={{ color: '#666' }}>Загрузка...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#fff' }}>
                <Navbar />
                <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-header)' }}>Событие не найдено</h1>
                    <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>
                        &larr; Вернуться на главную
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#fff' }}>
            <Navbar />

            <main className="container" style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px', display: 'flex', flexDirection: 'column' }}>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px' }}
                >
                    <button
                        onClick={handleBack}
                        style={{
                            color: '#888',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            letterSpacing: '0.05em',
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontFamily: 'inherit'
                        }}
                    >
                        &larr; НАЗАД
                    </button>
                </motion.div>

                {/* Content Grid */}
                <div className="event-content-grid">

                    {/* Left Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                    >
                        {/* Header Info */}
                        <div>
                            {/* Archive Badge */}
                            {event.isArchived && !event.isFeature && (
                                <div style={{
                                    display: 'inline-block',
                                    background: '#1a1a1a',
                                    color: '#666',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.15em',
                                    marginBottom: '1.5rem',
                                    border: '1px solid #333'
                                }}>
                                    ПРОШЕДШЕЕ СОБЫТИЕ
                                </div>
                            )}

                            <div style={{
                                fontFamily: 'var(--font-header)',
                                fontSize: 'clamp(3rem, 6vw, 5rem)',
                                lineHeight: 0.9,
                                marginBottom: '1rem',
                                textTransform: 'uppercase'
                            }}>
                                {event.isFeature ? event.title : event.city}
                            </div>

                            {!event.isFeature && (
                                <div style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1.2rem',
                                    color: '#aaa',
                                    display: 'flex',
                                    gap: '2rem',
                                    borderBottom: '1px solid #333',
                                    paddingBottom: '2rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <span>{event.date}</span>
                                    <span style={{ color: '#666' }}>//</span>
                                    <span>{event.venue}</span>
                                    {event.address && (
                                        <>
                                            <span style={{ color: '#666' }}>//</span>
                                            <span style={{ color: '#666' }}>{event.address}</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div style={{ maxWidth: '600px' }}>
                            <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem', letterSpacing: '0.1em' }}>О СОБЫТИИ</h3>
                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.1rem',
                                lineHeight: 1.6,
                                color: '#ddd'
                            }}>
                                {event.description}
                            </p>
                        </div>

                        {/* Lineup (if exists) */}
                        {!event.isFeature && event.lineup && event.lineup.length > 0 && (
                            <div style={{ marginTop: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem', letterSpacing: '0.1em' }}>ЛАЙНАП</h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {event.lineup.map((artist, idx) => (
                                        <li key={idx} style={{
                                            padding: '0.5rem 0',
                                            borderBottom: '1px solid #222',
                                            fontSize: '1.1rem'
                                        }}>
                                            {artist}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Show dates (if multiple shows) */}
                        {!event.isFeature && event.shows && event.shows.length > 1 && (
                            <div style={{ marginTop: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem', letterSpacing: '0.1em' }}>ДАТЫ</h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {event.shows.map((show, idx) => (
                                        <li key={idx} style={{
                                            padding: '0.75rem 0',
                                            borderBottom: '1px solid #222',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span>{formatDate(show.date)}</span>
                                            {show.status === 'SOLD_OUT' && (
                                                <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>SOLD OUT</span>
                                            )}
                                            {show.minPrice && show.status !== 'SOLD_OUT' && (
                                                <span style={{ color: '#888', fontSize: '0.9rem' }}>
                                                    от {show.minPrice} ₽
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action */}
                        <div style={{ marginTop: '2rem' }}>
                            {event.isArchived && !event.isFeature ? (
                                <div style={{
                                    display: 'inline-block',
                                    padding: '1rem 2rem',
                                    border: '1px solid #333',
                                    color: '#666',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.1em'
                                }}>
                                    АРХИВ — СОБЫТИЕ ЗАВЕРШЕНО
                                </div>
                            ) : (
                                <MagneticButton
                                    href={event.ticketUrl || '#'}
                                    variant="primary"
                                >
                                    {event.isFeature ? 'СЛУШАТЬ' : 'КУПИТЬ БИЛЕТЫ'}
                                </MagneticButton>
                            )}
                        </div>

                    </motion.div>

                    {/* Right Column: Poster */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            maxWidth: '500px',
                            aspectRatio: '3/4',
                            background: '#111',
                            overflow: 'hidden',
                            border: '1px solid #222'
                        }}>
                            <img
                                src={event.image}
                                alt="Event Poster"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'grayscale(100%)',
                                    transition: 'filter 0.5s ease'
                                }}
                                onMouseOver={(e) => e.target.style.filter = 'grayscale(0%)'}
                                onMouseOut={(e) => e.target.style.filter = 'grayscale(100%)'}
                            />
                        </div>
                    </motion.div>

                </div>

                {/* CSS Grid Style Injection */}
                <style>{`
                    .event-content-grid {
                        display: grid;
                        grid-template-columns: 1.2fr 1fr;
                        gap: 4rem;
                    }
                    @media (max-width: 900px) {
                        .event-content-grid {
                            grid-template-columns: 1fr;
                            gap: 3rem;
                        }
                    }
                `}</style>

            </main>

            <Footer />
        </div>
    );
};
