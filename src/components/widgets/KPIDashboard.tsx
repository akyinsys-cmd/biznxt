import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, IndianRupee } from 'lucide-react';
import { cn } from '../../lib/utils';

const monthlyData = [
  { month: 'Jan', revenue: 4000, users: 240 },
  { month: 'Feb', revenue: 5000, users: 300 },
  { month: 'Mar', revenue: 4500, users: 280 },
  { month: 'Apr', revenue: 6500, users: 390 },
  { month: 'May', revenue: 7800, users: 450 },
  { month: 'Jun', revenue: 9000, users: 510 },
];

export function KPIDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Monthly Performance" 
          value="₹90,000" 
          trend="+15.3%" 
          trendUp={true} 
          icon={IndianRupee} 
        />
        <KPICard 
          title="Operational Units" 
          value="510" 
          trend="+13.3%" 
          trendUp={true} 
          icon={Users} 
        />
        <KPICard 
          title="Growth Velocity" 
          value="24.5%" 
          trend="+2.1%" 
          trendUp={true} 
          icon={TrendingUp} 
        />
        <KPICard 
          title="Security Health" 
          value="99.9%" 
          trend="Secured" 
          trendUp={true} 
          icon={Activity} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Growth Projection</h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-2xl">Real-time</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 700 }} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 700 }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                  formatter={(value: number) => [`₹${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#C1121F" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#C1121F', strokeWidth: 4, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Unit Acquisition</h3>
            <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-2xl">Live Feed</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 700 }} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}
                  cursor={{ fill: '#f8fafc', radius: 10 }}
                />
                <Bar dataKey="users" fill="#C1121F" radius={[8, 8, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, trendUp, icon: Icon }: any) {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between min-h-[160px]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">
          <Icon className="w-5 h-5 text-slate-900" />
        </div>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-2xl",
          trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend}
        </span>
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</h4>
        <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
