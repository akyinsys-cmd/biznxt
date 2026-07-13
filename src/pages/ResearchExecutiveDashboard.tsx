import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Check, 
  ChevronRight, 
  Clock, 
  Award, 
  Sparkles, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  ListTodo,
  CheckSquare,
  ClipboardList,
  ShieldAlert,
  Download,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { updateTicketStatusWithNotifications } from '../services/ResearchService';
import ResearchFeedbackDialog from '../components/research/ResearchFeedbackDialog';
import { triggerHapticFeedback } from '../lib/vibration';

export interface ResearchTicket {
  id: string;
  ticketNumber: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  packageId: string;
  packageName: string;
  businessCategory: string;
  businessType: string;
  investment: string;
  location: string;
  createdAt: any;
  updatedAt: any;
  dueDate: string;
  status: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedExecutive: string;
  assignedQALead?: string;
  comments: { sender: string; senderRole: string; message: string; timestamp: any }[];
  internalNotes: string;
  findings?: {
    marketSize?: string;
    competitors?: string;
    financialEstimates?: string;
    swotAnalysis?: string;
    roadmap?: string;
    locationAnalysis?: string;
    customAnswers?: string;
  };
}

const STATUS_FLOW = [
  { id: 'payment_received', label: 'Payment Received', color: 'bg-emerald-500 text-white' },
  { id: 'waiting_assignment', label: 'Waiting Assignment', color: 'bg-amber-500 text-white' },
  { id: 'assigned', label: 'Assigned', color: 'bg-indigo-500 text-white' },
  { id: 'research_started', label: 'Research Started', color: 'bg-blue-500 text-white' },
  { id: 'market_research', label: 'Market Research', color: 'bg-cyan-500 text-white' },
  { id: 'competitor_analysis', label: 'Competitor Analysis', color: 'bg-sky-500 text-white' },
  { id: 'financial_analysis', label: 'Financial Analysis', color: 'bg-teal-500 text-white' },
  { id: 'internal_review', label: 'Internal Review', color: 'bg-purple-500 text-white' },
  { id: 'qa_review', label: 'QA Review', color: 'bg-pink-500 text-white' },
  { id: 'pdf_generation', label: 'PDF Generation', color: 'bg-violet-500 text-white' },
  { id: 'approved', label: 'Approved', color: 'bg-emerald-600 text-white' },
  { id: 'delivered', label: 'Delivered', color: 'bg-primary text-white' },
  { id: 'completed', label: 'Completed', color: 'bg-slate-700 text-white' }
];

