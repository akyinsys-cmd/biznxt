import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe2, 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function ManufacturerRegistration() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    gstNumber: '',
    panNumber: '',
    factoryAddress: '',
    officeAddress: '',
    googleMapsLink: '',
    website: '',
    email: '',
    phone: '',
    whatsapp: '',
    companyType: 'OEM',
    primaryCategory: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      error("Please login to submit an application.");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'manufacturer_applications'), {
        ...formData,
        userId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      success("Application submitted successfully. Our team will verify your details.");
      navigate('/marketplace');
    } catch (err: any) {
      console.error(err);
      error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 text-primary mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight mb-4">
          Join the Verified Network
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Apply to become a verified manufacturer on India's premium B2B ecosystem. Reach thousands of verified buyers looking for OEM, ODM, and White Label partners.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row border-b border-slate-200 bg-slate-50 p-6 sm:p-8 items-center justify-between">
           <div>
             <h2 className="text-xl font-bold text-slate-900">Application Form</h2>
             <p className="text-sm text-slate-500 mt-1">Please provide accurate business details for verification.</p>
           </div>
           <div className="mt-4 md:mt-0 flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
             <CheckCircle2 className="w-4 h-4 mr-2" /> 100% Secure & Confidential
           </div>
        </div>

         <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Business Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-slate-500" />
              Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Legal Name</label>
                <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="e.g. Apex Manufacturing Pvt Ltd" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">GST Number</label>
                <input required type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="22AAAAA0000A1Z5" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">PAN Number</label>
                <input required type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="ABCDE1234F" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Business Type</label>
                <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary">
                  <option value="OEM">OEM Manufacturer</option>
                  <option value="ODM">ODM Manufacturer</option>
                  <option value="White Label">White Label Supplier</option>
                  <option value="Contract Manufacturing">Contract Manufacturer</option>
                  <option value="Raw Materials">Raw Material Supplier</option>
                  <option value="Packaging">Packaging Partner</option>
                  <option value="Import">Import Partner</option>
                  <option value="Export">Export Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Category</label>
                <input required type="text" name="primaryCategory" value={formData.primaryCategory} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="e.g. Electronics, Cosmetics, FMCG" />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Location Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-slate-500" />
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Factory Address</label>
                <textarea required name="factoryAddress" value={formData.factoryAddress} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary h-24" placeholder="Complete address of the manufacturing unit..."></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Registered Office Address (if different)</label>
                <textarea name="officeAddress" value={formData.officeAddress} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary h-24" placeholder="Complete office address..."></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Factory Google Maps Link</label>
                <input type="url" name="googleMapsLink" value={formData.googleMapsLink} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-slate-500" />
              Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Website</label>
                <div className="relative">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full pl-10 p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="https://www.example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="sales@company.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number for Business</label>
                <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-start">
            <ShieldCheck className="w-6 h-6 text-primary mr-4 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Verification Process</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upon submission, our verification team will review your details, GST status, and physical location. This process typically takes 48-72 hours. You will be notified via email once approved.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70 flex items-center"
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Submit Application
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
