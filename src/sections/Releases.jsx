import React from 'react';



export const Releases = () => {
    return (
        <section id="releases" className="container" style={{ padding: '4rem 4vw' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Релизы</h2>
            <div style={{ width: '100%', minHeight: '450px', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                <iframe
                    frameBorder="0"
                    style={{ border: 'none', width: '100%', height: '450px' }}
                    width="100%"
                    height="450"
                    src="https://music.yandex.ru/iframe/#artist/14589945"
                    title="BLVCK CVRNVGE Yandex Music"
                />
            </div>
        </section>
    );
};
