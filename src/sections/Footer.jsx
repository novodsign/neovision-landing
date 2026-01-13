import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavClick = (e, hash) => {
        e.preventDefault();

        if (location.pathname !== '/') {
            navigate(`/${hash}`);
        } else {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <footer id="contact" className="container" style={{
            width: '100%',
            padding: '4rem 4vw',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4rem',
            borderTop: '1px solid #333'
        }}>
            <div style={{ opacity: 0.5 }}>&copy; 2025 NeoVision</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ pointerEvents: 'none', color: '#666', textDecoration: 'none' }}>Instagram *</a>
                    <a href="https://t.me/neovision" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Telegram</a>
                    <a href="mailto:contact@neovision.com" style={{ color: 'inherit', textDecoration: 'none' }}>Email</a>
                </div>
                <div style={{ fontSize: '0.6rem', opacity: 0.3, maxWidth: '300px', textAlign: 'right' }}>
                    * Деятельность Meta (соцсети Facebook и Instagram) запрещена в России как экстремистская.
                </div>
            </div>
        </footer>
    );
};
