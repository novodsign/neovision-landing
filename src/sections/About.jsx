import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ambientTrack from '../assets/audio/ambient.ogg';

export const About = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
            audioRef.current.volume = 0.5;
        }
        setIsPlaying(!isPlaying);
    };

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
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>О нас</h2>
                    <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                        NeoVision — творческое объединение артистов, продвигающих тёмное звучание электронной музыки.
                    </p>
                    <p style={{ fontSize: '1.25rem', opacity: 0.7, lineHeight: 1.6 }}>
                        Изначально существующий с&nbsp;2020 года как фестиваль, NeoVision перерос в&nbsp;музыкальный лейбл и&nbsp;промо-команду. Все участники имеют уникальный звук и&nbsp;собственное, новое видение Российской электроники.
                    </p>
                </div>

                <div className="about-player-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                    <audio ref={audioRef} src={ambientTrack} loop />

                    <motion.button
                        onClick={togglePlay}
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
                            {isPlaying ? (
                                <div style={{ width: '10px', height: '10px', background: '#000' }}></div>
                            ) : (
                                <div style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: '5px solid transparent',
                                    borderBottom: '5px solid transparent',
                                    borderLeft: '8px solid #000', // Black triangle
                                    marginLeft: '2px'
                                }}></div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                            <span style={{
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                fontFamily: 'var(--font-header)',
                                textTransform: 'uppercase',
                                color: '#000', // Black text
                                fontWeight: '700'
                            }}>
                                NEOVISION AUDIO
                            </span>
                            <div style={{ display: 'flex', gap: '3px', height: '16px', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            height: isPlaying ? ['4px', '12px', '4px'] : '2px',
                                            opacity: isPlaying ? 1 : 0.5
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            delay: i * 0.05,
                                            ease: "easeInOut"
                                        }}
                                        style={{ width: '2px', backgroundColor: '#000' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.button>

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
