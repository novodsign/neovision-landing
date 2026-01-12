import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

const Preloader = ({ onComplete, isFirstVisit }) => {
    useEffect(() => {
        // Simple spinner for both first visit and returning
        const duration = isFirstVisit ? 1500 : 800;

        const timer = setTimeout(() => {
            if (isFirstVisit) {
                sessionStorage.setItem('neovision_has_visited', 'true');
            }
            if (onComplete) onComplete();
        }, duration);

        return () => clearTimeout(timer);
    }, [onComplete, isFirstVisit]);

    // RENDER: First visit - Simple clean spinner
    if (isFirstVisit) {
        return (
            <motion.div
                className="preloader-minimal"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#050505',
                    zIndex: 9999
                }}
            >
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '2px solid #333',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'preloader-spin 1s linear infinite'
                }} />
                <style>{`@keyframes preloader-spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
        );
    }

    // RENDER: Returning visits - Original 3x3 grid spinner
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
};

export default Preloader;
