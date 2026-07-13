import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe2, 
  FileText, 
  Briefcase, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Plane
} from 'lucide-react';

export default function DubaiSetup() {
  const navigate = useNavigate();

  const services = [
    {
      id: 'freezone',
      title: 'Freezone Company Setup',
      desc: '100% foreign ownership, zero corporate tax, and full repatriation of profits. Ideal for trading, consulting, and global operations.',
      features: ['Flexi-desk options', 'Multiple visa allocations', 'Fast incorporation']
    },
    {
      id: 'mainland',
      title: 'Mainland LLC Setup',
      desc: 'Operate anywhere in the UAE market without restrictions. Essential for B2C retail, restaurants, and local government contracts.',
      features: ['Local sponsor/agent support', 'Prime retail locations', 'Unlimited visas']
    },
    {
      id: 'offshore',
      title: 'Offshore Registration',
      desc: 'Cost-effective holding company structure for international trade, property ownership, and wealth management.',
      features: ['Confidentiality', 'Asset protection', 'No physical office required']
    }
  ];

  const steps = [
    { step: 1, title: 'Consultation', desc: 'Select the right jurisdiction based on your business activities.' },
    { step: 2, title: 'Documentation', desc: 'Submit passport copies, business plan, and complete KYC.' },
    { step: 3, title: 'Licensing', desc: 'Obtain initial approval, trade name reservation, and final license.' },
    { step: 4, title: 'Visa & Banking', desc: 'Process Emirates ID, residency visa, and open corporate bank account.' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Hero */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 opacity-50"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
            {/* Minimalist pattern or silhouette representation */}
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Plane className="w-4 h-4 text-emerald-400" />
            <span>Global Expansion</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-tight">
            Dubai Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Setup</span>
          </h1>
          
          <p className="text-lg text-slate-400 font-medium">
            Expand your Indian business to the UAE seamlessly. Complete end-to-end support for Freezone, Mainland, visas, and banking.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-lg">
              Book Expert Consultation
            </button>
            <button onClick={() => navigate('/global')} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="relative z-10 hidden md:block space-y-4">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-64 text-center">
             <div className="text-3xl font-black text-white mb-1">0%</div>
             <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Corporate Tax*</div>
             <div className="text-[10px] text-slate-500 mt-1">*For Freezone qualifying income</div>
           </div>
           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-64 text-center">
             <div className="text-3xl font-black text-white mb-1">100%</div>
             <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Foreign Ownership</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Setup Types */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 font-display">Setup Structures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{service.title}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {service.desc}
                </p>
                <div className="space-y-2 mb-6">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center text-sm font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                      {feat}
                    </div>
                  ))}
                </div>
                <div className="flex items-center text-sm font-bold text-emerald-600">
                  View Details <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 font-display mt-12 mb-6">The Process</h2>
          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-slate-100"></div>
              {steps.map((s, idx) => (
                <div key={idx} className="relative z-10">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg mb-4 shadow-lg mx-auto md:mx-0">
                    {s.step}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2 text-center md:text-left">{s.title}</h4>
                  <p className="text-sm text-slate-500 text-center md:text-left">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
               <Briefcase className="w-5 h-5 mr-2 text-slate-500" />
               Value Added Services
             </h3>
             <ul className="space-y-4">
               {[
                 'Corporate Bank Account Opening',
                 'Emirates ID & Residency Visa',
                 'Golden Visa Processing',
                 'VAT Registration & Accounting',
                 'Virtual Office & Ejari',
                 'Trade Trademark Registration'
               ].map((item, idx) => (
                 <li key={idx} className="flex items-start text-sm text-slate-700 font-medium">
                   <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500 shrink-0 mt-0.5" />
                   {item}
                 </li>
               ))}
             </ul>
             <button className="w-full mt-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
               View All Services
             </button>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white text-center">
            <Globe2 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Speak to a Dubai Setup Expert</h3>
            <p className="text-sm text-slate-500 mb-6">Get a personalized roadmap and cost estimate for your business setup.</p>
            <button className="w-full py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-lg">
              Request Callback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
