import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * SplitReveal — Premium time-based intro transition overlay.
 *
 * Architecture:
 *   - Fixed overlay ON TOP of the hero/page content.
 *   - Two halves show a looping video (cinematic intro feel).
 *   - On mount: halves cover the screen with the video playing.
 *   - After a short hold, the halves slide apart revealing the real hero.
 *   - Near the end, the entire overlay fades out smoothly.
 *   - Once fully faded, the component unmounts via onComplete callback.
 *   - No scroll interaction. Pure CSS transitions + native video.
 *
 * Timing (total ~3.2s):
 *   - 0ms–800ms:    Hold (video playing, subtle texture overlay)
 *   - 800ms–2200ms: Halves slide apart (1.4s ease-out)
 *   - 1800ms–3200ms: Entire overlay fades out (1.4s ease)
 *   - 3200ms: onComplete fires, overlay unmounts
 */

// Inline noise texture — subtle concrete/stone grain
const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function SplitReveal({ onComplete }) {
  // Phase tracking:
  // 'holding'   → video playing, waiting
  // 'splitting' → halves sliding apart
  // 'fading'    → entire overlay fading out
  // 'done'      → ready to unmount
  const [phase, setPhase] = useState('holding');
  const videoLeftRef = useRef(null);
  const videoRightRef = useRef(null);

  const handleComplete = useCallback(() => {
    setPhase('done');
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // Timer chain: hold → split → fade → done
    const t1 = setTimeout(() => setPhase('splitting'), 800);
    const t2 = setTimeout(() => setPhase('fading'), 1800);
    const t3 = setTimeout(handleComplete, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [handleComplete]);

  // Sync both video elements to the same playback position
  useEffect(() => {
    const vl = videoLeftRef.current;
    const vr = videoRightRef.current;
    if (vl && vr) {
      // When left video seeks, sync right
      const sync = () => { vr.currentTime = vl.currentTime; };
      vl.addEventListener('seeked', sync);
      vl.addEventListener('play', () => vr.play().catch(() => {}));
      // Start playback
      vl.play().catch(() => {});
      vr.play().catch(() => {});
    }
  }, []);

  // Once done, render nothing
  if (phase === 'done') return null;

  // Compute styles based on phase
  const isSplit = phase === 'splitting' || phase === 'fading';
  const isFading = phase === 'fading';

  // Shared video styles — each half clips its own portion
  const videoStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    minWidth: '100vw',
    minHeight: '100vh',
    width: 'auto',
    height: 'auto',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
  };

  return (
    <div
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {/* ── Left half ─────────────────────────────────── */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden"
        style={{
          transform: isSplit ? 'translateX(-101%)' : 'translateX(0)',
          transition: 'transform 1.4s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        {/* Video background — positioned to show left half of full frame */}
        <video
          ref={videoLeftRef}
          src="/Untitled (3).mp4"
          muted
          loop
          playsInline
          preload="auto"
          style={{
            ...videoStyle,
            // Shift so this half shows the left portion of the video
            left: '100%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Dark overlay for premium feel */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Subtle stone texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: NOISE_BG, mixBlendMode: 'overlay' }}
        />
        {/* Soft edge shadow for depth at the seam */}
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-black/60 to-transparent" />
      </div>

      {/* ── Right half ────────────────────────────────── */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden"
        style={{
          transform: isSplit ? 'translateX(101%)' : 'translateX(0)',
          transition: 'transform 1.4s cubic-bezier(0.76, 0, 0.24, 1)',
        }}
      >
        {/* Video background — positioned to show right half of full frame */}
        <video
          ref={videoRightRef}
          src="/Untitled (3).mp4"
          muted
          loop
          playsInline
          preload="auto"
          style={{
            ...videoStyle,
            // Shift so this half shows the right portion of the video
            left: '0%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Dark overlay for premium feel */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Subtle stone texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: NOISE_BG, mixBlendMode: 'overlay' }}
        />
        {/* Soft edge shadow for depth at the seam */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* ── Center seam glow — warm brass light bleeding through ── */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: isSplit ? '4px' : '0px',
          opacity: isSplit && !isFading ? 0.5 : 0,
          background: 'var(--brass, #C9A449)',
          boxShadow: '0 0 30px var(--brass-light, #DDB95A), 0 0 60px var(--brass, #C9A449)',
          filter: 'blur(2px)',
          transition: 'width 0.6s ease-out, opacity 0.8s ease',
        }}
      />
    </div>
  );
}
