import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  Plus, 
  Settings, 
  Briefcase, 
  CheckCircle, 
  HelpCircle, 
  Search, 
  Sliders, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  Database,
  BarChart,
  UserCheck,
  Send,
  Zap,
  X,
  ChevronRight
} from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  updateDoc, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Import our highly responsive CRM sub-modules
import CRMAnalytics from '../components/crm/CRMAnalytics';
import CRMPipelineBoard from '../components/crm/CRMPipelineBoard';
import CRMLeadDetails from '../components/crm/CRMLeadDetails';

// ============================================================================
// SYSTEM DEFINITIONS & DEFAULTS
// ============================================================================
const DEFAULT_PIPELINE_STAGES = [
  'New Lead',
  'Requirement Gathering',
  'Quotation Sent',
  'Research Proposal Sent',
  'Negotiation',
  'Payment Received',
  'Completed'
];

const LEAD_SOURCES = [
  'Website', 'Android App', 'iOS App', 'Landing Pages', 'Referral', 
  'WhatsApp', 'Phone Call', 'Google Ads', 'Meta Ads', 'LinkedIn', 
  'Walk-In', 'Partner Referral', 'Manufacturer Referral', 'Trade Show'
];

const INDUSTRIES = [
  'Manufacturing', 'SaaS Tech', 'D2C E-Commerce', 'Logistics', 
  'Foodtech & QSR', 'International Expansion', 'Export-Import'
];

const LEAD_TYPES = [
  'B2B', 'B2C', 'Enterprise', 'Franchise', 'Manufacturing', 'International'
];

// Seeded leads to guarantee an immersive experience without manual inserts
const SEED_CRM_LEADS = [
  {
    id: 'l-seed-1',
    customerName: 'Vikram Singhania',
    businessName: 'Singhania Garments Pvt Ltd',
    industry: 'Manufacturing',
    type: 'Manufacturing',
    email: 'vikram@singhaniatex.com',
    mobile: '+91 98102 38402',
    whatsapp: '+91 98102 38402',
    budget: 450000,
    source: 'Manufacturer Referral',
    priority: 'Hot',
    status: 'Requirement Gathering',
    logs: [
      { text: 'Lead created from offline trade referral', time: new Date().toISOString() },
      { text: 'Conducted requirement gathering call - Vikram wants standard ISO Certification guidance and machinery sourcing auditing', time: new Date().toISOString() }
    ],
    followups: [
      { type: 'Phone Call', notes: 'Vikram requested pricing schedules for setup auditing', outcome: 'Interested / Advancing', nextFollowupDate: '2026-07-15', loggedAt: new Date().toISOString() }
    ],
    quotes: [],
    proposals: [],
    tasks: [
      { id: 't-s1', title: 'Compile factory blueprints checklist', assignee: 'Consultant Partner', priority: 'High', completed: false }
    ],
    meetings: []
  },
  {
    id: 'l-seed-2',
    customerName: 'Sophia Lin',
    businessName: 'Lin Global Cosmetics',
    industry: 'Export-Import',
    type: 'International',
    email: 'sophia.lin@linglobal.tw',
    mobile: '+886 2 2382 1822',
    whatsapp: '+886 2 2382 1822',
    budget: 1200000,
    source: 'LinkedIn',
    priority: 'Hot',
    status: 'New Lead',
    logs: [
      { text: 'Lead generated via LinkedIn automation hook', time: new Date().toISOString() }
    ],
    followups: [],
    quotes: [],
    proposals: [],
    tasks: [],
    meetings: []
  },
  {
    id: 'l-seed-3',
    customerName: 'Ananya Sharma',
    businessName: 'Nourish Organics Co',
    industry: 'D2C E-Commerce',
    type: 'B2B',
    email: 'ananya@nourishorganics.in',
    mobile: '+91 91102 48931',
    whatsapp: '+91 91102 48931',
    budget: 35000,
    source: 'Instagram',
    priority: 'Warm',
    status: 'Quotation Sent',
    logs: [
      { text: 'Lead captured from instagram advertisement', time: new Date().toISOString() },
      { text: 'Quotation generated for Trademark & Logo Suite', time: new Date().toISOString() }
    ],
    followups: [],
    quotes: [
      { id: 'q-s3-1', serviceId: 's-6', serviceTitle: 'Brand Launch Identity Suite', price: 24999, discount: 5000, taxRate: 18, taxAmount: 3599, total: 23598, validity: '15 Days', status: 'Quotation Sent', createdAt: new Date().toISOString() }
    ],
    proposals: [],
    tasks: [],
    meetings: []
  }
];