export default function ResearchExecutiveDashboard() {
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<ResearchTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Active Deadline Countdown state
  const [countdownStr, setCountdownStr] = useState<string>('00d 00h 00m 00s');

  // Interactive Task Checklist Local State
  const [tasks, setTasks] = useState<{ id: string; title: string; completed: boolean }[]>([
    { id: '1', title: 'Verify business registry and license registers', completed: true },
    { id: '2', title: 'Locate 5 nearest commercial competitors', completed: false },
    { id: '3', title: 'Compile Capex / Opex baseline cost sheets', completed: false },
    { id: '4', title: 'Formulate SWOT Risk Mitigation Matrix', completed: false },
    { id: '5', title: 'Draft final executive growth roadmap', completed: false },
  ]);

  // AI Content Assistant Draft States
  const [aiDraftType, setAiDraftType] = useState<string>('executive_summary');
  const [aiInstructions, setAiInstructions] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);

  // Feedback Dialog state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  // Sync Tickets from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'research_tickets'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData: ResearchTicket[] = [];
      snapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() } as ResearchTicket);
      });
      setTickets(ticketsData);
      setLoading(false);
    }, (error) => {
      console.error("Error loading tickets for dashboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;

  // Deadline Countdown Timer update effect
  useEffect(() => {
    if (!selectedTicket || !selectedTicket.dueDate) {
      setCountdownStr('No Active Deadline');
      return;
    }

    const updateCountdown = () => {
      const target = new Date(`${selectedTicket.dueDate}T23:59:59`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdownStr('Deadline Reached / Overdue');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const dStr = days.toString().padStart(2, '0');
      const hStr = hours.toString().padStart(2, '0');
      const mStr = minutes.toString().padStart(2, '0');
      const sStr = seconds.toString().padStart(2, '0');

      setCountdownStr(`${dStr}d ${hStr}h ${mStr}m ${sStr}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedTicket]);

  // Toggle checklist tasks
  const handleToggleTask = (id: string) => {
    triggerHapticFeedback('light');
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    showToast("Checklist task updated!", "info");
  };

  // Add new checklist task
  const [newChecklistText, setNewChecklistText] = useState('');
  const handleAddChecklistTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    triggerHapticFeedback('success');
    setTasks(prev => [
      ...prev,
      { id: Date.now().toString(), title: newChecklistText.trim(), completed: false }
    ]);
    setNewChecklistText('');
    showToast("Added custom task item to workspace checklist!", "success");
  };

  // Contact AI draft API
  const handleGenerateDraft = async () => {
    if (!selectedTicket) {
      showToast("Please select a valid ticket first.", "error");
      return;
    }
    setGenerating(true);
    setAiOutput('');

    try {
      const response = await fetch('/api/research/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessCategory: selectedTicket.businessCategory,
          businessType: selectedTicket.businessType,
          investment: selectedTicket.investment,
          location: selectedTicket.location,
          draftType: aiDraftType,
          specialRequirements: aiInstructions
        })
      });

      const data = await response.json();
      if (response.ok && data.draft) {
        setAiOutput(data.draft);
        showToast("Gemini draft successfully compiled!", "success");
      } else {
        throw new Error(data.error || "Failed to generate draft.");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to generate draft.", "error");
    } finally {
      setGenerating(false);
    }
  };

  // Submit report to QA Review
  const handleSubmitToQA = async () => {
    if (!selectedTicket) return;
    const pendingTasks = tasks.filter(t => !t.completed);
    if (pendingTasks.length > 0) {
      const confirm = window.confirm(`You still have ${pendingTasks.length} pending task(s) on your checklist. Do you want to proceed and submit anyway?`);
      if (!confirm) return;
    }

    try {
      // Transition ticket to qa_review status and trigger automated notification alerts
      const res = await updateTicketStatusWithNotifications(
        selectedTicket.id, 
        selectedTicket.ticketNumber, 
        'qa_review', 
        selectedTicket.userEmail, 
        selectedTicket.userName
      );

      if (res.success) {
        triggerHapticFeedback('success');
        showToast(`Ticket ${selectedTicket.ticketNumber} successfully submitted for QA Audit!`, "success");
        
        // Push activity log commentary
        const ticketRef = doc(db, 'research_tickets', selectedTicket.id);
        const systemComment = {
          sender: 'System Co-Pilot',
          senderRole: 'system',
          message: `Workspace report completed and pushed to QA audit queue. Peer review review pending.`,
          timestamp: new Date().toISOString()
        };

        await updateDoc(ticketRef, {
          comments: [...(selectedTicket.comments || []), systemComment]
        });

      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      showToast(err.message || "QA submission failed.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <p className="text-slate-500 text-xs">Loading SME Research Desk workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="research-executive-dashboard-container">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-2xl bg-indigo-500 animate-ping" />
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-400">Analyst Control Command</span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight">Research Executive Dashboard</h2>
          <p className="text-slate-400 text-xs max-w-xl">
            SME Sourcing & analytical command deck. Review client requests, coordinate primary location audits, generate content with the Gemini Co-pilot, and push dossiers for peer QA checks.
          </p>
        </div>

        {selectedTicket && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[200px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-primary-light animate-pulse" />
              <span>SLA Target Timer</span>
            </span>
            <div className="text-center font-mono text-lg font-bold text-primary-light tracking-wide">
              {countdownStr}
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1">Due: {selectedTicket.dueDate}</span>
          </div>
        )}
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Ticket List & Checklist */}
        <div className="lg:col-span-4 space-y-6">
          {/* Ticket selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              <span>Assigned Active Tickets</span>
            </h3>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {tickets.map(t => {
                const isSelected = t.id === selectedTicketId;
                const statusLabel = STATUS_FLOW.find(s => s.id === t.status)?.label || t.status;
                const badgeColor = STATUS_FLOW.find(s => s.id === t.status)?.color || 'bg-slate-200 text-slate-600';
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/[0.02] shadow-sm scale-[1.01]' 
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-primary font-bold">{t.ticketNumber}</span>
                      <span className="text-slate-500">{t.dueDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mt-1 truncate">{t.businessCategory}</h4>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-slate-500 truncate max-w-[120px]">By: {t.userName}</span>
                      <span className={`px-2 py-0.5 rounded-2xl text-[9px] font-bold uppercase ${badgeColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}

              {tickets.length === 0 && (
                <p className="text-slate-500 text-xs text-center py-6">No research tickets found in Firestore.</p>
              )}
            </div>
          </div>

          {/* Task Checklist Panel */}
          {selectedTicket && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ListTodo className="w-4.5 h-4.5 text-emerald-500" />
                  <span>Analytical Task Checklist</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Check progress items before pushing file to final peer review review.</p>
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-start gap-3 cursor-pointer select-none group"
                  >
                    <div className={`w-4.5 h-4.5 rounded border mt-0.5 flex items-center justify-center transition-all ${
                      task.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`text-xs transition-colors ${task.completed ? 'text-slate-400 line-through font-medium' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add custom checklist item */}
              <form onSubmit={handleAddChecklistTask} className="flex gap-1.5 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Add customized campaign check..."
                  value={newChecklistText}
                  onChange={e => setNewChecklistText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:bg-white"
                />
                <button 
                  type="submit"
                  className="p-2 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors"
                  title="Add check"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right column: Content Workspace & AI Module */}
        {selectedTicket ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Active Ticket Quick Info Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-2xl text-[10px] font-bold font-mono">
                      {selectedTicket.packageName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-mono">Order: {selectedTicket.orderId}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display mt-1">
                    {selectedTicket.businessCategory} ({selectedTicket.businessType})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-2xl text-xs font-bold uppercase ${
                    STATUS_FLOW.find(s => s.id === selectedTicket.status)?.color || 'bg-slate-200'
                  }`}>
                    {STATUS_FLOW.find(s => s.id === selectedTicket.status)?.label || selectedTicket.status}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Target Location</span>
                  <div className="flex items-center gap-1 text-slate-800 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedTicket.location}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total CapEx Budget</span>
                  <div className="flex items-center gap-1 text-slate-800 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedTicket.investment}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Lead QA Auditor</span>
                  <div className="text-slate-800 font-semibold">
                    {selectedTicket.assignedQALead || 'Pooja Patel (QA Director)'}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Co-Pilot drafting module */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-2xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-indigo-950 font-display">SME AI Drafting Co-Pilot</h3>
                  <p className="text-[11px] text-indigo-700 mt-0.5">
                    Utilize on-server Gemini inference configurations to generate high-fidelity sections matching BizNxt 3.0 layout guidelines.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider font-mono">Dossier Target Block</label>
                    <select
                      value={aiDraftType}
                      onChange={e => setAiDraftType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-indigo-100 rounded-2xl text-xs focus:outline-none"
                    >
                      <option value="executive_summary">1. Executive Summary Outline</option>
                      <option value="market_overview">2. Competitive TAM/SAM Overview</option>
                      <option value="swot">3. SWOT Risk Defense Blueprint</option>
                      <option value="investment">4. CapEx & Opex Cost Allocation model</option>
                      <option value="action_plan">5. 90-Day Enterprise GTM Roadmap</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider font-mono">Focus Guidelines & Constraints</label>
                    <textarea
                      rows={4}
                      value={aiInstructions}
                      onChange={e => setAiInstructions(e.target.value)}
                      placeholder="e.g. Focus on digital wholesale channels, manufacturing base raw materials in Ahmedabad, 5-year payback timelines..."
                      className="w-full p-3 bg-white border border-indigo-100 rounded-2xl text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleGenerateDraft}
                    disabled={generating}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating outline...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Custom AI Section</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center bg-indigo-100/50 p-2 border border-indigo-100 rounded-t-xl">
                    <span className="text-[9px] font-bold text-indigo-800 uppercase font-mono">Co-pilot synthesis terminal</span>
                    {aiOutput && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(aiOutput);
                          showToast("Copied draft to clipboard!", "success");
                        }}
                        className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-bold hover:bg-indigo-700"
                      >
                        Copy to Sourcing Draft
                      </button>
                    )}
                  </div>
                  <textarea
                    readOnly
                    rows={8}
                    value={aiOutput || 'Inference responses appear here. Enter constraints and click "Generate Custom AI Section" to start.'}
                    className="w-full flex-1 p-4 bg-slate-900 text-slate-100 border border-slate-900 rounded-b-xl text-xs font-mono focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* QA Peer Audit & Revisions Control Section */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5 justify-center md:justify-start">
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                  <span>Quality Assurance Gates</span>
                </h4>
                <p className="text-[11px] text-slate-500 max-w-md">
                  Once your document drafts and primary location analyses are gathered, push to QA review where peer directors verify cost metrics and model guidelines.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ClipboardList className="w-4 h-4 text-slate-500" />
                  <span>Log QA Audit Feedback</span>
                </button>

                <button
                  onClick={handleSubmitToQA}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit for QA</span>
                </button>
              </div>
            </div>

            {/* QA Feedback dialogue */}
            <ResearchFeedbackDialog
              isOpen={isFeedbackOpen}
              onClose={() => setIsFeedbackOpen(false)}
              ticketId={selectedTicket.id}
              ticketNumber={selectedTicket.ticketNumber}
              qaLeadName={selectedTicket.assignedQALead || 'Pooja Patel (QA Director)'}
              onSubmitSuccess={() => {
                setIsFeedbackOpen(false);
              }}
              showToast={showToast}
            />

          </div>
        ) : (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold font-display text-slate-900 text-sm">Select an Active Sourcing Ticket</h3>
            <p className="text-slate-500 text-xs">Choose a campaign from the assigned list on the left to start drafting and peer-review audits.</p>
          </div>
        )}
      </div>
    </div>
  );
}
