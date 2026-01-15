import React from 'react';
import { motion } from 'framer-motion';

export const About = () => {

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
                .player-arrow:hover {
                    opacity: 0.7;
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

                {/* Yandex Music Widget */}
                <div className="about-player-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        width: '100%',
                        maxWidth: '320px'
                    }}>
                        <iframe
                            frameBorder="0"
                            allow="clipboard-write; autoplay; encrypted-media"
                            style={{
                                border: 'none',
                                width: '100%',
                                height: '180px',
                                borderRadius: '0'
                            }}
                            src="https://music.yandex.ru/iframe/album/33627812/track/131983269"
                            title="LONELY — BLVCK CVRNVGE"
                        />
                        <span style={{
                            opacity: 0.5,
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em'
                        }}>
                            [ СЛУШАТЬ НА YANDEX MUSIC ]
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};
