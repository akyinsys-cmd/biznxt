
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Briefcase, FileText, FolderLock, BarChart3, LifeBuoy } from 'lucide-react';
import { SkeletonComponent } from '../../components/SkeletonComponent';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => location.hash.replace('#', '') || 'projects');

  useEffect(() => {
    if (location.hash) {
      setActiveTab(location.hash.replace('#', ''));
    }
  }, [location.hash]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    navigate(`#${id}`);
  };
  const { user } = useAuth();

  const tabs = [
    { id: 'journey', name: 'Business Journey', icon: Activity },
    { id: 'orders', name: 'Orders', icon: FolderLock },
    { id: 'reports', name: 'Research Reports', icon: FileText },
    { id: 'projects', name: 'Projects', icon: Briefcase },
    { id: 'payments', name: 'Payments', icon: BarChart3 },
    { id: 'invoices', name: 'Invoices', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[80vh]">
      <div className="clay-card p-10 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-3xl blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Welcome, {user?.displayName || 'Partner'}</h1>
            <p className="text-slate-500 font-medium tracking-tight">Your business operating system.</p>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-3 gap-3 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 whitespace-nowrap",
                isActive 
                  ? "clay-button-primary scale-[1.05] z-10" 
                  : "clay-button text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[50vh] clay-card p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="clay-card bg-slate-50/50 p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
              <h3 className="text-2xl font-black text-slate-900 mb-2 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h3>
              <p className="text-slate-500 font-semibold text-sm">You have no active records for this module.</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
