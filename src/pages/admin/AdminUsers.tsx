import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit2, Shield, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { collection, onSnapshot, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { AdminUserDetails } from './AdminUserDetails';

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { success, error } = useToast();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const roles = [
    { id: 'super_admin', label: 'Super Admin' },
    { id: 'manager', label: 'Manager' },
    { id: 'customer', label: 'Customer' }
  ];

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.displayName || u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' ? u.role !== 'super_admin' : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      success('User role updated successfully');
    } catch (err: any) {
      error(err.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      success(`User account ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        success('User deleted permanently');
      } catch (err: any) {
        error(err.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Enterprise Users & Roles</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage access control and customer accounts</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none"
          >
            <option value="all">All Roles</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`} alt="" className="w-10 h-10 rounded-2xl bg-slate-200" />
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{user.displayName || user.name || 'Unknown User'}</h4>
                      <p className="text-[10px] font-bold text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <select 
                    value={user.role || 'customer'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-transparent text-sm font-bold text-primary outline-none border-b border-dashed border-primary/30 cursor-pointer"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    user.status === 'suspended' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {user.status === 'suspended' ? <XCircle size={12} /> : <CheckCircle size={12} />}
                    {user.status === 'suspended' ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl transition-colors inline-flex"
                    title="View Details"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleStatusToggle(user.id, user.status)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors inline-flex"
                    title={user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                  >
                    <Shield size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition-colors inline-flex"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-sm font-bold text-slate-500">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <AdminUserDetails user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

