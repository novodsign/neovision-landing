import React from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '../components/MagneticButton';
import logo from '../assets/logo.png';



export const Hero = () => {
    return (
        <section className="hero" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100vw',
                    height: '100vh',
                    minWidth: '100%',
                    minHeight: '100%',
                    objectFit: 'cover',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0
                }}
            >
                <source src="/assets/hero_video.mp4?v=2" type="video/mp4" />
            </video>

            {/* Dark overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', // Slightly darker for better text contrast over video
                zIndex: 1
            }}></div>

            {/* Content Container - Grid for Desktop */}
            <div className="container" style={{
                width: '100%', // FORCE FULL WIDTH
                height: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 2fr) 1fr', // Matches About Us grid ratio
                alignItems: 'center',
                zIndex: 2,
                position: 'relative',
                padding: '80px 4vw 0 4vw', // Explicit padding matching About's horizontal logic
                gap: '4rem' // Matches About gap
            }}>

                {/* Left Side: Text */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    style={{ textAlign: 'left' }} // Removed maxWidth to match About alignment
                >
                    <div style={{ marginTop: '2rem' }}> {/* Adjusted spacing since logo is gone */}
                        <h1 style={{
                            fontSize: 'clamp(3rem, 10vw, 8rem)',
                            letterSpacing: '-0.02em',
                            color: '#eaeaea', // Off-white
                            lineHeight: 1,
                            marginBottom: '1rem'
                        }}>
                            NEOVISION
                        </h1>
                        <div className="hero-content-text" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <p style={{
                                fontSize: '1.5rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontFamily: 'var(--font-header)',
                                fontWeight: 700
                            }}>
                                Лейбл и&nbsp;Промо
                            </p>
                            <p style={{
                                fontSize: '1.1rem',
                                maxWidth: '500px',
                                opacity: 0.8,
                                marginBottom: '2rem',
                                mixBlendMode: 'difference'
                            }}>
                                Экспериментальное пространство визуального и звукового искусства.
                            </p>
                        </div>
                    </div>

                    {/* Mobile Only Buttons Container (Hidden on Desktop via CSS) */}
                    <div className="hero-buttons mobile-only" style={{ display: 'none' }}>
                        {/* Will be shown by media query if we didn't use inline display none. 
                             Actually, let's just use the same container and adjust css.
                         */}
                    </div>
                </motion.div>

                {/* Right Side: Buttons (Moves to bottom on mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'flex-end',
                        paddingBottom: '10vh',
                        alignItems: 'flex-end'
                    }}
                    className="hero-buttons-container"
                >
                    <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <MagneticButton href="#events" variant="primary">
                            Билеты
                        </MagneticButton>

                        <MagneticButton href="#contact" variant="secondary">
                            Связаться
                        </MagneticButton>
                    </div>
                </motion.div>
            </div>

            {/* Inline Media Query for Mobile Layout would be ideal in CSS, but for inline strictly: */}
            {/* Since we can't easily do media queries in inline styles without a library or style tag hook,
                we rely on the grid layout behaving reasonably.
                'grid-template-columns: minmax(0, 1fr) minmax(max-content, auto)' might squeeze on mobile.
                Ideally we change flex-direction or grid cols on mobile. 
                I will inject a style tag for responsiveness if needed, but for now assuming Desktop focus 
                based on "Right side" request.
                Actually, I'll use a style block for the hero-container class. 
            */}
            <style>{`
                @media (max-width: 768px) {
                    .hero .container {
                        grid-template-columns: 1fr !important;
                        /* Removed forced center alignment for cleaner text block */
                        padding-top: 100px !important;
                        justify-items: start; /* Align grid items to start */
                        text-align: left;
                        /* Ensure content is scrollable if it disobeys 100vh on small screens */
                        height: auto !important; 
                        padding-bottom: 50px;
                    }
                    /* Adjust title size for mobile */
                    .hero h1 {
                        font-size: clamp(2.5rem, 10vw, 4rem) !important;
                    }
                    .hero .container > div {
                        /* Keep left alignment from inline styles */
                        width: 100%;
                    }
                    /* Ensure buttons align left too */
                    .hero .container > div:last-child {
                         align-items: flex-start !important;
                         justify-content: flex-start !important;
                         padding-bottom: 4rem !important;
                         flex-direction: row; /* Keep buttons side-by-side or stack? */
                    }
                    /* Stack buttons but keep their natural size */
                    .hero-buttons {
                        flex-direction: column;
                        align-items: flex-start !important; /* Start aligned, no stretch */
                        width: 100%;
                        margin-top: 2rem;
                        gap: 1rem !important; /* Consistent gap */
                    }
                    /* Ensure buttons are NOT full width */
                    .hero-buttons > * {
                        width: auto !important; 
                        min-width: 200px; /* Optional minimum width for touch targets */
                        display: inline-flex !important;
                    }
                    /* Add spacing to label text */
                    .hero-content-text {
                        margin-top: 1.5rem !important; /* More breathing room */
                    }
                }
            `}</style>
        </section>
    );
};

