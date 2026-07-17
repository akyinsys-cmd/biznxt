import { useState, useEffect, useMemo, memo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users2, 
  Activity, 
  MousePointer2, 
  ShieldCheck, 
  Target, 
  DollarSign, 
  Zap, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  Filter, 
  Search, 
  Download, 
  Calendar,
  Share2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { 
  CORE_METRICS, 
  CUSTOMER_JOURNEY, 
  MARKETING_METRICS, 
  FINANCE_ANALYTICS, 
  AI_USAGE, 
  PARTNER_PERFORMANCE 
} from '../data/analyticsData';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { DashboardSkeleton } from '../components/ui/Skeleton';

type AnalyticsTab = 'executive' | 'marketing' | 'finance' | 'customer' | 'ai' | 'partner';

// Memoized Stat Card
const StatCard = memo(({ kpi, index }: { kpi: any, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-6 group hover:shadow-xl hover:border-primary/20 transition-all"
  >
    <div className={`w-16 h-16 rounded-[1.5rem] ${kpi.bg} ${kpi.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
      <kpi.icon size={28} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{kpi.value}</h3>
    </div>
  </motion.div>
));

StatCard.displayName = 'StatCard';

// Memoized Chart Section
const ExecutiveView = memo(({ liveEvents, loading }: { liveEvents: any[], loading: boolean }) => {
  if (loading) return <DashboardSkeleton dark={true} />;

  return (
    <motion.div
      key="executive"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Strategic Growth', value: `${CORE_METRICS.growthRate}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/5' },
          { label: 'Active Ecosystem', value: CORE_METRICS.mau.toLocaleString(), icon: Users2, color: 'text-blue-600', bg: 'bg-blue-500/5' },
          { label: 'Unit Revenue (Avg)', value: `₹${CORE_METRICS.aov.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-500/5' },
          { label: 'Execution Delta', value: `${CORE_METRICS.conversionRate}%`, icon: Activity, color: 'text-violet-600', bg: 'bg-violet-500/5' },
        ].map((kpi, i) => (
          <StatCard key={i} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Conversion Funnel */}
        <div className="col-span-12 lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.02] rounded-2xl blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Strategic Funnel Architecture</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Cross-domain Conversion Intelligence</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
              <AlertCircle size={16} className="text-primary" />
              Net Efficiency: {CORE_METRICS.conversionRate}%
            </div>
          </div>

          <div className="h-[450px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: '1px solid rgba(0,0,0,0.05)', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    padding: '16px'
                  }}
                />
                <Funnel
                  data={CUSTOMER_JOURNEY}
                  dataKey="count"
                >
                  <LabelList position="right" fill="#64748b" content={(props: any) => {
                    const { x, y, value, index } = props;
                    const dropOff = CUSTOMER_JOURNEY[index].dropOffRate;
                    return (
                      <text x={x + 15} y={y + 18} fill="#64748b" fontSize={10} fontWeight={900}>
                        {value.toLocaleString().toUpperCase()} • {dropOff}% LOSS
                      </text>
                    );
                  }} />
                  {CUSTOMER_JOURNEY.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#C1121F', '#D62828', '#E5383B', '#F94144', '#F3722C', '#F8961E', '#F9C74F'][index % 7]} 
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Event Stream */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-2xl blur-[100px] -mr-24 -mt-24" />
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/30">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Active Node Stream</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Real-time Telemetry</p>
            </div>
          </div>

          <div className="space-y-8 relative z-10 max-h-[400px] overflow-y-auto no-scrollbar">
            {liveEvents.length > 0 ? liveEvents.map((event, idx) => (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative pl-8 pb-8 border-l border-white/10 last:pb-0"
              >
                <div className="absolute left-[-6px] top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-slate-900 shadow-[0_0_10px_rgba(193,18,31,0.8)]" />
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">{event.eventName || event.name}</h4>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {event.timestamp ? new Date(event.timestamp.seconds * 1000 || event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOW'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">CAT: {event.category} • NODE: {event.userId?.slice(0, 8) || 'SYSTEM'}</p>
                <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 overflow-hidden">
                  <code className="text-[10px] text-primary/70 font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify(event.metadata || event.data || {}, null, 2)}
                  </code>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zero latency logs detected</p>
              </div>
            )}
          </div>

          <button className="w-full mt-10 py-5 bg-white/[0.05] hover:bg-white/[0.1] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-white/10">
            Access Historical Logs
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ExecutiveView.displayName = 'ExecutiveView';

export default function AnalyticsPlatform() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('executive');
  const [timeRange, setTimeRange] = useState('30d');
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'analytics_events'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLiveEvents(events);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching analytics events:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const memoizedExecutiveView = useMemo(() => (
    <ExecutiveView liveEvents={liveEvents} loading={loading} />
  ), [liveEvents, loading]);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-[30px] border-b border-slate-200/50 px-10 py-10 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full text-primary flex items-center justify-center">
                <BarChart3 size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Command Center</h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Global Intelligence & Telemetry</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 shadow-inner">
              {['24h', '7d', '30d', '1y'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-6 py-2.5 text-[10px] font-black rounded-2xl transition-all uppercase tracking-widest ${
                    timeRange === range ? 'bg-white text-primary shadow-xl shadow-slate-200/50' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-primary transition-all shadow-sm">
              <Download size={20} />
            </button>
            <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-500 hover:text-primary transition-all shadow-sm">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200/50">
        <div className="max-w-[1600px] mx-auto px-10">
          <div className="flex items-center space-x-12 overflow-x-auto no-scrollbar">
            {[
              { id: 'executive', label: 'Executive Nexus', icon: Target },
              { id: 'marketing', label: 'Growth & ROI', icon: MousePointer2 },
              { id: 'finance', label: 'Capital Ledger', icon: DollarSign },
              { id: 'customer', label: 'Lifecycle Engine', icon: Users2 },
              { id: 'ai', label: 'Neural Activity', icon: Zap },
              { id: 'partner', label: 'Ecosystem Trust', icon: ShieldCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                className={`py-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeAnalyticTab"
                    className="absolute bottom-[-1px] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(193,18,31,0.3)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-10 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'executive' && memoizedExecutiveView}

          {activeTab === 'marketing' && (
            <motion.div
              key="marketing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {MARKETING_METRICS.map((source, i) => (
                <motion.div 
                  key={source.source}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.02] rounded-2xl blur-3xl -mr-16 -mt-16 group-hover:bg-primary/[0.05] transition-all" />
                  
                  <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all shadow-inner">
                        <MousePointer2 size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{source.source}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Acquisition Channel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CPL Ledger</p>
                      <p className="text-xl font-black text-slate-900 tracking-tight">₹{source.costPerLead}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                    <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Lead Volume</p>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter">{source.leads.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conversions</p>
                      <p className="text-2xl font-black text-primary tracking-tighter">{source.conversions}</p>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Channel Efficiency</span>
                      <span className="text-xs font-black text-primary tracking-widest">{((source.conversions / source.leads) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(source.conversions / source.leads) * 100}%` }}
                        className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                      />
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target CAC</p>
                      <p className="text-lg font-black text-slate-900 tracking-tight">₹{source.costPerCustomer.toLocaleString()}</p>
                    </div>
                    <button className="h-10 px-6 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">Audit Performance</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'finance' && (
            <motion.div
              key="finance"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-10">Segment Revenue Distribution</h3>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(FINANCE_ANALYTICS.revenueByService).map(([name, value]) => ({ name, value }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} tickFormatter={v => `₹${v/100000}L`} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }} 
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
                        />
                        <Bar dataKey="value" fill="#2563eb" radius={[12, 12, 0, 0]} barSize={50}>
                          {Object.entries(FINANCE_ANALYTICS.revenueByService).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-10">Geographic Capital Influx</h3>
                  <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="h-[300px] w-full md:w-1/2 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(FINANCE_ANALYTICS.revenueByRegion).map(([name, value]) => ({ name, value }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {Object.entries(FINANCE_ANALYTICS.revenueByRegion).map((_, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} 
                                className="hover:opacity-80 transition-opacity cursor-pointer shadow-lg"
                              />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '16px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">Global</p>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-5">
                      {Object.entries(FINANCE_ANALYTICS.revenueByRegion).map(([name, value], i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors shadow-inner">
                          <div className="flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full shadow-lg shadow-black/10" style={{ backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i] }} />
                            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-500 tracking-tighter">₹{(value/100000).toFixed(1)}L</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'Outstandings', value: `₹${(FINANCE_ANALYTICS.outstandingPayments/100000).toFixed(1)}L`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                  { label: 'Ecosystem Fees', value: `₹${(FINANCE_ANALYTICS.partnerCommission/100000).toFixed(1)}L`, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                  { label: 'Taxation Summary', value: `₹${(FINANCE_ANALYTICS.gstSummary/100000).toFixed(1)}L`, icon: Calculator, color: 'text-primary', bg: 'bg-primary/5' },
                  { label: 'Global Cash Flow', value: `₹${(FINANCE_ANALYTICS.cashFlow/1000000).toFixed(1)} Cr`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-center group hover:shadow-xl transition-all"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-6 shadow-inner group-hover:rotate-12 transition-transform`}>
                      <stat.icon size={22} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                    <h4 className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h4>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {AI_USAGE.map((ai, i) => (
                <motion.div 
                  key={ai.featureName}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-900 p-10 rounded-[3.5rem] text-white border border-white/5 relative overflow-hidden group shadow-2xl shadow-slate-900/40"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-2xl blur-[100px] -mr-24 -mt-24 transition-transform group-hover:scale-125" />
                  
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="w-14 h-14 bg-primary rounded-[1.5rem] text-white flex items-center justify-center shadow-xl shadow-primary/40">
                      <Zap size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{ai.featureName}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Neural Node Active</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                    <div className="bg-white/[0.03] p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Request Load</p>
                      <p className="text-2xl font-black text-white tracking-tighter">{ai.requests.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/[0.03] p-6 rounded-[1.5rem] border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Response Latency</p>
                      <p className="text-2xl font-black text-emerald-400 tracking-tighter">{ai.avgResponseTime}s</p>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Fidelity</span>
                        <span className="text-[10px] font-black text-emerald-400 tracking-widest">{ai.successRate}% STABLE</span>
                      </div>
                      <div className="h-2 bg-white/[0.05] rounded-2xl overflow-hidden shadow-inner border border-white/5">
                        <div className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: `${ai.successRate}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Compute Load</p>
                      <p className="text-lg font-black text-slate-200 tracking-tight">{(ai.tokensUsed / 1000000).toFixed(1)}M Tokens</p>
                    </div>
                    <div className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">Usage: ${ai.cost}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'partner' && (
            <motion.div
              key="partner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10"
            >
              {PARTNER_PERFORMANCE.map((partner, i) => (
                <motion.div 
                  key={partner.partnerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col lg:flex-row gap-16 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-primary/[0.02] rounded-2xl blur-3xl -ml-16 -mt-16" />
                  
                  <div className="w-full lg:w-1/4 relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-400 shadow-inner border border-slate-100">
                        <Users2 size={40} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{partner.partnerName}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Certified Node</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SLA Compliance</span>
                        <span className="text-sm font-black text-emerald-600 tracking-tight">{partner.slaCompliance}%</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Pulse</span>
                        <span className="text-sm font-black text-slate-900 tracking-tight uppercase">{partner.responseTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                    {[
                      { label: 'Capture Win Rate', value: `${partner.winRate}%`, icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                      { label: 'Fulfillment Integrity', value: `${partner.completionRate}%`, icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
                      { label: 'Fidelity Score', value: partner.qualityRating, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                      { label: 'Revenue Yield', value: `₹${(partner.revenueGenerated/100000).toFixed(1)}L`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                    ].map((m, i) => (
                      <div key={i} className="bg-slate-50/30 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-white transition-all shadow-sm">
                        <div className={`w-14 h-14 rounded-2xl shadow-inner mb-6 ${m.bg} ${m.color} flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                          <m.icon size={28} />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{m.label}</p>
                        <p className="text-xl font-black text-slate-900 tracking-tighter">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="w-full lg:w-72 flex flex-col justify-center gap-4 relative z-10">
                    <button className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-primary transition-all text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95">
                      Operational Audit
                    </button>
                    <button className="w-full py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest shadow-sm active:scale-95">
                      Legal Directives
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Insight Assistant */}
      <motion.button 
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-12 right-12 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 flex items-center gap-4 group border border-white/10"
      >
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-float shadow-xl shadow-primary/30">
          <Zap size={20} />
        </div>
        <span className="font-black text-[10px] uppercase tracking-[0.2em]">Neural Nexus AI</span>
      </motion.button>
    </div>
  );
}
