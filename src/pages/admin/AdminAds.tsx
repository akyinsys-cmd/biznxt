import { useState, useEffect } from 'react';
import { DollarSign, Save, AlertCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { logAdminActivity } from '../../utils/adminLogger';

export function AdminAds() {
  const { success, error } = useToast();
  const [adsSettings, setAdsSettings] = useState({
    publisherId: '',
    enabled: false,
    autoAds: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'ads');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdsSettings(docSnap.data() as any);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'settings', 'ads'), adsSettings);
      logAdminActivity(
        'akyinsys@gmail.com',
        'super_admin',
        'Updated AdSense Settings',
        `Updated Publisher ID to "${adsSettings.publisherId}" and set active status to ${adsSettings.enabled ? 'Enabled' : 'Disabled'}.`,
        'System'
      );
      success('AdSense settings updated successfully');
    } catch (e) {
      error('Failed to update settings');
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight text-left">AdSense Management</h3>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Configure Google AdSense for BizNxt</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Publisher ID</span>
          <input 
            type="text" 
            value={adsSettings.publisherId}
            onChange={(e) => setAdsSettings({...adsSettings, publisherId: e.target.value})}
            className="mt-1 w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:border-primary" 
            placeholder="pub-xxxxxxxxxxxxxxxx"
          />
        </label>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Enable AdSense</span>
          <input 
            type="checkbox" 
            checked={adsSettings.enabled}
            onChange={(e) => setAdsSettings({...adsSettings, enabled: e.target.checked})}
            className="w-5 h-5 accent-emerald-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">Enable Auto Ads</span>
          <input 
            type="checkbox" 
            checked={adsSettings.autoAds}
            onChange={(e) => setAdsSettings({...adsSettings, autoAds: e.target.checked})}
            className="w-5 h-5 accent-emerald-600"
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
      >
        <Save size={16} />
        Save Settings
      </button>

      <div className="bg-blue-50 rounded-2xl p-6 flex gap-4">
        <AlertCircle className="text-blue-600 shrink-0" size={24} />
        <p className="text-xs font-bold text-blue-700 leading-relaxed">
          Ensure your ads.txt is configured correctly on your domain. AdSense will only be loaded on permitted pages.
        </p>
      </div>
    </div>
  );
}
