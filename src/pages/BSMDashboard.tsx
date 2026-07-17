import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Grid, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BSMCustomers } from './bsm/BSMCustomers';
import { CustomerWorkspace } from './bsm/CustomerWorkspace';
import { Project } from '../types/project';

export default function BSMDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => location.hash.replace('#', '') || 'customers');

  useEffect(() => {
    if (location.hash) {
      setActiveTab(location.hash.replace('#', ''));
    }
  }, [location.hash]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    navigate(`#${id}`);
  };
  const [selectedCustomer, setSelectedCustomer] = useState<Project | null>(null);

  const tabs = [
    { id: 'customers', label: 'Assigned Customers', icon: Users },
    { id: 'projects', label: 'Projects', icon: LayoutDashboard },
    { id: 'communication', label: 'Communication', icon: Users },
  ];

  if (selectedCustomer) {
    return <CustomerWorkspace project={selectedCustomer} onBack={() => setSelectedCustomer(null)} />;
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen font-sans flex flex-col">
      <div className="mx-4 sm:mx-6 lg:mx-8 mt-6">
        <div className="clay-card bg-slate-900 text-white px-8 py-10 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Manager Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Operational control center for clients and projects</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 relative z-20 flex-1 flex flex-col mb-12">
        <div className="clay-card p-2 flex flex-wrap gap-2 mb-8 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? 'clay-button-primary' 
                    : 'clay-button'
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
              {activeTab === 'customers' && <BSMCustomers onSelectCustomer={setSelectedCustomer} />}
              {activeTab !== 'customers' && (
                <div className="clay-card p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-black text-slate-900 mb-2 capitalize">{activeTab.replace('-', ' ')}</h3>
                  <p className="text-slate-500 font-medium">This module is currently being optimized for a better experience.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
