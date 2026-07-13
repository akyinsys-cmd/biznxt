import React from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle, Save, Calendar, ShieldCheck, CreditCard } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  timestamp: string;
  type: 'draft' | 'payment' | 'milestone' | 'consult' | 'file';
  desc: string;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Free Discovery Research Draft saved',
    timestamp: '10 minutes ago',
    type: 'draft',
    desc: 'Auto-saved Step 4 geographic footprint parameters to cloud Firestore ledger.'
  },
  {
    id: '2',
    title: 'Consultation Scheduled',
    timestamp: '2 hours ago',
    type: 'consult',
    desc: 'Meeting booked with Senior Advisory Expert Ketan Sharma for GST alignment.'
  },
  {
    id: '3',
    title: 'GST Registration Document Verified',
    timestamp: 'Yesterday',
    type: 'milestone',
    desc: 'Compliance audit signed off successfully by regional operations advisor.'
  },
  {
    id: '4',
    title: 'Filing Fee Paid',
    timestamp: '3 days ago',
    type: 'payment',
    desc: 'Incorporation statutory payment processed via unified checkout gateway.'
  }
];

export function RecentActivities() {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'draft': return <Save className="w-4 h-4 text-warning" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-success" />;
      case 'milestone': return <ShieldCheck className="w-4 h-4 text-primary" />;
      case 'consult': return <Calendar className="w-4 h-4 text-purple-500" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="glass-card bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 text-base">Recent Activities</h3>
        <p className="text-xs text-slate-500 mt-0.5">Chronological audit ledger of active business processes.</p>
      </div>

      <div className="relative border-l-2 border-slate-100 pl-4 ml-2 space-y-5">
        {MOCK_ACTIVITIES.map((act) => (
          <div key={act.id} className="relative group">
            {/* Pulsing indicator */}
            <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              {getIcon(act.type)}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">{act.title}</h4>
                <span className="text-[10px] text-slate-500 font-medium font-mono">{act.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
