import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Shield, Star, Award, ChevronRight } from 'lucide-react';

interface ValueComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: any;
}

export function ValueComparisonModal({ isOpen, onClose, service }: ValueComparisonModalProps) {
  if (!isOpen || !service) return null;

  const features = service.premium_features_list || [
    { text: "Dedicated Success Manager", highlight: "1-on-1 proactive guidance" },
    { text: "Expert Quality Assurance", highlight: "Multi-point manual review" },
    { text: "Business Health Scoring", highlight: "AI-driven compliance tracking" },
    { text: "Priority SLAs", highlight: "4hr guaranteed response time" },
    { text: "Zero Hidden Costs", highlight: "Transparent, inclusive pricing" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }} 
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50">
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-2xl text-xs font-bold mb-3">
                <Star className="w-3.5 h-3.5" />
                <span>Value Analysis</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-display">Why Choose BizNxt Premium?</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">Compare our expert-reviewed deliverables for "{service.title}" against standard market alternatives.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-2xl transition-colors shrink-0">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          
          <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 md:p-6 font-bold text-slate-900 w-1/3">Feature / Deliverable</th>
                    <th className="p-4 md:p-6 font-bold text-slate-500 w-1/3 border-l border-slate-200 text-center">Basic Market Scope<br/><span className="text-sm font-normal">₹{(service.benchmark_price || service.price || 0).toLocaleString()}</span></th>
                    <th className="p-4 md:p-6 font-black text-primary w-1/3 border-l border-slate-200 bg-indigo-50/50 text-center relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-500" />
                      BizNxt Premium Deliverables<br/><span className="text-sm font-normal text-slate-900">₹{(service.biznxt_price || service.price || 0).toLocaleString()}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Document Preparation</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center">Basic automated templates</td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Custom drafted by specialists</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Quality Assurance</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Expert Review & Multi-point QA</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Business Health Score</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">AI-driven compliance tracking</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Support SLA</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center">Reactive (24-48hrs)</td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Priority 4hr guaranteed response</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Account Management</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Dedicated Success Manager</td>
                  </tr>
                  {features && features.length > 0 && features.map((feat: any, i: number) => {
                    const featureText = typeof feat === 'string' ? feat : (feat.text || feat.name || 'Premium Feature');
                    const isDefault = ["Dedicated Success Manager", "Expert Quality Assurance", "Business Health Scoring", "Priority SLAs", "Zero Hidden Costs"].includes(featureText);
                    if (isDefault) return null;
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 md:p-6 font-medium text-slate-900">{featureText}</td>
                        <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                        <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button 
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-2xl transition-all"
            >
              Understood
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
