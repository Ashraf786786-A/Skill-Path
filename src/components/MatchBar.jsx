import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * MatchBar — Animated horizontal progress bar for evidence match scores.
 *
 * Props:
 *   score     : number  — 0 to 100
 *   label     : string  — e.g. "Evidence Match"
 *   color     : string  — tailwind gradient class or "brand" | "cyan" | "gold" | "green" | "red"
 *   showScore : boolean — show the percentage number (default true)
 *   height    : string  — bar height class (default "h-2")
 *   delay     : number  — animation delay in seconds
 *   className : string
 */

const COLORS = {
  brand: 'from-brand-500 to-purple-500',
  cyan:  'from-cyan-400 to-blue-500',
  gold:  'from-amber-400 to-orange-500',
  green: 'from-emerald-400 to-green-600',
  red:   'from-red-400 to-rose-600',
};

function getBarColor(score) {
  if (score >= 70) return COLORS.green;
  if (score >= 45) return COLORS.gold;
  return COLORS.red;
}

export default function MatchBar({
  score = 0,
  label = '',
  color = '',
  showScore = true,
  height = 'h-2',
  delay = 0,
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  const gradientClass = color
    ? (COLORS[color] || color)
    : getBarColor(score);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {(label || showScore) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-slate-400">{label}</span>
          )}
          {showScore && (
            <motion.span
              className="text-xs font-semibold text-slate-300 tabular-nums"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: delay + 0.3, duration: 0.3 }}
            >
              {score.toFixed(0)}%
            </motion.span>
          )}
        </div>
      )}

      <div className={`w-full ${height} rounded-full bg-white/[0.06] overflow-hidden`}>
        <motion.div
          className={`${height} rounded-full bg-gradient-to-r ${gradientClass}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${Math.min(score, 100)}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: delay,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      </div>
    </div>
  );
}
