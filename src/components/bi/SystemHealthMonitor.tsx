import { memo } from 'react';
import { ShieldCheck, Server, Database, Globe, CreditCard, Mail, MessageSquare } from 'lucide-react';
import { SystemStatus } from '../../types/bi';

interface SystemHealthMonitorProps {
  status: SystemStatus;
}

export const SystemHealthMonitor = memo(function SystemHealthMonitor({ status }: SystemHealthMonitorProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'online': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      default: return 'bg-primary';
    };
  };

  const systems = [
    { name: 'Firebase', key: 'firebase', icon: Server },
    { name: 'Firestore', key: 'firestore', icon: Database },
    { name: 'Storage', key: 'storage', icon: Globe },
    { name: 'Auth', key: 'auth', icon: ShieldCheck },
    { name: 'Payments', key: 'paymentGateway', icon: CreditCard },
    { name: 'Email', key: 'emailService', icon: Mail },
    { name: 'WhatsApp', key: 'whatsappService', icon: MessageSquare },
  ];

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">System Infrastructure</h3>
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-2xl">
          <div className="w-1.5 h-1.5 rounded-2xl bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {systems.map((sys) => (
          <div key={sys.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <sys.icon size={14} className="text-slate-500" />
              <span className="text-[10px] font-bold text-slate-600">{sys.name}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status[sys.key as keyof SystemStatus])}`} />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Uptime (30d)</p>
          <p className="text-sm font-black text-slate-900">99.98%</p>
        </div>
        <button className="text-[10px] font-black text-primary hover:underline">View Logs</button>
      </div>
    </div>
  );
});
