import React from 'react';
import { cn } from '../../lib/utils';
import { Search, PenTool, CheckSquare, PackageCheck, Send, FileText } from 'lucide-react';

export type ResearchStatusType = 
  | 'Pending'
  | 'Payment Pending'
  | 'Assigned'
  | 'Research Started'
  | 'Verification'
  | 'Report Designing'
  | 'Quality Check'
  | 'Completed'
  | 'Delivered';

interface ResearchStatusProps {
  status: ResearchStatusType;
  title: string;
  ticketId: string;
  updatedAt: string;
  className?: string;
}

const statusConfig: Record<ResearchStatusType, { color: string, bg: string, icon: any, label: string }> = {
  'Pending': { color: 'text-slate-600', bg: 'bg-slate-100', icon: ClockIcon, label: 'Pending' },
  'Payment Pending': { color: 'text-warning', bg: 'bg-warning/10', icon: ClockIcon, label: 'Awaiting Payment' },
  'Assigned': { color: 'text-primary', bg: 'bg-primary/10', icon: Send, label: 'Team Assigned' },
  'Research Started': { color: 'text-purple-600', bg: 'bg-purple-100', icon: Search, label: 'Researching' },
  'Verification': { color: 'text-warning', bg: 'bg-warning/10', icon: CheckSquare, label: 'Verifying Data' },
  'Report Designing': { color: 'text-purple-600', bg: 'bg-purple-100', icon: PenTool, label: 'Designing PDF' },
  'Quality Check': { color: 'text-primary', bg: 'bg-primary/10', icon: Search, label: 'Quality Check' },
  'Completed': { color: 'text-success', bg: 'bg-success/10', icon: PackageCheck, label: 'Completed' },
  'Delivered': { color: 'text-success', bg: 'bg-success/10', icon: FileText, label: 'Delivered' },
};

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export function ResearchStatus({ status, title, ticketId, updatedAt, className }: ResearchStatusProps) {
  const config = statusConfig[status] || statusConfig['Pending'];
  const Icon = config.icon;

  return (
    <div className={cn("glass-card glass-card-hover p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6", className)}>
      <div className="flex items-center gap-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", config.bg, config.color)}>
          <Icon size={28} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
            <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 tracking-widest uppercase">ID: {ticketId}</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{updatedAt}</p>
        </div>
      </div>
      
      <div className={cn("px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase border flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center transition-all", config.bg, config.color, "border-current/10 shadow-sm")}>
        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
        {config.label}
      </div>
    </div>
  );
}
