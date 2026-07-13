import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  Compass, 
  Briefcase, 
  RefreshCcw, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { BusinessProfile, BusinessGoal, BusinessTask, BusinessDocument, BusinessHealth } from './types';

interface AiAssistantProps {
  profile: BusinessProfile | null;
  goals: BusinessGoal | null;
  tasks: BusinessTask[];
  documents: BusinessDocument[];
  health: BusinessHealth | null;
}

interface AiInsights {
  reminders: string[];
  deadlines: string[];
  missingDocs: string[];
  nextSteps: string[];
  services: { name: string; description: string; path: string }[];
  analysis: string;
}

export function AiAssistant({ profile, goals, tasks, documents, health }: AiAssistantProps) {
  const [insights, setInsights] = useState<AiInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAiInsights = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/business-os/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, goals, tasks, documents, health })
      });
      if (!res.ok) throw new Error('Failed to generate insights from Gemini');
      const data = await res.json();
      setInsights(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not establish secure link to AI Advisor. Please check configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, [profile, goals, tasks, documents, health]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/15 rounded-2xl blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="bg-indigo-500/25 text-indigo-300 text-[10px] font-black px-4 py-1.5 rounded-2xl border border-indigo-400/30 uppercase tracking-[0.2em] flex items-center gap-2 w-fit">
              <BrainCircuit className="w-4 h-4 animate-pulse" strokeWidth={2.5} />
              AI ADVISOR
            </span>
            <h1 className="text-4xl font-black font-display mt-4 tracking-tighter leading-tight">Smart Strategy & Safety Check</h1>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Use our smart AI to check your business paperwork, money, and tasks for any missing steps or risks.
            </p>
          </div>
          <button
            onClick={fetchAiInsights}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all duration-300 flex items-center justify-center gap-3 shrink-0 h-fit whitespace-nowrap"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
            {loading ? 'Re-Analyzing...' : 'Trigger Strategic Re-Audit'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center space-y-3">
          <RefreshCcw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">Processing Gap Analysis...</p>
          <p className="text-xs text-slate-500">Gemini is auditing trademark filings, GST checklists, pending deadlines, and logistics structures...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-rose-50 border border-primary/20 rounded-3xl p-6 text-rose-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Audit Connection Interrupted</p>
            <p className="text-xs mt-0.5">{errorMsg}</p>
          </div>
        </div>
      ) : insights ? (
        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              Cognitive Executive Summary
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{insights.analysis}</p>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-4 flex items-center gap-3 text-[10px] text-slate-500 font-medium whitespace-nowrap">
              <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700 whitespace-nowrap">Data Origin Notice:</span> 
                <span className="truncate">Mapped directly to your active GST, PAN registries, and task milestones.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Reminders & Missing Docs */}
            <div className="space-y-6">
              {/* Critical Reminders */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Cognitive Action Reminders
                </h3>
                {insights.reminders && insights.reminders.length > 0 ? (
                  <div className="space-y-2.5">
                    {insights.reminders.map((rem, idx) => (
                      <div key={idx} className="p-3 bg-rose-50/45 border border-primary/20 rounded-2xl text-xs text-rose-900 font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-2xl mt-1.5 shrink-0"></span>
                        <span>{rem}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">All task checklists are running in alignment. No urgent reminders.</p>
                )}
                
                <div className="bg-slate-50 rounded-2xl p-3 flex items-start gap-2 text-[9px] text-slate-500 font-medium">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                  <span>Based strictly on active task lists (User Data).</span>
                </div>
              </div>

              {/* Missing Documents list */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
                  <Compass className="w-5 h-5 text-amber-500" />
                  Missing Registrations & Certificates
                </h3>
                {insights.missingDocs && insights.missingDocs.length > 0 ? (
                  <div className="space-y-2.5">
                    {insights.missingDocs.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-amber-50/45 border border-amber-100 rounded-2xl text-xs text-amber-900 font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-2xl mt-1.5 shrink-0"></span>
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">All critical certificates (GST, PAN, IEC, Trademark) are registered.</p>
                )}

                <div className="bg-indigo-50/45 rounded-2xl p-3 flex items-start gap-2 text-[9px] text-indigo-600 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />
                  <span>Synthesized by auditing the uploaded files in your vault against export standards (User Data + General Guidance).</span>
                </div>
              </div>
            </div>

            {/* Right Col: Next Steps & Recommended Services */}
            <div className="space-y-6">
              {/* Sequential Next Steps */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Dynamic Growth Roadmap
                </h3>
                {insights.nextSteps && insights.nextSteps.length > 0 ? (
                  <div className="space-y-3">
                    {insights.nextSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 text-xs text-slate-700">
                        <span className="bg-primary text-white rounded-2xl w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="leading-relaxed">{step}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Roadmap targets complete. Trigger a re-audit to calculate next vectors.</p>
                )}

                <div className="bg-slate-50 rounded-2xl p-3 flex items-start gap-2 text-[9px] text-slate-500 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                  <span>Calculated based on active targets, expansion plans, and financial goals (User Data + General Guidance).</span>
                </div>
              </div>

              {/* Recommended BizNxt Services */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  Targeted Service Recommendations
                </h3>
                {insights.services && insights.services.length > 0 ? (
                  <div className="space-y-3">
                    {insights.services.map((srv, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 transition-colors space-y-2">
                        <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                          {srv.name}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{srv.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No specific services recommended at this time.</p>
                )}

                <div className="bg-slate-50 rounded-2xl p-3 flex items-start gap-2 text-[9px] text-slate-500 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                  <span>Offered services designed to clear identified compliance gaps (General Guidance).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm text-center">
          <p className="text-sm text-slate-500 font-medium">Click 'Trigger Strategic Re-Audit' to generate enterprise insights.</p>
        </div>
      )}
    </div>
  );
}
