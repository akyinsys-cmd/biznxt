import { useState, useEffect, useMemo, memo } from 'react';
import { 
  TrendingUp, 
  Users2, 
  Briefcase, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  ArrowUpRight,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Settings2,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Target,
  FileText,
  UserPlus,
  Box,
  Truck,
  Globe,
  Database
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
  Pie
} from 'recharts';
import { StatCard } from '../components/bi/StatCard';
import { AIExecutiveInsights } from '../components/bi/AIExecutiveInsights';
import { SystemHealthMonitor } from '../components/bi/SystemHealthMonitor';
import { LiveBusinessMap } from '../components/bi/LiveBusinessMap';
import { 
  EXECUTIVE_METRICS, 
  BUSINESS_HEALTH, 
  REVENUE_CHART_DATA, 
  SERVICE_PERFORMANCE,
  ALERTS,
  SYSTEM_STATUS,
  FINANCE_SUMMARY
} from '../data/biData';
import { PremiumDashboardSkeleton, SkeletonComponent } from '../components/SkeletonComponent';

// 1. Memoized Area Chart Component
const RevenueChartSection = memo(({ chartData }: { chartData: typeof REVENUE_CHART_DATA }) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue & Profit Trends</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year-over-Year Performance Analysis</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-[10px] font-bold text-slate-700 uppercase">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-700 uppercase">Profit</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C1121F" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#C1121F" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#111827' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#111827' }} 
              tickFormatter={(v) => `₹${v/100000}L`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#C1121F" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// 2. Memoized Sales Pipeline / Funnel
const SalesPipelineSection = memo(() => {
  const steps = useMemo(() => [
    { label: 'Leads', value: 1200, color: 'bg-slate-100 text-[#111827]', width: '100%' },
    { label: 'Qualified', value: 850, color: 'bg-slate-50 text-[#111827]', width: '70%' },
    { label: 'Proposal', value: 420, color: 'bg-rose-50 text-[#C1121F]', width: '45%' },
    { label: 'Negotiation', value: 180, color: 'bg-amber-50 text-amber-900', width: '25%' },
    { label: 'Closed', value: 120, color: 'bg-emerald-50 text-emerald-900', width: '15%' },
  ], []);

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Global Sales Pipeline</h3>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            <div className={`p-3 rounded-2xl border border-transparent hover:border-slate-100 transition-all flex items-center justify-between z-10 relative ${step.color}`}>
              <span className="text-[10px] font-black uppercase">{step.label}</span>
              <span className="text-xs font-black">{step.value}</span>
            </div>
            <div className="absolute inset-0 bg-slate-50 rounded-2xl opacity-20" style={{ width: step.width }} />
          </div>
        ))}
      </div>
    </div>
  );
});

