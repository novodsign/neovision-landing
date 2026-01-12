import React from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '../components/MagneticButton';

const events = [
    {
        id: 1,
        date: '21.10.25',
        city: 'МОСКВА',
        venue: 'MUTABOR',
        link: '/event/1',
        image: '/assets/event_poster.png'
    },
    {
        id: 2,
        date: '15.11.25',
        city: 'САНКТ-ПЕТЕРБУРГ',
        venue: 'BLANK',
        link: '/event/2',
        image: '/assets/event_poster.png'
    },
    {
        id: 3,
        date: '05.12.25',
        city: 'ЕКАТЕРИНБУРГ',
        venue: 'TELE-CLUB',
        link: '/event/3',
        image: '/assets/event_poster.png'
    },
    {
        // Spacer / Feature Card
        id: 4,
        isFeature: true,
        title: 'NEOVISION SOUND',
        subtitle: 'СЛУШАТЬ МИКСЫ',
        link: '/event/4',
        image: '/assets/event_poster.png' // Utilizing same base for consistency, visual distinctness via CSS
    }
];

export const Events = () => {
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
                    paddingBottom: '1rem'
                }}
            >
                <h2 style={{
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontFamily: 'var(--font-header)',
                    margin: 0
                }}>
                    СОБЫТИЯ
                </h2>
                <span style={{ fontFamily: 'var(--font-body)', color: '#666' }}>2025 TOUR</span>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)', // Force 4 columns for desktop
                gap: '2rem',
                width: '100%',
                // Removed justifyContent center to align left
            }}>
                {events.map((evt, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#0a0a0a',
                            border: '1px solid #222',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                        whileHover={{
                            borderColor: '#444',
                            // Removed y: -5 to prevent jumping
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* Image Container */}
                        <div style={{
                            width: '100%',
                            aspectRatio: '3/4', // Portrait poster format
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#111' // Placeholder bg
                        }}>
                            {/* Placeholder generic image since specific assets might not exist perfectly yet,
                                 or using the referenced one.
                                 Adding a gradient overlay for text legibility if text was over it,
                                 but here text is below. */}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${evt.image})`, // Reverted to using backgroundImage for cover
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: evt.isFeature ? 'invert(1) grayscale(100%)' : 'grayscale(100%)', // Distinct look for feature
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
                                    {/* Simple "Play" icon overlay for the feature card */}
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
                                div:hover > div > .event-image { /* Targeting the image on card hover */
                                    transform: scale(1.05);
                                    filter: grayscale(0%); /* Restores color on hover */
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

                            <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                                <MagneticButton
                                    href={evt.link}
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
