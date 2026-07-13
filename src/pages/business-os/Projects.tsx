import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderGit2, 
  Plus, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  CircleDot
} from 'lucide-react';
import { BusinessProject, ProjectType } from './types';

interface ProjectsProps {
  projects: BusinessProject[];
  onCreateProject: (project: Omit<BusinessProject, 'id' | 'ownerId' | 'createdAt'>) => Promise<void>;
  onUpdateProjectStatus: (projectId: string, status: BusinessProject['status']) => Promise<void>;
}

const PROJECT_CATEGORIES: ProjectType[] = [
  'Research Project',
  'Manufacturing Project',
  'Website Project',
  'Marketing Project',
  'GST Project',
  'Trademark Project',
  'Loan Project',
  'Import Project',
  'Export Project',
  'Expansion Project'
];

export function Projects({ projects, onCreateProject, onUpdateProjectStatus }: ProjectsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjType, setNewProjType] = useState<ProjectType>('Research Project');
  const [newProjTeam, setNewProjTeam] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    setSubmitting(true);
    try {
      await onCreateProject({
        name: newProjName.trim(),
        type: newProjType,
        status: 'Not Started',
        team: newProjTeam ? newProjTeam.split(',').map(s => s.trim()) : [],
        timeline: [
          { phase: 'Project Scoping & Alignment', deadline: new Date(Date.now() + 604800000).toISOString().split('T')[0], status: 'pending' },
          { phase: 'Execution Milestone Phase 1', deadline: new Date(Date.now() + 2592000000).toISOString().split('T')[0], status: 'pending' }
        ]
      });
      setNewProjName('');
      setNewProjTeam('');
      setShowAddModal(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-4 rounded-2xl text-white">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Expansion & Sourcing Project Board</h2>
            <p className="text-xs text-slate-500">Coordinate and check progress across all 10 corporate modules including exports, trademarks, and legal entities.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Initiate Project Module
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          // Calculate project progress percentage based on its timeline phases
          const completedPhases = proj.timeline.filter(t => t.status === 'completed').length;
          const totalPhases = proj.timeline.length;
          const progressPercent = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

          return (
            <motion.div 
              key={proj.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Type and Status Header */}
                <div className="flex justify-between items-start gap-2">
                  <span className="bg-slate-50 border border-slate-100 text-slate-500 font-mono text-[10px] font-bold px-2.5 py-1 rounded-2xl uppercase tracking-wider">
                    {proj.type}
                  </span>
                  <select 
                    value={proj.status}
                    onChange={e => onUpdateProjectStatus(proj.id!, e.target.value as BusinessProject['status'])}
                    className={`text-xs font-bold px-2 py-1 rounded-2xl border focus:outline-none ${
                      proj.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : proj.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : proj.status === 'On Hold'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                {/* Project Title */}
                <div>
                  <h4 className="font-bold text-slate-800 text-base font-display line-clamp-1">{proj.name}</h4>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>{proj.team.join(', ') || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Phases & Timelines</span>
                    <span className="font-mono font-bold text-slate-600">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-2xl overflow-hidden">
                    <div className="bg-primary h-1.5 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                {/* Steps detail */}
                <div className="space-y-2 pt-1">
                  {proj.timeline.map((phase, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <CircleDot className={`w-3 h-3 shrink-0 ${phase.status === 'completed' ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span className="truncate">{phase.phase}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{phase.deadline}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
            
            {/* Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10 border border-slate-100 space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-900 font-display">Initiate Business OS Project</h3>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Project Name / Scope</label>
                  <input 
                    type="text" 
                    value={newProjName}
                    onChange={e => setNewProjName(e.target.value)}
                    placeholder="e.g. Dubai Main Road Warehousing Audit"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Project Category</label>
                  <select
                    value={newProjType}
                    onChange={e => setNewProjType(e.target.value as ProjectType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PROJECT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Assigned Team (comma separated)</label>
                  <input 
                    type="text" 
                    value={newProjTeam}
                    onChange={e => setNewProjTeam(e.target.value)}
                    placeholder="e.g. Rahul Sharma, Amrita Patel"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-2xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-1/2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-sm"
                  >
                    {submitting ? 'Initiating...' : 'Launch Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
