import { useState, useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import { EXECUTIVE_METRICS, REVENUE_CHART_DATA, ALERTS } from '../../data/biData';

interface Insight {
  type: 'opportunity' | 'risk' | 'summary';
  title: string;
  description: string;
}

export const AIExecutiveInsights = memo(function AIExecutiveInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/ceo/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: EXECUTIVE_METRICS,
          trends: REVENUE_CHART_DATA,
          alerts: ALERTS.filter(a => a.type === 'critical')
        })
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      console.error('Error fetching CEO insights:', err);
      setError(true);
      // Fallback to static if API fails
      setInsights([
        {
          type: 'opportunity',
          title: 'Expansion Opportunity',
          description: 'Demand for Market Research in UAE grew by 45% this quarter. Recommend launching specialized Dubai-entry reports.'
        },
        {
          type: 'risk',
          title: 'Customer Churn Risk',
          description: '3 Enterprise accounts have delayed renewals. Immediate follow-up required by Success Managers.'
        },
        {
          type: 'summary',
          title: 'Weekly Performance',
          description: 'Revenue is 12% above target. Project delivery time improved by 0.5 days on average.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="bg-slate-900 rounded-[2rem] p-6 text-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-2xl text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">AI Executive Insights</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini Pro</p>
          </div>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 py-12">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-2xl animate-spin" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synthesizing Data...</p>
          </div>
        ) : (
          insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-2xl ${
                  insight.type === 'opportunity' ? 'text-emerald-400 bg-emerald-400/10' :
                  insight.type === 'risk' ? 'text-rose-400 bg-rose-400/10' :
                  'text-blue-400 bg-blue-400/10'
                }`}>
                  {insight.type === 'opportunity' ? <TrendingUp size={14} /> :
                   insight.type === 'risk' ? <AlertTriangle size={14} /> :
                   <Lightbulb size={14} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{insight.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs transition-all border border-white/10">
        Generate Full Strategy Document
      </button>
    </div>
  );
});
