import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRightCircle, 
  TrendingDown, 
  Layers, 
  Award, 
  Briefcase, 
  CheckCircle, 
  Calendar, 
  FileText,
  BadgePercent,
  Compass
} from 'lucide-react';

interface AIOverviewData {
  summary: string;
  opportunityScore: number;
  difficultyScore: number;
  investmentLevel: string;
  suggestedIndustries: string[];
  suggestedBusinessTypes: string[];
  generalRecommendations: string[];
  strengths: string[];
  risks: string[];
  nextSteps: string[];
  requestId?: string;
}

export function AIOverviewWidget({ 
  data, 
  onUpgrade, 
  onBook 
}: { 
  data: AIOverviewData; 
  onUpgrade?: () => void; 
  onBook?: () => void;
}) {
  const oppScore = data.opportunityScore || 75;
  const diffScore = data.difficultyScore || 45;

  const getScoreColor = (score: number, isDifficulty = false) => {
    if (isDifficulty) {
      if (score < 40) return 'text-success bg-success/10 border-success/20';
      if (score < 70) return 'text-warning bg-warning/10 border-warning/20';
      return 'text-danger bg-danger/10 border-danger/20';
    } else {
      if (score >= 75) return 'text-success bg-success/10 border-success/20';
      if (score >= 50) return 'text-warning bg-warning/10 border-warning/20';
      return 'text-danger bg-danger/10 border-danger/20';
    }
  };

  const getScoreBarColor = (score: number, isDifficulty = false) => {
    if (isDifficulty) {
      if (score < 40) return 'bg-success';
      if (score < 70) return 'bg-warning';
      return 'bg-danger';
    } else {
      if (score >= 75) return 'bg-success';
      if (score >= 50) return 'bg-warning';
      return 'bg-danger';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Thank You & Request Info Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary-light text-xs font-bold uppercase tracking-widest mb-1">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Research Request Generated</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Thank you! Your submission is secure.</h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <p>
              Request ID: <span className="font-mono text-white font-bold bg-white/10 px-2 py-1 rounded">{data.requestId || 'BZNXT-F-73910'}</span>
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Just now submitted
            </p>
          </div>
        </div>
      </div>

      {/* Main Executive Summary */}
      <div className="bg-gradient-to-br from-slate-50 to-purple-50/20 p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-slate-850">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-lg">AI Executive Feasibility Brief</h3>
        </div>
        <p className="text-slate-700 leading-relaxed text-sm">
          {data.summary}
        </p>
      </div>

      {/* Metrics Scores Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Opportunity Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Opportunity Score</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold text-slate-900">{oppScore}</span>
              <span className="text-slate-500 text-sm">/100</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-2xl overflow-hidden">
              <div 
                className={`h-full ${getScoreBarColor(oppScore)}`} 
                style={{ width: `${oppScore}%` }}
              />
            </div>
            <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-2xl border ${getScoreColor(oppScore)} font-bold`}>
              {oppScore >= 75 ? 'High Viability' : oppScore >= 50 ? 'Moderate Viability' : 'Low Viability'}
            </span>
          </div>
        </div>

        {/* Difficulty Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Difficulty Score</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold text-slate-900">{diffScore}</span>
              <span className="text-slate-500 text-sm">/100</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-100 h-2 rounded-2xl overflow-hidden">
              <div 
                className={`h-full ${getScoreBarColor(diffScore, true)}`} 
                style={{ width: `${diffScore}%` }}
              />
            </div>
            <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-2xl border ${getScoreColor(diffScore, true)} font-bold`}>
              {diffScore < 40 ? 'Easy Setup' : diffScore < 70 ? 'Moderate Complexity' : 'High Barrier'}
            </span>
          </div>
        </div>

        {/* Investment Level */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Investment Level</span>
            <h4 className="text-2xl font-bold text-slate-900 mt-2 capitalize">{data.investmentLevel || 'Medium'}</h4>
          </div>
          <div className="mt-4">
            <span className="text-xs text-slate-500 font-medium block">Based on selected CapEx</span>
            <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold">
              Capital Safe Match
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Models & Sectors */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Sectors */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
            <Compass className="w-5 h-5" />
            <h4 className="font-bold text-sm">Suggested Sectors / Industries</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data.suggestedIndustries || []).map((ind, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-100">
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* Models */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-success">
            <Layers className="w-5 h-5" />
            <h4 className="font-bold text-sm">Suggested Business Types</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data.suggestedBusinessTypes || []).map((type, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-semibold border border-success/20">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Risks */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-success">
            <TrendingUp className="w-5 h-5" />
            <h4 className="font-bold text-sm">Key Strengths</h4>
          </div>
          <ul className="space-y-2">
            {(data.strengths || []).map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-2xl bg-success mt-1.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="font-bold text-sm">Potential Risks</h4>
          </div>
          <ul className="space-y-2">
            {(data.risks || []).map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-2xl bg-warning mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations & Next Steps */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Award className="w-5 h-5 text-purple-500" />
          <h4 className="font-bold text-sm">Strategic Recommendations</h4>
        </div>
        <ul className="space-y-3">
          {(data.generalRecommendations || []).map((rec, i) => (
            <li key={i} className="flex gap-3 items-start text-sm text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-purple-500 font-bold">★</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Next Steps */}
      <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <ArrowRightCircle className="w-5 h-5" />
          <h4 className="font-bold text-sm">Recommended Next Steps</h4>
        </div>
        <div className="space-y-3">
          {(data.nextSteps || []).map((step, i) => (
            <div key={i} className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-6 h-6 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                {i + 1}
              </div>
              <span className="text-sm font-medium text-slate-700">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Crucial Note */}
      <div className="p-4 bg-warning/10 rounded-2xl border border-warning/20 text-warning text-xs flex gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Important Note:</span> This is an artificial intelligence-driven high-level feasibility overview only. Detailed, localized primary research, municipal inspections, and expert sign-off require a Premium Feasibility Report.
        </div>
      </div>

      {/* Conversion CTAs */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={onUpgrade}
          className="flex items-center justify-center gap-2 px-5 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-md active:scale-[0.98]"
        >
          <Award className="w-4 h-4" />
          Upgrade to Premium Research Report
        </button>
        <button 
          onClick={onBook}
          className="flex items-center justify-center gap-2 px-5 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
        >
          <Calendar className="w-4 h-4" />
          Book Business Consultation
        </button>
      </div>
    </motion.div>
  );
}
