import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Footer } from '../sections/Footer';

// Import all images
import img1 from '../assets/images/img_1.jpg';
import img2 from '../assets/images/img_2.jpg';
import img3 from '../assets/images/img_3.jpg';
import img4 from '../assets/images/img_4.jpg';
import img5 from '../assets/images/img_5.jpg';
import img6 from '../assets/images/img_6.jpg';
import img7 from '../assets/images/img_7.jpg';
import img8 from '../assets/images/img_8.jpg';
import img9 from '../assets/images/img_9.jpg';
import img10 from '../assets/images/img_10.jpg';

const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

export const GalleryPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <main style={{ flex: 1, paddingTop: '120px', paddingBottom: '80px' }} className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 style={{
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        marginBottom: '60px',
                        textAlign: 'center'
                    }}>
                        Visual Archive
                    </h1>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem',
                }}>
                    {images.map((src, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            style={{
                                width: '100%',
                                aspectRatio: i % 3 === 0 ? '3/4' : '4/3', // Varied aspect ratios
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={src}
                                alt={`Gallery image ${i + 1}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};
