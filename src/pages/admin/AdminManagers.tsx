import { useState, useEffect } from 'react';
import { Search, Shield, UserPlus, Trash2, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { collection, onSnapshot, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';

export function AdminManagers() {
  const [managers, setManagers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { success, error } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'manager'));
    const unsub = onSnapshot(q, (snap) => {
      setManagers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filteredManagers = managers.filter(m => {
    return (m.displayName || m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
           (m.email || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      success(`Manager account ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDemote = async (userId: string) => {
    if (window.confirm('Are you sure you want to demote this manager to customer?')) {
      try {
        await updateDoc(doc(db, 'users', userId), { role: 'customer' });
        success('User demoted to customer');
      } catch (err: any) {
        error(err.message || 'Failed to demote user');
      }
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight text-left">Internal Management Team</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Managers & Business Executives</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <button className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
            <UserPlus size={16} />
            Invite Manager
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manager Details</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Departments</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredManagers.map(manager => (
              <tr key={manager.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-left">
                  <div className="flex items-center gap-4">
                    <img src={manager.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${manager.displayName || manager.email}`} alt="" className="w-10 h-10 rounded-2xl bg-slate-200" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{manager.displayName || manager.name || 'Unknown'}</h4>
                      <p className="text-[10px] font-bold text-slate-500">{manager.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    manager.status === 'suspended' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {manager.status === 'suspended' ? <XCircle size={12} /> : <CheckCircle size={12} />}
                    {manager.status === 'suspended' ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex gap-1 flex-wrap">
                     <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-black rounded uppercase">Operations</span>
                     <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-black rounded uppercase">BSM</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button 
                    onClick={() => handleStatusToggle(manager.id, manager.status)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors inline-flex"
                    title={manager.status === 'suspended' ? 'Activate' : 'Suspend'}
                  >
                    <Shield size={16} />
                  </button>
                  <button 
                    onClick={() => handleDemote(manager.id)}
                    className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-2xl transition-colors inline-flex"
                    title="Demote to Customer"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredManagers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-sm font-bold text-slate-500">
                  No managers found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
