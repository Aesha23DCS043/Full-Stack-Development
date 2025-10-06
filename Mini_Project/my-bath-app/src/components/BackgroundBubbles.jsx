import React, { useEffect, useRef } from 'react';

/**
 * BackgroundBubbles: soft ambient bubbles floating slowly in the background.
 * - Full-screen canvas behind content (very low z-index)
 * - Mix of big and small bubbles with gentle sway
 * - Optimized for performance and respects prefers-reduced-motion
 */
export default function BackgroundBubbles({
  maxBubbles = 48,
  minSize = 12,
  maxSize = 84,
  baseOpacity = 0.10,
  color = 'rgba(160, 231, 247, 1.0)',
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const bubblesRef = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    const spawnBubble = () => {
      const size = Math.random() < 0.35
        ? minSize + Math.random() * (minSize * 1.6) // more small bubbles
        : minSize + Math.random() * (maxSize - minSize); // occasional big ones
      const speed = 0.08 + (1 - size / maxSize) * 0.35; // bigger = slower
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + size + Math.random() * window.innerHeight * 0.5; // start below
      const drift = (Math.random() - 0.5) * 0.25; // subtle left/right
      const phase = Math.random() * Math.PI * 2;
      const opacity = baseOpacity * (0.6 + Math.random() * 0.8);
      return { x, y, r: size, vy: -speed, vx: drift, phase, opacity };
    };

    // initialize
    bubblesRef.current = Array.from({ length: maxBubbles }, spawnBubble);

    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(32, now - last);
      last = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < bubblesRef.current.length; i++) {
        const b = bubblesRef.current[i];
        // gentle horizontal sway
        b.phase += 0.0008 * dt;
        const sway = Math.sin(b.phase) * 0.35;
        b.x += (b.vx + sway) * (dt / 16);
        b.y += b.vy * (dt / 16);

        // wrap to bottom when off the top
        if (b.y + b.r < -10) {
          bubblesRef.current[i] = spawnBubble();
          continue;
        }

        // draw bubble with soft inner highlight
        const grd = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, b.x, b.y, b.r);
        const inner = color.replace('1.0', (0.22 * b.opacity).toString());
        grd.addColorStop(0, inner);
        grd.addColorStop(1, color.replace('1.0', '0'));
        ctx.fillStyle = grd;
        ctx.globalAlpha = b.opacity;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [maxBubbles, minSize, maxSize, baseOpacity, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0, // behind everything
      }}
    />
  );
}
