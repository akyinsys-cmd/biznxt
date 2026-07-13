import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Plus, 
  Trash, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  Circle,
  FolderOpen
} from 'lucide-react';
import { BusinessTask, BusinessProject } from './types';

interface TaskManagerProps {
  tasks: BusinessTask[];
  projects: BusinessProject[];
  onCreateTask: (task: Omit<BusinessTask, 'id' | 'ownerId' | 'createdAt'>) => Promise<void>;
  onToggleTaskStatus: (taskId: string, currentStatus: BusinessTask['status']) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TaskManager({ tasks, projects, onCreateTask, onToggleTaskStatus, onDeleteTask }: TaskManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<BusinessTask['priority']>('Medium');
  const [deadline, setDeadline] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !deadline) return;
    setSubmitting(true);
    try {
      await onCreateTask({
        projectId: selectedProjectId || undefined,
        taskName: taskName.trim(),
        priority,
        deadline,
        assignedPerson: assignedPerson.trim() || 'Rahul Sharma',
        checklist: [
          { text: 'Review initial draft requirements', done: false },
          { text: 'Obtain executive manager signoff', done: false }
        ],
        attachments: [],
        dependencies: [],
        progress: 0,
        status: 'Pending',
        calendarIntegration: true
      });
      setTaskName('');
      setDeadline('');
      setAssignedPerson('');
      setSelectedProjectId('');
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
          <div className="bg-slate-800 p-4 rounded-2xl text-white">
            <CheckSquare className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Task Registry & Checklist Ledger</h2>
            <p className="text-xs text-slate-500">Log task dependencies, manage team delegation, and map checklist progress to specific project targets.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Custom Task
        </button>
      </div>

      {/* Task List Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {tasks.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {tasks.map((task) => {
              const taskProject = projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  {/* Status Toggle & Details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <button 
                      onClick={() => onToggleTaskStatus(task.id!, task.status)}
                      className="mt-1 shrink-0 text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {task.status === 'Completed' ? (
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold text-slate-800 truncate ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                        {task.taskName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {task.assignedPerson}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-[10px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Due: {task.deadline}
                        </span>
                        {taskProject && (
                          <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            <FolderOpen className="w-3 h-3" />
                            {taskProject.name}
                          </span>
                        )}
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-2xl border ${
                          task.priority === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border-primary/20'
                            : task.priority === 'High'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Checklist Progress */}
                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-500 block">Progress: {task.progress}%</span>
                      <div className="w-24 bg-slate-100 h-1 rounded-2xl overflow-hidden mt-1.5">
                        <div className="bg-primary h-1" style={{ width: `${task.progress}%` }}></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteTask(task.id!)}
                      className="text-slate-400 hover:text-primary-dark p-2 rounded-2xl hover:bg-slate-50 transition-all duration-150"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-slate-500">No tasks logged. Click 'Log Custom Task' to begin operations.</div>
        )}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10 border border-slate-100 space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-900 font-display">Log Custom Operational Task</h3>
              
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Task Details</label>
                  <input 
                    type="text" 
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                    placeholder="e.g. Audit Custom AD Code submission forms"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Task Priority</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as BusinessTask['priority'])}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Deadline Date</label>
                    <input 
                      type="date" 
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Assigned Executive</label>
                  <input 
                    type="text" 
                    value={assignedPerson}
                    onChange={e => setAssignedPerson(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Link to Project Track</label>
                  <select
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none"
                  >
                    <option value="">-- No Linked Project --</option>
                    {projects.map(proj => (
                      <option key={proj.id} value={proj.id}>{proj.name}</option>
                    ))}
                  </select>
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
                    {submitting ? 'Logging...' : 'Commit Task'}
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
