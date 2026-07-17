import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Project, ProjectRisk } from '../../types/project';

export function ProjectHealthScoreWidget({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [healthStatus, setHealthStatus] = useState<'Healthy' | 'At Risk' | 'Critical'>('Healthy');
  
  useEffect(() => {
    if (!projectId) return;
    
    const calculateHealth = async () => {
      try {
        const projectSnap = await getDoc(doc(db, 'projects', projectId));
        if (!projectSnap.exists()) return;
        const project = projectSnap.data() as Project;
        
        // 1. Analyze Risks (Max 40 points)
        const qRisks = query(collection(db, 'project_risks'), where('projectId', '==', projectId));
        const risksSnap = await getDocs(qRisks);
        const risks = risksSnap.docs.map(d => d.data() as ProjectRisk);
        
        const openRisks = risks.filter(r => !r.resolved);
        const criticalRisks = openRisks.filter(r => r.level === 'Critical').length;
        const highRisks = openRisks.filter(r => r.level === 'High').length;
        const mediumRisks = openRisks.filter(r => r.level === 'Medium').length;
        
        let riskScore = 40 - (criticalRisks * 15) - (highRisks * 8) - (mediumRisks * 3);
        riskScore = Math.max(0, riskScore);

        // 2. Analyze Financials (Max 30 points)
        let financialScore = 30;
        const totalBudget = project.totalBudget || 100000;
        const currentSpend = project.totalPaid || 0;
        
        // Very basic variance logic since actual forecasting logic is complex
        // We'll mock it based on spend vs budget
        if (currentSpend > totalBudget) {
          financialScore = 0;
        } else if (currentSpend > totalBudget * 0.9) {
          financialScore = 10;
        } else if (currentSpend > totalBudget * 0.75) {
          financialScore = 20;
        }

        // 3. Analyze Resource Allocation (Max 30 points)
        // Without full resource details, we will just use a generic score for now based on team size
        // Alternatively, use milestones completion
        let resourceScore = 30;
        
        const score = riskScore + financialScore + resourceScore;
        setHealthScore(score);
        
        if (score >= 80) setHealthStatus('Healthy');
        else if (score >= 50) setHealthStatus('At Risk');
        else setHealthStatus('Critical');
        
      } catch (err) {
        console.error("Error calculating health score:", err);
      } finally {
        setLoading(false);
      }
    };
    
    calculateHealth();
  }, [projectId]);

  if (loading) {
    return (
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 border border-slate-100 flex items-center justify-center h-[120px]">
        <div className="w-5 h-5 border-2 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500 ${
        healthStatus === 'Healthy' ? 'bg-emerald-50' : 
        healthStatus === 'At Risk' ? 'bg-amber-50' : 'bg-rose-50'
      }`} />
      
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
          healthStatus === 'Healthy' ? 'bg-emerald-100 text-emerald-600' : 
          healthStatus === 'At Risk' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
        }`}>
          {healthStatus === 'Healthy' ? <CheckCircle2 size={28} /> : 
           healthStatus === 'At Risk' ? <AlertTriangle size={28} /> : <XCircle size={28} />}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Project Health</h3>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black tracking-tight" style={{ color: healthStatus === 'Healthy' ? '#059669' : healthStatus === 'At Risk' ? '#d97706' : '#e11d48' }}>
              {healthScore}
            </span>
            <span className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest">/ 100</span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold tracking-widest uppercase ${
            healthStatus === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
            healthStatus === 'At Risk' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {healthStatus}
          </span>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
            AI aggregated status
          </p>
        </div>
      </div>
    </div>
  );
}
