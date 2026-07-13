import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import { Project } from '../../types/project';

interface BSMControlsProps {
  project: Project;
  onUpdate: () => void;
  onAdvanceStage: (nextStage: Project['currentTimelineStep']) => void;
}

export default function BSMControls({ project, onUpdate, onAdvanceStage }: BSMControlsProps) {
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState<'task' | 'meeting' | 'document' | 'note' | 'stage' | null>(null);

  const STAGES: Project['currentTimelineStep'][] = [
    'Research', 'Quotation', 'Documentation', 'Registration', 
    'Branding', 'Manufacturer', 'Website', 'Marketing', 
    'Launch', 'Growth'
  ];

  const currentStageIndex = STAGES.indexOf(project.currentTimelineStep);
  const nextStage = STAGES[currentStageIndex + 1];

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, 'project_tasks'), {
        projectId: project.id,
        title: formData.get('title'),
        description: formData.get('description'),
        status: 'Pending',
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        completionPercentage: 0,
        checklist: [],
        createdAt: serverTimestamp()
      });
      showToast('Task initialized successfully', 'success');
      setActiveModal(null);
      onUpdate();
    } catch (error) {
      showToast('Failed to create task', 'error');
    }
  };

  const handleScheduleMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, 'project_meetings'), {
        projectId: project.id,
        clientId: project.clientId,
        bsmId: project.bsmId,
        title: formData.get('title'),
        dateTime: formData.get('dateTime'),
        platform: formData.get('platform'),
        meetingLink: formData.get('meetingLink'),
        status: 'Scheduled',
        createdAt: serverTimestamp()
      });
      showToast('Meeting scheduled successfully', 'success');
      setActiveModal(null);
      onUpdate();
    } catch (error) {
      showToast('Failed to schedule meeting', 'error');
    }
  };

  const handleRequestDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, 'customer_documents'), {
        projectId: project.id,
        clientId: project.clientId,
        name: formData.get('name'),
        type: formData.get('type'),
        status: 'Pending Upload',
        version: 1,
        requestedBy: project.bsmId,
        createdAt: serverTimestamp()
      });
      showToast('Document request sent', 'success');
      setActiveModal(null);
      onUpdate();
    } catch (error) {
      showToast('Failed to request document', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
          <ShieldAlert size={18} className="text-primary" />
          BSM Action Center
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setActiveModal('task')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-[2rem] hover:bg-primary hover:text-white transition-all group border border-slate-100"
          >
            <Plus size={24} className="text-primary group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">New Task</span>
          </button>
          <button 
            onClick={() => setActiveModal('meeting')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-[2rem] hover:bg-primary hover:text-white transition-all group border border-slate-100"
          >
            <Calendar size={24} className="text-primary group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Schedule</span>
          </button>
          <button 
            onClick={() => setActiveModal('document')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-[2rem] hover:bg-primary hover:text-white transition-all group border border-slate-100"
          >
            <FileText size={24} className="text-primary group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Request Doc</span>
          </button>
          <button 
            onClick={() => setActiveModal('note')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 rounded-[2rem] hover:bg-primary hover:text-white transition-all group border border-slate-100"
          >
            <MessageSquare size={24} className="text-primary group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Internal Note</span>
          </button>
        </div>
        
        {nextStage && (
          <button 
            onClick={() => setActiveModal('stage')}
            className="w-full mt-6 py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Zap size={18} className="text-primary" />
            Advance to {nextStage}
          </button>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-2xl blur-3xl -mr-16 -mt-16" />
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                  {activeModal === 'task' && 'Initialize Execution Task'}
                  {activeModal === 'meeting' && 'Sync Strategic Session'}
                  {activeModal === 'document' && 'Request Asset Vault Upload'}
                  {activeModal === 'note' && 'Internal Record Entry'}
                  {activeModal === 'stage' && 'Advance Project Stage'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-2xl text-slate-400 hover:text-primary transition-all">
                  <XCircle size={20} />
                </button>
              </div>

              {activeModal === 'stage' && (
                <div className="space-y-8">
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                        <Zap size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Node</p>
                        <h4 className="text-lg font-black text-slate-900">{project.currentTimelineStep}</h4>
                      </div>
                      <ChevronRight size={24} className="text-slate-300 mx-2" />
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Next Target</p>
                        <h4 className="text-lg font-black text-slate-900">{nextStage}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Advancing to the next stage will notify the client and update the execution roadmap. Ensure all current stage tasks and documents are validated.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      onAdvanceStage(nextStage as any);
                      setActiveModal(null);
                    }}
                    className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Confirm Stage Transition
                  </button>
                </div>
              )}

              {activeModal === 'task' && (
                <form onSubmit={handleCreateTask} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Task Title</label>
                    <input name="title" required className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                    <textarea name="description" rows={3} className="w-full p-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Priority</label>
                      <select name="priority" className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Deadline</label>
                      <input type="date" name="deadline" className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Finalize Entry
                  </button>
                </form>
              )}

              {activeModal === 'meeting' && (
                <form onSubmit={handleScheduleMeeting} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Meeting Title</label>
                    <input name="title" required className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Platform</label>
                      <select name="platform" className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20">
                        <option>Google Meet</option>
                        <option>Zoom</option>
                        <option>WhatsApp</option>
                        <option>Phone</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Date & Time</label>
                      <input type="datetime-local" name="dateTime" required className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Meeting Link (Optional)</label>
                    <input name="meetingLink" className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Confirm Schedule
                  </button>
                </form>
              )}

              {activeModal === 'document' && (
                <form onSubmit={handleRequestDocument} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Document Name</label>
                    <input name="name" required placeholder="e.g. Pan Card, GST Registration" className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                    <select name="type" className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20">
                      <option>ID Proof</option>
                      <option>Address Proof</option>
                      <option>GST</option>
                      <option>Trademark</option>
                      <option>Contract</option>
                      <option>Logo</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Send Request
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
