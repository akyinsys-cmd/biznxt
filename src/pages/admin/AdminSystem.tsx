import { useState, useEffect } from 'react';
import { Settings, Shield, Zap, RefreshCw, AlertCircle, Terminal, HardDrive, Cpu } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { logAdminActivity } from '../../utils/adminLogger';

export function AdminSystem() {
  const { success } = useToast();
  const [uptime, setUptime] = useState('99.98%');
  const [logs, setLogs] = useState([
    { id: '1', event: 'Database Backup', status: 'Success', time: '2 hours ago' },
    { id: '2', event: 'Google Account Verification', status: 'Active', time: 'Just now' },
    { id: '3', event: 'Security Audit', status: 'Completed', time: 'Yesterday' },
    { id: '4', event: 'New Manager Onboarded', status: 'Info', time: '5 hours ago' },
  ]);

  const handleMaintenance = () => {
    logAdminActivity(
      'akyinsys@gmail.com',
      'super_admin',
      'Toggled Maintenance Mode',
      'Administrative override toggled BizNxt server maintenance flag.',
      'System'
    );
    success('System maintenance mode toggled');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard label="System Uptime" value={uptime} icon={Zap} color="text-emerald-600" bg="bg-emerald-50" />
        <StatusCard label="Active Sessions" value="142" icon={Shield} color="text-blue-600" bg="bg-blue-50" />
        <StatusCard label="Server Load" value="14%" icon={Cpu} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight text-left">System Health & Logs</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Live infrastructure monitoring</p>
          </div>
          
          <div className="p-8">
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-400">
                      <Terminal size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{log.event}</h4>
                      <p className="text-[10px] font-bold text-slate-500">{log.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    log.status === 'Success' || log.status === 'Completed' || log.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <RefreshCw size={14} />
              Refresh Logs
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6">Master Controls</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">Maintenance Mode</h4>
                  <p className="text-xs font-bold text-slate-500">Redirect all traffic to maintenance page</p>
                </div>
                <button 
                  onClick={handleMaintenance}
                  className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors hover:bg-slate-300"
                >
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">New User Registration</h4>
                  <p className="text-xs font-bold text-slate-500">Allow new customers to sign up</p>
                </div>
                <button className="w-12 h-6 bg-emerald-500 rounded-full relative transition-colors">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <button className="w-full py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                  <AlertCircle size={14} />
                  Purge System Cache
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-xl">
                <HardDrive size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight">Database Storage</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instance biznxt-prod-01</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Usage</span>
                <span>1.2 GB / 20 GB</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="w-[6%] h-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <h4 className="text-xl font-black text-slate-900">{value}</h4>
      </div>
    </div>
  );
}
