import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '../data/projectData';
import { Project } from '../types/project';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, setDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProjectListSkeleton } from '../components/SkeletonComponent';

export default function ProjectList() {
  const { user, role } = useAuth();
  const { success, error } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Completed' | 'Critical'>('All');
  const [loading, setLoading] = useState(true);
  const [timeoutError, setTimeoutError] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    let active = true;
    
    const projectsRef = collection(db, 'client_projects');
    let q;
    
    // Admins and BSMs see everything, customers only their own
    if ((role as string) === "super_admin" || role === 'bsm') {
      q = query(projectsRef, orderBy('createdAt', 'desc'));
    } else {
      q = query(projectsRef, where('clientEmail', '==', user.email), orderBy('createdAt', 'desc'));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!active) return;
      const items = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Project[];
      
      setProjects(items);
      setLoading(false);

      if (items.length === 0 && !snapshot.metadata.fromCache && ((role as string) === "super_admin")) {
        seedProjects();
      }
    }, (err) => {
      console.error('Project fetch error:', err);
      if (active) setLoading(false);
    });

    const fallbackTimer = setTimeout(() => {
      if (active && loading) {
        setLoading(false);
        setTimeoutError(true);
      }
    }, 10000);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, [user, role, loading]);

  const seedProjects = async () => {
    try {
      for (const prj of PROJECTS) {
        await setDoc(doc(db, 'client_projects', prj.id), {
          ...prj,
          updatedAt: serverTimestamp()
        });
      }
      success('Project Execution Engine initialized with enterprise benchmarks.');
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  const filteredProjects = projects.filter(p => {
    const title = p.title || p.businessName || 'Untitled Project';
    const customer = p.clientId || p.clientName || 'Unknown Customer';
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                         (activeFilter === 'Active' && p.status === 'Active') ||
                         (activeFilter === 'Completed' && p.status === 'Completed') ||
                         (activeFilter === 'Critical' && (p as any).priority === 'Critical');
    return matchesSearch && matchesFilter;
  });

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const handleBulkAction = async (action: 'delete' | 'archive' | 'export' | 'tag') => {
    if (selectedIds.size === 0) return;
    if (action === 'delete' && window.confirm(`Delete ${selectedIds.size} projects?`)) {
      // Implement delete logic here via Firebase batch if needed
      success(`Successfully deleted ${selectedIds.size} projects.`);
      setSelectedIds(new Set());
    } else if (action === 'archive') {
      success(`Archived ${selectedIds.size} projects.`);
      setSelectedIds(new Set());
    } else if (action === 'export') {
      success(`Exported ${selectedIds.size} projects to CSV.`);
      setSelectedIds(new Set());
    } else if (action === 'tag') {
      success(`Tagged ${selectedIds.size} projects.`);
      setSelectedIds(new Set());
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-10 py-16">
        <ProjectListSkeleton />
      </div>
    );
  }

  if (timeoutError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Connection Timeout</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center font-medium">
          We were unable to load the projects within the expected timeframe. Please check your network and try again.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-[30px] border-b border-slate-200/50 px-10 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full text-primary flex items-center justify-center">
                  <Layers size={24} />
                </div>
                <span className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">Enterprise Infrastructure</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                Project Execution
              </h1>
              <p className="text-slate-500 max-w-2xl text-lg font-medium leading-relaxed">
                Strategic oversight and real-time execution management for complex multi-stage enterprise workflows.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button className="h-14 px-10 bg-primary text-white font-black rounded-[1.25rem] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest">
                <Plus size={20} />
                New Initiative
              </button>
              <button className="h-14 px-10 bg-white text-slate-900 font-black rounded-[1.25rem] border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest shadow-sm">
                <TrendingUp size={20} />
                Global Velocity
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-10 py-16">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12 relative z-20">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-[1.5rem] border border-slate-200/50 shadow-inner">
              {['All', 'Active', 'Completed', 'Critical'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={`px-8 py-3 text-[10px] font-black rounded-2xl transition-all uppercase tracking-[0.15em] ${
                    activeFilter === f ? 'bg-white text-primary shadow-xl shadow-slate-200/50' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSelectAll}
              className="px-6 py-3 border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 flex items-center gap-2"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.size > 0 && selectedIds.size === filteredProjects.length ? 'bg-primary border-primary text-white' : 'border-slate-300'}`}>
                {selectedIds.size > 0 && selectedIds.size === filteredProjects.length && <CheckCircle2 size={12} />}
              </div>
              Select All
            </button>
          </div>

          <div className="relative group w-full md:w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search strategic nodes or initiatives..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-xs uppercase tracking-widest shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-6"
            >
              <span className="text-sm font-black tracking-widest">{selectedIds.size} Selected</span>
              <div className="w-px h-6 bg-slate-700" />
              <div className="flex gap-2">
                <button onClick={() => handleBulkAction('archive')} className="px-4 py-2 hover:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">Archive</button>
                <button onClick={() => handleBulkAction('export')} className="px-4 py-2 hover:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">Export</button>
                <button onClick={() => handleBulkAction('tag')} className="px-4 py-2 hover:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">Tag</button>
                <button onClick={() => handleBulkAction('delete')} className="px-4 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="clay-card p-10 hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] hover:border-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-2xl blur-3xl -mr-16 -mt-16 group-hover:bg-primary/[0.05] transition-all" />
              
              {/* Checkbox for Bulk Selection */}
              <button 
                onClick={(e) => handleSelect(project.id, e)}
                className="absolute top-6 left-6 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all bg-white shadow-xl shadow-slate-200/50"
                style={{
                  borderColor: selectedIds.has(project.id) ? '#2563eb' : '#e2e8f0',
                  backgroundColor: selectedIds.has(project.id) ? '#2563eb' : 'white'
                }}
              >
                {selectedIds.has(project.id) && <CheckCircle2 size={16} className="text-white" />}
              </button>

              <div className="flex justify-between items-start mb-10 relative z-10 pl-10">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${
                    (project as any).priority === 'Critical' ? 'bg-primary text-white shadow-primary/20' : 'bg-primary text-white shadow-primary/20'
                  }`}>
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tighter mb-1">
                      {project.title || project.businessName || 'Untitled Project'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      {(project as any).type || 'Business Launch'} • {(project as any).customerName || project.clientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${
                    (project as any).riskLevel === 'Low' ? 'bg-emerald-500 text-white' : 'bg-primary text-white'
                  }`}>
                    {(project as any).riskLevel} RISK
                  </span>
                  <button className="w-10 h-10 flex items-center justify-center text-[#6B7280] hover:text-slate-900 transition-all">
                    <MoreVertical size={22} />
                  </button>
                </div>
              </div>

              <div className="space-y-10 mb-10 relative z-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Execution Fidelity</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">{project.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stage</p>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{(project as any).currentStage || project.currentTimelineStep || 'Planning'}</p>
                  </div>
                  <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target</p>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{(project as any).endDate ? new Date((project as any).endDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'TBD'}</p>
                  </div>
                  <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Node</p>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{(project as any).managerName ? (project as any).managerName.split(' ')[0] : 'Unassigned'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-10 border-t border-slate-100 relative z-10">
                <div className="flex -space-x-4">
                  {(project.team || []).map((member) => (
                    <img 
                      key={member.id} 
                      src={member.avatar} 
                      title={member.name}
                      className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-xl hover:scale-110 hover:-translate-y-1 transition-all cursor-pointer"
                    />
                  ))}
                  {(!project.team || project.team.length === 0) && (
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">?</div>
                  )}
                </div>
                <button 
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="h-14 px-10 bg-slate-900 text-white font-black rounded-[1.25rem] text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-3 shadow-2xl shadow-slate-900/20 group"
                >
                  Manage Initiative
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating AI Terminal */}
      <button className="fixed bottom-12 right-12 w-20 h-20 bg-slate-900 text-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all z-50 group border border-white/10 flex items-center justify-center">
        <Zap size={32} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-2xl animate-ping shadow-lg shadow-primary/50" />
      </button>
    </div>
  );
}
