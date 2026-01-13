import React from 'react';



export const Releases = () => {
    return (
        <section id="releases" className="container" style={{ padding: '4rem 4vw' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Релизы</h2>
            <div style={{
                width: '100%',
                minHeight: '300px',
                borderTop: '1px solid #333',
                paddingTop: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '600px',
                    padding: '3rem 2rem',
                    background: 'linear-gradient(145deg, #111, #0a0a0a)',
                    border: '1px solid #222',
                    borderRadius: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-header)' }}>BLVCK CVRNVGE</h3>
                        <p style={{ color: '#888', margin: 0 }}>Слушать последние релизы</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
                        <a
                            href="https://music.yandex.ru/artist/14589945"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                padding: '1rem',
                                backgroundColor: '#fc0',
                                color: '#000',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                borderRadius: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <span style={{ fontSize: '1.2rem' }}>PLAY ON YANDEX MUSIC</span>
                        </a>

                        <a
                            href="https://vk.com/music/artist/blvck_cvrnvge"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                padding: '1rem',
                                backgroundColor: '#0077FF',
                                color: '#fff',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                borderRadius: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <span style={{ fontSize: '1.2rem' }}>PLAY ON VK MUSIC</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
