import React, { useState, useEffect } from 'react';
import { Project, ProjectMeeting } from '../../../types/project';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Video, Phone, Plus, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export function Meetings({ project }: { project: Project }) {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<ProjectMeeting[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'project_meetings'), where('projectId', '==', project.id));
    const unsub = onSnapshot(q, (snap) => {
      setMeetings(snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectMeeting)));
    });
    return () => unsub();
  }, [project.id]);

  const handleSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await addDoc(collection(db, 'project_meetings'), {
      projectId: project.id,
      bsmId: user?.uid,
      clientId: project.clientId,
      title: formData.get('title'),
      dateTime: formData.get('dateTime'),
      platform: formData.get('platform'),
      meetingLink: formData.get('meetingLink'),
      status: 'Scheduled',
    });
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Meetings</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule and track client calls</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-2.5 bg-primary text-white text-[10px] font-black rounded-2xl uppercase tracking-widest flex items-center gap-2"
        >
          <Plus size={16} /> Schedule
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map(m => (
          <div key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-primary/30 transition-all gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                {m.platform.includes('Meet') || m.platform.includes('Zoom') ? <Video size={20} /> : <Phone size={20} />}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{m.title}</h4>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(m.dateTime), 'MMM dd, yyyy • hh:mm a')}</span>
                  <span>•</span>
                  <span>{m.platform}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                m.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                m.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {m.status}
              </span>
              
              {m.meetingLink && m.status === 'Scheduled' && (
                <a href={m.meetingLink} target="_blank" rel="noreferrer" className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                  Join <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
        {meetings.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-bold text-sm">
            No meetings scheduled.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6">Schedule Meeting</h3>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Meeting Title</label>
                <input name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Date & Time</label>
                <input type="datetime-local" name="dateTime" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Platform</label>
                <select name="platform" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary">
                  <option>Google Meet</option>
                  <option>Zoom</option>
                  <option>Phone</option>
                  <option>WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Meeting Link (Optional)</label>
                <input name="meetingLink" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-primary/90">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
