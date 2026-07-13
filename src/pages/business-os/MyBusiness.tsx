import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  FileCheck, 
  Plus, 
  Users, 
  Calendar,
  Save
} from 'lucide-react';
import { BusinessProfile } from './types';

interface MyBusinessProps {
  profile: BusinessProfile | null;
  onSaveProfile: (profile: BusinessProfile) => Promise<void>;
}

export function MyBusiness({ profile, onSaveProfile }: MyBusinessProps) {
  const [edited, setEdited] = useState<BusinessProfile>(
    profile || {
      ownerId: '',
      businessName: '',
      businessCategory: '',
      industry: '',
      gst: '',
      pan: '',
      msme: '',
      iec: '',
      trademarkStatus: 'Not Applied',
      employees: 1,
      office: '',
      factory: '',
      warehouse: '',
      website: '',
      socialMedia: { linkedin: '', twitter: '', instagram: '', facebook: '' },
      timeline: [],
      updatedAt: ''
    }
  );

  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field: keyof BusinessProfile, value: any) => {
    setEdited(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (key: string, value: string) => {
    setEdited(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveProfile(edited);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-4 rounded-2xl text-white">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Corporate Identity Registry</h2>
            <p className="text-xs text-slate-500">Official registrations, facilities structure, and corporate milestones ledger.</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2"
        >
          {saving ? 'Saving...' : 'Update Corporate Registry'}
          <Save className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General and Official ID Registrations */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              General & Legal Registrations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Company Registered Name</label>
                <input 
                  type="text" 
                  value={edited.businessName}
                  onChange={e => handleFieldChange('businessName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Business Category</label>
                <input 
                  type="text" 
                  value={edited.businessCategory}
                  onChange={e => handleFieldChange('businessCategory', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Industry</label>
                <input 
                  type="text" 
                  value={edited.industry}
                  onChange={e => handleFieldChange('industry', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Total Employees</label>
                <input 
                  type="number" 
                  value={edited.employees}
                  onChange={e => handleFieldChange('employees', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">GST Registration Code (GSTIN)</label>
                <input 
                  type="text" 
                  value={edited.gst}
                  onChange={e => handleFieldChange('gst', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Permanent Account Number (PAN)</label>
                <input 
                  type="text" 
                  value={edited.pan}
                  onChange={e => handleFieldChange('pan', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">MSME Udyam Number</label>
                <input 
                  type="text" 
                  value={edited.msme}
                  onChange={e => handleFieldChange('msme', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Import Export Code (IEC)</label>
                <input 
                  type="text" 
                  value={edited.iec}
                  onChange={e => handleFieldChange('iec', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Trademark Status</label>
                <select 
                  value={edited.trademarkStatus}
                  onChange={e => handleFieldChange('trademarkStatus', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Not Applied">Not Applied</option>
                  <option value="In Progress">In Progress / Filed</option>
                  <option value="Registered">Registered</option>
                  <option value="Opposed">Opposed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Infrastructure Assets */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
              <MapPin className="w-5 h-5 text-indigo-600" />
              Corporate Infrastructure & Facilities
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Registered HQ / Office Address</label>
                <input 
                  type="text" 
                  value={edited.office}
                  onChange={e => handleFieldChange('office', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Manufacturing Unit / Factory Address</label>
                <input 
                  type="text" 
                  value={edited.factory}
                  onChange={e => handleFieldChange('factory', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Logistics / Warehouse Address</label>
                <input 
                  type="text" 
                  value={edited.warehouse}
                  onChange={e => handleFieldChange('warehouse', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Online Channels */}
        <div className="space-y-6">
          {/* Online presence channels */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
              <Globe className="w-5 h-5 text-indigo-600" />
              Web & Social Channels
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Corporate Website</label>
                <input 
                  type="url" 
                  value={edited.website}
                  onChange={e => handleFieldChange('website', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">LinkedIn Page</label>
                <input 
                  type="url" 
                  value={edited.socialMedia.linkedin || ''}
                  onChange={e => handleSocialChange('linkedin', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Twitter / X</label>
                <input 
                  type="url" 
                  value={edited.socialMedia.twitter || ''}
                  onChange={e => handleSocialChange('twitter', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Instagram Business</label>
                <input 
                  type="url" 
                  value={edited.socialMedia.instagram || ''}
                  onChange={e => handleSocialChange('instagram', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 border-b border-slate-50 pb-3">
              <Calendar className="w-5 h-5 text-primary" />
              Operational Timeline
            </h3>

            {edited.timeline && edited.timeline.length > 0 ? (
              <div className="relative border-l-2 border-primary/20 ml-2 pl-4 space-y-4">
                {edited.timeline.map((item, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -left-[25px] top-1.5 bg-primary w-2.5 h-2.5 rounded-2xl border border-white"></span>
                    <span className="text-[10px] font-mono text-primary block">{item.date}</span>
                    <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                    <span className="text-[11px] text-slate-500">{item.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No organizational milestone timeline logged.</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
