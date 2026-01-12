import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Footer } from '../sections/Footer';
import { MagneticButton } from '../components/MagneticButton';

// Mock Data (In a real app, this would come from an API or shared state)
const eventsData = [
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

export const EventPage = () => {
    const { id } = useParams();
    const event = eventsData.find(e => e.id === parseInt(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!event) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#050505', color: '#fff' }}>
                <Navbar />
                <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1>Событие не найдено</h1>
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
                    <Link to="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                        &larr; НАЗАД
                    </Link>
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
                                    paddingBottom: '2rem'
                                }}>
                                    <span>{event.date}</span>
                                    <span style={{ color: '#666' }}>//</span>
                                    <span>{event.venue}</span>
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

                        {/* Action */}
                        <div style={{ marginTop: '2rem' }}>
                            <MagneticButton
                                href="#"
                                variant="primary"
                                style={{}}
                            >
                                {event.isFeature ? 'СЛУШАТЬ' : 'КУПИТЬ БИЛЕТЫ'}
                            </MagneticButton>
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

                {/* CSS Grid Style Injection for this page specifically */}
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
                        .event-content-grid > div:nth-child(2) {
                            order: -1; /* Move poster to top on mobile per design patterns, or keep bottom? Keeping bottom based on Left->Right flow usually mapping to Top->Bottom. But visual impact usually demands poster first. Let's keep strict source order first (Info then Poster) as requested by "Left... Right..." usually implies order. BUT commonly posters are top on mobile. I will keep it bottom for now to match the "Left=Info" priority. Actually, let's just make it standard reading order. Info first. */
                        }
                    }
                `}</style>

            </main>

            <Footer />
        </div>
    );
};
