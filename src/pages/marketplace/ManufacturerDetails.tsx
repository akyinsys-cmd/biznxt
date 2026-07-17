import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Globe2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Package,
  ArrowLeft,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function ManufacturerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration purposes as we don't have a populated db yet
  const manufacturer = {
    id: id,
    name: 'Apex Manufacturing Tech',
    type: 'OEM & White Label',
    category: 'Electronics',
    location: 'Pune, Maharashtra',
    rating: 4.9,
    reviews: 124,
    verified: true,
    minOrder: '500 Units',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    description: 'Specialized in consumer electronics OEM. High-end PCB assembly and plastic molding. We have over 15 years of experience in creating top-tier consumer electronics for global brands. Our facility is ISO 9001 certified and we maintain rigorous quality control standards.',
    established: '2008',
    certifications: ['ISO 9001:2015', 'CE', 'RoHS', 'GMP'],
    capabilities: [
      'PCB Design & Assembly',
      'Injection Molding',
      'Final Assembly & Testing',
      'Custom Packaging',
      'White Label Branding'
    ],
    contact: {
      website: 'www.apex-mfg.example.com',
      email: 'contact@apex-mfg.example.com',
      phone: '+91 98765 43210'
    }
  };

  useEffect(() => {
    // In a real app, fetch from Firestore
    // const docRef = doc(db, 'manufacturers', id);
    // ...
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    success("Contact request sent. The manufacturer will reach out to you shortly.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-2xl animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </button>

      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="h-64 sm:h-80 relative">
          <img src={manufacturer.image} alt={manufacturer.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  {manufacturer.type}
                </span>
                {manufacturer.verified && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
                {manufacturer.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shrink-0">
              <div className="text-center">
                <div className="flex items-center justify-center text-amber-400 font-bold text-lg">
                  {manufacturer.rating} <Star className="w-4 h-4 ml-1 fill-amber-400" />
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{manufacturer.reviews} Reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">About the Manufacturer</h2>
              <p className="text-slate-600 leading-relaxed">
                {manufacturer.description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Production Capabilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {manufacturer.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                    {cap}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Certifications & Compliance</h2>
              <div className="flex flex-wrap gap-2">
                {manufacturer.certifications.map((cert, i) => (
                  <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold border border-slate-200">
                    {cert}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Quick Overview</h3>
              
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-5 h-5 mr-3 text-slate-500 shrink-0" />
                <span>{manufacturer.location}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Building2 className="w-5 h-5 mr-3 text-slate-500 shrink-0" />
                <span>Established in {manufacturer.established}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Package className="w-5 h-5 mr-3 text-slate-500 shrink-0" />
                <span>Min Order: <strong className="text-slate-900">{manufacturer.minOrder}</strong></span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 space-y-4">
              <h3 className="font-bold text-blue-900 uppercase tracking-wider text-xs">Contact Details</h3>
              
              <div className="flex items-center text-sm text-blue-800">
                <Globe2 className="w-4 h-4 mr-3 shrink-0" />
                <a href={`https://${manufacturer.contact.website}`} target="_blank" rel="noreferrer" className="hover:underline truncate">{manufacturer.contact.website}</a>
              </div>
              <div className="flex items-center text-sm text-slate-800">
                <Mail className="w-4 h-4 mr-3 shrink-0" />
                <a href={`mailto:${manufacturer.contact.email}`} className="hover:underline truncate">{manufacturer.contact.email}</a>
              </div>
              <div className="flex items-center text-sm text-slate-800">
                <Phone className="w-4 h-4 mr-3 shrink-0" />
                <span>{manufacturer.contact.phone}</span>
              </div>
            </div>

            <button 
              onClick={handleContact}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Manufacturer
            </button>
            
            <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">
              <FileText className="w-5 h-5 mr-2 text-slate-500" />
              Request Quote / Catalog
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
