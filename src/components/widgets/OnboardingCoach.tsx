import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OnboardingCoach() {
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const response = await fetch('/api/onboarding/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progressData: { accountAgeDays: 5, activeProjects: 1 } })
        });
        const data = await response.json();
        if (data && data.actions) {
          setActions(data.actions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/20 flex items-center justify-center min-h-[250px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (actions.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-tight">AI Onboarding Coach</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Recommended Next Steps</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {actions.map((action, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex items-center justify-between group hover:bg-white/20 transition-all">
            <div>
              <h4 className="text-sm font-bold mb-1">{action.title}</h4>
              <p className="text-xs text-indigo-100">{action.description}</p>
            </div>
            <button 
              onClick={() => navigate(action.link)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:scale-105 transition-all"
            >
              {action.buttonText}
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
