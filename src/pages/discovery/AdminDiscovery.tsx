import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Database, Brain, Split, FileText, List, Sliders, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function AdminDiscovery() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('categories');

  const tabs = [
    { id: 'categories', label: 'Manage Categories', icon: List },
    { id: 'industries', label: 'Manage Industries', icon: Database },
    { id: 'questions', label: 'Manage Questions', icon: FileText },
    { id: 'ai_prompts', label: 'AI System Prompts', icon: Brain },
    { id: 'models', label: 'Business Models', icon: Split },
    { id: 'logic', label: 'Discovery Logic', icon: Sliders },
    { id: 'rules', label: 'Recommendation Rules', icon: Settings },
  ];

  const handleSave = () => {
    success("Configuration saved successfully.");
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center">
          <Settings className="w-8 h-8 mr-3 text-slate-700" />
          Discovery Admin Settings
        </h1>
        <p className="text-slate-500 mt-2">Manage the AI logic, questions, categories, and business models for the Discovery Engine.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-3 rounded-2xl font-bold text-sm transition-all \${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 \${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-500 text-white rounded-full font-bold text-sm hover:bg-emerald-600 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <p className="text-slate-500 text-sm">Define the primary business categories available in the Discovery wizard.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Food', 'Automobile', 'Healthcare', 'Beauty', 'Fashion'].map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span className="font-bold text-slate-700">{cat}</span>
                    <button className="text-slate-500 hover:text-primary transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:text-primary hover:border-primary transition-colors font-bold text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Category
                </button>
              </div>
            </div>
          )}

          {activeTab === 'industries' && (
            <div className="space-y-6">
              <p className="text-slate-500 text-sm">Manage industry definitions and metadata.</p>
              <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                Dynamic Industry Manager loaded. Connect to Firestore collection: `industries`.
              </div>
            </div>
          )}

          {activeTab === 'ai_prompts' && (
            <div className="space-y-6">
              <p className="text-slate-500 text-sm">Configure the Gemini AI system instructions and logic prompts.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Base System Prompt</label>
                  <textarea 
                    className="w-full h-48 p-4 rounded-2xl border border-slate-200 font-mono text-sm bg-slate-50 focus:ring-2 focus:ring-primary/20"
                    defaultValue="You are an elite AI Business Consultant and Discovery Engine..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {['questions', 'models', 'logic', 'rules'].includes(activeTab) && (
            <div className="space-y-6">
              <p className="text-slate-500 text-sm">Configuration for {activeTab}.</p>
              <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                Module configuration loaded. Ready for dynamic data binding.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
