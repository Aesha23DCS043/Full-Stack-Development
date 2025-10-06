import React, { useEffect, useRef } from 'react';

/**
 * CursorBubbles: lightweight canvas-based cursor trail with floating bubbles.
 * - Pointer-events: none, so it won't block clicks
 * - Respects prefers-reduced-motion
 */
export default function CursorBubbles({ color = 'rgba(162, 189, 213, 0.92)' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // Respect user setting

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    const spawnParticles = (x, y, count = 2) => {
      for (let i = 0; i < count; i++) {
        const size = 2 + Math.random() * 5; // 2-7px
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.6, // slight horizontal drift
          vy: -0.6 - Math.random() * 0.8,   // float upward
          size,
          life: 900 + Math.random() * 600,  // ms
          age: 0,
          hueShift: Math.random() * 20,
        });
      }
    };

    const onMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      const now = performance.now();
      if (now - lastSpawnRef.current > 12) { // throttle spawn
        lastSpawnRef.current = now;
        spawnParticles(e.clientX, e.clientY, 2 + (Math.random() < 0.3 ? 1 : 0));
      }
    };
    window.addEventListener('mousemove', onMove);

    let last = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = Math.min(32, now - last); // cap delta for stability
      last = now;

      // Clear with slight fade to create trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);

        const t = Math.min(1, p.age / p.life);
        const alpha = (1 - t) * 0.9; // fade out
        const radius = p.size * (1 + t * 0.2);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.age >= p.life || p.y + radius < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particles.splice(i, 1);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, [color]);

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
        zIndex: 30,
      }}
    />
  );
}
