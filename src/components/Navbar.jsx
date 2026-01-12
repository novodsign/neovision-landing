import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavItem = ({ href, to, children }) => {
    const Component = to ? Link : 'a';
    const MotionComponent = motion(Component);

    return (
        <MotionComponent
            href={href}
            to={to}
            whileHover={{ scale: 1.1, opacity: 0.8 }}
            whileTap={{ scale: 0.95 }}
            style={{
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer'
            }}
        >
            {children}
        </MotionComponent>
    );
};

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
            <Link to="/" style={{ fontWeight: '700', textTransform: 'uppercase', textDecoration: 'none', color: 'inherit' }}>
                NeoVision
            </Link>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <NavItem href="#about">О нас</NavItem>
                <NavItem to="/gallery">Галерея</NavItem>
                <NavItem href="#releases">Релизы</NavItem>
                <NavItem href="#events">События</NavItem>
                <NavItem href="#contact">Контакты</NavItem>
            </div>
        </nav>
    );
}
