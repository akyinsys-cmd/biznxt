import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, Activity, Save } from 'lucide-react';
import { subscribeToPricingConfig, toggleAutomatedPricing, PricingConfig } from '../../lib/pricingService';
import { logUserActivity } from './UserActivityLogger';
import { auth } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';

export function PricingAdminConfig() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    const unsub = subscribeToPricingConfig((data) => {
      setConfig(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleToggle = async () => {
    if (!config) return;
    const newState = !config.enableAutomatedAdjustment;
    try {
      await toggleAutomatedPricing(newState);
      success(`Automated pricing adjustments ${newState ? 'enabled' : 'disabled'}`);
      if (auth.currentUser) {
        logUserActivity(
          'Pricing Config Update', 
          `Automated Markup set to ${newState}`, 
          auth.currentUser.email || 'Admin'
        );
      }
    } catch (err) {
      error('Failed to update pricing config');
    }
  };

  if (loading || !config) return <div className="p-4 text-slate-500">Loading pricing config...</div>;

  return (
    <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-[2.5rem] p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Premium Pricing Engine</h3>
          <p className="text-sm text-slate-500 mt-1">Manage global automated markup logic.</p>
        </div>
        <div className={`p-3 rounded-2xl ${config.enableAutomatedAdjustment ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
          <RefreshCw className={`w-6 h-6 ${config.enableAutomatedAdjustment ? 'animate-spin-slow' : ''}`} />
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Automated Premium Markup</h4>
          <p className="text-xs text-slate-500 mt-1">When enabled, benchmark prices receive a 50% markup and round to marketing-clean formats (e.g. 2499, 4999).</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer ml-4">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={config.enableAutomatedAdjustment}
            onChange={handleToggle}
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-2xl peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-2xl after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>
  );
}
