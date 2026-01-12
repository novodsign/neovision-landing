import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const Preloader = ({ onComplete, isFirstVisit }) => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Levels definition for Elevator
    const levels = [0, -1, -2, -3];

    useEffect(() => {
        if (isFirstVisit) {
            // --- FULL 'ELEVATOR' ANIMATION ---
            const levelDuration = 800; // ms per level
            const totalLevels = levels.length;

            // Progress Levels
            const timer = setInterval(() => {
                setCurrentLevel(prev => {
                    const next = prev - 1;
                    if (next < -3) {
                        clearInterval(timer);
                        return -3;
                    }
                    return next;
                });
            }, levelDuration);

            // Finish sequence
            const finishTimeout = setTimeout(() => {
                setIsFinished(true); // Triggers door opening

                // Mark as visited once complete
                sessionStorage.setItem('neovision_has_visited', 'true');

                // Actual Callback after doors open
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 2000);

            }, levelDuration * totalLevels + 500);

            return () => {
                clearInterval(timer);
                clearTimeout(finishTimeout);
            };

        } else {
            // --- MINIMAL ANIMATION ---
            // Just a short delay with a simple loader
            const minimalDuration = 1000; // 1 second total

            const timer = setTimeout(() => {
                setIsFinished(true); // Fade out trigger
                if (onComplete) onComplete();
            }, minimalDuration);

            return () => clearTimeout(timer);
        }
    }, [onComplete, isFirstVisit]);

    // RENDER: MINIMAL
    if (!isFirstVisit) {
        return (
            <motion.div
                className="preloader-minimal"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <rect className="spinner_zWVm" x="1" y="1" width="7.33" height="7.33" />
                    <rect className="spinner_gfyD" x="8.33" y="1" width="7.33" height="7.33" />
                    <rect className="spinner_T5JJ" x="1" y="8.33" width="7.33" height="7.33" />
                    <rect className="spinner_E3Wz" x="15.66" y="1" width="7.33" height="7.33" />
                    <rect className="spinner_g2vs" x="8.33" y="8.33" width="7.33" height="7.33" />
                    <rect className="spinner_ctYB" x="1" y="15.66" width="7.33" height="7.33" />
                    <rect className="spinner_BDNj" x="15.66" y="8.33" width="7.33" height="7.33" />
                    <rect className="spinner_rCw3" x="8.33" y="15.66" width="7.33" height="7.33" />
                    <rect className="spinner_Rszm" x="15.66" y="15.66" width="7.33" height="7.33" />
                </svg>
            </motion.div>
        );
    }

    // RENDER: FULL ELEVATOR
    return (
        <div className={`preloader-container ${isFinished ? 'finished' : 'shaking'}`}>
            {/* Left Door */}
            <div className="elevator-door left">
                <div className="safety-window"></div>
                <div className="kick-plate"></div>
            </div>

            {/* Right Door */}
            <div className="elevator-door right">
                <div className="safety-window"></div>
                <div className="kick-plate"></div>
            </div>

            {/* Floating Control Panel */}
            <motion.div
                className="control-panel"
                animate={{
                    opacity: isFinished ? 0 : 1,
                    scale: isFinished ? 0.9 : 1
                }}
                transition={{ duration: 0.5 }}
            >
                <div className="level-list">
                    {levels.map((lvl) => (
                        <div
                            key={lvl}
                            className={`level-item ${lvl === currentLevel ? 'active' :
                                lvl > currentLevel ? 'passed' : ''
                                }`}
                        >
                            LEVEL {lvl}
                        </div>
                    ))}
                </div>

                <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                    animation: 'pulse 0.5s infinite'
                }}></div>
            </motion.div>
        </div>
    );
};

export default Preloader;
