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
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>О нас</h2>
                    <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                        NeoVision — творческое объединение артистов, продвигающих тёмное звучание электронной музыки.
                    </p>
                    <p style={{ fontSize: '1.25rem', opacity: 0.7, lineHeight: 1.6 }}>
                        Изначально существующий с 2020 года как фестиваль, NeoVision перерос в музыкальный лейбл и промо-команду. Все участники имеют уникальный звук и собственное, новое видение Российской электроники.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
                    <audio ref={audioRef} src={ambientTrack} loop />

                    <motion.button
                        onClick={togglePlay}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '30px', // Soft rounded corners (pill shape)
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            cursor: 'pointer',
                            width: 'auto',
                            minWidth: '240px',
                            backdropFilter: 'blur(5px)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#000'
                        }}>
                            {/* Play/Pause Icon */}
                            {isPlaying ? (
                                <div style={{ width: '12px', height: '12px', background: '#000', borderRadius: '1px' }}></div>
                            ) : (
                                <div style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: '6px solid transparent',
                                    borderBottom: '6px solid transparent',
                                    borderLeft: '10px solid #000',
                                    marginLeft: '2px'
                                }}></div>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>
                                Ambient Mode
                            </span>
                            <div style={{ display: 'flex', gap: '3px', height: '16px', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            height: isPlaying ? ['4px', '16px', '4px'] : '4px',
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }}
                                        style={{ width: '3px', borderRadius: '2px', backgroundColor: '#fff' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.button>
                </div>
            </div>
        </section>
    );
};
