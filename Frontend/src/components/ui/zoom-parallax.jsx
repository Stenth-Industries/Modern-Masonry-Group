'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

const POSITIONS = [
    { h: '40vh', w: '40vw', top: null,    left: null },
    { h: '32vh', w: '36vw', top: '-28vh', left: '5vw' },
    { h: '48vh', w: '22vw', top: '-8vh',  left: '-30vw' },
    { h: '30vh', w: '28vw', top: '0vh',   left: '28vw' },
    { h: '28vh', w: '22vw', top: '28vh',  left: '5vw' },
    { h: '28vh', w: '32vw', top: '28vh',  left: '-26vw' },
];

export function ZoomParallax({ images }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    // All hooks called at top level — no loops
    // Tighter scale ranges = less pixel interpolation work per frame
    const s0 = useTransform(scrollYProgress, [0, 1], [1, 2.5]);
    const s1 = useTransform(scrollYProgress, [0, 1], [1, 3]);
    const s2 = useTransform(scrollYProgress, [0, 1], [1, 3.5]);
    const s3 = useTransform(scrollYProgress, [0, 1], [1, 3]);
    const s4 = useTransform(scrollYProgress, [0, 1], [1, 3.5]);
    const s5 = useTransform(scrollYProgress, [0, 1], [1, 4.5]);
    const scales = [s0, s1, s2, s3, s4, s5];

    const six = images.slice(0, 6);

    return (
        <div ref={container} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
                {six.map(({ src, alt }, index) => {
                    const pos = POSITIONS[index];
                    const isCenter = index === 0;

                    return (
                        <motion.div
                            key={index}
                            style={{ scale: scales[index], willChange: "transform" }}
                            className="absolute top-0 flex h-full w-full items-center justify-center"
                        >
                            <div
                                className="group overflow-hidden cursor-pointer"
                                style={
                                    isCenter
                                        ? { height: pos.h, width: pos.w }
                                        : { height: pos.h, width: pos.w, top: pos.top, left: pos.left, position: 'relative' }
                                }
                            >
                                <img
                                    src={src}
                                    alt={alt}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <span
                                        className="text-white group-hover:text-[#ccab7b] transition-colors duration-300 font-bold uppercase tracking-[0.15em]"
                                        style={{ fontSize: isCenter ? '13px' : '11px' }}
                                    >
                                        {alt}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
