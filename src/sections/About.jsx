import React from 'react';
import { motion } from 'framer-motion';

export const About = () => {
    const latestReleaseLink = 'https://music.yandex.ru/artist/14589945';

    return (
        <section id="about" className="container" style={{ padding: '6rem 4vw', position: 'relative' }}>
            <style>{`
                .about-grid {
                    display: grid;
                    grid-template-columns: minmax(300px, 2fr) 1fr;
                    gap: 4rem;
                    align-items: start;
                }
                @media (max-width: 900px) {
                    .about-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .about-player-container {
                        align-items: flex-start !important;
                        width: 100%;
                    }
                }
            `}</style>

            <div className="about-grid">
                <div>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '2rem' }}>О нас</h2>
                    <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                        NeoVision — творческое объединение артистов, продвигающих тёмное звучание электронной музыки.
                    </p>
                    <p style={{ fontSize: '1.25rem', opacity: 0.7, lineHeight: 1.6 }}>
                        Изначально существующий с&nbsp;2020 года как фестиваль, NeoVision перерос в&nbsp;музыкальный лейбл и&nbsp;промо-команду. Все участники имеют уникальный звук и&nbsp;собственное, новое видение Российской электроники.
                    </p>
                </div>

                <div className="about-player-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                    <motion.a
                        href={latestReleaseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: '#FFFFFF', // High contrast white background
                            border: '1px solid #FFFFFF',
                            borderRadius: '0px',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            width: 'auto',
                            minWidth: '280px',
                            maxWidth: '100%', /* Ensure it fits on mobile */
                            position: 'relative',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)' // Added shadow for lift
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '1px solid #000', // Black border
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000', // Black icon
                            flexShrink: 0
                        }}>
                            <div style={{
                                width: 0,
                                height: 0,
                                borderTop: '6px solid transparent',
                                borderBottom: '6px solid transparent',
                                borderLeft: '10px solid #000', // Black triangle
                                marginLeft: '3px'
                            }}></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                            <span style={{
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-body)',
                                color: '#666',
                                textTransform: 'uppercase',
                                lineHeight: 1
                            }}>
                                LATEST RELEASE
                            </span>
                            <span style={{
                                fontSize: '1rem',
                                letterSpacing: '0.05em',
                                fontFamily: 'var(--font-header)',
                                textTransform: 'uppercase',
                                color: '#000', // Black text
                                fontWeight: '700',
                                lineHeight: 1.2
                            }}>
                                DREAMRAVE
                            </span>
                        </div>
                    </motion.a>

                    {/* Signature / Hint */}
                    <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.7rem',
                        opacity: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        textAlign: 'right'
                    }}>
                        [ CLICK TO LISTEN ]
                    </span>
                </div>
            </div>
        </section>
    );
};
