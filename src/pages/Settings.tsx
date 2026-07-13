import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Moon,
  LogOut,
  Save,
  Sparkles,
  ShieldAlert,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const { user, role, logout } = useAuth();
  const { success, error } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('profile');

  const [settings, setSettings] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    language: 'English',
    emailNotifs: true,
    pushNotifs: false,
    mfa: false
  });

  const handleSave = async () => {
    try {
      if (user) {
        // Update user display name in settings locally
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          displayName: settings.name,
          language: settings.language,
        }, { merge: true });
        success('Settings saved successfully!');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update preferences.');
    }
  };

  const handleRoleSwitch = async (newRole: string) => {
    try {
      if (!user) {
        error('You must be signed in to change roles.');
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { role: newRole }, { merge: true });
      success(`Successfully shifted workspace role to: ${newRole.toUpperCase()}`);
    } catch (err: any) {
      error(err.message || 'Failed to update user role.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'sandbox', label: 'Sandbox Roles', icon: Sparkles },
  ];

  const roleCards = [
    {
      id: 'customer',
      title: '1. Customer',
      desc: 'Entrepreneurs launching a venture. Can submit feasibility requests and track their overall success journey.',
      color: 'border-l-indigo-500 bg-indigo-50/20'
    },
    {
      id: 'bsm',
      title: '2. Business Success Manager (BSM)',
      desc: 'First contact for the customer. Oversees the lifecycle from intake to delivery and acts as the project guide.',
      color: 'border-l-amber-500 bg-amber-50/20'
    },
    {
      id: 'researcher',
      title: '3. Research Executive',
      desc: 'Analytical specialists who compile market research, run feasibility matrix evaluations, and draft PDF dossiers.',
      color: 'border-l-emerald-500 bg-emerald-50/20'
    },
    {
      id: 'consultant',
      title: '4. Business Consultant',
      desc: 'SME experts leading roadmap strategy, aligning commercial goals, and scheduling 1-on-1 advice sessions.',
      color: 'border-l-blue-500 bg-blue-50/20'
    },
    {
      id: 'ca',
      title: '5. Chartered Accountant (CA)',
      desc: 'Manages corporate financial structuring, tax plans, audit compliance, and GST/PAN registrations.',
      color: 'border-l-sky-500 bg-sky-50/20'
    },
    {
      id: 'lawyer',
      title: '6. Corporate Lawyer',
      desc: 'Drafts operational agreements, terms of service, partnership deeds, and intellectual property filings.',
      color: 'border-l-violet-500 bg-violet-50/20'
    },
    {
      id: 'manufacturer',
      title: '7. OEM Manufacturer',
      desc: 'Handles equipment sourcing, factory prototyping, physical inventory setup, and supply chain logistics.',
      color: 'border-l-orange-500 bg-orange-50/20'
    },
    {
      id: 'marketing',
      title: '8. Marketing Agency',
      desc: 'Leads digital search engine campaigns, brand guides, user acquisition programs, and social channels.',
      color: 'border-l-pink-500 bg-pink-50/20'
    },
    {
      id: 'websiteteam',
      title: '9. Website Team',
      desc: 'Deploys custom checkout landing pages, web apps, databases, and e-commerce setups.',
      color: 'border-l-cyan-500 bg-cyan-50/20'
    },
    {
      id: 'finance',
      title: '10. Finance Team',
      desc: 'Secures venture capital debt/equity rounds, handles UPI ledger settlements, and calculates capital cashbacks.',
      color: 'border-l-teal-500 bg-teal-50/20'
    },
    {
      id: 'admin',
      title: 'Operations Admin',
      desc: 'Operational management panel overseeing assigned tasks, general ticketing flow, and systems health.',
      color: 'border-l-rose-500 bg-rose-50/20'
    },
    {
      id: 'superadmin',
      title: 'Super Admin',
      desc: 'Ultimate access to ledger transactions, developer controls, system parameters, and diagnostic profiles.',
      color: 'border-l-purple-500 bg-purple-50/20'
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-white/80' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-200">
              <button
                onClick={() => logout()}
                className="w-full flex items-center px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 min-h-[500px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                    <p className="text-sm text-slate-500 mt-1">Update your personal details and public profile.</p>
                  </div>
                  <div className="grid gap-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={settings.name}
                        onChange={e => setSettings({...settings, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        value={settings.email}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">App Preferences</h2>
                    <p className="text-sm text-slate-500 mt-1">Customize your language and display settings.</p>
                  </div>
                  <div className="grid gap-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                      <select 
                        value={settings.language}
                        onChange={e => setSettings({...settings, language: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setTheme('light')}
                          className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                           <div className="w-8 h-8 rounded-2xl bg-slate-100 border border-slate-200"></div>
                           <span className="text-sm font-medium text-slate-700">Light</span>
                        </button>
                        <button 
                          onClick={() => setTheme('dark')}
                          className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                        >
                           <div className="w-8 h-8 rounded-2xl bg-slate-900 border border-slate-800"></div>
                           <span className="text-sm font-medium text-slate-700">Dark</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Notification Settings</h2>
                    <p className="text-sm text-slate-500 mt-1">Control how and when you receive alerts.</p>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div>
                        <span className="block text-sm font-medium text-slate-900">Email Notifications</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Receive updates via email.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.emailNotifs}
                        onChange={e => setSettings({...settings, emailNotifs: e.target.checked})}
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div>
                        <span className="block text-sm font-medium text-slate-900">Push Notifications</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Get desktop push alerts.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.pushNotifs}
                        onChange={e => setSettings({...settings, pushNotifs: e.target.checked})}
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Security</h2>
                    <p className="text-sm text-slate-500 mt-1">Keep your account secure.</p>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div>
                        <span className="block text-sm font-medium text-slate-900">Two-Factor Auth (2FA)</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Require a code to login.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.mfa}
                        onChange={e => setSettings({...settings, mfa: e.target.checked})}
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                    </label>
                    
                    <button className="text-sm font-medium text-primary hover:text-primary-dark p-2 -ml-2 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'sandbox' && (
                <div className="space-y-6">
                  <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-4 text-amber-800">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-semibold">Sandbox Role Shifter</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        biznxt.online operates on strict role-based presentation. Shifting your role here instantly writes to your Firestore user ledger profile, causing your workspace, sidebar tabs, and API boundaries to react and reshape dynamically.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roleCards.map((card) => {
                      const isActive = role === card.id;
                      return (
                        <button
                          key={card.id}
                          onClick={() => handleRoleSwitch(card.id)}
                          className={`text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between min-h-[120px] ${
                            isActive 
                              ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                              : `border-slate-100 hover:border-slate-200 ${card.color}`
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                                {card.title}
                              </span>
                              {isActive && (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-primary text-white rounded-2xl text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Active</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                              {card.desc}
                            </p>
                          </div>
                          
                          <span className="text-[10px] text-slate-500 font-mono mt-2 self-end">
                            Role ID: {card.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab !== 'sandbox' && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <button 
                    onClick={handleSave}
                    className="flex items-center px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
