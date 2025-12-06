import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import images for the main page grid (showing 8 images for a nice 4x2 grid)
import img1 from '../assets/images/img_1.jpg';
import img2 from '../assets/images/img_2.jpg';
import img3 from '../assets/images/img_3.jpg';
import img4 from '../assets/images/img_4.jpg';
import img5 from '../assets/images/img_5.jpg';
import img6 from '../assets/images/img_6.jpg';
import img7 from '../assets/images/img_7.jpg';
import img8 from '../assets/images/img_8.jpg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

export const Gallery = () => {
    return (
        <section className="container" style={{ padding: '4rem 4vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '3rem', margin: 0 }}>Галерея</h2>
                <Link to="/gallery" style={{
                    fontSize: '1rem',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    opacity: 0.7
                }}>
                    Посмотреть все
                </Link>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
            }}>
                {images.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        style={{
                            aspectRatio: '1',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        <img
                            src={src}
                            alt={`Gallery ${i}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
