import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Lightbulb, 
  GitCompare, 
  Factory, 
  Store, 
  Package, 
  Globe2, 
  Plane, 
  Bot,
  ArrowRight,
  TrendingUp,
  FileText,
  CalendarCheck
} from 'lucide-react';

export default function DiscoveryHome() {
  const navigate = useNavigate();

  const discoveryOptions = [
    { id: 'scratch', title: 'Start from Scratch', icon: Rocket, color: 'text-primary' },
    { id: 'existing', title: 'I already have a Business Idea', icon: Lightbulb, color: 'text-amber-500' },
    { id: 'compare', title: 'Compare Business Ideas', icon: GitCompare, color: 'text-indigo-500' },
    { id: 'manufacturing', title: 'Find Manufacturing Business', icon: Factory, color: 'text-emerald-500' },
    { id: 'trading', title: 'Find Trading Business', icon: Store, color: 'text-blue-500' },
    { id: 'whitelabel', title: 'Find White Label Business', icon: Package, color: 'text-purple-500' },
    { id: 'franchise', title: 'Find Franchise', icon: Bot, color: 'text-primary' },
    { id: 'import', title: 'Find Import Business', icon: Globe2, color: 'text-cyan-500' },
    { id: 'export', title: 'Find Export Business', icon: Plane, color: 'text-sky-500' },
    { id: 'ai', title: 'AI Recommendation', icon: Bot, color: 'text-indigo-600', special: true },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-indigo-500/20 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Bot className="w-4 h-4 text-primary-light" />
            <span>AI + Human Intelligence</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight leading-tight">
            Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-emerald-400">Business</span>
          </h1>
          
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Find the perfect business for your budget, location, and risk profile using our elite AI discovery engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/discovery/wizard')}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center group"
            >
              Start Discovery
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-4 h-4 mr-2" />
              View Sample Report
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center shadow-lg">
              <CalendarCheck className="w-4 h-4 mr-2" />
              Book Expert Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Discovery Options */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 font-display">Discovery Options</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoveryOptions.map((option, idx) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/discovery/wizard?type=\${option.id}`)}
                className={`flex items-start p-6 rounded-2xl border transition-all text-left group \${
                  option.special 
                    ? 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mr-4 transition-transform group-hover:scale-110 \${
                  option.special ? 'bg-indigo-100' : 'bg-slate-50'
                }`}>
                  <Icon className={`w-6 h-6 \${option.color}`} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm \${option.special ? 'text-indigo-950' : 'text-slate-900'}`}>
                    {option.title}
                  </h3>
                  <div className="flex items-center mt-2 text-xs font-medium text-slate-500 group-hover:text-primary transition-colors">
                    <span>Start process</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Mini Dashboard / Saved Ideas preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
              Recent Discoveries
            </h3>
            <button 
              onClick={() => navigate('/discovery/saved')}
              className="text-xs font-bold text-primary hover:text-primary-dark"
            >
              View All
            </button>
          </div>
          <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-100">
            <p>You haven't run any business discoveries yet.</p>
            <button 
              onClick={() => navigate('/discovery/wizard')}
              className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:border-primary hover:text-primary transition-colors"
            >
              Run your first discovery
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
              Your Business Score
            </h3>
          </div>
          <div className="flex items-center justify-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="text-center">
                <div className="text-4xl font-display font-black text-slate-400 mb-1">--</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Readiness Score</div>
                <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto">
                  Complete a discovery profile to calculate your readiness.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
