import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Sparkles, 
  FileText, 
  Briefcase, 
  Calculator, 
  Scale, 
  Cpu, 
  Megaphone, 
  Globe, 
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRightLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Step {
  id: UserRole;
  num: number;
  title: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  desc: string;
  deliverable: string;
  actor: string;
  actionRequired: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export function EnterprisePipeline() {
  const { user, role } = useAuth();
  const { success, error } = useToast();
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const steps: Step[] = [
    {
      id: 'customer',
      num: 1,
      title: 'Customer (Venture Owner)',
      shortLabel: 'Customer',
      icon: User,
      desc: 'The entrepreneur initiating the venture. Submits market briefs, tracks operational progress, and pays setup invoices.',
      deliverable: 'Venture Intake Form & Seed Brief',
      actor: 'Entrepreneur Client',
      actionRequired: 'Submit custom startup proposal and specify capital budget limit.',
      color: 'indigo',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 'bsm',
      num: 2,
      title: 'Business Success Manager (BSM)',
      shortLabel: 'BSM Guide',
      icon: UserCheck,
      desc: 'First level project champion. Reviews incoming proposals, delegates feasibility queries, and acts as the persistent client advisor.',
      deliverable: 'Delegated Brief & Ticket Allocations',
      actor: 'Success Advisor Lead',
      actionRequired: 'Verify client KYC, assess core objectives, and forward to Research.',
      color: 'amber',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      id: 'researcher',
      num: 3,
      title: 'Research Executive',
      shortLabel: 'Researcher',
      icon: FileText,
      desc: 'Sourcing analyst who runs advanced regional demography algorithms, models CapEx matrices, and drafts the comprehensive PDF feasibility reports.',
      deliverable: 'A.I. Market Feasibility Dossier (PDF)',
      actor: 'Senior Research Executive',
      actionRequired: 'Run demographic index checkers and bundle official feasibility data.',
      color: 'emerald',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'consultant',
      num: 4,
      title: 'Business Consultant',
      shortLabel: 'Consultant',
      icon: Briefcase,
      desc: 'Subject matter expert who validates commercial gaps, refines pricing, and hosts strategic 1-on-1 consultations.',
      deliverable: 'Commercial Roadmap Sign-off',
      actor: 'Lead Business Architect',
      actionRequired: 'Review competitor analysis & schedule consultation roadmap meeting.',
      color: 'blue',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'ca',
      num: 5,
      title: 'Chartered Accountant (CA)',
      shortLabel: 'C.A. Expert',
      icon: Calculator,
      desc: 'Financial and corporate taxation lead. Handles entity classification, PAN/TAN registration, GST filing setups, and corporate cash books.',
      deliverable: 'Tax Structure & Legal Registration Desk',
      actor: 'Chartered Accountant Associate',
      actionRequired: 'File central GST portals and establish operational cash ledger rules.',
      color: 'sky',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200'
    },
    {
      id: 'lawyer',
      num: 6,
      title: 'Corporate Lawyer',
      shortLabel: 'Legal Counsel',
      icon: Scale,
      desc: 'Legal counselor who designs custom partnership agreements, board resolutions, client contracts, and processes trademark filings.',
      deliverable: 'Partnership Deed & Trademark Applications',
      actor: 'Advisory Counsel General',
      actionRequired: 'Review liability clauses, seal agreements, and submit trademark tokens.',
      color: 'violet',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200'
    },
    {
      id: 'manufacturer',
      num: 7,
      title: 'OEM Manufacturer',
      shortLabel: 'Manufacturer',
      icon: Cpu,
      desc: 'Supply chain partner handling machinery acquisitions, factory floor prototypes, and wholesale hardware sourcing.',
      deliverable: 'B2B Procurement Ledger',
      actor: 'OEM Logistics Officer',
      actionRequired: 'Audit bill of materials (BoM) and reserve production slots.',
      color: 'orange',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'marketing',
      num: 8,
      title: 'Marketing Agency',
      shortLabel: 'Marketing',
      icon: Megaphone,
      desc: 'Brand strategist who develops Google/Meta search campaigns, logo vectors, copy books, and localized customer acquisition frameworks.',
      deliverable: 'High-Conversion Campaign Blueprint',
      actor: 'Brand & Marketing Director',
      actionRequired: 'Configure ad accounts, verify domain analytics, and launch creatives.',
      color: 'pink',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'websiteteam',
      num: 9,
      title: 'Website Team',
      shortLabel: 'Web Tech',
      icon: Globe,
      desc: 'Technical advisors launching custom web systems, UPI checkout integrations, and live tracking interfaces.',
      deliverable: 'biznxt.online Subdomain Portal',
      actor: 'Digital Solutions Lead',
      actionRequired: 'Deploy customer portal, configure secure custom integration pathways, and run system validations.',
      color: 'cyan',
      textColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      id: 'finance',
      num: 10,
      title: 'Finance Team',
      shortLabel: 'Finance Ledger',
      icon: DollarSign,
      desc: 'Capital management team. Disburses Cashback vouchers, pays out partner commissions, and registers venture portfolios with seed funds.',
      deliverable: 'Ledger Audit & Cashback Disbursal',
      actor: 'VP of Treasury Operations',
      actionRequired: 'Approve ₹2,500 referral cashback and deposit venture security reserve.',
      color: 'teal',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    }
  ];

  const currentStep = steps[selectedStepIndex];

  const handleRoleSwitch = async (targetRole: string) => {
    try {
      if (!user) {
        error('You must be signed in to simulate roles.');
        return;
      }
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { role: targetRole }, { merge: true });
      success(`Workspace role shifted to ${targetRole.toUpperCase()}!`);
    } catch (err: any) {
      error('Failed to switch simulation role.');
    }
  };

  return (
    <div className="glass-card bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm overflow-auto resize-y min-h-[400px]">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-1">
            <Activity className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">biznxt.online Success Architecture</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">Enterprise Operations Pipeline</h2>
          <p className="text-sm text-slate-500">Track and switch through the step-by-step collaborative business success chain.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0">
          <span className="text-xs font-semibold text-slate-500 pl-2">Current Workspace Role:</span>
          <span className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 uppercase tracking-wide">
            {role || 'Customer'}
          </span>
        </div>
      </div>

      {/* Visual Progress Stepper - Horizontal scrollable map */}
      <div className="py-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex items-center space-x-2 min-w-[1000px] px-1 py-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = selectedStepIndex === index;
            const isActiveUserRole = role === step.id;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setSelectedStepIndex(index)}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all text-center relative shrink-0 w-28 group ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/10' 
                      : isActiveUserRole 
                        ? 'border-slate-800 bg-slate-50 hover:bg-slate-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  {/* Active User Role Marker badge */}
                  {isActiveUserRole && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-widest border border-white">
                      You
                    </div>
                  )}

                  {/* Circle with number or icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 font-display font-bold transition-colors ${
                    isSelected 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-xs font-bold text-slate-900 truncate w-full px-1">{step.shortLabel}</span>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5">Step {step.num}</span>
                </button>

                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Detail panel for selected step */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`border rounded-2xl p-5 ${currentStep.bgColor} ${currentStep.borderColor}`}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-display font-bold ${currentStep.textColor}`}>
                  0{currentStep.num}
                </span>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  {currentStep.title}
                </h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">{currentStep.desc}</p>
              
              {/* Deliverable info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/80 p-3 rounded-2xl border border-white shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Key Deliverable</span>
                  <span className="text-sm font-semibold text-slate-800 mt-1 block">{currentStep.deliverable}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-2xl border border-white shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Action Required</span>
                  <span className="text-xs text-slate-600 mt-1 block leading-relaxed">{currentStep.actionRequired}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 md:w-56">
              <div className="bg-white/60 rounded-2xl p-3 text-center border border-white">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Primary Actor</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">{currentStep.actor}</span>
              </div>

              {/* Simulation Quick Trigger */}
              <button
                onClick={() => handleRoleSwitch(currentStep.id)}
                className={`w-full py-2 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                  role === currentStep.id 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                {role === currentStep.id ? 'Active (Testing Role)' : 'Switch to this Role'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Loop footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Real-time collaborative workspace secured with enterprise-grade data protection
        </span>
        <span className="font-mono text-[10px]">
          10-Tier Closed Operational Cycle: Customer ➔ Finance ➔ Customer Loop
        </span>
      </div>
    </div>
  );
}
