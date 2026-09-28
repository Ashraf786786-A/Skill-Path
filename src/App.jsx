import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';

// Phase 1 pages
import Overview from './pages/Overview.jsx';
import Students from './pages/Students.jsx';
import StudentDetail from './pages/StudentDetail.jsx';
import Evidence from './pages/Evidence.jsx';
import Skills from './pages/Skills.jsx';
import CareerExplorer from './pages/CareerExplorer.jsx';
import Recommendations from './pages/Recommendations.jsx';
import HumanReview from './pages/HumanReview.jsx';
import StakeholderTradeoff from './pages/StakeholderTradeoff.jsx';

// Phase 2 pages
import StakeholderFeedback from './pages/StakeholderFeedback.jsx';
import AccessControl from './pages/AccessControl.jsx';
import OperationalHealth from './pages/OperationalHealth.jsx';
import BaselineMetrics from './pages/BaselineMetrics.jsx';

export default function App() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-950 bg-noise">
      {/* Ambient glow behind everything */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%]
                        bg-brand-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%]
                        bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main area — offset by sidebar width */}
      <div className="flex-1 ml-[260px] relative z-10 transition-all duration-300">
        <TopBar />

        <main className="p-6">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Phase 1 */}
              <Route path="/"              element={<Overview />} />
              <Route path="/students"      element={<Students />} />
              <Route path="/students/:id"  element={<StudentDetail />} />
              <Route path="/evidence"      element={<Evidence />} />
              <Route path="/skills"        element={<Skills />} />
              <Route path="/careers"       element={<CareerExplorer />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/review"        element={<HumanReview />} />
              <Route path="/tradeoff"      element={<StakeholderTradeoff />} />

              {/* Phase 2 */}
              <Route path="/feedback"      element={<StakeholderFeedback />} />
              <Route path="/access"        element={<AccessControl />} />
              <Route path="/health"        element={<OperationalHealth />} />
              <Route path="/metrics"       element={<BaselineMetrics />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
