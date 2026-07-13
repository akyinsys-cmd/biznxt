import React, { useState, useEffect } from 'react';
import { Project, ProjectTask } from '../../../types/project';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle2, Clock, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function Tasks({ project }: { project: Project }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'project_tasks'), where('projectId', '==', project.id));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectTask)));
    });
    return () => unsub();
  }, [project.id]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const taskData = {
      projectId: project.id,
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: formData.get('status') || 'Pending',
      deadline: formData.get('deadline'),
      assignedTo: user?.uid,
      completionPercentage: editingTask ? editingTask.completionPercentage : 0,
      createdAt: new Date()
    };

    try {
      if (editingTask) {
        await updateDoc(doc(db, 'project_tasks', editingTask.id), taskData);
      } else {
        await addDoc(collection(db, 'project_tasks'), taskData);
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save task');
    }
  };

  const toggleStatus = async (task: ProjectTask) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await updateDoc(doc(db, 'project_tasks', task.id), { status: newStatus, completionPercentage: newStatus === 'Completed' ? 100 : 0 });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) {
      await deleteDoc(doc(db, 'project_tasks', id));
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Task Management</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage project deliverables</p>
        </div>
        <button 
          onClick={() => { setEditingTask(null); setShowModal(true); }}
          className="px-6 py-2.5 bg-primary text-white text-[10px] font-black rounded-2xl uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 rounded-2xl border border-slate-200 hover:border-primary/30 transition-all flex items-start gap-4 group">
            <button 
              onClick={() => toggleStatus(task)}
              className={`mt-1 shrink-0 ${task.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-primary'}`}
            >
              {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 rounded-2xl border-2 border-current" />}
            </button>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-sm font-black ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    task.priority === 'Critical' || task.priority === 'High' ? 'bg-rose-100 text-rose-600' : 
                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Clock size={12} /> Due: {format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 ml-auto">
                  <button onClick={() => { setEditingTask(task); setShowModal(true); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(task.id)} className="p-1.5 hover:bg-rose-50 rounded text-rose-600"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm font-bold">No tasks assigned yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6">{editingTask ? 'Edit Task' : 'Create Task'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Title</label>
                <input name="title" defaultValue={editingTask?.title} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Description</label>
                <textarea name="description" defaultValue={editingTask?.description} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Priority</label>
                  <select name="priority" defaultValue={editingTask?.priority || 'Medium'} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Deadline</label>
                  <input type="date" name="deadline" defaultValue={editingTask?.deadline} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-primary/90">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
