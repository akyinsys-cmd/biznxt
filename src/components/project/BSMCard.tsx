import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { BSMDetails, Project } from '../../types/project';

interface BSMCardProps {
  bsm: BSMDetails | null;
  project: Project | null;
  onScheduleMeeting: () => void;
}

export default function BSMCard({ bsm, project, onScheduleMeeting }: BSMCardProps) {
  if (!bsm || !project) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-2xl blur-3xl -mr-16 -mt-16" />
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img 
              src={bsm.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager'} 
              alt={bsm.name} 
              className="w-20 h-20 rounded-[2rem] bg-slate-100 shadow-xl shadow-slate-900/5 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{bsm.name}</h3>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Dedicated Success Manager</p>
            <div className="flex items-center gap-2 mt-2 text-emerald-600 font-bold text-xs">
              <ShieldCheck size={14} /> Certified Consultant
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8 relative z-10">
        {[
          { icon: Phone, label: 'Call', color: 'text-blue-600', bg: 'bg-blue-50', action: () => window.open(`tel:${bsm.phone || ''}`) },
          { icon: MessageSquare, label: 'WhatsApp', color: 'text-emerald-600', bg: 'bg-emerald-50', action: () => window.open(`https://wa.me/${bsm.phone || ''}`) },
          { icon: Mail, label: 'Email', color: 'text-primary', bg: 'bg-primary/5', action: () => window.open(`mailto:${bsm.email}`) },
          { icon: Calendar, label: 'Meeting', color: 'text-amber-600', bg: 'bg-amber-50', action: onScheduleMeeting },
        ].map((btn, i) => (
          <button 
            key={i}
            onClick={btn.action}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all"
          >
            <div className={`p-2 ${btn.bg} ${btn.color} rounded-2xl`}>
              <btn.icon size={18} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Launch Stage</span>
          <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">{project.currentTimelineStep}</span>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 h-3 bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-100">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(193,18,31,0.3)]" 
            />
          </div>
          <span className="text-sm font-black text-slate-900">{project.progress}%</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-[10px] font-bold text-slate-500">Next Step: <span className="text-slate-900">Registration Complete</span></p>
          <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            View Roadmap <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
