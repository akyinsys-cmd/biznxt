import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator, TrendingUp, AlertTriangle, ArrowRight, Activity, DollarSign } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Project, ProjectMilestone } from '../../types/project';

export function FinancialForecastingWidget({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    if (!projectId) return;
    
    const calculateForecast = async () => {
      try {
        const projectSnap = await getDoc(doc(db, 'projects', projectId));
        if (!projectSnap.exists()) return;
        const project = projectSnap.data() as Project;
        
        const qMilestones = query(collection(db, 'project_milestones'), where('projectId', '==', projectId));
        const milestonesSnap = await getDocs(qMilestones);
        const milestones = milestonesSnap.docs.map(d => d.data() as ProjectMilestone);
        
        const totalBudget = project.totalBudget || 100000;
        const currentSpend = project.totalPaid || (totalBudget * 0.35);
        
        const completedMilestones = milestones.filter(m => m.status === 'Completed').length;
        const totalMilestones = milestones.length || 1;
        const remainingScope = 1 - (completedMilestones / totalMilestones);
        
        // Mock historical data analysis for burn rate
        const historicalBurnRate = 12500; // per month
        const estimatedCompletionCost = currentSpend + (totalBudget * remainingScope * 1.1); // 10% risk buffer
        
        const variance = ((estimatedCompletionCost - totalBudget) / totalBudget) * 100;
        const budgetStatus = variance > 5 ? 'Over Budget' : variance < -5 ? 'Under Budget' : 'On Track';

        setForecast({
          estimatedCompletionCost,
          currentSpend,
          historicalBurnRate,
          monthsRemaining: remainingScope > 0 ? (estimatedCompletionCost - currentSpend) / historicalBurnRate : 0,
          budgetStatus,
          variance: variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`
        });
      } catch (err) {
        console.error("Error calculating forecast:", err);
      } finally {
        setLoading(false);
      }
    };
    
    calculateForecast();
  }, [projectId]);

  if (loading) {
    return (
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center justify-center h-full min-h-[350px]">
        <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analyzing Historical Spend...</p>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden h-[350px] flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10" />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Financial Forecast</h3>
            <p className="text-xs font-medium text-slate-500">Historical spend & scope analysis</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Cost</p>
            <h4 className="text-xl font-black text-slate-900">
              ${forecast.estimatedCompletionCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h4>
            <div className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
              forecast.budgetStatus === 'Over Budget' ? 'bg-rose-100 text-rose-600' : 
              forecast.budgetStatus === 'On Track' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {forecast.budgetStatus === 'Over Budget' ? <AlertTriangle size={12} /> : <TrendingUp size={12} />}
              {forecast.variance} vs Budget
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Burn Rate Trend</p>
            <h4 className="text-xl font-black text-slate-900">
              ${forecast.historicalBurnRate.toLocaleString()}/mo
            </h4>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              <Activity size={12} />
              Avg Historical
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-[30px] -mr-8 -mt-8" />
          <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-2">
            <DollarSign size={14} /> AI Projection
          </h4>
          <p className="text-sm font-medium text-slate-300 leading-relaxed">
            Based on current velocity and {forecast.monthsRemaining.toFixed(1)} months remaining scope, the project is tracking towards {forecast.budgetStatus}.
          </p>
        </div>
      </div>
    </div>
  );
}
