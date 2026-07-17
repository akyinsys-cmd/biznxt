import { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, Briefcase } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Project } from '../../types/project';

export function BSMCustomers({ onSelectCustomer }: { onSelectCustomer: (project: Project) => void }) {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(query(collection(db, 'client_projects'), where('bsmId', '==', user.uid)), (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
    });
    return () => unsub();
  }, [user]);

  const stages = ['All', 'Research', 'Quotation', 'Documentation', 'Registration', 'Branding', 'Website', 'Launch'];

  const filtered = customers.filter(c => {
    const matchesSearch = (c.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.clientName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || c.currentTimelineStep === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="clay-card flex flex-col min-h-[600px]">
      <div className="p-6 border-b border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Assigned Customers</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage your portfolio</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-slate-200/50 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-primary transition-colors shadow-inner"
            />
          </div>
          <select 
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/70 border border-slate-200/50 rounded-full text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-white"
          >
            {stages.map(s => <option key={s} value={s}>{s === 'All' ? 'All Stages' : s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(project => (
            <div 
              key={project.id} 
              onClick={() => onSelectCustomer(project)}
              className="clay-card bg-white hover:scale-[1.02] active:scale-95 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black shadow-inner">
                    {project.businessName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{project.businessName}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{project.clientName}</p>
                  </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage</span>
                  <span className="text-xs font-black text-slate-900 px-2.5 py-0.5 bg-slate-50 rounded-full border border-slate-100">{project.currentTimelineStep}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm ${
                    project.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-amber-50 text-amber-600 border border-amber-100/50'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                    <span className="text-[10px] font-black text-primary">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/20">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-bold">
              No customers found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
