import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe2, 
  Ship, 
  Plane, 
  FileText, 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  Users, 
  Building2, 
  PackageSearch,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Factory
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function GlobalDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error } = useToast();
  const [loading, setLoading] = useState(false); // set true if fetching

  // Mock data for dashboard
  const stats = [
    { label: 'Active Import Projects', value: 2, icon: Ship, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Export Projects', value: 1, icon: Plane, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Global Suppliers', value: 4, icon: PackageSearch, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'International Buyers', value: 3, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  const iecStatus = {
    status: 'Active',
    number: '03140XXXXX',
    expiry: 'Lifetime',
  };

  const shippingStatus = [
    { id: '1', type: 'Import', origin: 'Shenzhen, CN', destination: 'Mumbai, IN', status: 'In Transit', ETA: '12 Aug 2026', vessel: 'MSC Isabella' },
    { id: '2', type: 'Export', origin: 'Chennai, IN', destination: 'Dubai, UAE', status: 'Customs Cleared', ETA: '15 Aug 2026', vessel: 'Maersk Mc-Kinney' }
  ];

  const currencyRates = [
    { pair: 'USD/INR', rate: '83.45', trend: '+0.12%', up: true },
    { pair: 'EUR/INR', rate: '91.20', trend: '-0.05%', up: false },
    { pair: 'AED/INR', rate: '22.72', trend: '+0.01%', up: true },
  ];

  const countryOpportunities = [
    { country: 'UAE (Dubai)', sector: 'FMCG & Tech', match: '95%', icon: Building2 },
    { country: 'Vietnam', sector: 'Textiles & Manufacturing', match: '88%', icon: Factory },
    { country: 'USA', sector: 'IT Services & SaaS', match: '82%', icon: Briefcase },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center">
          <Globe2 className="w-8 h-8 mr-3 text-indigo-600" />
          Global Expansion Dashboard
        </h1>
        <p className="text-slate-500 mt-2">Manage your international trade, global suppliers, and cross-border operations.</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => navigate('/global/dubai-setup')} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center">
          <Building2 className="w-4 h-4 mr-2" />
          Dubai Business Setup
        </button>
        <button onClick={() => navigate('/global/import-export')} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center">
          <Ship className="w-4 h-4 mr-2" />
          New Import/Export Project
        </button>
        <button onClick={() => navigate('/global/trade-docs')} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Trade Documents
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Projects & Shipping */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Ship className="w-5 h-5 mr-2 text-blue-500" />
                Active Shipments
              </h2>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Logistics</button>
            </div>
            <div className="divide-y divide-slate-100">
              {shippingStatus.map((ship) => (
                <div key={ship.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${ship.type === 'Import' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {ship.type}
                      </span>
                      <span className="font-bold text-slate-900">{ship.vessel}</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-2xl">{ship.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 mt-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-slate-500" /> {ship.origin}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-slate-500" /> {ship.destination}
                    </div>
                  </div>
                  <div className="mt-3 text-xs font-semibold text-slate-500">ETA: {ship.ETA}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Documents & Compliance */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-500" />
                Compliance & Documents
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-900">IEC Status</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-sm text-emerald-700 font-medium">Number: {iecStatus.number}</div>
                <div className="text-xs text-emerald-600 mt-1">Status: {iecStatus.status} (Valid: {iecStatus.expiry})</div>
              </div>
              <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-900">Customs Bonds</span>
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-sm text-amber-700 font-medium">AD Code Registration</div>
                <div className="text-xs text-amber-600 mt-1">Action Required for Nhava Sheva Port</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-8">
          
          {/* Currency Monitor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-500" />
              Live Currency Monitor
            </h2>
            <div className="space-y-4">
              {currencyRates.map((rate, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700">{rate.pair}</span>
                  <div className="text-right">
                    <div className="font-black text-slate-900">₹{rate.rate}</div>
                    <div className={`text-xs font-bold ${rate.up ? 'text-emerald-500' : 'text-primary'}`}>
                      {rate.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-colors">
              International Banking Services
            </button>
          </div>

          {/* Country Opportunities */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Globe2 className="w-5 h-5 mr-2 text-blue-500" />
              Expansion Opportunities
            </h2>
            <div className="space-y-4">
              {countryOpportunities.map((opp, idx) => {
                const Icon = opp.icon || Globe2;
                return (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{opp.country}</span>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{opp.match} Match</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Icon className="w-3 h-3 mr-1" /> {opp.sector}
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-bold text-slate-700 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
              Explore Global Markets
            </button>
          </div>

          {/* International Meetings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              Upcoming Meetings
            </h2>
            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500">No international meetings scheduled.</p>
              <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700">Schedule Meeting</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
