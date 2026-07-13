import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MarketplaceGridSkeleton } from '../../components/SkeletonComponent';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Package, 
  Factory, 
  Globe2, 
  TrendingUp,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';

export default function MarketplaceHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    'All', 'OEM', 'ODM', 'White Label', 'Private Label', 
    'Contract Manufacturing', 'Raw Materials', 'Packaging', 
    'Industrial Equipment', 'Import', 'Export'
  ];

  const manufacturers = [
    {
      id: '1',
      name: 'Apex Manufacturing Tech',
      type: 'OEM & White Label',
      category: 'Electronics',
      location: 'Pune, Maharashtra',
      rating: 4.9,
      reviews: 124,
      verified: true,
      minOrder: '500 Units',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
      description: 'Specialized in consumer electronics OEM. High-end PCB assembly and plastic molding.'
    },
    {
      id: '2',
      name: 'Global Pack Solutions',
      type: 'Packaging',
      category: 'Packaging',
      location: 'Ahmedabad, Gujarat',
      rating: 4.8,
      reviews: 89,
      verified: true,
      minOrder: '5000 Units',
      image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80',
      description: 'Eco-friendly and custom branded packaging solutions for FMCG and retail.'
    },
    {
      id: '3',
      name: 'Naturals Private Label',
      type: 'Private Label',
      category: 'Cosmetics',
      location: 'Baddi, Himachal Pradesh',
      rating: 4.7,
      reviews: 210,
      verified: true,
      minOrder: '1000 Units',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80',
      description: 'Organic skincare and cosmetic products ready for your brand label. GMP Certified.'
    },
    {
      id: '4',
      name: 'SteelForge Industrial',
      type: 'Contract Manufacturing',
      category: 'Automotive',
      location: 'Chennai, Tamil Nadu',
      rating: 4.9,
      reviews: 156,
      verified: true,
      minOrder: '100 Units',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
      description: 'Precision CNC machining and forging for automotive parts and industrial equipment.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-50"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Network</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-tight">
            Premium <span className="text-primary-dark">Manufacturer</span> Network
          </h1>
          
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Discover verified OEM, White Label, and Contract Manufacturing partners for your business. India's largest trusted ecosystem.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search manufacturers, products, or services..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-colors shrink-0">
              Search
            </button>
          </div>
          
          <div className="pt-4">
             <button 
                onClick={() => navigate('/marketplace/register')}
                className="text-sm font-bold text-slate-400 hover:text-white transition-colors underline underline-offset-4"
              >
                Are you a manufacturer? Apply to join the network.
             </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all \${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats/Trust Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Verified Partners', value: '5,000+', icon: BadgeCheck, color: 'text-emerald-500' },
          { label: 'Quality Inspected', value: '100%', icon: ShieldCheck, color: 'text-blue-500' },
          { label: 'Categories', value: '45+', icon: Package, color: 'text-indigo-500' },
          { label: 'Global Reach', value: '12 Countries', icon: Globe2, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center">
            <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mr-4 \${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Grid */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 font-display">Featured Manufacturers</h2>
        <button className="flex items-center text-sm font-bold text-slate-600 hover:text-slate-900">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </button>
      </div>

      {loading ? <MarketplaceGridSkeleton /> : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {manufacturers.map((mfg, idx) => (
          <motion.div 
            key={mfg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group cursor-pointer flex flex-col"
            onClick={() => navigate(`/marketplace/manufacturer/\${mfg.id}`)}
          >
            <div className="h-48 relative overflow-hidden bg-slate-100">
              <img src={mfg.image} alt={mfg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-2xl flex items-center shadow-sm">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                <span className="text-xs font-bold text-slate-900">{mfg.rating}</span>
                <span className="text-xs text-slate-500 ml-1">({mfg.reviews})</span>
              </div>
              {mfg.verified && (
                <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-2xl flex items-center shadow-sm">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{mfg.type}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{mfg.name}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-1">{mfg.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                  {mfg.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Package className="w-4 h-4 mr-2 text-slate-500" />
                  Min Order: <span className="font-bold text-slate-900 ml-1">{mfg.minOrder}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{mfg.category}</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      
      </div>
      )}
    </div>
  );
}
