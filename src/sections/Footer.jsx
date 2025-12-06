import React from 'react';

export const Footer = () => {
    return (
        <footer id="contact" className="container" style={{
            padding: '4rem 4vw',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '4rem',
            borderTop: '1px solid #333'
        }}>
            <div style={{ opacity: 0.5 }}>&copy; 2025 NeoVision</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#">Instagram</a>
                <a href="#">Telegram</a>
                <a href="#">Email</a>
            </div>
        </footer>
    );
};
