import React, { useState, useRef, useEffect } from 'react';
import { MagneticButton } from '../components/MagneticButton';

const releases = [
    {
        title: "LONELY",
        artist: "BLVCK CVRNVGE",
        year: "2024",
        yandexLink: "https://music.yandex.ru/album/33627812/track/131983269",
        yandexEmbed: "https://music.yandex.ru/iframe/album/33627812/track/131983269",
        vkLink: "https://vk.com/blvckcvrnvge",
        audioSrc: "/audio/lonely.mp3"
    },
    {
        title: "Ночь",
        artist: "Asenssia",
        year: "2024",
        yandexLink: "https://music.yandex.ru/album/21241332/track/100949287",
        yandexEmbed: "https://music.yandex.ru/iframe/album/21241332/track/100949287",
        vkLink: "https://vk.com/asenssia",
        audioSrc: "/audio/noch.mp3"
    },
    {
        title: "Moon",
        artist: "BLVCK CVRNVGE",
        year: "2024",
        yandexLink: "https://music.yandex.ru/album/33916709/track/132687440",
        yandexEmbed: "https://music.yandex.ru/iframe/album/33916709/track/132687440",
        vkLink: "https://vk.com/blvckcvrnvge",
        audioSrc: "/audio/moon.mp3"
    }
];

export const ReleasesList = () => {
    const [playingIndex, setPlayingIndex] = useState(null);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            audioRef.current.pause();
            audioRef.current.src = "";
        };
    }, []);

    const handlePlayPause = (index, src) => {
        if (playingIndex === index) {
            // Toggle pause
            if (!audioRef.current.paused) {
                audioRef.current.pause();
                setPlayingIndex(null); // Show play icon
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed (file might be missing):", e));
                setPlayingIndex(index); // Show pause icon
            }
        } else {
            // Play new track
            audioRef.current.pause();
            audioRef.current.src = src;
            audioRef.current.load();
            audioRef.current.play().catch(e => console.log("Audio play failed (file might be missing):", e));
            setPlayingIndex(index);

            // Auto reset when ended
            audioRef.current.onended = () => setPlayingIndex(null);
        }
    };

    return (
        <section className="container" style={{ padding: '6rem 4vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <h2 style={{
                    fontSize: 'clamp(3rem, 5vw, 4rem)',
                    margin: 0,
                    fontFamily: 'var(--font-header)',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em'
                }}>Релизы</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {releases.map((release, index) => (
                    <div
                        key={index}
                        className="release-item"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '2rem 0',
                            borderBottom: '1px solid var(--color-border)',
                            position: 'relative'
                        }}
                    >
                        {/* Left Side: Play Button + Title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginRight: 'auto' }}>
                            {/* Play Button */}
                            <button
                                onClick={() => handlePlayPause(index, release.audioSrc)}
                                style={{
                                    width: '34px', // Reduced from 50px to match text height
                                    height: '34px',
                                    borderRadius: '50%',
                                    border: '1px solid var(--color-border)', // Subtle border by default
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-text)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    flexShrink: 0,
                                    opacity: 0.8 // Slightly muted
                                }}
                                className="play-btn"
                                aria-label={playingIndex === index ? "Pause" : "Play"}
                            >
                                {playingIndex === index ? (
                                    // Pause Icon
                                    <svg width="10" height="12" viewBox="0 0 14 16" fill="currentColor">
                                        <rect width="4" height="16" rx="1" />
                                        <rect x="10" width="4" height="16" rx="1" />
                                    </svg>
                                ) : (
                                    // Play Icon
                                    <svg width="10" height="12" viewBox="0 0 14 16" fill="currentColor" style={{ marginLeft: '2px' }}>
                                        <path d="M14 8L0 16V0L14 8Z" />
                                    </svg>
                                )}
                            </button>

                            {/* Title */}
                            <span style={{
                                fontSize: '2.2rem',
                                fontWeight: '600',
                                fontFamily: 'var(--font-header)',
                                textTransform: 'uppercase',
                                lineHeight: 1,
                                letterSpacing: '-0.02em',
                                cursor: 'default'
                            }} className="release-title">
                                {release.title}
                            </span>
                        </div>

                        {/* Right Side Group: Year + Buttons */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3rem',
                            flexShrink: 0
                        }}>
                            <span style={{
                                fontSize: '1.2rem',
                                fontFamily: 'var(--font-body)',
                                color: 'var(--color-text-muted)',
                                flexShrink: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                {release.year}
                            </span>

                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <MagneticButton
                                    href={release.yandexLink}
                                    variant="secondary"
                                    style={{
                                        minWidth: 'auto',
                                        padding: '0.6rem 1.2rem',
                                        fontSize: '0.85rem',
                                        borderRadius: '50px',
                                        display: 'flex',
                                        gap: '0.4rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    Yandex
                                </MagneticButton>

                                <MagneticButton
                                    href={release.vkLink}
                                    variant="secondary"
                                    style={{
                                        minWidth: 'auto',
                                        padding: '0.6rem 1.2rem',
                                        fontSize: '0.85rem',
                                        borderRadius: '50px',
                                        display: 'flex',
                                        gap: '0.4rem',
                                        alignItems: 'center'
                                    }}
                                >
                                    VK
                                </MagneticButton>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .play-btn:hover {
                    background-color: transparent; /* Keep transparent */
                    border-color: var(--color-text) !important; /* Brighten border to white */
                    opacity: 1 !important;
                    transform: scale(1.1);
                }
                .release-item {
                    transition: opacity 0.3s;
                }
                .release-item:hover {
                    opacity: 1;
                }
                /* Optional: dim non-hovered items slightly for focus effect, valid for lists */
                .release-item:hover .release-title {
                     opacity: 1;
                }

                @media (max-width: 768px) {
                    .release-item {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 1rem !important;
                    }
                    .release-title {
                        font-size: 1.8rem !important;
                    }
                    div[style*="margin-right: auto"] {
                         width: 100%;
                         justify-content: flex-start;
                         gap: 1rem !important;
                    }
                     /* Make play button same size on mobile or slightly adjusted if needed */
                    .play-btn {
                       /* Keep consistent 34px or let it inherit */
                    }
                    div[style*="flex-shrink: 0"] {
                         width: 100%;
                         justify-content: space-between;
                         gap: 0 !important; /* Reset big gap */
                    }
                }
            `}</style>
        </section>
    );
};
