import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const PAGE_TITLES = {
  '/':               'Overview',
  '/students':       'Students',
  '/evidence':       'Evidence',
  '/skills':         'Skills',
  '/careers':        'Career Explorer',
  '/recommendations':'Recommendations',
  '/review':         'Human Review',
  '/tradeoff':       'Stakeholder Trade-off',
};

export default function TopBar() {
  const location = useLocation();

  // Resolve title — handle dynamic routes like /students/s001
  let title = PAGE_TITLES[location.pathname];
  if (!title && location.pathname.startsWith('/students/')) {
    title = 'Student Detail';
  }
  if (!title) title = 'SkillPath';

  return (
    <motion.header
      className="sticky top-0 z-40 h-16 flex items-center justify-between px-6
                 border-b border-white/[0.06] bg-surface-950/70 backdrop-blur-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-lg font-display font-semibold text-white tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Synthetic data badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-amber-500/[0.08] border border-amber-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-medium text-amber-400/90 tracking-wide">
            SYNTHETIC PROTOTYPE
          </span>
        </div>

        {/* Ethics tag */}
        <div className="hidden md:flex items-center gap-1.5 text-emerald-400/60">
          <Shield size={14} />
          <span className="text-[11px] font-medium tracking-wide">ETHICAL AI</span>
        </div>
      </div>
    </motion.header>
  );
}
