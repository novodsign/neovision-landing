import React, { useEffect, useRef } from 'react';

export const DistortionFilter = () => {
    const deepRef = useRef(null);

    useEffect(() => {
        let frame;
        let time = 0;

        const animate = () => {
            time += 0.005;
            if (deepRef.current) {
                // Subtle vertical movement of the noise to simulate scanning/video feed
                // baseFrequency="0.01 0.5" -> keeping x low (streaky) and y high (noise)
                const freqY = 0.5 + Math.sin(time) * 0.05;
                deepRef.current.setAttribute('baseFrequency', `0.01 ${freqY}`);
            }
            frame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <filter id="glass-distortion">
                    <feTurbulence
                        ref={deepRef}
                        type="fractalNoise"
                        baseFrequency="0.01 0.5"
                        numOctaves="1"
                        result="noise"
                    />
                    <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
                    <feDisplacementMap in="SourceGraphic" in2="grayNoise" scale="50" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>
        </svg>
    );
};
