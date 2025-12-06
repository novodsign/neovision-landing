import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: '1.5rem 4vw',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 100,
            mixBlendMode: 'difference',
            color: '#fff'
        }}>
            <div style={{ fontWeight: '700', textTransform: 'uppercase' }}>NeoVision</div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Simple responsive wrap */}
                <a href="#about" style={{ fontSize: '0.9rem', textTransform: 'uppercase', textDecoration: 'none', color: 'inherit' }}>О нас</a>
                <Link to="/gallery" style={{ fontSize: '0.9rem', textTransform: 'uppercase', textDecoration: 'none', color: 'inherit' }}>Галерея</Link>
                <a href="#releases" style={{ fontSize: '0.9rem', textTransform: 'uppercase', textDecoration: 'none', color: 'inherit' }}>Релизы</a>
                <a href="#events" style={{ fontSize: '0.9rem', textTransform: 'uppercase', textDecoration: 'none', color: 'inherit' }}>События</a>
                <a href="#contact" style={{ fontSize: '0.9rem', textTransform: 'uppercase', textDecoration: 'none', color: 'inherit' }}>Контакты</a>
            </div>
        </nav>
    );
}
