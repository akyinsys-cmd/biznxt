import React, { useState, useEffect } from 'react';
import { 
  Award, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Download, 
  Eye, 
  ChevronRight, 
  User, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Calendar, 
  Compass, 
  ShieldCheck,
  Send,
  Loader2,
  FileText
} from 'lucide-react';
import { ResearchTicket } from '../pages/PremiumResearch';
import ResearchPDFPreview from './ResearchPDFPreview';

export function ClaymorphicBadge({ status, label }: { status: string; label: string }) {
  let bg = 'bg-slate-100';
  let border = 'border-slate-200/50';
  let text = 'text-slate-700';
  let glow = 'rgba(148, 163, 184, 0.3)';

  if (status === 'completed' || status === 'approved' || status === 'delivered') {
    bg = 'bg-emerald-100/90';
    border = 'border-white';
    text = 'text-emerald-800';
    glow = 'rgba(16, 185, 129, 0.4)';
  } else if (status === 'qa_review' || status === 'internal_review') {
    bg = 'bg-pink-100/90';
    border = 'border-white';
    text = 'text-pink-800';
    glow = 'rgba(236, 72, 153, 0.4)';
  } else if (status.includes('analysis') || status.includes('research') || status === 'pdf_generation') {
    bg = 'bg-indigo-100/90';
    border = 'border-white';
    text = 'text-indigo-800';
    glow = 'rgba(99, 102, 241, 0.4)';
  } else if (status === 'assigned' || status === 'research_started') {
    bg = 'bg-blue-100/90';
    border = 'border-white';
    text = 'text-blue-800';
    glow = 'rgba(59, 130, 246, 0.4)';
  } else {
    bg = 'bg-amber-100/90';
    border = 'border-white';
    text = 'text-amber-800';
    glow = 'rgba(245, 158, 11, 0.4)';
  }

  return (
    <span 
      className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider border ${bg} ${border} ${text}`}
      style={{
        boxShadow: `3px 3px 8px ${glow}, inset -2px -2px 5px rgba(0,0,0,0.06), inset 2px 2px 5px rgba(255,255,255,0.8)`
      }}
    >
      <span className="w-1.5 h-1.5 rounded-2xl bg-current mr-1.5 animate-pulse" />
      {label}
    </span>
  );
}

interface ResearchDashboardProps {
  tickets: ResearchTicket[];
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  user: any;
  handleDownloadReportPDF: (ticket: ResearchTicket) => void;
  handleSendComment: (comment: string) => void;
  STATUS_FLOW: { id: string; label: string; color: string }[];
}

export default function ResearchDashboard({
  tickets,
  selectedTicketId,
  setSelectedTicketId,
  user,
  handleDownloadReportPDF,
  handleSendComment,
  STATUS_FLOW
}: ResearchDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tracker' | 'pdf_preview' | 'chat'>('tracker');
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [countdownStr, setCountdownStr] = useState<string>('00d 00h 00m 00s');

  // Pick active ticket
  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;

  const currentStatusLabel = activeTicket 
    ? (STATUS_FLOW.find(s => s.id === activeTicket.status)?.label || activeTicket.status) 
    : '';

  // Get active status index for milestones
  const activeStatusIndex = activeTicket 
    ? STATUS_FLOW.findIndex(s => s.id === activeTicket.status) 
    : 0;

  // Real-time Delivery Countdown effect
  useEffect(() => {
    if (!activeTicket || !activeTicket.dueDate) {
      setCountdownStr('No Active SLA');
      return;
    }

    const updateCountdown = () => {
      const target = new Date(`${activeTicket.dueDate}T23:59:59`);
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdownStr('SLA Under Review / Delivered');
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
  }, [activeTicket]);

  // Render dummy milestones if none are saved in ticket yet, otherwise pull from ticket
  const timelineMilestones = (activeTicket as any)?.projectTimeline || [
    { milestone: "1. Desk Setup & File Verification", daysOffset: 1, action: "Analyst parses submitted paperwork & MCA registers.", stageIndex: 2 },
    { milestone: "2. Primary Sourcing & Competitor Audits", daysOffset: 2, action: "Identify top 5 regional competitors & pricing sheets.", stageIndex: 5 },
    { milestone: "3. Capex Allocation & Working Capital Model", daysOffset: 3, action: "Build 5-year CAGR estimates & cost breakdown.", stageIndex: 6 },
    { milestone: "4. SWOT Drafting & Reference Assembly", daysOffset: 4, action: "Assemble risk mitigation matrix and references.", stageIndex: 7 },
    { milestone: "5. QA Review & Multi-format PDF Delivery", daysOffset: 5, action: "Audit peer checklist & lock dynamic PDF download.", stageIndex: 10 },
  ];

  const handlePostChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTicket) return;
    setSendingChat(true);
    try {
      await handleSendComment(chatInput);
      setChatInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setSendingChat(false);
    }
  };

  if (!activeTicket) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold font-display text-slate-900">No Active Research Tickets</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          Unlock your premium feasibility validations and competitive intelligence by requesting a research package above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn" id="claymorphic-research-dashboard-root">
      
      {/* 1. CLAYMORPHIC OVERVIEW STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Tickets Card - Soft Blue Clay */}
        <div className="bg-blue-50/70 border border-white rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] shadow-[8px_8px_16px_rgba(219,234,254,0.6),-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">Dossier Pool</span>
            <h3 className="text-3xl font-extrabold text-blue-900 font-display">{tickets.length}</h3>
            <p className="text-[10px] text-blue-500 font-medium">Active premium campaigns</p>
          </div>
          <div className="p-4 bg-white/80 border border-blue-100 rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.02)]">
            <Layers className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Current Stage Card - Soft Amber Clay */}
        <div className="bg-amber-50/70 border border-white rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] shadow-[8px_8px_16px_rgba(254,243,199,0.6),-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono">Current Stage</span>
            <h3 className="text-lg font-bold text-amber-900 font-display truncate max-w-[150px]">{currentStatusLabel}</h3>
            <p className="text-[10px] text-amber-500 font-medium">Stage {activeStatusIndex + 1} of 13</p>
          </div>
          <div className="p-4 bg-white/80 border border-amber-100 rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.02)]">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        {/* Lead Researcher Card - Soft Indigo Clay */}
        <div className="bg-indigo-50/70 border border-white rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] shadow-[8px_8px_16px_rgba(224,231,255,0.6),-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Industry SME</span>
            <h3 className="text-sm font-extrabold text-indigo-900 font-display truncate max-w-[150px]">{activeTicket.assignedExecutive}</h3>
            <p className="text-[10px] text-indigo-500 font-medium">Assigned expert guide</p>
          </div>
          <div className="p-4 bg-white/80 border border-indigo-100 rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.02)]">
            <User className="w-6 h-6 text-indigo-500" />
          </div>
        </div>

        {/* SLA Countdown Card - Soft Emerald Clay */}
        <div className="bg-emerald-50/70 border border-white rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] shadow-[8px_8px_16px_rgba(209,250,229,0.6),-8px_-8px_16px_rgba(255,255,255,0.9)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono">SLA Delivery Target</span>
            <h3 className="text-sm font-black text-emerald-900 font-mono tracking-wide">{countdownStr}</h3>
            <p className="text-[10px] text-emerald-500 font-medium">Target: {activeTicket.dueDate}</p>
          </div>
          <div className="p-4 bg-white/80 border border-emerald-100 rounded-2xl shadow-[inset_2px_2px_5px_rgba(0,0,0,0.02)]">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

      </div>

      {/* CLAYMORPHIC TICKETS STATUS CARD - improving scannability */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Feasibility Campaign Dossiers & Visual Status Badges</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
              Monitor your ongoing premium industry dossiers. Visual claymorphic indicators show real-time progress as analysts conduct physical mapping, competitor audits, and peer QA checklist validation.
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((t) => {
            const isSelected = t.id === selectedTicketId;
            const statusLabel = STATUS_FLOW.find(s => s.id === t.status)?.label || t.status;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected 
                    ? 'bg-indigo-50/40 border-indigo-500 shadow-[4px_4px_10px_rgba(99,102,241,0.15)] scale-[1.01]' 
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-primary">{t.ticketNumber}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold">Due {t.dueDate}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs truncate">{t.businessCategory}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{t.location}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100/70">
                  <span className="text-[10px] text-slate-400 font-medium">Stage Status:</span>
                  <ClaymorphicBadge status={t.status} label={statusLabel} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN TICKETS SELECTION BAR (If multiple tickets) */}
      {tickets.length > 1 && (
        <div className="bg-slate-100 rounded-2xl p-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0 pl-2">Select Campaign:</span>
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTicketId(t.id)}
              className={`px-4 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTicketId === t.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/50'
              }`}
            >
              {t.ticketNumber} - {t.businessCategory}
            </button>
          ))}
        </div>
      )}

      {/* 3. DYNAMIC WORKSPACE CARD - Interactive Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Dynamic Card Header */}
        <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-mono text-xs text-primary-light font-bold">{activeTicket.ticketNumber}</span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-slate-400 mr-2">{activeTicket.packageName}</span>
              <ClaymorphicBadge status={activeTicket.status} label={currentStatusLabel} />
            </div>
            <h3 className="text-xl font-bold font-display">{activeTicket.businessCategory}</h3>
            <p className="text-xs text-slate-400">Target Location: <span className="text-white font-bold">{activeTicket.location}</span></p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pdf_preview')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'pdf_preview' 
                  ? 'bg-primary text-white shadow' 
                  : 'bg-white/10 text-slate-300 hover:bg-white/25'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>🔬 Open Live PDF Preview</span>
            </button>

            {(activeTicket.status === 'delivered' || activeTicket.status === 'completed') ? (
              <button
                onClick={() => handleDownloadReportPDF(activeTicket)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Report PDF</span>
              </button>
            ) : (
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-amber-300 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Analyst Drafting</span>
              </div>
            )}
          </div>
        </div>

        {/* Tracker Inner Tabs Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          {[
            { id: 'tracker', label: '📊 Milestone Progress Tracker' },
            { id: 'pdf_preview', label: '🔬 Dynamic Report Preview' },
            { id: 'chat', label: '💬 Direct Analyst Chat' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3.5 text-center border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-bold bg-primary/[0.02]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Milestone Progress Tracker */}
        {activeTab === 'tracker' && (
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Linear Status Pipeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Venture Verification Stages</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {STATUS_FLOW.slice(0, 7).map((sf, idx) => {
                  const isActive = sf.id === activeTicket.status;
                  const isCompleted = STATUS_FLOW.findIndex(s => s.id === activeTicket.status) > idx;
                  return (
                    <div 
                      key={sf.id} 
                      className={`p-3 rounded-2xl border text-center space-y-1 transition-all ${
                        isActive 
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold scale-[1.02] shadow' 
                          : isCompleted 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="flex justify-center">
                        {isCompleted ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                        ) : isActive ? (
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold animate-pulse">●</span>
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[9px] flex items-center justify-center font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <p className="text-[10px] truncate">{sf.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Claymorphic Project Timeline Milestones */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">Automated Project Timeline Milestones</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Automated workflow engine matched checklist items upon payment success.</p>
                </div>
                <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-2xl font-mono font-bold uppercase">
                  Trigger Active
                </span>
              </div>

              <div className="space-y-4">
                {timelineMilestones.map((ms: any, idx: number) => {
                  // If stage index has been passed, check if activeTicket status is beyond or equal to this stage index
                  const isCompleted = activeStatusIndex >= ms.stageIndex;
                  const isActive = activeStatusIndex < ms.stageIndex && (idx === 0 || activeStatusIndex >= (timelineMilestones[idx - 1]?.stageIndex || 0));

                  return (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCompleted 
                          ? 'bg-emerald-50/50 border-emerald-200/60 shadow-[4px_4px_10px_rgba(209,250,229,0.3)]' 
                          : isActive 
                          ? 'bg-indigo-50/70 border-indigo-200/60 shadow-[4px_4px_10px_rgba(224,231,255,0.4)] scale-[1.01]' 
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-8 h-8 rounded-2xl flex items-center justify-center font-bold font-mono text-xs border ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : isActive 
                            ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse' 
                            : 'bg-white text-slate-400 border-slate-200'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>

                        <div>
                          <h4 className={`text-xs font-bold ${isCompleted ? 'text-emerald-900' : isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {ms.milestone}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{ms.action}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto text-right font-mono text-[10px]">
                        <div>
                          <p className="text-slate-400 uppercase font-bold">Owner</p>
                          <p className={`font-semibold ${isCompleted ? 'text-emerald-800' : isActive ? 'text-indigo-800' : 'text-slate-500'}`}>
                            {activeTicket.assignedExecutive.split(' (')[0]}
                          </p>
                        </div>
                        <div className="h-6 w-[1px] bg-slate-200" />
                        <div>
                          <p className="text-slate-400 uppercase font-bold">SLA Limit</p>
                          <p className={`font-semibold ${isCompleted ? 'text-emerald-800' : isActive ? 'text-indigo-800' : 'text-slate-500'}`}>
                            Day {ms.daysOffset || idx + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-900">Direct Analyst Dialogue:</span> Want custom regulatory inclusions or specific competitor pricing profiles? Switch to the <span className="font-semibold text-slate-900">Direct Analyst Chat</span> tab to converse with <span className="font-semibold text-slate-900">{activeTicket.assignedExecutive}</span> in real time. All drafts update instantly on your Dynamic Report Preview tab as they edit.
              </div>
            </div>

          </div>
        )}

        {/* Tab Content: Dynamic Report Preview */}
        {activeTab === 'pdf_preview' && (
          <div className="p-4 sm:p-6 bg-slate-50">
            <ResearchPDFPreview 
              ticket={activeTicket} 
              onDownloadPdf={() => handleDownloadReportPDF(activeTicket)} 
            />
          </div>
        )}

        {/* Tab Content: Direct Analyst Chat */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[500px] animate-fadeIn">
            
            {/* Message Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {activeTicket.comments && activeTicket.comments.length > 0 ? (
                activeTicket.comments.map((msg, index) => {
                  const isUser = msg.senderRole === 'customer';
                  const isSystem = msg.senderRole === 'system';
                  
                  return (
                    <div 
                      key={index} 
                      className={`flex flex-col ${
                        isUser ? 'items-end' : isSystem ? 'items-center' : 'items-start'
                      } space-y-1`}
                    >
                      <div className="flex items-center space-x-1.5 text-[9px] font-bold text-slate-400 uppercase font-mono">
                        <span>{msg.sender}</span>
                        <span>•</span>
                        <span>{msg.senderRole}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className={`p-3.5 rounded-2xl text-xs max-w-sm sm:max-w-md shadow-xs leading-relaxed ${
                        isUser 
                          ? 'bg-primary text-white rounded-tr-xs' 
                          : isSystem 
                          ? 'bg-slate-100 border border-slate-200 text-slate-600 text-center font-mono rounded-2xl' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-[3px_3px_6px_rgba(0,0,0,0.02)]'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No dialogue logs initiated. Post a message below to start chatting with your Research lead.
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handlePostChat} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your strategic inquiry, feedback, or inclusion request..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                disabled={sendingChat || !chatInput.trim()}
                className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-2xl text-xs font-bold transition-colors shadow flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {sendingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
}
