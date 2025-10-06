import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveal component: animates children into view on scroll using IntersectionObserver.
 * Adds classes: 'reveal' initially, then 'reveal-visible' when intersecting.
 */
const Reveal = ({ children, className = '', rootMargin = '0px 0px -10% 0px', threshold = 0.15 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Reveal;
