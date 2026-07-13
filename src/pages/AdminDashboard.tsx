import { useState } from 'react';
import { LayoutDashboard, Users, Grid, Settings, Shield, DollarSign, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminOverview } from './admin/AdminOverview';
import { AdminUsers } from './admin/AdminUsers';
import { AdminManagers } from './admin/AdminManagers';
import { AdminServices } from './admin/AdminServices';
import { AdminPricing } from './admin/AdminPricing';
import { AdminSystem } from './admin/AdminSystem';
import { AdminAds } from './admin/AdminAds';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'managers', label: 'Managers', icon: Shield },
    { id: 'users', label: 'Customers', icon: Users },
    { id: 'services', label: 'Services', icon: Grid },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'ads', label: 'Ad Management', icon: Megaphone },
    { id: 'system', label: 'System', icon: Settings },
  ];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen font-sans flex flex-col">
      <div className="bg-slate-900 text-white px-8 py-10 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-2xl blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Enterprise Control Center</h1>
            <p className="text-slate-400 text-sm mt-1">Super Admin Management Panel</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 flex-1 flex flex-col mb-12">
        <div className="bg-white rounded-2xl p-2 flex flex-wrap gap-2 shadow-sm border border-slate-100 mb-8 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'overview' && <AdminOverview />}
              {activeTab === 'managers' && <AdminManagers />}
              {activeTab === 'users' && <AdminUsers />}
              {activeTab === 'services' && <AdminServices />}
              {activeTab === 'pricing' && <AdminPricing />}
              {activeTab === 'ads' && <AdminAds />}
              {activeTab === 'system' && <AdminSystem />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
