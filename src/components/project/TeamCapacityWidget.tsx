import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Zap, Battery, BatteryCharging, BatteryFull, Download } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Project } from '../../types/project';
import { downloadCSV } from '../../utils/adminLogger';

export function TeamCapacityWidget({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const unsub = onSnapshot(doc(db, 'projects', projectId), (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() } as Project);
      }
    });
    return () => unsub();
  }, [projectId]);

  if (!project) return null;

  const team = project.team || [
    { id: '1', name: 'Alex Consultant', role: 'Lead Strategist', avatar: '' },
    { id: '2', name: 'Sarah Designer', role: 'UX Expert', avatar: '' },
    { id: '3', name: 'Mike Engineer', role: 'Full Stack', avatar: '' }
  ];

  const getCapacity = (index: number) => {
    const capacities = [85, 60, 95, 40, 75];
    return capacities[index % capacities.length];
  };

  const getSkills = (role: string) => {
    if (role.includes('Strategist')) return ['Strategy', 'Planning', 'Comms'];
    if (role.includes('UX') || role.includes('Design')) return ['UI/UX', 'Figma', 'Research'];
    if (role.includes('Engineer') || role.includes('Dev')) return ['React', 'Node.js', 'System Arch'];
    return ['Management', 'Operations', 'Analysis'];
  };

  const exportTeamReport = () => {
    const headers = ['Name', 'Role', 'Utilization (%)', 'Skills'];
    const csvRows = [headers.join(',')];
    
    team.forEach((member, i) => {
      const capacity = getCapacity(i);
      const skills = getSkills(member.role).join('; ');
      
      const row = [
        `"${member.name}"`,
        `"${member.role}"`,
        `"${capacity}"`,
        `"${skills}"`
      ];
      csvRows.push(row.join(','));
    });
    
    downloadCSV(csvRows.join('\n'), `team_capacity_${projectId}.csv`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden h-[350px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Team Skill & Capacity</h3>
            <p className="text-xs font-medium text-slate-500">Resource allocation mapping</p>
          </div>
        </div>
        <button 
          onClick={exportTeamReport}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          title="Export Team Report (CSV)"
        >
          <Download size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {team.map((member, i) => {
          const capacity = getCapacity(i);
          return (
            <div key={member.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-slate-400">{member.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className={`flex items-center gap-1 ${capacity > 80 ? 'text-rose-500' : capacity > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {capacity > 80 ? <BatteryFull size={14} /> : capacity > 50 ? <BatteryCharging size={14} /> : <Battery size={14} />}
                    <span className="text-xs font-bold">{capacity}%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Utilization</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {getSkills(member.role).map((skill, j) => (
                  <span key={j} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold tracking-wide">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
