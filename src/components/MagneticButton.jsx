import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const MagneticButton = ({ children, onClick, href, variant = 'primary', className, style }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Base component (a or button)
    const Component = href ? motion.a : motion.button;

    // Visual Constants
    const isPrimary = variant === 'primary';
    const baseColor = '#eaeaea'; // Border/Text color
    // Determine background: Primary is solid, Secondary is transparent
    const bgColor = isPrimary ? '#eaeaea' : 'transparent';
    const textColor = isPrimary ? '#080808' : '#eaeaea';

    // Hover Colors
    const hoverTextColor = isPrimary ? '#eaeaea' : '#080808'; // Invert on hover
    const fillColor = isPrimary ? '#080808' : '#eaeaea'; // Fill with opposite

    return (
        <Component
            ref={ref}
            href={href}
            onClick={onClick}
            className={className}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                display: 'inline-block',
                cursor: 'pointer',
                textDecoration: 'none',
                padding: '0.8rem 2rem', // Default nice padding
                borderRadius: '2rem',
                border: `1px solid ${baseColor}`, // Always show white border
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '0.9rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                overflow: 'hidden', // Essential for masking fill
                textAlign: 'center',
                minWidth: '140px',
                zIndex: 1,
                ...style // Allow overrides
            }}
        >
            {/* Fill Circle */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: isHovered ? 2.5 : 0,
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '50%', // Center initially
                    left: '50%',
                    width: '100%', // Base size relative to button
                    paddingBottom: '100%', // Make it square (circle aspect ratio)
                    marginTop: '-50%', // Center offset
                    marginLeft: '-50%', // Center offset
                    borderRadius: '50%',
                    backgroundColor: fillColor,
                    pointerEvents: 'none',
                    zIndex: 0, // Changed from -1 to 0 to be visible over parent bg
                }}
            />

            {/* Content Text - Needs to change color */}
            <motion.span
                animate={{ color: isHovered ? hoverTextColor : textColor }}
                transition={{ duration: 0.3 }}
                style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'block' // Ensure structure
                }}
            >
                {children}
            </motion.span>
        </Component>
    );
};
