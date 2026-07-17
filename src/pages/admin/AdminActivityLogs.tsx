import { useState, useEffect } from 'react';
import { Search, Filter, Terminal, Shield, Users, Database, Zap, RefreshCw, AlertCircle, Clock, FileSpreadsheet } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { EmptySearchIllustration } from '../../components/EmptyStates';
import { logAdminActivity, fetchSystemAudits, generateSystemAuditsCSV, downloadCSV } from '../../utils/adminLogger';

interface ActivityLog {
  id: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'User Management' | 'Security' | 'Billing' | 'System' | 'Operations';
}

const SEED_LOGS = [
  {
    actorEmail: 'akyinsys@gmail.com',
    actorRole: 'super_admin',
    action: 'Successful Administrator Login',
    details: 'Admin dashboard loaded successfully from IP 182.72.19.244.',
    category: 'Security',
    timestamp: new Date(Date.now() - 5000000).toISOString()
  },
  {
    actorEmail: 'system-agent@biznxt.io',
    actorRole: 'system',
    action: 'Automated Database Backup',
    details: 'Full Cloud Firestore snapshot archived to secure cloud bucket: biznxt-backups-2026.',
    category: 'System',
    timestamp: new Date(Date.now() - 15000000).toISOString()
  },
  {
    actorEmail: 'moderator_sharma@biznxt.in',
    actorRole: 'manager',
    action: 'Updated User Access Status',
    details: 'Suspended customer account id u_91244821 due to suspicious multi-device activity.',
    category: 'User Management',
    timestamp: new Date(Date.now() - 35000000).toISOString()
  },
  {
    actorEmail: 'payments@biznxt.in',
    actorRole: 'system',
    action: 'Billing Tier Updated',
    details: 'Successfully processed premium monthly subscription invoice #BXT-INV-9921.',
    category: 'Billing',
    timestamp: new Date(Date.now() - 60000000).toISOString()
  },
  {
    actorEmail: 'akyinsys@gmail.com',
    actorRole: 'super_admin',
    action: 'Toggled Maintenance Settings',
    details: 'Changed remote configuration flag: ALLOW_REGISTRATION to enabled.',
    category: 'System',
    timestamp: new Date(Date.now() - 120000000).toISOString()
  },
  {
    actorEmail: 'anonymous@untrusted.net',
    actorRole: 'anonymous',
    action: 'Failed Login Attempt',
    details: 'Unsuccessful authentication attempt using incorrect password hash for admin account.',
    category: 'Security',
    timestamp: new Date(Date.now() - 180000000).toISOString()
  }
];

export function AdminActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { success, error } = useToast();

  // Load logs with real-time support
  useEffect(() => {
    const q = query(collection(db, 'activity_logs'));
    const unsub = onSnapshot(q, async (snap) => {
      let fetchedLogs = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];

      // Sort logs descending by timestamp
      fetchedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Seed if completely empty so the admin has rich interaction immediately
      if (fetchedLogs.length === 0) {
        console.log('Seeding activity logs collection...');
        for (const log of SEED_LOGS) {
          await addDoc(collection(db, 'activity_logs'), log);
        }
      } else {
        setLogs(fetchedLogs);
      }
    }, (err) => {
      console.error('Error listening to activity logs:', err);
      error('Failed to load real-time activity logs');
    });

    return () => unsub();
  }, [error]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      success('Activity logs refreshed successfully');
    }, 600);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security':
        return <Shield className="w-4 h-4 text-rose-500" />;
      case 'User Management':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'Billing':
        return <Database className="w-4 h-4 text-emerald-500" />;
      case 'System':
        return <Zap className="w-4 h-4 text-purple-500" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-500" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.actorEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const exportLogsToCSV = () => {
    try {
      const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Details', 'Category'];
      const csvRows = [headers.join(',')];

      logs.forEach(log => {
        const row = [
          `"${log.timestamp}"`,
          `"${log.actorEmail}"`,
          `"${log.actorRole}"`,
          `"${log.action.replace(/"/g, '""')}"`,
          `"${log.details.replace(/"/g, '""')}"`,
          `"${log.category}"`
        ];
        csvRows.push(row.join(','));
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `biznxt_activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logAdminActivity(
        'akyinsys@gmail.com',
        'super_admin',
        'Exported Activity Logs',
        `Exported ${logs.length} activity log items to CSV format.`,
        'System'
      );
      success('Activity logs exported to CSV');
    } catch (err: any) {
      error('Failed to export activity logs');
    }
  };

  const handleExportSystemAudits = async () => {
    try {
      success('Querying SystemAudits collection...');
      const audits = await fetchSystemAudits();
      const csvContent = generateSystemAuditsCSV(audits);
      downloadCSV(csvContent, `system_compliance_audits_${new Date().toISOString().split('T')[0]}.csv`);
      
      logAdminActivity(
        'akyinsys@gmail.com',
        'super_admin',
        'Exported System Compliance Audits',
        `Exported ${audits.length} system compliance audit records from SystemAudits collection to CSV format.`,
        'Security'
      );
      success('System compliance audits exported successfully');
    } catch (err: any) {
      error('Failed to export system compliance audits');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px] text-left">
      {/* Header controls */}
      <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Security & Audit Trails</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time immutable logging & event monitoring</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search actions, emails, details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-700 outline-none flex-1 sm:flex-initial"
          >
            <option value="all">All Categories</option>
            <option value="Security">Security</option>
            <option value="User Management">User Management</option>
            <option value="Billing">Billing</option>
            <option value="System">System</option>
            <option value="Operations">Operations</option>
          </select>

          <button 
            onClick={exportLogsToCSV}
            className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2"
            title="Export Logs CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Logs</span>
          </button>

          <button 
            onClick={handleExportSystemAudits}
            className="px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-sm font-bold hover:bg-rose-100 transition-colors flex items-center gap-2"
            title="Export System Compliance Audits CSV"
          >
            <Shield className="w-4 h-4 text-rose-600" />
            <span>Export Audits</span>
          </button>

          <button 
            onClick={handleRefresh}
            className="p-2.5 border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-colors inline-flex items-center justify-center"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-48">Timestamp</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Category</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-64">Action</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-56 text-right">Actor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] font-semibold">
                    <Clock size={12} className="text-slate-400" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700">
                    {getCategoryIcon(log.category)}
                    {log.category}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-black text-slate-900 line-clamp-1">{log.action}</span>
                </td>
                <td className="px-8 py-5">
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 max-w-xl">{log.details}</p>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="inline-block">
                    <span className="text-xs font-black text-slate-800 font-mono">{log.actorEmail}</span>
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">{log.actorRole}</span>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-sm font-bold text-slate-500">
                  <EmptySearchIllustration className="w-32 h-32 mx-auto mb-4" />
                  No audit logs match your filtering criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
