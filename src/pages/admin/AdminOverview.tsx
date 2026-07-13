import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Target, Activity, FileText, Briefcase, Zap, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function AdminOverview() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    activeCustomers: 0,
    newCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    pendingResearch: 8,
    completedResearch: 42,
    businessProjects: 0,
    payments: 0,
    pendingPayments: 0,
    refunds: 0,
    supportTickets: 0,
    careerApps: 0,
    websiteVisitors: 0,
  });

  useEffect(() => {
    // Real-time counts from Firestore
    const unsubDocs = onSnapshot(collection(db, 'document_orders'), (snap) => {
      const pending = snap.docs.filter(d => d.data().status === 'Draft').length;
      const completed = snap.docs.filter(d => d.data().status === 'Completed').length;
      setStats(prev => ({ ...prev, pendingOrders: pending, completedOrders: completed }));
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setStats(prev => ({ ...prev, activeCustomers: snap.size }));
    });

    const unsubProjects = onSnapshot(collection(db, 'client_projects'), (snap) => {
      setStats(prev => ({ ...prev, businessProjects: snap.size }));
    });

    return () => {
      unsubDocs();
      unsubUsers();
      unsubProjects();
    };
  }, []);

  const chartData = [
    { name: 'Jan', revenue: 400000, visitors: 2400 },
    { name: 'Feb', revenue: 300000, visitors: 1398 },
    { name: 'Mar', revenue: 200000, visitors: 9800 },
    { name: 'Apr', revenue: 278000, visitors: 3908 },
    { name: 'May', revenue: 189000, visitors: 4800 },
    { name: 'Jun', revenue: 239000, visitors: 3800 },
    { name: 'Jul', revenue: 349000, visitors: 4300 },
  ];

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue (Projected)" value={`₹${stats.todayRevenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Monthly Revenue (Projected)" value={`₹${stats.monthlyRevenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Yearly Revenue (Projected)" value={`₹${stats.yearlyRevenue.toLocaleString()}`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Payments" value={stats.payments} icon={DollarSign} color="text-indigo-600" bg="bg-indigo-50" />
        
        <StatCard title="Active Customers" value={stats.activeCustomers} icon={Users} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="New Customers" value={stats.newCustomers} icon={UserPlus} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Website Visitors" value={stats.websiteVisitors} icon={Users} color="text-slate-600" bg="bg-slate-50" />
        <StatCard title="Refunds" value={stats.refunds} icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Analytics</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Financial Performance</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs font-bold text-slate-700 outline-none">
              <option>Last 7 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 800 }}
                  itemStyle={{ color: '#0f172a', fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Operations Overview</h3>
          
          <div className="space-y-4 flex-1">
            <OpRow label="Pending Orders" value={stats.pendingOrders} icon={Activity} color="text-amber-500" />
            <OpRow label="Completed Orders" value={stats.completedOrders} icon={Target} color="text-emerald-500" />
            <OpRow label="Pending Research" value={stats.pendingResearch} icon={FileText} color="text-purple-500" />
            <OpRow label="Completed Research" value={stats.completedResearch} icon={FileText} color="text-emerald-500" />
            <OpRow label="Launch Projects" value={stats.businessProjects} icon={Briefcase} color="text-blue-500" />
            <OpRow label="Support Tickets" value={stats.supportTickets} icon={AlertCircle} color="text-rose-500" />
            <OpRow label="Career Apps" value={stats.careerApps} icon={Zap} color="text-indigo-500" />
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-500/30 transition-all">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-2xl font-black text-slate-900">{value}</h4>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
  );
}

function OpRow({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <Icon size={16} className={color} />
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}

function UserPlus(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
}
