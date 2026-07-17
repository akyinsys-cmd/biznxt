import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BarChart3, 
  Globe, 
  MapPin, 
  TrendingUp, 
  Factory, 
  Target, 
  ShieldCheck, 
  ChevronRight, 
  Search, 
  Filter,
  Lightbulb,
  Zap,
  Layers,
  ArrowUpRight,
  Database,
  History,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INDUSTRIES, 
  LOCATIONS, 
  MANUFACTURERS, 
  TRENDS, 
  RECOMMENDATIONS,
  OPPORTUNITIES
} from '../data/intelligenceData';
import { 
  IndustryProfile, 
  LocationProfile, 
  ManufacturerIntel, 
  MarketTrend, 
  AIRecommendation,
  BusinessOpportunity
} from '../types/intelligence';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '../context/ToastContext';

type IntelTab = 'industry' | 'location' | 'opportunity' | 'trends' | 'manufacturers' | 'ai';

export default function MarketIntelligence() {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<IntelTab>('industry');
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const [industryIntel, setIndustryIntel] = useState<IndustryProfile[]>([]);
  const [locationIntel, setLocationIntel] = useState<LocationProfile[]>([]);
  const [opportunities, setOpportunities] = useState<BusinessOpportunity[]>([]);
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [manufacturers, setManufacturers] = useState<ManufacturerIntel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Industries
    const unsubInd = onSnapshot(collection(db, 'intel_industries'), (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as IndustryProfile));
      setIndustryIntel(items);
      if (items.length === 0 && !snap.metadata.fromCache) seedIntel();
    });

    // Locations
    const unsubLoc = onSnapshot(collection(db, 'intel_locations'), (snap) => {
      setLocationIntel(snap.docs.map(d => ({ id: d.id, ...d.data() } as LocationProfile)));
    });

    // Opportunities
    const unsubOpp = onSnapshot(collection(db, 'intel_opportunities'), (snap) => {
      setOpportunities(snap.docs.map(d => ({ id: d.id, ...d.data() } as BusinessOpportunity)));
    });

    // Trends
    const unsubTrend = onSnapshot(collection(db, 'intel_trends'), (snap) => {
      setTrends(snap.docs.map(d => ({ id: d.id, ...d.data() } as MarketTrend)));
    });

    // Manufacturers
    const unsubMfg = onSnapshot(collection(db, 'intel_manufacturers'), (snap) => {
      setManufacturers(snap.docs.map(d => ({ id: d.id, ...d.data() } as ManufacturerIntel)));
      setLoading(false);
    });

    return () => {
      unsubInd();
      unsubLoc();
      unsubOpp();
      unsubTrend();
      unsubMfg();
    };
  }, []);

  const seedIntel = async () => {
    try {
      // Industries
      for (const item of INDUSTRIES) {
        await setDoc(doc(db, 'intel_industries', item.id), { ...item, updatedAt: serverTimestamp() });
      }
      // Locations
      for (const item of LOCATIONS) {
        await setDoc(doc(db, 'intel_locations', item.id), { ...item, updatedAt: serverTimestamp() });
      }
      // Opportunities
      for (const item of OPPORTUNITIES) {
        await setDoc(doc(db, 'intel_opportunities', item.id), { ...item, updatedAt: serverTimestamp() });
      }
      // Trends
      for (const item of TRENDS) {
        await setDoc(doc(db, 'intel_trends', item.id), { ...item, updatedAt: serverTimestamp() });
      }
      // Manufacturers
      for (const item of MANUFACTURERS) {
        await setDoc(doc(db, 'intel_manufacturers', item.id), { ...item, updatedAt: serverTimestamp() });
      }
      success('Market Intelligence Platform synced with global data lakes.');
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  const filteredIndustries = useMemo(() => 
    industryIntel.filter(ind => ind.name.toLowerCase().includes(searchQuery.toLowerCase())),
  [industryIntel, searchQuery]);

  const filteredLocations = useMemo(() => 
    locationIntel.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase())),
  [locationIntel, searchQuery]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accessing Intelligence Network...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative px-8 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary mb-6">
                <Database size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intelligence Ledger</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                Market <span className="text-primary">Intelligence</span>
              </h1>
              <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">
                Structured datasets and AI-driven analytics to identify growth opportunities and market trends across the global ecosystem.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button className="neo-button bg-primary text-white px-8 py-4 rounded-full font-black text-[10px] tracking-widest uppercase transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                <Filter size={18} />
                Strategic Filter
              </button>
              <button className="neo-button bg-white text-slate-900 px-8 py-4 rounded-full font-black text-[10px] tracking-widest uppercase transition-all border border-slate-200">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-8 overflow-x-auto">
          <div className="flex items-center space-x-12 min-w-max">
            {[
              { id: 'industry', label: 'Industries', icon: BarChart3 },
              { id: 'location', label: 'Locations', icon: MapPin },
              { id: 'opportunity', label: 'Opportunities', icon: Target },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'manufacturers', label: 'Manufacturers', icon: Factory },
              { id: 'ai', label: 'AI Synthesis', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as IntelTab)}
                className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2.5 ${
                  activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-2xl"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Search */}
        <div className="mb-12 max-w-3xl group relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search market intelligence database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-900 placeholder:text-slate-500"
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'industry' && (
            <motion.div
              key="industry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredIndustries.map(ind => (
                <div key={ind.id} className="glass-card glass-card-hover p-10 rounded-[2.5rem] group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight">{ind.name}</h3>
                      <p className="text-slate-500 mt-2 font-medium leading-relaxed">{ind.overview}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                      ind.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {ind.confidence} Accuracy
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mt-10">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Growth Engines</p>
                      <ul className="space-y-2">
                        {ind.growthFactors.map((f, i) => (
                          <li key={i} className="text-xs font-bold text-slate-700 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-2xl bg-emerald-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Revenue Models</p>
                      <ul className="space-y-2">
                        {ind.businessModels.map((m, i) => (
                          <li key={i} className="text-xs font-bold text-slate-700 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-2xl bg-primary" /> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">V-{ind.id}</span>
                    <button className="text-primary font-black text-[10px] tracking-widest uppercase flex items-center gap-2 group/btn">
                      Full Sector Analysis <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredLocations.map(loc => (
                <div key={loc.id} className="glass-card glass-card-hover p-10 rounded-[2.5rem]">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary shadow-sm">
                        <MapPin size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{loc.name}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{loc.type} Portfolio</p>
                      </div>
                    </div>
                    <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10">
                      Optimized
                    </span>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Sector Density</p>
                      <div className="flex flex-wrap gap-2.5">
                        {loc.relevantIndustries.map(ind => (
                          <span key={ind} className="px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-black rounded-full border border-slate-100">{ind}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Strategic Clusters</p>
                      <div className="flex flex-wrap gap-2.5">
                        {loc.businessClusters.map(cl => (
                          <span key={cl} className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full border border-indigo-100">{cl}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-12 py-5 bg-slate-900 text-white font-black text-[10px] tracking-widest uppercase rounded-[1.5rem] hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                    Launch Interactive Map
                    <Globe size={18} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'opportunity' && (
            <motion.div
              key="opportunity"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {opportunities.length > 0 ? opportunities.map(opp => (
                <div key={opp.id} className="glass-card glass-card-hover p-12 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[6rem] -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <h3 className="text-3xl font-black text-slate-900 pr-16 leading-tight tracking-tighter">{opp.title}</h3>
                      {opp.verified && (
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                          <ShieldCheck size={28} />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-8 mb-12">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Capex</p>
                        <p className={`text-sm font-black tracking-widest uppercase ${
                          opp.investmentLevel === 'Low' ? 'text-emerald-600' : opp.investmentLevel === 'Medium' ? 'text-amber-600' : 'text-primary-dark'
                        }`}>{opp.investmentLevel}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Friction</p>
                        <p className={`text-sm font-black tracking-widest uppercase ${
                          opp.competitionLevel === 'Low' ? 'text-emerald-600' : opp.competitionLevel === 'Medium' ? 'text-amber-600' : 'text-primary-dark'
                        }`}>{opp.competitionLevel}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Maturity</p>
                        <p className="text-sm font-black text-slate-700 tracking-widest uppercase">{opp.complexity}</p>
                      </div>
                    </div>

                    <div className="space-y-6 mb-12">
                      {[
                        { label: 'Scale Potential', val: opp.scalability },
                        { label: 'Demand Index', val: opp.demandIndicator },
                        { label: 'Digital Readiness', val: opp.digitalReadiness },
                      ].map((m, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                            <span className="text-[10px] font-black text-primary">{m.val}/10</span>
                          </div>
                          <div className="h-2 bg-slate-50 rounded-2xl overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${m.val * 10}%` }}
                              transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                              className="h-full bg-primary rounded-2xl shadow-lg shadow-primary/20" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-5 bg-primary text-white font-black text-[10px] tracking-widest uppercase rounded-[1.5rem] shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                      Acquire Blueprint
                      <Zap size={20} className="animate-pulse" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-32 glass-card rounded-[2.5rem]">
                   <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-6">
                      <AlertCircle size={40} />
                   </div>
                   <p className="text-sm text-slate-500 font-black uppercase tracking-[0.2em]">Zero strategic matches found</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {trends.length > 0 ? trends.map(trend => (
                <div key={trend.id} className="glass-card glass-card-hover p-10 rounded-[2.5rem] flex flex-col md:flex-row md:items-center gap-10">
                  <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 bg-emerald-500/5 text-emerald-500 rounded-[2.5rem] border border-emerald-500/10 shadow-inner">
                    <TrendingUp size={40} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest">{trend.category}</span>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">+{trend.growthPercentage}% Velocity</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{trend.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-3xl">{trend.description}</p>
                  </div>
                  <div className="flex-shrink-0 md:text-right min-w-[140px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Momentum</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{trend.demandLevel}</p>
                    <div className="mt-4 flex flex-col md:items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Analyzed</span>
                      <span className="text-[10px] font-bold text-slate-900">{trend.lastAnalysis}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-32 glass-card rounded-[2.5rem]">
                   <p className="text-sm text-slate-500 font-black uppercase tracking-[0.2em]">Observing market signals...</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'manufacturers' && (
            <motion.div
              key="manufacturers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {manufacturers.length > 0 ? manufacturers.map(mfg => (
                <div key={mfg.id} className="glass-card glass-card-hover p-8 rounded-[2rem] group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/10 transition-all shadow-inner">
                      <Factory size={28} />
                    </div>
                    {mfg.verificationStatus === 'Verified' && (
                      <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-full flex items-center gap-2 border border-emerald-500/20">
                        <ShieldCheck size={14} /> Verified
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors tracking-tight">{mfg.name}</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{mfg.industriesServed.join(' • ')}</p>
                  
                  <div className="space-y-4 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">Inventory MOQ</span>
                      <span className="text-slate-900">{mfg.moq}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">Lead Cycle</span>
                      <span className="text-slate-900">{mfg.leadTime}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-emerald-500/[0.03] p-4 rounded-2xl border border-emerald-500/10 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">SLA Score</p>
                      <p className="text-xl font-black text-emerald-600">{mfg.qualityMetric}%</p>
                    </div>
                    <div className="bg-primary/[0.03] p-4 rounded-2xl border border-primary/10 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Response</p>
                      <p className="text-xl font-black text-primary">{mfg.responseMetric}%</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-white text-slate-900 font-black text-[10px] tracking-widest uppercase rounded-2xl border border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                    Access Catalog
                  </button>
                </div>
              )) : (
                <div className="col-span-3 text-center py-32 glass-card rounded-[2.5rem]">
                   <p className="text-sm text-slate-500 font-black uppercase tracking-[0.2em]">Searching manufacturing layer...</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <div className="bg-slate-900 rounded-3xl p-16 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-2xl blur-[120px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-2xl blur-[100px] -ml-32 -mb-32" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-20 h-20 bg-primary rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center group overflow-hidden">
                      <Zap size={36} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter">AI Synthesis <span className="text-primary">Engine</span></h2>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Version 5.0 Active</p>
                    </div>
                  </div>
                  <p className="text-slate-400 font-medium text-xl leading-relaxed mb-16 max-w-2xl">
                    Hyper-personalized strategic recommendations synthesized from real-time macro indicators and proprietary ecosystem data.
                  </p>
                  
                  <div className="space-y-6">
                    {RECOMMENDATIONS.map(rec => (
                      <div key={rec.id} className="bg-white shadow-xl shadow-slate-200/50/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-white/20 transition-all group cursor-pointer active:scale-[0.99]">
                        <div className="flex items-start gap-8">
                          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                            <Lightbulb size={28} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                              <h3 className="text-2xl font-black group-hover:text-primary transition-colors tracking-tight">{rec.title}</h3>
                              <span className="inline-flex px-4 py-1.5 bg-primary/20 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20 backdrop-blur-sm">
                                {Math.round(rec.confidence * 100)}% Accuracy Index
                              </span>
                            </div>
                            <p className="text-lg text-slate-500 leading-relaxed mb-8 font-medium">{rec.reason}</p>
                            <button className="text-primary font-black text-[10px] tracking-widest uppercase flex items-center gap-2 group/btn">
                              Execute Recommendation <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Active Data Nodes', val: '1.2B+', icon: Database },
                  { label: 'Model Integrity', val: 'Verified', icon: History },
                  { label: 'Decision Threshold', val: '85%', icon: ShieldCheck },
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 mb-6 border border-slate-100 shadow-inner">
                      <stat.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Meta-Actions */}
      <div className="fixed bottom-12 right-12 flex flex-col gap-4 z-[100]">
        <button className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/10 group">
          <Layers size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
        <button className="w-16 h-16 bg-primary text-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group">
          <Zap size={24} className="animate-pulse group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
