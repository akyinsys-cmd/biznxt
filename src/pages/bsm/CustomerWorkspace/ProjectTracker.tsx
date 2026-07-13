import { Project } from '../../../types/project';
import { CheckCircle2, Clock, Target, AlertCircle } from 'lucide-react';

export function ProjectTracker({ project }: { project: Project }) {
  const steps = [
    'Research', 'Quotation', 'Payment', 'Documentation', 'Registration', 
    'Branding', 'Manufacturer', 'Website', 'Marketing', 'Launch', 'Support'
  ];

  const currentIndex = steps.indexOf(project.currentTimelineStep);

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Project Tracker</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">End-to-end journey progress</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-primary">{project.progress}%</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-slate-100" />
        
        <div className="space-y-6 relative z-10">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex || (index === steps.length - 1 && project.status === 'Completed');
            const isCurrent = index === currentIndex && project.status !== 'Completed';
            const isPending = index > currentIndex;

            return (
              <div key={step} className={`flex items-start gap-6 group ${isPending ? 'opacity-50' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-transform ${
                  isCompleted ? 'bg-emerald-500 text-white' :
                  isCurrent ? 'bg-primary text-white scale-110' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : 
                   isCurrent ? <Target size={20} /> : 
                   <Clock size={20} />}
                </div>
                
                <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                  isCurrent ? 'bg-primary/5 border-primary/20 shadow-md' : 
                  isCompleted ? 'bg-emerald-50 border-emerald-100' : 
                  'bg-slate-50 border-transparent hover:border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-black ${isCurrent ? 'text-primary' : isCompleted ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {step}
                      </h4>
                      {isCurrent && (
                        <p className="text-[10px] font-bold text-primary/70 mt-1 uppercase tracking-widest">Current Stage</p>
                      )}
                    </div>
                    {isCurrent && (
                      <span className="px-3 py-1 bg-white text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-sm">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
