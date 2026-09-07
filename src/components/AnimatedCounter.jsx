import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * AnimatedCounter — Smoothly counts up to `value` when scrolled into view.
 *
 * Props:
 *   value     : number — target value
 *   suffix    : string — e.g. "%" or "+"
 *   prefix    : string — e.g. "$"
 *   duration  : number — animation duration in seconds (default 2)
 *   decimals  : number — decimal places (default 0)
 *   className : string — additional CSS classes
 */
export default function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  decimals = 0,
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const start = 0;
    const end = value;
    const startTime = performance.now();
    const dur = duration * 1000;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={`tabular-nums font-display font-bold ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}