export default function CRM() {
  const { user } = useAuth();
  const { success, error, confirm } = useToast();

  // Active navigation view inside CRM
  const [crmView, setCrmView] = useState<'dashboard' | 'pipeline' | 'analytics' | 'automations'>('dashboard');
  
  // Interactive role filter to simulate authorization matrix
  const [activeRole, setActiveRole] = useState<'admin' | 'bsm' | 'partner' | 'customer'>('admin');

  // Sync state with Firestore
  const [leads, setLeads] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [pipelineStages, setPipelineStages] = useState<string[]>(DEFAULT_PIPELINE_STAGES);
  
  // Modals state
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New Lead Form values
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: '',
    businessName: '',
    industry: 'Manufacturing',
    type: 'B2B',
    email: '',
    mobile: '',
    whatsapp: '',
    budget: 150000,
    source: 'Website',
    priority: 'Medium',
    notes: ''
  });

  // Automation Engine settings state
  const [automationRules, setAutomationRules] = useState([
    { id: 'rule-assign', name: 'Auto Lead Assignment SLA', description: 'Instantly allocate incoming leads to closest matching Success Manager based on industry match', active: true },
    { id: 'rule-welcome', name: 'Auto Welcome Email Trigger', description: 'Simulate dispatching custom brochure suite once new lead is validated', active: true },
    { id: 'rule-followup', name: 'Auto Escalation Follow-up', description: 'Escalate lead to Principal Director if priority is Hot and remains uncontacted for 2 hours', active: false },
    { id: 'rule-quote', name: 'Auto Invoice Generation Sync', description: 'Automatically post accounting transactions on quote acceptance', active: true }
  ]);

  // ============================================================================
  // DATABASE SYNCHRONIZATION & SELF-SEEDING
  // ============================================================================
  useEffect(() => {
    // 1. Sync CRM Leads
    const unsubLeads = onSnapshot(collection(db, 'crm_leads'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setLeads(items);

      // Auto-Seed if CRM collection is empty
      if (items.length === 0 && snap.metadata.fromCache === false) {
        console.log('CRM empty. Initiating dynamic seeding process...');
        triggerCrmSeeding();
      }
    });

    // 2. Sync Services catalog for Quote generator mapping
    const unsubServices = onSnapshot(collection(db, 'service_catalog'), (snap) => {
      const items: any[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setServices(items);
    });

    // 3. Sync Dynamic Pipeline Stages Config (if stored in DB)
    const unsubPipelineConfig = onSnapshot(collection(db, 'crm_pipeline'), (snap) => {
      if (!snap.empty) {
        snap.forEach(docSnap => {
          if (docSnap.id === 'stages_config') {
            setPipelineStages(docSnap.data().stages || DEFAULT_PIPELINE_STAGES);
          }
        });
      }
    });

    return () => {
      unsubLeads();
      unsubServices();
      unsubPipelineConfig();
    };
  }, []);

  const triggerCrmSeeding = async () => {
    try {
      for (const lead of SEED_CRM_LEADS) {
        await setDoc(doc(db, 'crm_leads', lead.id), {
          ...lead,
          createdAt: new Date().toISOString()
        });
      }
      success('BizNxt CRM initialized. Pre-seeded with 3 high-value enterprise accounts.');
    } catch (err) {
      console.error('CRM seed failure', err);
    }
  };

  // Update pipeline stages on config changes
  const handleUpdatePipelineStages = async (nextStages: string[]) => {
    try {
      await setDoc(doc(db, 'crm_pipeline', 'stages_config'), { stages: nextStages });
      setPipelineStages(nextStages);
      success('Sales workflow stages configured dynamically.');
    } catch (err) {
      error('Failed to save pipeline configuration.');
    }
  };

  // Update a single lead inside Firestore
  const handleUpdateLead = async (updatedLead: any) => {
    try {
      const { id, ...data } = updatedLead;
      await setDoc(doc(db, 'crm_leads', id), data);
      
      // Update local state for modal immediately to prevent lag
      if (selectedLead?.id === id) {
        setSelectedLead(updatedLead);
      }
      success('Account record securely persisted.');
    } catch (err) {
      error('Database synchronization failure.');
    }
  };

  // Simple stage advance handler
  const handleUpdateLeadStage = async (leadId: string, nextStage: string) => {
    try {
      const target = leads.find(l => l.id === leadId);
      if (!target) return;

      const logItem = `Stage transition: ${target.status || 'New Lead'} → ${nextStage}`;
      const updatedLogs = [...(target.logs || []), { text: logItem, time: new Date().toISOString() }];

      await updateDoc(doc(db, 'crm_leads', leadId), {
        status: nextStage,
        logs: updatedLogs
      });
      
      // Automation Log Simulation Trigger
      await addDoc(collection(db, 'crm_automation_logs'), {
        leadId,
        trigger: 'PIPELINE_STAGE_CHANGED',
        description: `Lead moved to ${nextStage}. Validating automated workflows matching this node.`,
        timestamp: new Date().toISOString()
      });

      success(`Advanced lead to: ${nextStage}`);
    } catch (err) {
      error('Workflow update failed.');
    }
  };

  // Save new lead
  const handleSaveNewLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.customerName.trim() || !newLeadForm.businessName.trim()) {
      error('Provide Customer Name and Business Name.');
      return;
    }

    try {
      const newId = `l-user-${Date.now() % 1000}`;
      const payload = {
        id: newId,
        customerName: newLeadForm.customerName.trim(),
        businessName: newLeadForm.businessName.trim(),
        industry: newLeadForm.industry,
        type: newLeadForm.type,
        email: newLeadForm.email || `${newLeadForm.customerName.toLowerCase().replace(/\s+/g, '')}@biznxtclient.com`,
        mobile: newLeadForm.mobile || '+91 99999 12345',
        whatsapp: newLeadForm.whatsapp || '+91 99999 12345',
        budget: Number(newLeadForm.budget) || 100000,
        source: newLeadForm.source,
        priority: newLeadForm.priority,
        status: pipelineStages[0], // starts at first configured stage
        logs: [{ text: `Lead generated manually by staff role: ${activeRole}`, time: new Date().toISOString() }],
        followups: [],
        quotes: [],
        proposals: [],
        tasks: [],
        meetings: [],
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'crm_leads', newId), payload);
      setShowAddLeadModal(false);
      setNewLeadForm({
        customerName: '',
        businessName: '',
        industry: 'Manufacturing',
        type: 'B2B',
        email: '',
        mobile: '',
        whatsapp: '',
        budget: 150000,
        source: 'Website',
        priority: 'Medium',
        notes: ''
      });
      success('New enterprise account ingested into database pipeline!');
    } catch (err) {
      error('Failed to ingest lead.');
    }
  };

  // Toggle dynamic automations rules
  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(rules => rules.map(r => {
      if (r.id === ruleId) {
        const nextState = !r.active;
        success(`Automation rule "${r.name}" is now ${nextState ? 'Active' : 'Paused'}`);
        return { ...r, active: nextState };
      }
      return r;
    }));
  };

  // ============================================================================
  // COMPUTE SUMMARY KPIS FOR METRIC RIBBON
  // ============================================================================
  const summaryKpis = useMemo(() => {
    const counts = {
      today: 0,
      hot: 0,
      warm: 0,
      won: 0,
      value: 0
    };

    leads.forEach(l => {
      counts.value += (Number(l.budget) || 0);
      if (l.priority === 'Hot') counts.hot += 1;
      if (l.priority === 'Warm') counts.warm += 1;
      
      const isWon = l.status === 'Completed' || l.status === 'Payment Received' || l.status === 'Services Purchased';
      if (isWon) counts.won += 1;

      // check if created today
      if (l.createdAt) {
        const createdDate = new Date(l.createdAt).toDateString();
        const todayDate = new Date().toDateString();
        if (createdDate === todayDate) counts.today += 1;
      }
    });

    return counts;
  }, [leads]);

  return (
    <div className="min-h-screen bg-background pb-32">
      
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-[30px] border-b border-slate-200/50 px-10 py-10 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl text-primary flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Growth Nexus</h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Enterprise Pipeline Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
            {/* Role Matrix Simulator */}
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
              {[
                { id: 'admin', label: 'Admin' },
                { id: 'bsm', label: 'Success' },
                { id: 'partner', label: 'Partner' },
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id as any)}
                  className={`px-4 py-2 text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest ${
                    activeRole === role.id ? 'bg-white text-primary shadow-xl shadow-slate-200/50' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowAddLeadModal(true)}
              className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              Ingest New Account
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-[1600px] mx-auto px-10">
          <div className="flex items-center space-x-12 overflow-x-auto no-scrollbar">
            {[
              { id: 'dashboard', label: 'Summary Pulse', icon: Layers },
              { id: 'pipeline', label: 'Execution Board', icon: Sliders },
              { id: 'analytics', label: 'Growth Metrics', icon: BarChart },
              { id: 'automations', label: 'Neural Rules', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCrmView(tab.id as any)}
                className={`py-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 whitespace-nowrap ${
                  crmView === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {crmView === tab.id && (
                  <motion.div
                    layoutId="activeCrmTab"
                    className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.3)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-10 py-12">
        <AnimatePresence mode="wait">
          {crmView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Metric ribbon row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {[
                  { label: 'Ingested Today', value: summaryKpis.today, icon: Plus, color: 'text-slate-800', bg: 'bg-slate-100' },
                  { label: 'Hot Targets', value: summaryKpis.hot, icon: Zap, color: 'text-primary-dark', bg: 'bg-primary/5' },
                  { label: 'Warm Opps', value: summaryKpis.warm, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-500/5' },
                  { label: 'Closed Deals', value: summaryKpis.won, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-500/5' },
                  { label: 'Portfolio Value', value: `₹${(summaryKpis.value/100000).toFixed(1)}L`, icon: Database, color: 'text-primary', bg: 'bg-primary/5' },
                ].map((kpi, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col items-center text-center group hover:shadow-xl hover:border-primary/20 transition-all"
                  >
                    <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-6 shadow-inner group-hover:rotate-12 transition-transform`}>
                      <kpi.icon size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-10">
                {/* Account list ledger */}
                <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                  <div className="flex items-center justify-between mb-12">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Enterprise Accounts</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Live Pipeline Ledger</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search accounts..." 
                          className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64 shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
                    {leads.length === 0 ? (
                      <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No records found in active node</p>
                      </div>
                    ) : (
                      leads.map((lead, idx) => (
                        <motion.div 
                          key={lead.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setSelectedLead(lead)}
                          className="bg-white border border-slate-100 rounded-[2rem] p-8 flex items-center justify-between hover:shadow-xl hover:border-primary/20 hover:scale-[1.02] cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-8">
                            <div className={`w-16 h-16 rounded-[1.25rem] ${lead.priority === 'Hot' ? 'bg-rose-50' : 'bg-slate-50'} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                              <div className={`w-3 h-3 rounded-full ${lead.priority === 'Hot' ? 'bg-primary animate-pulse' : 'bg-slate-300'}`} />
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-slate-900 tracking-tight">{lead.customerName}</h4>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{lead.businessName} • {lead.industry}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-12 text-right">
                            <div className="hidden md:block">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Portfolio Value</p>
                              <p className="text-lg font-black text-slate-900 tracking-tighter">₹{Number(lead.budget || 0).toLocaleString()}</p>
                            </div>
                            <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                              <p className="text-[11px] font-black text-primary uppercase tracking-widest">{lead.status || 'New Lead'}</p>
                            </div>
                            <button className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Automation audit trail block */}
                <div className="col-span-12 lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-2xl blur-[100px] -mr-24 -mt-24" />
                  
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Neural Audit Feed</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">SLA Enforcement Logs</p>
                    </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                    {[
                      { title: 'API Ingest: Success', desc: 'Enterprise account Vikram Singhania validated. Triggering auto-SLA.', time: '12m' },
                      { title: 'Doc-OCR: Verified', desc: 'GSTIN integrity match on Nourish Organics Co. Clearing node.', time: '1h' },
                      { title: 'SMTP: Despatched', desc: 'Custom Brand Identity schedule emailed to prospective lead.', time: '2h' },
                      { title: 'SLA: Escalated', desc: 'Lead "Sophia Lin" remains uncontacted > 2h. Notifying Director.', time: '4h', alert: true }
                    ].map((evt, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-8 pb-8 border-l border-white/10 last:pb-0"
                      >
                        <div className={`absolute left-[-6px] top-1.5 w-3 h-3 rounded-full border-4 border-slate-900 shadow-xl ${evt.alert ? 'bg-primary shadow-primary/50' : 'bg-primary shadow-primary/50'}`} />
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-[11px] font-black uppercase tracking-wider ${evt.alert ? 'text-rose-400' : 'text-white'}`}>{evt.title}</h4>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{evt.time}</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{evt.desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  <button className="w-full mt-10 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-white/10 shadow-lg">
                    Access Historical Logs
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {crmView === 'pipeline' && (
            <motion.div 
              key="pipeline"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <CRMPipelineBoard
                leads={leads}
                stages={pipelineStages}
                onUpdateStage={handleUpdateLeadStage}
                onSelectLead={setSelectedLead}
                onAddLead={() => setShowAddLeadModal(true)}
                onUpdateStages={handleUpdatePipelineStages}
              />
            </motion.div>
          )}

          {crmView === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CRMAnalytics leads={leads} />
            </motion.div>
          )}

          {crmView === 'automations' && (
            <motion.div 
              key="automations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-primary rounded-3xl text-white flex items-center justify-center shadow-2xl shadow-primary/30">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Workflow Orchestration</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Autonomous Business Logic Node</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {automationRules.map((rule, i) => (
                    <motion.div 
                      key={rule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex items-start justify-between gap-8 hover:bg-white hover:shadow-xl transition-all group"
                    >
                      <div className="space-y-3">
                        <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{rule.name}</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm">{rule.description}</p>
                      </div>
                      
                      <button
                        onClick={() => toggleAutomationRule(rule.id)}
                        className={`w-16 h-9 rounded-2xl p-1.5 transition-all relative ${
                          rule.active ? 'bg-primary shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-300'
                        }`}
                      >
                        <motion.div 
                          animate={{ x: rule.active ? 28 : 0 }}
                          className="w-6 h-6 rounded-2xl bg-white shadow-md" 
                        />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Lead Modal */}
      {selectedLead && (
        <CRMLeadDetails
          lead={selectedLead}
          services={services}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={handleUpdateLead}
          toastSuccess={success}
          toastError={error}
        />
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
          >
            <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                  <Plus size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Corporate Ingestion</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Manual Account Node Entry</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary transition-all shadow-sm active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNewLead} className="p-12 space-y-10">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Customer Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={newLeadForm.customerName}
                    onChange={(e) => setNewLeadForm({...newLeadForm, customerName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Entity / Business</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Singhania Fabrics"
                    value={newLeadForm.businessName}
                    onChange={(e) => setNewLeadForm({...newLeadForm, businessName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Domain</label>
                  <select
                    value={newLeadForm.industry}
                    onChange={(e) => setNewLeadForm({...newLeadForm, industry: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner appearance-none"
                  >
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account Class</label>
                  <select
                    value={newLeadForm.type}
                    onChange={(e) => setNewLeadForm({...newLeadForm, type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner appearance-none"
                  >
                    {LEAD_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Investment (₹)</label>
                  <input
                    type="number"
                    value={newLeadForm.budget}
                    onChange={(e) => setNewLeadForm({...newLeadForm, budget: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-10 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-10 py-5 bg-white border border-slate-200 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                >
                  Abort Entry
                </button>
                <button
                  type="submit"
                  className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                  Ingest Enterprise Account
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Inline helper close X SVG definition
function XIconSVG() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
