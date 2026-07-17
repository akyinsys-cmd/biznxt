import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Copy, Check, Users, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ReferralProgram() {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const referralCode = "BIZNXT-9024X";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    success('Referral code copied successfully!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[220px]">
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-primary" />
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-indigo-600">
          <Gift className="w-5 h-5 text-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-widest">biznxt.online Referral Program</span>
        </div>

        <h3 className="font-bold text-slate-950 text-base leading-snug">Share biznxt.online, Get Rewarded</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Invite fellow entrepreneurs to launch their ventures on biznxt.online. When they pay their first incorporation invoice, you both receive <span className="font-bold text-slate-900">₹2,500 Cash Back</span> directly to your linked ledger.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-150 rounded-2xl px-4 py-2.5 w-full sm:w-auto justify-between">
          <span className="text-[10px] text-slate-500 font-medium">YOUR CODE</span>
          <span className="font-mono text-slate-900 tracking-wider text-sm">{referralCode}</span>
        </div>

        <button 
          onClick={handleCopy}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-scale" />
              <span>Copied Code</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
