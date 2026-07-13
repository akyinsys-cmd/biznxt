import { useState } from 'react';
import { Project } from '../../../types/project';
import { Briefcase, MapPin, DollarSign, Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';

export function CustomerDetails({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Business Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="Business Name" value={project.businessName} icon={Briefcase} />
          <DetailItem label="Category" value={project.businessCategory || 'Not specified'} icon={Target} />
          <DetailItem label="Location" value={project.location || 'Not specified'} icon={MapPin} />
          <DetailItem label="Investment Budget" value={project.investmentAmount ? `₹${project.investmentAmount}` : 'Not specified'} icon={DollarSign} />
          <DetailItem label="Current Stage" value={project.currentTimelineStep} icon={Target} />
          <DetailItem label="Created On" value={project.createdAt?.seconds ? format(new Date(project.createdAt.seconds * 1000), 'MMM dd, yyyy') : 'Unknown'} icon={Calendar} />
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-100">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Business Idea / Description</h4>
          <p className="text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl">
            {project.businessIdea || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Client Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Name</p>
            <p className="text-sm font-black text-slate-900">{project.clientName}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
            <p className="text-sm font-bold text-slate-700">{project.clientEmail}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
            <p className="text-sm font-bold text-slate-700">{project.clientPhone || 'Not specified'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl">
      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}
