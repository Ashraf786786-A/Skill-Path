import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Brain,
  Compass,
  Star,
  ShieldCheck,
  Scale,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Key,
  Activity,
  BarChart2,
} from 'lucide-react';

const NAV_ITEMS_PHASE1 = [
  { to: '/',              icon: LayoutDashboard, label: 'Overview' },
  { to: '/students',      icon: Users,           label: 'Students' },
  { to: '/evidence',      icon: FileCheck,       label: 'Evidence' },
  { to: '/skills',        icon: Brain,           label: 'Skills' },
  { to: '/careers',       icon: Compass,         label: 'Career Explorer' },
  { to: '/recommendations', icon: Star,          label: 'Recommendations' },
  { to: '/review',        icon: ShieldCheck,     label: 'Human Review' },
  { to: '/tradeoff',      icon: Scale,           label: 'Stakeholder Trade-off' },
];

const NAV_ITEMS_PHASE2 = [
  { to: '/feedback',      icon: MessageSquare,   label: 'Stakeholder Feedback' },
  { to: '/access',        icon: Key,             label: 'Access Control' },
  { to: '/health',        icon: Activity,        label: 'Health Monitor' },
  { to: '/metrics',       icon: BarChart2,       label: 'Baseline Metrics' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      className="fixed top-0 left-0 z-50 h-screen flex flex-col border-r border-white/[0.06] bg-surface-950/90 backdrop-blur-xl"
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Sparkles size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              className="font-display font-bold text-lg tracking-tight gradient-text whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              SkillPath
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS_PHASE1.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="block"
            >
              <motion.div
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-colors duration-200 group
                  ${isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }
                `}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-brand-500/10 border border-brand-500/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <item.icon
                  size={20}
                  className={`relative z-10 shrink-0 ${isActive ? 'text-brand-400' : ''}`}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="relative z-10 text-sm font-medium whitespace-nowrap"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active dot when collapsed */}
                {isActive && collapsed && (
                  <motion.div
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-400"
                    layoutId="activeDot"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}

        {/* Phase 2 Divider */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-semibold text-purple-400/60 uppercase tracking-widest">Phase 2</p>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && <div className="my-1 mx-auto w-6 h-px bg-white/10" />}

        {NAV_ITEMS_PHASE2.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="block"
            >
              <motion.div
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-colors duration-200 group
                  ${isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }
                `}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav2"
                    className="absolute inset-0 rounded-xl bg-purple-500/10 border border-purple-500/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <item.icon
                  size={20}
                  className={`relative z-10 shrink-0 ${isActive ? 'text-purple-400' : ''}`}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="relative z-10 text-sm font-medium whitespace-nowrap"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && collapsed && (
                  <motion.div
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-400"
                    layoutId="activeDot2"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Ethics Badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="mx-3 mb-3 p-3 rounded-xl bg-emerald-500/[0.07] border border-emerald-500/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="text-[10px] font-medium text-emerald-400/80 uppercase tracking-widest mb-1">
              Ethics
            </p>
            <p className="text-[11px] text-emerald-300/70 leading-relaxed">
              Evidence-based, not surveillance-based.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-white/[0.06]
                   text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]
                   transition-colors duration-200"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