// 3. Memoized Service Distribution Component
const ServiceDistributionSection = memo(({ performanceData }: { performanceData: typeof SERVICE_PERFORMANCE }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Service Revenue Distribution</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="revenue"
            >
              {performanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#C1121F', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {performanceData.slice(0, 4).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#C1121F', '#10b981', '#f59e0b', '#8b5cf6'][i] }} />
            <span className="text-[10px] font-bold text-slate-700 truncate">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// 4. Memoized Active Alerts
const AlertCenterSection = memo(() => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Alerts</h3>
        <span className="px-2 py-0.5 bg-rose-50 text-slate-900 text-[10px] font-black rounded-2xl">3 New</span>
      </div>
      <div className="space-y-4">
        {ALERTS.map((alert) => (
          <div key={alert.id} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
            <div className={`mt-0.5 ${alert.type === 'critical' ? 'text-primary' : 'text-amber-500'}`}>
              <AlertCircle size={14} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">{alert.title}</h4>
              <p className="text-[10px] text-slate-700 leading-tight mb-2">{alert.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-600">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                <button className="text-[9px] font-black text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity">Acknowledge</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// 5. Memoized Financial Snapshot Section
const FinancialSnapshotSection = memo(() => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-6">Financial Snapshot</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-700 uppercase">Monthly Burn</span>
          <span className="text-sm font-black text-slate-900">₹{(FINANCE_SUMMARY.expenses / 100000).toFixed(1)}L</span>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-2xl overflow-hidden">
          <div className="h-full bg-primary w-[60%]" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-700 uppercase">Cash Reserve</span>
          <span className="text-sm font-black text-emerald-700">₹{(FINANCE_SUMMARY.cashFlow / 1000000).toFixed(1)} Cr</span>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-2xl overflow-hidden">
          <div className="h-full bg-emerald-500 w-[85%]" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">GST Liability</p>
            <p className="text-xs font-black text-slate-950">₹15.3L</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Outstandings</p>
            <p className="text-xs font-black text-amber-700">₹8.5L</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function CEOCommandCenter() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // High-performance state initialization only on mount
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) setLoading(false);
    }, 1200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] pb-12">
        <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <SkeletonComponent className="w-48 h-8 rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <PremiumDashboardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-12">
      {/* Top Navigation / Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="text-primary" size={20} />
                CEO Command Center
              </h1>
              <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Real-time Business Intelligence Hub</p>
            </div>
            
            <div className="h-8 w-px bg-slate-200" />
            
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {['24h', '7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-[10px] font-black rounded-2xl transition-all ${
                    timeRange === range ? 'bg-white text-primary shadow-sm' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-primary transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="bg-slate-50 border border-slate-100 pl-9 pr-4 py-2 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 text-slate-900 placeholder-slate-500"
              />
            </div>
            <button className="p-2 text-slate-700 hover:text-slate-900 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-2xl border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
              <div className="w-7 h-7 bg-primary rounded-2xl flex items-center justify-center text-white text-[10px] font-black">CEO</div>
              <ChevronRight size={14} className="text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Core Metrics */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Primary Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                label="Today's Revenue" 
                value={`₹${(EXECUTIVE_METRICS.todayRevenue / 1000).toFixed(1)}k`} 
                trend={{ value: 12, isUp: true }}
                icon={DollarSign}
                color="emerald"
              />
              <StatCard 
                label="Active Customers" 
                value={EXECUTIVE_METRICS.activeCustomers} 
                trend={{ value: 5, isUp: true }}
                icon={Users2}
                color="blue"
              />
              <StatCard 
                label="Active Projects" 
                value={EXECUTIVE_METRICS.activeProjects} 
                trend={{ value: 2, isUp: false }}
                icon={Briefcase}
                color="indigo"
              />
              <StatCard 
                label="Health Score" 
                value={`${BUSINESS_HEALTH.overallScore}/100`} 
                subValue="Optimal Performance"
                icon={Activity}
                color="violet"
              />
            </div>

            {/* Main Chart Section */}
            <RevenueChartSection chartData={REVENUE_CHART_DATA} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales Funnel */}
              <SalesPipelineSection />

              {/* Service Performance */}
              <ServiceDistributionSection performanceData={SERVICE_PERFORMANCE} />
            </div>

            {/* Location Map */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Geo-Distribution Center</h3>
                  <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Live Heatmap of Global Operations</p>
                </div>
                <button className="p-2 bg-slate-50 rounded-2xl text-slate-700 hover:text-primary transition-all">
                  <Globe size={18} />
                </button>
              </div>
              <LiveBusinessMap />
            </div>

          </div>

          {/* Right Column - Insights & Monitoring */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* AI Insights Card */}
            <div className="h-[400px]">
              <AIExecutiveInsights />
            </div>

            {/* Alert Center */}
            <AlertCenterSection />

            {/* Financial Health Summary */}
            <FinancialSnapshotSection />

            {/* Infrastructure Monitor */}
            <div className="h-[400px]">
              <SystemHealthMonitor status={SYSTEM_STATUS} />
            </div>

          </div>
        </div>
      </div>

      {/* Quick Action Drawer (Floating) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl border border-white/10 z-50 flex items-center gap-6"
      >
        {[
          { label: 'Broadcast', icon: Bell },
          { label: 'Audit Log', icon: ShieldCheck },
          { label: 'Reports', icon: FileText },
          { label: 'Team', icon: Users2 },
          { label: 'Settings', icon: Settings2 },
        ].map((action, i) => (
          <button key={i} className="flex flex-col items-center gap-1 group">
            <div className="p-2 text-slate-400 group-hover:text-white group-hover:bg-white/10 rounded-2xl transition-all">
              <action.icon size={18} />
            </div>
            <span className="text-[8px] font-black text-slate-400 group-hover:text-slate-300 uppercase tracking-widest">{action.label}</span>
          </button>
        ))}
        <div className="h-8 w-px bg-white/10 mx-2" />
        <button className="px-5 py-2 bg-primary text-white text-[10px] font-black rounded-2xl hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Calendar size={14} />
          Schedule Review
        </button>
      </motion.div>
    </div>
  );
}
