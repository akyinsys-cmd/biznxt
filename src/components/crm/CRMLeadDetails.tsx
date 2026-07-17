import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Briefcase, 
  Phone, 
  MessageSquare, 
  Calendar, 
  FileText, 
  DollarSign, 
  ListTodo, 
  Send, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle,
  Upload,
  Info,
  Layers,
  Sparkles,
  Award,
  Zap,
  Target,
  Database,
  Globe,
  MoreVertical,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';

interface CRMLeadDetailsProps {
  lead: any;
  services: any[];
  onClose: () => void;
  onUpdateLead: (updatedLead: any) => void;
  toastSuccess: (msg: string) => void;
  toastError: (msg: string) => void;
}

export default function CRMLeadDetails({
  lead,
  services,
  onClose,
  onUpdateLead,
  toastSuccess,
  toastError
}: CRMLeadDetailsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'followups' | 'quotes' | 'proposals' | 'tasks' | 'meetings'>('profile');

  // Follow-up inputs
  const [followupType, setFollowupType] = useState('Phone Call');
  const [followupNotes, setFollowupNotes] = useState('');
  const [followupOutcome, setFollowupOutcome] = useState('No Answer');
  const [nextFollowupDate, setNextFollowupDate] = useState('');

  // Quote generator inputs
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [customPrice, setCustomPrice] = useState(0);
  const [customDiscount, setCustomDiscount] = useState(0);
  const [customTax, setCustomTax] = useState(18); // Default GST 18%
  const [quoteValidity, setQuoteValidity] = useState('15 Days');

  // Proposal generator inputs
  const [proposalScope, setProposalScope] = useState('');
  const [proposalDeliverables, setProposalDeliverables] = useState('');
  const [proposalPaymentSchedule, setProposalPaymentSchedule] = useState('50% advance, 50% on completion');
  const [signedName, setSignedName] = useState('');

  // Task inputs
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Business Success Manager');
  const [taskPriority, setTaskPriority] = useState('Medium');

  // Meeting inputs
  const [meetingAgenda, setMeetingAgenda] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingActionItems, setMeetingActionItems] = useState('');

  // Load service price helper
  useEffect(() => {
    if (selectedServiceId) {
      const selected = services.find(s => s.id === selectedServiceId);
      if (selected) {
        setCustomPrice(selected.price || 9999);
        setCustomDiscount(selected.discount || 0);
      }
    }
  }, [selectedServiceId, services]);

  // Handle follow-up submission
  const handleLogFollowup = async () => {
    if (!followupNotes.trim()) return;
    const item = {
      type: followupType,
      notes: followupNotes.trim(),
      outcome: followupOutcome,
      nextFollowupDate: nextFollowupDate || 'None Scheduled',
      loggedAt: new Date().toISOString()
    };
    const updatedFollowups = [...(lead.followups || []), item];
    
    // Add communication log entry
    const logItem = `Logged ${followupType}: ${followupNotes.trim()} (Outcome: ${followupOutcome})`;
    const updatedLogs = [...(lead.logs || []), { text: logItem, time: new Date().toISOString() }];

    const nextLead = { ...lead, followups: updatedFollowups, logs: updatedLogs };
    onUpdateLead(nextLead);
    
    // Auto Automation Rule: trigger followup log confirmation
    await addDoc(collection(db, 'crm_automation_logs'), {
      leadId: lead.id,
      trigger: 'FOLLOWUP_LOGGED',
      description: `Dispatched auto-sms notification validation for upcoming follow-up on ${nextFollowupDate || 'N/A'}.`,
      timestamp: new Date().toISOString()
    });

    setFollowupNotes('');
    toastSuccess('Follow-up activity logged successfully!');
  };

  // Handle Quote creation
  const handleCreateQuote = async () => {
    if (!selectedServiceId) {
      toastError('Please select a service item.');
      return;
    }
    const selected = services.find(s => s.id === selectedServiceId);
    if (!selected) return;

    const baseAmount = customPrice - customDiscount;
    const taxAmount = Math.round(baseAmount * (customTax / 100));
    const totalAmount = baseAmount + taxAmount;

    const item = {
      id: `q-${Date.now() % 1000}`,
      serviceId: selected.id,
      serviceTitle: selected.title,
      price: customPrice,
      discount: customDiscount,
      taxRate: customTax,
      taxAmount,
      total: totalAmount,
      validity: quoteValidity,
      status: 'Quotation Sent',
      createdAt: new Date().toISOString()
    };

    const updatedQuotes = [...(lead.quotes || []), item];
    const logItem = `Created Quotation for ${selected.title} totaling ₹${totalAmount.toLocaleString()}`;
    const updatedLogs = [...(lead.logs || []), { text: logItem, time: new Date().toISOString() }];

    const nextLead = { 
      ...lead, 
      quotes: updatedQuotes, 
      logs: updatedLogs, 
      status: 'Quotation Sent', // update pipeline stage automatically
      budget: totalAmount // update budget estimate
    };
    onUpdateLead(nextLead);

    // Automation log
    await addDoc(collection(db, 'crm_automation_logs'), {
      leadId: lead.id,
      trigger: 'QUOTATION_SENT',
      description: `Generated dynamic PDF Invoice. Emailed Quotation proposal to ${lead.email || 'lead'}.`,
      timestamp: new Date().toISOString()
    });

    toastSuccess('Custom corporate quotation generated and dispatch simulation complete!');
  };

  // Handle Proposal creation
  const handleCreateProposal = async () => {
    if (!proposalScope.trim()) {
      toastError('Please define proposal scope of work.');
      return;
    }

    const item = {
      id: `prop-${Date.now() % 1000}`,
      scope: proposalScope.trim(),
      deliverables: proposalDeliverables.trim() || 'All standard service deliverables mapped',
      paymentSchedule: proposalPaymentSchedule,
      signedByLead: signedName.trim() || null,
      createdAt: new Date().toISOString(),
      status: 'Sent'
    };

    const updatedProposals = [...(lead.proposals || []), item];
    const logItem = `Generated Custom Investment Proposal. Payment schedule: ${proposalPaymentSchedule}`;
    const updatedLogs = [...(lead.logs || []), { text: logItem, time: new Date().toISOString() }];

    const nextLead = { 
      ...lead, 
      proposals: updatedProposals, 
      logs: updatedLogs, 
      status: 'Research Proposal Sent' 
    };
    onUpdateLead(nextLead);

    toastSuccess('Professional investment proposal deployed!');
    setProposalScope('');
    setProposalDeliverables('');
  };

  // Handle digital signature of proposal
  const handleSignProposal = (propId: string) => {
    if (!signedName.trim()) {
      toastError('Please type your name for digital signature.');
      return;
    }
    const updated = (lead.proposals || []).map((p: any) => {
      if (p.id === propId) {
        return { ...p, signedByLead: signedName.trim(), status: 'Accepted' };
      }
      return p;
    });

    const nextLead = { 
      ...lead, 
      proposals: updated, 
      status: 'Negotiation', 
      logs: [...(lead.logs || []), { text: `Proposal ${propId} signed digitally by ${signedName}`, time: new Date().toISOString() }] 
    };
    onUpdateLead(nextLead);
    toastSuccess('Proposal signed successfully! Transitioning lead stage to Negotiation.');
    setSignedName('');
  };

  // Handle task submission
  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    const item = {
      id: `t-${Date.now() % 1000}`,
      title: taskTitle.trim(),
      assignee: taskAssignee,
      priority: taskPriority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...(lead.tasks || []), item];
    const nextLead = { ...lead, tasks: updatedTasks };
    onUpdateLead(nextLead);
    setTaskTitle('');
    toastSuccess('Action task assigned to team.');
  };

  const handleToggleTask = (taskId: string) => {
    const updated = (lead.tasks || []).map((t: any) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    onUpdateLead({ ...lead, tasks: updated });
    toastSuccess('Task completion status changed!');
  };

  // Handle meeting submission
  const handleAddMeeting = () => {
    if (!meetingAgenda.trim() || !meetingDate) {
      toastError('Provide an agenda and a target date/time.');
      return;
    }

    const item = {
      id: `meet-${Date.now() % 1000}`,
      agenda: meetingAgenda.trim(),
      date: meetingDate,
      actionItems: meetingActionItems.trim() || 'Review requirements',
      createdAt: new Date().toISOString()
    };

    const updatedMeetings = [...(lead.meetings || []), item];
    const logItem = `Scheduled Google Meet alignment: ${meetingAgenda.trim()} on ${meetingDate}`;
    const updatedLogs = [...(lead.logs || []), { text: logItem, time: new Date().toISOString() }];

    const nextLead = { ...lead, meetings: updatedMeetings, logs: updatedLogs };
    onUpdateLead(nextLead);
    setMeetingAgenda('');
    setMeetingDate('');
    setMeetingActionItems('');
    toastSuccess('Venture meeting logged & sync to BSM Google Calendar simulated.');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white border border-slate-200 rounded-[3.5rem] w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
      >
        {/* Top Header Section */}
        <div className="p-12 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 relative group overflow-hidden">
              <User size={40} />
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload size={24} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                  {lead.customerName || 'Anonymous Lead'}
                </h2>
                <div className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                  lead.priority === 'Hot' ? 'bg-rose-50 text-primary shadow-sm' : 'bg-slate-100 text-slate-500 shadow-sm'
                }`}>
                  {lead.priority || 'Standard'} Priority
                </div>
              </div>
              <div className="flex items-center gap-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-primary" />
                  <span>{lead.businessName || 'Indie Enterprise'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-primary" />
                  <span>{lead.industry || 'Market General'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-primary" />
                  <span>{lead.status || 'New Lead'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              Edit Ledger
            </button>
            <button 
              onClick={onClose}
              className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary transition-all shadow-sm active:scale-95"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation & Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Action Tabs Sidebar */}
          <div className="w-80 border-r border-slate-100 bg-slate-50/30 overflow-y-auto p-8 space-y-4">
            {[
              { id: 'profile', label: 'Account Summary', icon: User },
              { id: 'followups', label: 'Neural Logs', icon: MessageSquare },
              { id: 'quotes', label: 'Quotation Engine', icon: DollarSign },
              { id: 'proposals', label: 'Strategic Proposals', icon: FileText },
              { id: 'tasks', label: 'Action Center', icon: ListTodo },
              { id: 'meetings', label: 'Alignment Desk', icon: Calendar }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all group ${
                  activeSubTab === tab.id 
                    ? 'bg-white text-primary shadow-xl shadow-slate-200/50 border border-slate-100' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  activeSubTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                }`}>
                  <tab.icon size={18} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                {activeSubTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            ))}
          </div>

          {/* Main Content Workspace */}
          <div className="flex-1 overflow-y-auto p-12 bg-white scroll-smooth no-scrollbar">
            <AnimatePresence mode="wait">
              {activeSubTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  {/* Detailed Specs Grid */}
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                          <Info size={20} className="text-primary" />
                          Corporate Identity
                        </h3>
                        <div className="grid grid-cols-2 gap-8">
                          {[
                            { label: 'Origin Channel', value: lead.source || 'Direct Ingestion' },
                            { label: 'Account Type', value: lead.type || 'Enterprise' },
                            { label: 'Contact Suffix', value: lead.mobile || 'Confidential' },
                            { label: 'WhatsApp', value: lead.whatsapp || 'Pending' },
                            { label: 'Primary Email', value: lead.email || 'Confidential' },
                            { label: 'Industry Node', value: lead.industry || 'Market General' },
                            { label: 'Territory', value: lead.city ? `${lead.city}, ${lead.state || ''}` : lead.preferredLocation || 'India' },
                            { label: 'Asset Value', value: `₹${Number(lead.budget || 0).toLocaleString()}`, highlight: true },
                          ].map((field, i) => (
                            <div key={i} className="space-y-1">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{field.label}</p>
                              <p className={`text-[13px] font-bold ${field.highlight ? 'text-primary' : 'text-slate-900'}`}>{field.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Strategic Intent</h4>
                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">
                          "{lead.businessGoal || 'Objective mapping pending. Client seeks general platform orchestration.'}"
                        </p>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                          <Award size={20} className="text-primary" />
                          Internal Intelligence
                        </h3>
                        <div className="grid grid-cols-2 gap-6 mb-10">
                          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl shadow-slate-900/20">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conversion Fit</p>
                            <h5 className="text-3xl font-black tracking-tighter">82%</h5>
                          </div>
                          <div className="bg-primary p-8 rounded-3xl text-white shadow-2xl shadow-primary/20">
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Priority Tier</p>
                            <h5 className="text-3xl font-black tracking-tighter">Gold</h5>
                          </div>
                        </div>
                        
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Audit Trail</p>
                          {(lead.logs || []).length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Log Entries</p>
                            </div>
                          ) : (
                            (lead.logs || []).slice().reverse().map((log: any, idx: number) => (
                              <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm relative pl-10 overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-100" />
                                <div className="flex justify-between items-start gap-4">
                                  <p className="text-[11px] font-medium text-slate-600 leading-relaxed">{log.text}</p>
                                  <span className="text-[9px] font-black text-slate-400 uppercase shrink-0">{new Date(log.time).toLocaleTimeString()}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'followups' && (
                <motion.div 
                  key="followups"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-12 gap-12"
                >
                  <div className="col-span-4 space-y-10">
                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-inner">
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                        <Zap size={20} className="text-primary" />
                        Engagement Logger
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Channel</label>
                          <select
                            value={followupType}
                            onChange={(e) => setFollowupType(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm appearance-none"
                          >
                            <option value="Phone Call">Phone Call</option>
                            <option value="WhatsApp Chat">WhatsApp Chat</option>
                            <option value="Email Proposal">Email Dispatch</option>
                            <option value="Google Meet">Video Conference</option>
                            <option value="Video Call">Sourcing Audit</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Outcome</label>
                          <select
                            value={followupOutcome}
                            onChange={(e) => setFollowupOutcome(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm appearance-none"
                          >
                            <option value="Interested / Advancing">Advancing to Next Node</option>
                            <option value="No Answer / Retry">Node Silent / Retry</option>
                            <option value="Budget Constraint Negotiation">Budget Negotiation</option>
                            <option value="Postponed Launch">Project Postponed</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Next Consultation Window</label>
                          <input
                            type="date"
                            value={nextFollowupDate}
                            onChange={(e) => setNextFollowupDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interaction Brief</label>
                          <textarea
                            rows={4}
                            placeholder="Detail the technical parameters discussed..."
                            value={followupNotes}
                            onChange={(e) => setFollowupNotes(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-5 py-4 text-[12px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          />
                        </div>

                        <button
                          onClick={handleLogFollowup}
                          className="w-full py-5 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                        >
                          Archive Engagement Node
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-8 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                      <Layers size={20} className="text-primary" />
                      Interaction Ledger
                    </h3>
                    <div className="space-y-6">
                      {(!lead.followups || lead.followups.length === 0) ? (
                        <div className="py-24 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                            <MessageSquare size={32} />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Engagement Records Found</p>
                        </div>
                      ) : (
                        lead.followups.map((f: any, idx: number) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-4 hover:shadow-xl hover:border-primary/20 transition-all group"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                  <Phone size={18} />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">{f.type}</h4>
                              </div>
                              <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest">
                                {f.outcome}
                              </span>
                            </div>
                            <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{f.notes}</p>
                            <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                              <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-primary" />
                                <span>Next Action: {f.nextFollowupDate}</span>
                              </div>
                              <span>Logged: {new Date(f.loggedAt).toLocaleDateString()}</span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'quotes' && (
                <motion.div 
                  key="quotes"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-12 gap-12"
                >
                  <div className="col-span-5 space-y-10">
                    <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
                          <DollarSign size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tighter">Draft Quotation</h3>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Revenue Generator</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Catalog Service</label>
                          <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm appearance-none"
                          >
                            <option value="">-- Choose Corporate Catalog --</option>
                            {services.map(s => (
                              <option key={s.id} value={s.id}>{s.title} (₹{s.price})</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Base (₹)</label>
                            <input 
                              type="number"
                              value={customPrice}
                              onChange={(e) => setCustomPrice(Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Discount (₹)</label>
                            <input 
                              type="number"
                              value={customDiscount}
                              onChange={(e) => setCustomDiscount(Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GST / Tax (%)</label>
                            <input 
                              type="number"
                              value={customTax}
                              onChange={(e) => setCustomTax(Number(e.target.value))}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Validity</label>
                            <select
                              value={quoteValidity}
                              onChange={(e) => setQuoteValidity(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm appearance-none"
                            >
                              <option value="15 Days">15 Days</option>
                              <option value="30 Days">30 Days</option>
                              <option value="7 Days">7 Days</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-8 bg-slate-900 rounded-[2rem] border border-white/5 space-y-4">
                          <div className="flex justify-between items-center text-slate-500">
                            <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                            <span className="text-sm font-black font-mono">₹{(customPrice - customDiscount).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500">
                            <span className="text-[10px] font-black uppercase tracking-widest">Neural Tax</span>
                            <span className="text-sm font-black font-mono">₹{Math.round((customPrice - customDiscount) * (customTax / 100)).toLocaleString()}</span>
                          </div>
                          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Total Invoice</span>
                            <span className="text-2xl font-black text-white tracking-tighter font-mono">₹{Math.round((customPrice - customDiscount) * (1 + customTax / 100)).toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={handleCreateQuote}
                          className="w-full py-5 bg-emerald-600 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Send size={14} />
                          Publish Formal Quote
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-7 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                      <RefreshCw size={20} className="text-primary" />
                      Active Quoted Services
                    </h3>
                    <div className="space-y-6">
                      {(!lead.quotes || lead.quotes.length === 0) ? (
                        <div className="py-24 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                            <FileText size={32} />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Quotation Records</p>
                        </div>
                      ) : (
                        lead.quotes.map((q: any) => (
                          <motion.div 
                            key={q.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex justify-between items-center group hover:shadow-xl hover:border-emerald-500/20 transition-all"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-500 font-mono px-3 py-1 bg-slate-50 rounded-full">{q.id}</span>
                                <h4 className="text-lg font-black text-slate-900 tracking-tight">{q.serviceTitle}</h4>
                              </div>
                              <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                  <Calendar size={12} className="text-emerald-500" />
                                  <span>Expires: {q.validity}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Sparkles size={12} className="text-emerald-500" />
                                  <span>Issued: {new Date(q.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-4">
                              <h5 className="text-2xl font-black text-slate-900 tracking-tighter font-mono">₹{q.total.toLocaleString()}</h5>
                              <button
                                onClick={() => {
                                  const updated = lead.quotes.map((item: any) => {
                                    if (item.id === q.id) {
                                      return { ...item, status: 'Accepted' };
                                    }
                                    return item;
                                  });
                                  onUpdateLead({
                                    ...lead,
                                    quotes: updated,
                                    status: 'Payment Received',
                                    logs: [...(lead.logs || []), { text: `Quotation ${q.id} accepted. Advanced node.`, time: new Date().toISOString() }]
                                  });
                                  toastSuccess('Success Node Verified');
                                }}
                                className={`px-6 py-2.5 text-[10px] font-black rounded-2xl uppercase tracking-widest transition-all ${
                                  q.status === 'Accepted'
                                    ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                                    : 'bg-slate-900 text-white hover:bg-emerald-600'
                                }`}
                                disabled={q.status === 'Accepted'}
                              >
                                {q.status === 'Accepted' ? 'Settled' : 'Simulate Payment'}
                              </button>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'proposals' && (
                <motion.div 
                  key="proposals"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-12 gap-12"
                >
                  <div className="col-span-5 space-y-10">
                    <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner">
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        Proposal Forge
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Scope Brief</label>
                          <textarea
                            rows={4}
                            placeholder="Detail the technical or compliance audit actions..."
                            value={proposalScope}
                            onChange={(e) => setProposalScope(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4 text-[12px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deliverables</label>
                          <textarea
                            rows={3}
                            placeholder="e.g. GSTIN procurement, Brand Assets..."
                            value={proposalDeliverables}
                            onChange={(e) => setProposalDeliverables(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4 text-[12px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payment Protocol</label>
                          <input
                            type="text"
                            value={proposalPaymentSchedule}
                            onChange={(e) => setProposalPaymentSchedule(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm"
                          />
                        </div>
                        <button
                          onClick={handleCreateProposal}
                          className="w-full py-5 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                        >
                          Dispatch Strategy Proposal
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-7 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                      <Target size={20} className="text-primary" />
                      Active Strategies
                    </h3>
                    <div className="space-y-6">
                      {(!lead.proposals || lead.proposals.length === 0) ? (
                        <div className="py-24 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Proposals</p>
                        </div>
                      ) : (
                        lead.proposals.map((p: any) => (
                          <motion.div 
                            key={p.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-slate-100 p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-8 hover:shadow-xl hover:border-primary/20 transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-500 font-mono">ID: {p.id}</span>
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-wider">Project Charter</h4>
                              </div>
                              <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                                p.status === 'Accepted' ? 'bg-emerald-50 text-emerald-500' : 'bg-primary/5 text-primary'
                              }`}>
                                Status: {p.status}
                              </span>
                            </div>

                            <div className="space-y-6 text-[13px] font-medium text-slate-600 leading-relaxed">
                              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Technical Scope</p>
                                {p.scope}
                              </div>
                              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Deliverables Mapped</p>
                                {p.deliverables}
                              </div>
                            </div>

                            {p.status !== 'Accepted' ? (
                              <div className="pt-8 border-t border-slate-50 flex items-center gap-6">
                                <div className="flex-1 space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Digital Signature</label>
                                  <input
                                    type="text"
                                    placeholder="Type Legal Name to Sign"
                                    value={signedName}
                                    onChange={(e) => setSignedName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSignProposal(p.id)}
                                  className="px-10 py-4 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95 self-end"
                                >
                                  Execute Agreement
                                </button>
                              </div>
                            ) : (
                              <div className="pt-8 border-t border-slate-50 flex items-center gap-3 text-emerald-500">
                                <Check size={20} />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Digitally Verified: {p.signedByLead}</span>
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'tasks' && (
                <motion.div 
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-12 gap-12"
                >
                  <div className="col-span-4 space-y-10">
                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-inner">
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                        <Plus size={20} className="text-primary" />
                        Action Forge
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Task Descriptor</label>
                          <input
                            type="text"
                            placeholder="e.g. Doc Audit Completion..."
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assignee</label>
                          <select
                            value={taskAssignee}
                            onChange={(e) => setTaskAssignee(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm appearance-none"
                          >
                            <option value="Business Success Manager">BSM Lead</option>
                            <option value="Research Executive">Research Node</option>
                            <option value="Consultant Partner">Consultant Partner</option>
                            <option value="Vanguard Admin">System Admin</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                          <select
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm appearance-none"
                          >
                            <option value="High">Priority Node</option>
                            <option value="Medium">Standard</option>
                            <option value="Low">Low Priority</option>
                          </select>
                        </div>
                        <button
                          onClick={handleAddTask}
                          className="w-full py-5 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                        >
                          Inject Action Task
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-8 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                      <ListTodo size={20} className="text-primary" />
                      Neural Checklist
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {(!lead.tasks || lead.tasks.length === 0) ? (
                        <div className="py-24 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checklist Empty</p>
                        </div>
                      ) : (
                        lead.tasks.map((t: any) => (
                          <motion.div 
                            key={t.id} 
                            layout
                            onClick={() => handleToggleTask(t.id)}
                            className={`p-8 rounded-[2rem] border cursor-pointer flex justify-between items-center transition-all ${
                              t.completed 
                                ? 'bg-slate-50 border-slate-100 opacity-60' 
                                : 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-xl'
                            }`}
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                t.completed ? 'bg-primary border-primary text-white' : 'border-slate-200 bg-white'
                              }`}>
                                {t.completed && <Check size={16} />}
                              </div>
                              <div>
                                <p className={`text-[13px] font-black tracking-tight ${t.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{t.title}</p>
                                <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                                  <span>Owner: {t.assignee}</span>
                                  <span>Priority: {t.priority}</span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase font-mono">{t.id}</span>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'meetings' && (
                <motion.div 
                  key="meetings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-12 gap-12"
                >
                  <div className="col-span-4 space-y-10">
                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-inner">
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-8 flex items-center gap-3">
                        <Calendar size={20} className="text-primary" />
                        Alignment Desk
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Window</label>
                          <input
                            type="datetime-local"
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Agenda Hub</label>
                          <input
                            type="text"
                            placeholder="Scope audit review session..."
                            value={meetingAgenda}
                            onChange={(e) => setMeetingAgenda(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[12px] font-bold text-slate-900 focus:outline-none shadow-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Action Items Brief</label>
                          <textarea
                            rows={3}
                            placeholder="Identify bottlenecks, agree on timelines..."
                            value={meetingActionItems}
                            onChange={(e) => setMeetingActionItems(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-6 py-4 text-[12px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                          />
                        </div>
                        <button
                          onClick={handleAddMeeting}
                          className="w-full py-5 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                        >
                          Schedule Strategy Consultation
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-8 space-y-8">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                      <Globe size={20} className="text-primary" />
                      Scheduled Consultations
                    </h3>
                    <div className="space-y-6">
                      {(!lead.meetings || lead.meetings.length === 0) ? (
                        <div className="py-24 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Events Scheduled</p>
                        </div>
                      ) : (
                        lead.meetings.map((m: any) => (
                          <motion.div 
                            key={m.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-slate-100 p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-8 hover:shadow-xl hover:border-primary/20 transition-all"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl shadow-slate-900/20">
                                  <span className="text-[10px] font-black uppercase opacity-60">Node</span>
                                  <span className="text-xl font-black tracking-tighter">{new Date(m.date).getDate()}</span>
                                </div>
                                <div>
                                  <h4 className="text-xl font-black text-slate-900 tracking-tighter">{m.agenda}</h4>
                                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">Virtual Consultation Scheduled</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Window</p>
                                <p className="text-[13px] font-black text-slate-900">{new Date(m.date).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Action Parameters</p>
                              <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">"{m.actionItems}"</p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Inline helper for cleanly returning component content or fallback subtabs
function activeTabSubTabHandler(active: string, current: string, content: React.ReactNode) {
  if (active === current) {
    return content;
  }
  return null;
}
