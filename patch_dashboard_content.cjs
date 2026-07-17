const fs = require('fs');
let content = fs.readFileSync('src/pages/business-os/index.tsx', 'utf8');

// Replace the entire component with a simpler production-ready dashboard
const newDashboard = `
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Briefcase, FileText, FolderLock, BarChart3, LifeBuoy } from 'lucide-react';
import { DashboardSkeleton } from '../../components/SkeletonComponent';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects');
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
      <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-10 rounded-3xl shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
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
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 border shadow-sm whitespace-nowrap",
                isActive 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-[1.05] z-10" 
                  : "bg-white/70 text-slate-500 border-white/80 hover:bg-white hover:text-slate-900 backdrop-blur-sm"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="min-h-[50vh] bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 p-8 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center min-h-[300px] flex flex-col items-center justify-center shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-2 capitalize">{activeTab.replace('-', ' ')}</h3>
              <p className="text-slate-500 font-medium">You have no active records for this module.</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/business-os/index.tsx', newDashboard);
console.log("Replaced Dashboard with clean version");
