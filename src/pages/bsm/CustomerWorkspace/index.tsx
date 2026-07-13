import { useState } from 'react';
import { Project } from '../../../types/project';
import { ArrowLeft, User, Target, CheckSquare, FileText, MessageSquare, Calendar, DollarSign, Activity } from 'lucide-react';
import { CustomerDetails } from './CustomerDetails';
import { ProjectTracker } from './ProjectTracker';
import { Tasks } from './Tasks';
import { Documents } from './Documents';
import { Chat } from './Chat';
import { Meetings } from './Meetings';
import { Finance } from './Finance';
import { Timeline } from './Timeline';

export function CustomerWorkspace({ project, onBack }: { project: Project, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details', icon: User },
    { id: 'tracker', label: 'Tracker', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: Activity },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-2xl hover:bg-primary hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{project.businessName}</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{project.clientName} • Stage: {project.currentTimelineStep}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'details' && <CustomerDetails project={project} />}
        {activeTab === 'tracker' && <ProjectTracker project={project} />}
        {activeTab === 'tasks' && <Tasks project={project} />}
        {activeTab === 'documents' && <Documents project={project} />}
        {activeTab === 'chat' && <Chat project={project} />}
        {activeTab === 'meetings' && <Meetings project={project} />}
        {activeTab === 'finance' && <Finance project={project} />}
        {activeTab === 'timeline' && <Timeline project={project} />}
      </div>
    </div>
  );
}
