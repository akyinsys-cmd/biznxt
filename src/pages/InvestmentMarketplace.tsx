import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Briefcase, 
  Target, 
  Building2, 
  Users2, 
  FileText, 
  Calculator, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  Plus,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Building,
  Handshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INVESTORS, 
  STARTUPS, 
  BUSINESSES_FOR_SALE, 
  FRANCHISES, 
  PARTNERSHIPS 
} from '../data/investmentData';
import { 
  Investor, 
  StartupProfile, 
  BusinessForSale, 
  FranchiseListing, 
  PartnershipOpportunity 
} from '../types/investment';

type ActiveTab = 'market' | 'investors' | 'startups' | 'valuation' | 'pitchdeck' | 'franchise' | 'partnership';

export default function InvestmentMarketplace() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('market');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = ['All', 'SaaS', 'Fintech', 'AI', 'Manufacturing', 'AgriTech', 'Logistics', 'Health-AI', 'F&B'];

  const filteredInvestors = useMemo(() => {
    return INVESTORS.filter(inv => 
      (selectedIndustry === 'All' || inv.industries.includes(selectedIndustry)) &&
      (inv.name.toLowerCase().includes(searchQuery.toLowerCase()) || inv.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, selectedIndustry]);

  const filteredStartups = useMemo(() => {
    return STARTUPS.filter(start => 
      (selectedIndustry === 'All' || start.industry === selectedIndustry) &&
      start.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, selectedIndustry]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-2xl text-primary">
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm font-bold text-primary tracking-tight uppercase">Capital Hub</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Investment Ecosystem
              </h1>
              <p className="text-slate-500 max-w-xl text-lg font-medium leading-relaxed">
                India's premier digital marketplace to raise funds, acquire businesses, and find strategic partners.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                <Plus size={18} />
                List Opportunity
              </button>
              <button className="px-6 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                Pitch Deck Center
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { label: 'Total Invested', value: '₹450 Cr+', icon: TrendingUp, color: 'text-emerald-600' },
              { label: 'Active Investors', value: '1,200+', icon: Users2, color: 'text-blue-600' },
              { label: 'Businesses for Sale', value: '340+', icon: Building2, color: 'text-amber-600' },
              { label: 'Success Rate', value: '92%', icon: ShieldCheck, color: 'text-indigo-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-2xl bg-white shadow-sm ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-lg font-extrabold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 overflow-x-auto">
          <div className="flex items-center space-x-8 min-w-max">
            {[
              { id: 'market', label: 'Marketplace', icon: Building2 },
              { id: 'investors', label: 'Investors', icon: Users2 },
              { id: 'startups', label: 'Startups', icon: Target },
              { id: 'franchise', label: 'Franchise', icon: Building },
              { id: 'partnership', label: 'Partnership', icon: Handshake },
              { id: 'valuation', label: 'Valuation', icon: Calculator },
              { id: 'pitchdeck', label: 'Pitch Decks', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`py-6 text-sm font-bold transition-all relative flex items-center gap-2 ${
                  activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold text-slate-700 cursor-pointer min-w-[180px]"
              >
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <ShieldCheck size={18} />
              Verified Only
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'market' && (
            <motion.div
              key="market-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Featured Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-900">Businesses For Sale</h2>
                    <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                      View all <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {BUSINESSES_FOR_SALE.map(biz => (
                      <div key={biz.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                        <div className="h-48 relative">
                          <img src={biz.photos[0]} alt={biz.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-2xl text-[10px] font-black text-primary uppercase tracking-wider">
                            Manufacturing
                          </div>
                          {biz.isVerified && (
                            <div className="absolute bottom-4 left-4 p-2 bg-emerald-500 rounded-2xl text-white shadow-lg">
                              <ShieldCheck size={14} />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{biz.name}</h3>
                            <span className="text-primary font-black text-lg">₹{(biz.price / 10000000).toFixed(1)} Cr</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                            <Building size={12} /> {biz.location} • {biz.businessAge} years old
                          </p>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-3 rounded-2xl">
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Revenue</p>
                              <p className="text-sm font-bold text-slate-700">₹{(biz.revenue / 10000000).toFixed(1)} Cr/yr</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl">
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Profit</p>
                              <p className="text-sm font-bold text-emerald-600">₹{(biz.profit / 10000000).toFixed(1)} Cr/yr</p>
                            </div>
                          </div>
                          <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                            Contact Seller
                            <ArrowUpRight size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-2xl blur-3xl" />
                    <h3 className="text-xl font-black mb-2">Free Valuation</h3>
                    <p className="text-white/80 text-sm mb-6 leading-relaxed">
                      Wondering what your business is worth? Get an instant AI-powered estimation based on real industry data.
                    </p>
                    <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-lg shadow-black/10 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                      Start Valuation
                      <Calculator size={18} />
                    </button>
                  </div>

                  <div className="bg-white rounded-[2rem] border border-slate-200 p-8">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Trending Categories</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Retail Stores', count: 124, growth: '+12%' },
                        { label: 'E-commerce Brands', count: 85, growth: '+45%' },
                        { label: 'SaaS Businesses', count: 62, growth: '+28%' },
                        { label: 'Factories', count: 42, growth: '+5%' },
                      ].map((cat, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{cat.label}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{cat.count} Listings</p>
                          </div>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-2xl">
                            {cat.growth}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'investors' && (
            <motion.div
              key="investors-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredInvestors.map(inv => (
                <div key={inv.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={inv.avatar} alt={inv.name} className="w-16 h-16 rounded-2xl object-cover" />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-extrabold text-slate-900">{inv.name}</h3>
                        {inv.isVerified && <ShieldCheck size={14} className="text-blue-500" />}
                      </div>
                      <p className="text-xs font-bold text-primary">{inv.company}</p>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{inv.type}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex flex-wrap gap-1">
                      {inv.industries.map(ind => (
                        <span key={ind} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-2xl">{ind}</span>
                      ))}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Check Size</p>
                      <p className="text-sm font-extrabold text-slate-700">₹{(inv.investmentRange.min / 10000000).toFixed(1)} Cr - ₹{(inv.investmentRange.max / 10000000).toFixed(1)} Cr</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mb-6 line-clamp-2 italic">"{inv.bio}"</p>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl text-sm hover:bg-primary/90 transition-all">
                      Connect
                    </button>
                    <button className="px-4 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'startups' && (
            <motion.div
              key="startups-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {filteredStartups.map(start => (
                <div key={start.id} className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col md:flex-row gap-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                  <div className="flex-shrink-0">
                    <img src={start.logo} alt={start.name} className="w-24 h-24 rounded-3xl object-cover bg-slate-50 p-2" />
                    <div className="mt-4 flex flex-col items-center gap-2">
                      <span className={`px-3 py-1 rounded-2xl text-[10px] font-black uppercase tracking-wider ${
                        start.fundingStage === 'Seed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {start.fundingStage}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-slate-900">{start.name}</h3>
                          {start.isVerified && <ShieldCheck size={18} className="text-emerald-500" />}
                        </div>
                        <p className="text-sm font-bold text-slate-500">{start.industry} • {start.founder}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase">Seeking</p>
                        <p className="text-xl font-black text-primary">₹{(start.investmentRequired / 10000000).toFixed(1)} Cr</p>
                        <p className="text-[10px] font-bold text-slate-500">for {start.equityOffered}% Equity</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">{start.businessModel}</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Revenue', value: start.revenueStage },
                        { label: 'Traction', value: start.traction },
                        { label: 'Valuation', value: `₹${(start.valuation / 10000000).toFixed(1)} Cr` }
                      ].map((m, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{m.label}</p>
                          <p className="text-xs font-black text-slate-700 truncate">{m.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-primary text-white font-bold rounded-2xl text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                        View Pitch Deck
                        <FileText size={16} />
                      </button>
                      <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl text-sm hover:bg-slate-800 transition-all">
                        Request Meeting
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'franchise' && (
            <motion.div
              key="franchise-tab"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {FRANCHISES.map(fran => (
                <div key={fran.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group hover:shadow-xl transition-all">
                  <div className="h-32 bg-gradient-to-r from-primary/10 to-indigo-100 relative">
                    <img src={fran.logo} alt={fran.brand} className="absolute -bottom-6 left-6 w-20 h-20 rounded-2xl object-cover bg-white p-1 border-4 border-white shadow-xl" />
                  </div>
                  <div className="p-6 pt-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black text-slate-900">{fran.brand}</h3>
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-2xl uppercase tracking-wider">{fran.industry}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">{fran.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Investment</p>
                        <p className="text-xs font-black text-slate-700">₹{(fran.investmentRange.min / 100000).toFixed(0)}-{(fran.investmentRange.max / 100000).toFixed(0)}L</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">ROI</p>
                        <p className="text-xs font-black text-emerald-600">{fran.roiMonths} Months</p>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-primary/10 text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all">
                      Apply for Franchise
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'partnership' && (
            <motion.div
              key="partnership-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {PARTNERSHIPS.map(part => (
                <div key={part.id} className="bg-white rounded-3xl border border-slate-200 p-8 flex gap-6 hover:border-primary transition-all">
                  <img src={part.postedBy.avatar} alt={part.postedBy.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{part.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-2xl">{part.type}</span>
                          <span className="text-xs text-slate-500 font-medium">Posted by {part.postedBy.name} • {part.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{part.postedAt}</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">{part.description}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {part.requirements.map((req, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-2xl border border-slate-100">
                          {req}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all">
                        Connect Now
                      </button>
                      <button className="px-8 py-3 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'valuation' && (
            <motion.div
              key="valuation-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-12"
            >
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calculator size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-3">Enterprise Valuation Engine</h2>
                <p className="text-slate-500 font-medium">Get a precise business valuation based on revenue multiples and industry benchmarks.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3">Industry Segment</label>
                    <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option>SaaS (Multiple: 6x - 12x)</option>
                      <option>Manufacturing (Multiple: 2x - 4x)</option>
                      <option>Retail (Multiple: 1.5x - 3x)</option>
                      <option>E-commerce (Multiple: 2x - 5x)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3">Annual EBITDA (₹)</label>
                    <input type="number" placeholder="e.g. 50,00,000" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3">Asset Value (₹)</label>
                    <input type="number" placeholder="e.g. 20,00,000" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Estimated Valuation</p>
                    <h3 className="text-5xl font-black text-white mb-2">₹ 4.50 Cr</h3>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <TrendingUp size={14} /> Higher than 78% of similar businesses
                    </div>
                  </div>

                  <div className="space-y-4 mt-12">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">Growth Score</span>
                      <span className="text-emerald-400">8.4 / 10</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-2xl overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[84%]" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">Risk Factor</span>
                      <span className="text-amber-400">Low</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                Generate Full Audit Report
                <ArrowUpRight size={20} />
              </button>
            </motion.div>
          )}

          {activeTab === 'pitchdeck' && (
            <motion.div
              key="pitchdeck-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">My Pitch Decks</h2>
                  <p className="text-sm text-slate-500 font-medium">Manage versions and get AI feedback on your investor presentations.</p>
                </div>
                <button className="px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center gap-2">
                  <Plus size={18} /> New Deck
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Series A Deck - V3', date: '2 days ago', score: 92, status: 'Reviewed' },
                  { title: 'Investor One-Pager', date: '1 week ago', score: 85, status: 'Draft' },
                  { title: 'Seed Round - Final', date: '1 month ago', score: 88, status: 'Sent' },
                ].map((deck, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition-all group">
                    <div className="w-full aspect-video bg-slate-100 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                      <FileText size={32} className="text-slate-400" />
                      <div className="absolute top-4 right-4 px-2 py-1 bg-white rounded-2xl text-[10px] font-black text-emerald-600 shadow-sm border border-emerald-50">
                        {deck.score}% AI Score
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{deck.title}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">{deck.date} • {deck.status}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-slate-50 text-slate-600 font-bold rounded-2xl text-xs hover:bg-slate-100 transition-all">
                        Edit
                      </button>
                      <button className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-slate-800 transition-all">
                        AI Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button for AI Assistant */}
      <button className="fixed bottom-8 right-8 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-2xl flex items-center justify-center">
          <TrendingUp size={16} />
        </div>
        <span className="pr-2 font-bold text-sm">Investment AI Assistant</span>
      </button>
    </div>
  );
}
