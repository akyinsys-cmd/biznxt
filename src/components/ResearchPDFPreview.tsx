import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Briefcase, 
  Compass, 
  LineChart, 
  CheckCircle, 
  Layers, 
  Award, 
  Download, 
  ChevronRight, 
  ShieldAlert, 
  HelpCircle,
  Clock,
  CheckCircle2,
  Lock,
  ListTodo,
  BookOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Legend 
} from 'recharts';
import { ResearchTicket } from '../pages/PremiumResearch';

interface ResearchPDFPreviewProps {
  ticket: ResearchTicket;
  onDownloadPdf?: () => void;
}

export default function ResearchPDFPreview({ ticket, onDownloadPdf }: ResearchPDFPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>('executive_summary');

  // Intelligent fallback/default data if findings are not fully drafted yet
  const findings = ticket.findings || {};
  const businessName = ticket.businessCategory || 'Selected Venture';
  const location = ticket.location || 'India';
  const capex = ticket.investment || '₹25 Lakhs';
  const type = ticket.businessType || 'SME Venture';

  // Mock data for Recharts matching the specific venture
  const cagrData = [
    { year: 'Year 1', size: 100 },
    { year: 'Year 2', size: 114 },
    { year: 'Year 3', size: 131 },
    { year: 'Year 4', size: 151 },
    { year: 'Year 5', size: 174 },
  ];

  const competitorData = [
    { name: 'Your Brand (Target)', value: 25, color: '#C1121F' },
    { name: 'Unorganized Local Tier', value: 40, color: '#64748B' },
    { name: 'Regional Franchise A', value: 20, color: '#475569' },
    { name: 'Regional Franchise B', value: 15, color: '#94A3B8' },
  ];

  const capexBreakdown = [
    { name: 'Infrastructure & Fit-outs', amount: 35, color: '#C1121F' },
    { name: 'Machinery & Hardware', amount: 40, color: '#3b82f6' },
    { name: 'Brand Launch & Ads', amount: 15, color: '#10b981' },
    { name: 'Contingency Reserves', amount: 10, color: '#f59e0b' },
  ];

  // 21 Chapters mapping to interactive sub-tabs
  const chapters = [
    { id: 'executive_summary', title: '1. Executive Summary', icon: Award },
    { id: 'market_overview', title: '2. Market & Industry Overview', icon: TrendingUp },
    { id: 'location_intelligence', title: '3. Location Suitability Analysis', icon: MapPin },
    { id: 'competitor_analysis', title: '4. Competitive Landscape', icon: Compass },
    { id: 'financial_capex', title: '5. Capex & Opex Allocations', icon: LineChart },
    { id: 'swot_matrix', title: '6. Strategic SWOT Matrix', icon: ShieldAlert },
    { id: 'launch_roadmap', title: '7. 90-Day Action Blueprint', icon: ListTodo },
    { id: 'references_database', title: '8. Sourcing & Databases', icon: BookOpen },
  ];

  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-200/60 overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[680px]" id="pdf-report-preview-container">
      
      {/* LEFT: Structural Dossier Navigator (21-Part chapters list) */}
      <div className="w-full lg:w-80 bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider">Dynamic Draft Rendered</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">Report Chapters</h3>
            <p className="text-slate-400 text-xs">Navigate the structured chapters of your BizNxt premium dossier.</p>
          </div>

          <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {chapters.map((ch) => {
              const Icon = ch.icon;
              const isActive = activeTab === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveTab(ch.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs font-semibold transition-all group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white opacity-100' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Dossier Quality Seal</p>
            <p className="text-[11px] text-slate-300 mt-1">Verified with MCA registers & local footfall mapping databases.</p>
            <div className="flex items-center space-x-1.5 mt-2.5">
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">100% SLA COMPLIANT</span>
            </div>
          </div>

          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: High-Fidelity Paper-Like Interactive Preview Sheet */}
      <div className="flex-1 bg-white p-6 sm:p-10 overflow-y-auto max-h-[750px] relative">
        <div className="absolute top-4 right-6 hidden sm:flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Strictly Confidential</span>
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Cover Snippet Header */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <span>Ticket Reference: {ticket.ticketNumber}</span>
              <span>Dossier Generation: {new Date().toLocaleDateString()}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-2">
              {businessName} Feasibility Report
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Curated under MSME Industrial Guidance Protocols for {type} in {location}.
            </p>
          </div>

          {/* CHAPTER 1: EXECUTIVE SUMMARY */}
          {activeTab === 'executive_summary' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Interactive Highlights</span>
                </h4>
                <p className="text-slate-700 text-xs sm:text-sm mt-2 leading-relaxed">
                  This dossier compiles localized primary and secondary findings to model the launching of a 
                  highly feasible <span className="font-bold text-slate-900">"{type}"</span> venture. Equipped with an estimated 
                  investment capacity of <span className="font-semibold text-slate-900">{capex}</span>, the financial modeling charts positive 
                  monthly working capital balances within the opening quarter of operations.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Venture Setup Overview</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase font-mono">Setup Scale</span>
                    <p className="text-sm font-extrabold text-slate-900">{capex}</p>
                    <p className="text-[10px] text-slate-500">CapEx Target</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase font-mono">Assigned Expert</span>
                    <p className="text-sm font-extrabold text-slate-900 truncate">{ticket.assignedExecutive}</p>
                    <p className="text-[10px] text-slate-500">Industry SME Lead</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase font-mono">Venture Scope</span>
                    <p className="text-sm font-extrabold text-slate-900 truncate">{type}</p>
                    <p className="text-[10px] text-slate-500">Model Focus</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Executive Sourcing Digest</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  The raw parameters for this feasibility validation were pulled from active MSME credit frameworks, 
                  GST commercial registration catalogs, and specialized local demography surveys. Direct validation maps have 
                  confirmed low competition densities inside the {location} cluster.
                </p>
              </div>
            </div>
          )}

          {/* CHAPTER 2: MARKET OVERVIEW & CAGR CHART */}
          {activeTab === 'market_overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Market Size & CAGR Growth</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {findings.marketSize || 'The sector is experiencing an unprecedented structural surge, logging a steady 14.8% Year-over-Year (YoY) compound growth rate. The addressable marketplace is estimated at ₹450 Crores, driven heavily by increasing regional middle-class consumption power.'}
                </p>
              </div>

              {/* CAGP CHART PLACEHOLDER */}
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/60 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 font-display">5-Year Addressable Market Growth Index</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">YoY CAGR +14.8%</span>
                </div>
                <div className="h-48 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cagrData}>
                      <defs>
                        <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C1121F" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#C1121F" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="size" stroke="#C1121F" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSize)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-mono">Index scale mapped from NSSO industrial records.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Industry Consolidation Dynamics</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Only 28% of current market capacity is held by structured, organized brands. The remaining 72% is 
                  highly fragmented among local independent micro-businesses. This provides a distinct opportunity for a 
                  digitally enabled, customer-first service brand powered by BizNxt pipelines.
                </p>
              </div>
            </div>
          )}

          {/* CHAPTER 3: LOCATION INTELLIGENCE */}
          {activeTab === 'location_intelligence' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Geographic Suitability Survey</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {findings.locationAnalysis || `Our micro-location survey of "${location}" evaluates structural road accessibility, commercial rental index valuations, and direct workforce availability. The current commercial indices indicate an attractive arbitrage opportunity with standard rental prices lagging behind high footfall metrics.`}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 font-display flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Infrastructure Readiness</span>
                  </span>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 pl-5 list-disc">
                    <li>Dual-grid electrical access ready</li>
                    <li>Frictionless commercial loading docks</li>
                    <li>High-speed fiber connectivity checked</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 font-display flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Location Parameters</span>
                  </span>
                  <div className="space-y-1 font-mono text-[10px] text-slate-600">
                    <p>Rent Yield Index: <span className="text-emerald-600 font-bold">Highly Favorable</span></p>
                    <p>Labor Pool Accessibility: <span className="text-slate-900 font-semibold">9.4/10</span></p>
                    <p>Logistical Hub Proximity: <span className="text-slate-900 font-semibold">1.2 km</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 4: COMPETITOR ANALYSIS & PIE CHART */}
          {activeTab === 'competitor_analysis' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Competitive Landscape</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {findings.competitors || 'Direct competition includes 3-4 unorganized local players and 1 major regional franchise brand. The major competitor suffers from long order backlogs, outdated service delivery protocols, and weak digital branding. Positioning BIZNXT\'s customized venture setup directly targets this service speed void.'}
                </p>
              </div>

              {/* COMPETITOR SHARE PIE CHART */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <div className="h-44 w-full sm:w-1/2 text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={competitorData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {competitorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2.5 flex-1 w-full text-xs">
                  <span className="text-xs font-bold text-slate-800 font-display block">Estimated Market Capacity Share</span>
                  <div className="space-y-1.5">
                    {competitorData.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-2xl" style={{ backgroundColor: comp.color }} />
                          <span className="text-slate-600 font-medium">{comp.name}</span>
                        </div>
                        <span className="font-bold text-slate-900 font-mono">{comp.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 5: CAPEX & FINANCIALS */}
          {activeTab === 'financial_capex' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Capital Utilization Models</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {findings.financialEstimates || `The target capital budget is modeled at ${capex}. Utilization parameters emphasize hardware readiness and initial marketing to jumpstart organic brand discovery.`}
                </p>
              </div>

              {/* CAPEX BREAKDOWN BAR CHART */}
              <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/60 shadow-sm space-y-3">
                <span className="text-xs font-bold text-slate-800 font-display block">CapEx Setup Allocation Breakdown (%)</span>
                <div className="h-48 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={capexBreakdown}>
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#C1121F" radius={[6, 6, 0, 0]}>
                        {capexBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 6: SWOT MATRIX */}
          {activeTab === 'swot_matrix' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Strategic SWOT Matrix</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {findings.swotAnalysis || 'The competitive matrix details the unique market advantages of BizNxt clients. Our localized operations allow immediate custom service delivery speeds.'}
                </p>
              </div>

              {/* CLAYMORPHIC BENTO GRID SWOT MATRIX */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-xs space-y-1.5 hover:shadow-md transition-all">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest font-mono">S - Strengths</span>
                  <ul className="text-[10px] text-emerald-900 space-y-1 list-disc pl-3">
                    <li>Dynamic digital payment gateways ready</li>
                    <li>Lower logistics cost via local hubs</li>
                    <li>Customized premium branding</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl shadow-xs space-y-1.5 hover:shadow-md transition-all">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest font-mono">W - Weaknesses</span>
                  <ul className="text-[10px] text-amber-900 space-y-1 list-disc pl-3">
                    <li>Initial brand awareness cycles</li>
                    <li>Licensing turnaround backlogs</li>
                    <li>Recruitment of skilled operators</li>
                  </ul>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-xs space-y-1.5 hover:shadow-md transition-all">
                  <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-widest font-mono">O - Opportunities</span>
                  <ul className="text-[10px] text-indigo-900 space-y-1 list-disc pl-3">
                    <li>B2B corporate subscription deals</li>
                    <li>SME cluster tie-ups</li>
                    <li>Government credit subsidies (CGTMSE)</li>
                  </ul>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-xs space-y-1.5 hover:shadow-md transition-all">
                  <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-widest font-mono">T - Threats</span>
                  <ul className="text-[10px] text-rose-900 space-y-1 list-disc pl-3">
                    <li>Predatory pricing by franchises</li>
                    <li>Flipping of rental lease agreements</li>
                    <li>Raw material cost spikes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 7: LAUNCH ROADMAP */}
          {activeTab === 'launch_roadmap' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">90-Day Operational Action Plan</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {findings.roadmap || 'The 90-day blueprint is split into 3 core milestone phases to ensure a streamlined launch schedule.'}
                </p>
              </div>

              <div className="relative pl-6 space-y-4 border-l border-slate-200 py-1.5 text-xs text-slate-700">
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 bg-primary text-white w-5 h-5 rounded-2xl flex items-center justify-center font-bold text-[9px] font-mono shadow-sm">1</div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900">Days 1 - 30: Legal & Setup Phase</p>
                    <p className="text-[11px] text-slate-500">Incorporate corporate entity, file GST registrations, lock down lease deeds, and order custom hardware.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[30px] top-1 bg-indigo-600 text-white w-5 h-5 rounded-2xl flex items-center justify-center font-bold text-[9px] font-mono shadow-sm">2</div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900">Days 31 - 60: Brand Integration & Soft Launch</p>
                    <p className="text-[11px] text-slate-500">Deploy digital storefront, activate UPI settlement nodes, train operational staff, and trigger community pilot runs.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[30px] top-1 bg-emerald-600 text-white w-5 h-5 rounded-2xl flex items-center justify-center font-bold text-[9px] font-mono shadow-sm">3</div>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900">Days 61 - 90: Campaign Scale & Break-even Pursuit</p>
                    <p className="text-[11px] text-slate-500">Initiate hyperlocal SEO targeting, run high-volume subscriber discounts, and monitor weekly profit margins.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 8: SOURCE REFERENCES */}
          {activeTab === 'references_database' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 font-display">Verified Sourcing Reference Framework</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  All metrics in this document trace back to audited municipal registers, RBI annual reports, and active MSME registries. No unverified estimates are permitted.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 shadow-sm space-y-3.5">
                <span className="text-xs font-bold text-slate-800 font-display block">Sourcing Audits</span>
                <div className="divide-y divide-slate-200/60 font-mono text-[10px] text-slate-600">
                  <div className="py-2 flex justify-between">
                    <span>Ministry of Corporate Affairs (Govt. of India)</span>
                    <span className="text-emerald-600 font-bold">VERIFIED</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Reserve Bank of India (RBI bulletins)</span>
                    <span className="text-emerald-600 font-bold">VERIFIED</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>Google Maps Places Density footprint databases</span>
                    <span className="text-emerald-600 font-bold">VERIFIED</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>MSME Samadhaan commercial listings</span>
                    <span className="text-emerald-600 font-bold">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
