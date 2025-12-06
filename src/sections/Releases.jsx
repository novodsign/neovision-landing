import React from 'react';

const releases = [
    { artist: 'Artist One', title: 'Dark Matter EP', year: '2024', link: '#' },
    { artist: 'Artist Two', title: 'Void Whispers', year: '2023', link: '#' },
    { artist: 'NeoVision', title: 'Compilation Vol. 1', year: '2022', link: '#' },
];

export const Releases = () => {
    return (
        <section id="releases" className="container" style={{ padding: '4rem 4vw' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Релизы</h2>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #333' }}>
                {releases.map((rel, i) => (
                    <a key={i} href={rel.link} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '2rem 0',
                        borderBottom: '1px solid #333',
                        transition: 'opacity 0.2s'
                    }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold' }}>{rel.title}</span>
                            <span style={{ fontSize: '1rem', color: '#888' }}>{rel.artist}</span>
                        </div>
                        <span style={{ fontSize: '1rem', fontFamily: 'var(--font-header)' }}>{rel.year} &rarr;</span>
                    </a>
                ))}
            </div>
        </section>
    );
};
