import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Sliders, 
  Terminal, 
  FileText, 
  Save, 
  CheckCircle,
  Database
} from 'lucide-react';

interface AdminViewProps {
  activityLogs: { action: string; module: string; details: string; createdAt: string }[];
}

export function AdminView({ activityLogs }: AdminViewProps) {
  const [categories, setCategories] = useState([
    'Import-Export & Manufacturing',
    'Customs Brokerage SME',
    'Wholesale Electronics Trade',
    'Retail e-Commerce Logistics'
  ]);
  const [newCat, setNewCat] = useState('');

  const [reminderRules, setReminderRules] = useState({
    gstInterval: 30, // days before
    trademarkCheck: 90, // days before
    iecRenewal: 365 // days before
  });

  const [saving, setSaving] = useState(false);

  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    setCategories(prev => [...prev, newCat.trim()]);
    setNewCat('');
  };

  const handleSaveRules = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-4 rounded-2xl text-white">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Business OS System Administration</h2>
            <p className="text-xs text-slate-500">Manage reminder triggers, update trade category classifiers, override suggestions rules, and audit system logs.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rules Config */}
        <div className="space-y-6 lg:col-span-2">
          {/* Categories Manager */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
              <Database className="w-5 h-5 text-indigo-600" />
              Manage Corporate Classifications
            </h3>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                placeholder="Add custom trade classification..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={handleAddCategory}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-2xl text-xs font-bold shrink-0"
              >
                Add Category
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-1 rounded-2xl">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Reminder Trigger Rules */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
              <Sliders className="w-5 h-5 text-primary" />
              Manage Automated Reminder Triggers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">GSTR Returns Alert</label>
                <input 
                  type="number" 
                  value={reminderRules.gstInterval}
                  onChange={e => setReminderRules(prev => ({ ...prev, gstInterval: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Days before return is due</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Trademark Status Audits</label>
                <input 
                  type="number" 
                  value={reminderRules.trademarkCheck}
                  onChange={e => setReminderRules(prev => ({ ...prev, trademarkCheck: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Recurrence checking days</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">IEC Port Re-Validations</label>
                <input 
                  type="number" 
                  value={reminderRules.iecRenewal}
                  onChange={e => setReminderRules(prev => ({ ...prev, iecRenewal: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Standard validation days</span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleSaveRules}
                disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Apply Trigger Configuration'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Logs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
            <Terminal className="w-5 h-5 text-indigo-600" />
            Audit Ledger & System Logs
          </h3>

          <div className="max-h-[360px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {activityLogs && activityLogs.length > 0 ? (
              activityLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">{log.action}</p>
                  <p className="text-[10px] text-slate-500">{log.module} • {new Date(log.createdAt).toLocaleTimeString()}</p>
                  <p className="text-[10px] text-slate-500 italic leading-relaxed">{log.details}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No audits generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
