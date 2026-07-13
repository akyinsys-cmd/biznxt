import { useState } from 'react';
import { X, FileText, Activity, CreditCard, ShoppingBag, Clock } from 'lucide-react';

export function AdminUserDetails({ user, onClose }: any) {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="flex items-center gap-4">
            <img src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}`} alt="" className="w-16 h-16 rounded-2xl bg-slate-200 border-4 border-white shadow-sm" />
            <div>
              <h3 className="text-xl font-black text-slate-900">{user.displayName || user.name || 'Unknown User'}</h3>
              <p className="text-sm font-bold text-slate-500">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">{user.role || 'customer'}</span>
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md ${user.status === 'suspended' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>{user.status === 'suspended' ? 'Suspended' : 'Active'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-2xl text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 px-6 pt-4 gap-6 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: 'Order History', icon: ShoppingBag },
            { id: 'payments', label: 'Invoices & Payments', icon: CreditCard },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'research', label: 'Research Reports', icon: Activity },
            { id: 'timeline', label: 'Timeline', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 px-1 border-b-2 text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-bold">No {activeTab} records found for this user.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
