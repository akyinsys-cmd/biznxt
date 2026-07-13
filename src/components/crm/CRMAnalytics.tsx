import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Activity, 
  BarChart3, 
  PieChart, 
  Sparkles,
  ArrowRight,
  Target,
  Zap,
  Globe,
  Database
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart as RechartsPieChart, 
  Pie as RechartsPie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface CRMAnalyticsProps {
  leads: any[];
}

const COLORS = ['#C1121F', '#8B5CF6', '#16A34A', '#D62828', '#F59E0B', '#111827'];

export default function CRMAnalytics({ leads }: CRMAnalyticsProps) {
  // Compute Key Analytics
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.priority === 'Hot').length;
  const warmLeads = leads.filter(l => l.priority === 'Warm').length;
  const coldLeads = leads.filter(l => l.priority === 'Cold').length;
  
  const wonLeads = leads.filter(l => l.status === 'Completed' || l.status === 'Services Purchased' || l.status === 'Payment Received');
  const lostLeads = leads.filter(l => l.status === 'Lost');
  const winRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0;
  
  // Compute Revenue Forecast
  const totalRevenue = wonLeads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0);
  const pipelineValue = leads.reduce((sum, l) => sum + (Number(l.budget) || 0), 0);

  // Group by Source for Chart
  const sourceData = React.useMemo(() => {
    const counts: { [key: string]: { count: number; value: number } } = {};
    leads.forEach(l => {
      const src = l.source || 'Website';
      const b = Number(l.budget) || 0;
      if (!counts[src]) {
        counts[src] = { count: 0, value: 0 };
      }
      counts[src].count += 1;
      counts[src].value += b;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      Leads: counts[key].count,
      Value: counts[key].value
    }));
  }, [leads]);

  // Group by Stage for Pipeline
  const stageData = React.useMemo(() => {
    const counts: { [key: string]: number } = {};
    leads.forEach(l => {
      const stg = l.status || 'New Lead';
      counts[stg] = (counts[stg] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      Count: counts[key]
    }));
  }, [leads]);

  return (
    <div className="space-y-12">
      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Pipeline Velocity', value: totalLeads, icon: Activity, trend: '+12%', color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Locked Revenue', value: `₹${(totalRevenue/100000).toFixed(1)}L`, icon: DollarSign, trend: '+8.4%', color: 'text-success', bg: 'bg-success/5' },
          { label: 'Node Conversion', value: `${winRate}%`, icon: Target, trend: '+2.1%', color: 'text-purple-600', bg: 'bg-purple-500/5' },
          { label: 'Pipeline Assets', value: `₹${(pipelineValue/100000).toFixed(1)}L`, icon: Database, trend: '+15%', color: 'text-warning', bg: 'bg-warning/5' },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] group hover:shadow-xl hover:border-primary/20 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                <kpi.icon size={28} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-success uppercase tracking-widest">{kpi.trend}</span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Growth Index</p>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Source Analysis */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] space-y-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Acquisition DNA</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Channel Yield Analysis</p>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C1121F" stopOpacity={1} />
                    <stop offset="100%" stopColor="#C1121F" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #F1F5F9', 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    padding: '20px'
                  }}
                />
                <Bar dataKey="Value" radius={[12, 12, 0, 0]} barSize={40}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stage Distribution */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] space-y-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Node Distribution</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Pipeline Saturation Pulse</p>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={8}
                  dataKey="Count"
                  nameKey="name"
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </RechartsPie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: 'none', 
                    borderRadius: '24px', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    padding: '20px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">{value}</span>}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SLA Health Indicator */}
      <div className="bg-slate-900 p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-2xl blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/10 rounded-2xl blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
                <Zap size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-black tracking-tight text-white">Neural SLA Enforcement</h4>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1">Autonomous Quality Assurance</p>
              </div>
            </div>
            <p className="text-lg font-medium text-slate-500 leading-relaxed">
              BizNxt engine monitors every node transition in real-time. Lead allocation holds a target <span className="text-white">15-minute contact SLA</span>. Active efficiency rating is currently <span className="text-success font-black">98.4%</span> across all Success Managers.
            </p>
          </div>

          <div className="flex gap-12 shrink-0">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Avg Cycle</p>
              <h5 className="text-4xl font-black text-white tracking-tighter">4.2<span className="text-lg text-slate-500 ml-1">Days</span></h5>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Escalations</p>
              <h5 className="text-4xl font-black text-success tracking-tighter">00</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
