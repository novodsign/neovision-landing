import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo_vector.svg';

const NavItem = ({ href, to, children, onClick }) => {
    const Component = to ? Link : 'a';
    const MotionComponent = motion(Component);

    return (
        <MotionComponent
            href={href}
            to={to}
            onClick={onClick}
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
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check window size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const handleNavClick = (e, hash) => {
        if (e) e.preventDefault();

        setIsMenuOpen(false); // Close menu on click

        if (location.pathname !== '/') {
            navigate(`/${hash}`);
        } else {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const navLinks = [
        { label: 'О нас', href: '#about' },
        { label: 'Галерея', to: '/gallery' },
        { label: 'Релизы', href: '#releases' },
        { label: 'События', href: '#events' },
        { label: 'Контакты', href: '#contact' },
    ];

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
            color: '#fff'
            /* Removing mix-blend-mode from container to avoid messing up mobile menu overlay */
        }}>
            <Link
                to="/"
                onClick={(e) => {
                    setIsMenuOpen(false);
                    if (location.pathname === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }}
                style={{
                    zIndex: 101,
                    mixBlendMode: 'difference', // Apply blend mode ONLY to logo
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <img src={logo} alt="NeoVision" style={{ height: 'clamp(32px, 5vw, 60px)', width: 'auto', display: 'block' }} />
            </Link>

            {/* Desktop Menu */}
            {!isMobile && (
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    mixBlendMode: 'difference' // Apply blend mode ONLY to links
                }}>
                    {navLinks.map((link, i) => (
                        <NavItem
                            key={i}
                            href={link.href}
                            to={link.to}
                            onClick={link.href ? (e) => handleNavClick(e, link.href) : undefined}
                        >
                            {link.label}
                        </NavItem>
                    ))}
                </div>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        zIndex: 101,
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        mixBlendMode: 'difference' // Apply to hamburger button
                    }}
                >
                    <motion.div
                        animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        style={{ width: '24px', height: '2px', background: 'currentColor' }}
                    />
                    <motion.div
                        animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                        style={{ width: '24px', height: '2px', background: 'currentColor' }}
                    />
                    <motion.div
                        animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        style={{ width: '24px', height: '2px', background: 'currentColor' }}
                    />
                </button>
            )}

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {isMobile && isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: '#080808', // Clean dark background
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start', // Align to top
                            zIndex: 100, // Behind the close button (101)
                            padding: '6rem 2rem 2rem 2rem' // Padding for top bar and sides
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            {navLinks.map((link, i) => {
                                const Component = link.to ? Link : 'a';
                                return (
                                    <Component
                                        key={i}
                                        href={link.href}
                                        to={link.to}
                                        onClick={link.href ? (e) => handleNavClick(e, link.href) : () => setIsMenuOpen(false)}
                                        style={{
                                            fontSize: '1.5rem',
                                            textTransform: 'uppercase',
                                            color: '#fff',
                                            textDecoration: 'none',
                                            fontFamily: 'var(--font-header)',
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'baseline',
                                            borderBottom: '1px solid rgba(255,255,255,0.2)',
                                            padding: '1.5rem 0'
                                        }}
                                    >
                                        <span>{link.label}</span>
                                        <span style={{
                                            fontSize: '1rem',
                                            opacity: 0.5,
                                            fontFamily: 'var(--font-body)'
                                        }}>
                                            {`(${String(i + 1).padStart(2, '0')})`}
                                        </span>
                                    </Component>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
