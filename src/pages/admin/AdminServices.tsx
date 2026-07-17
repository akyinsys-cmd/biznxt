import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { logAdminActivity } from '../../utils/adminLogger';

export function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const { success, error } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'service_catalog'));
    const unsub = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const categories = Array.from(new Set(services.map(s => s.category || 'Uncategorized'))).filter(Boolean);

  const filteredServices = services.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serviceData = {
      name: formData.get('name'),
      category: formData.get('category'),
      subCategory: formData.get('subCategory'),
      basePrice: Number(formData.get('basePrice')),
      gst: Number(formData.get('gst')),
      timeline: formData.get('timeline'),
      description: formData.get('description'),
      requiredDocs: formData.get('requiredDocs'),
      features: formData.get('features'),
      isActive: editingService ? editingService.isActive : true
    };

    try {
      if (editingService) {
        await updateDoc(doc(db, 'service_catalog', editingService.id), serviceData);
        logAdminActivity(
          'akyinsys@gmail.com',
          'super_admin',
          'Updated Service Catalog',
          `Modified service details for "${serviceData.name}" under category "${serviceData.category}"`,
          'Operations'
        );
        success('Service updated successfully');
      } else {
        await addDoc(collection(db, 'service_catalog'), serviceData);
        logAdminActivity(
          'akyinsys@gmail.com',
          'super_admin',
          'Created Service Catalog',
          `Created a new service "${serviceData.name}" under category "${serviceData.category}"`,
          'Operations'
        );
        success('Service created successfully');
      }
      setShowModal(false);
      setEditingService(null);
    } catch (err: any) {
      error('Failed to save service');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const sObj = services.find(s => s.id === id);
      await updateDoc(doc(db, 'service_catalog', id), { isActive: !currentStatus });
      logAdminActivity(
        'akyinsys@gmail.com',
        'super_admin',
        'Toggled Service Status',
        `Toggled status of service "${sObj?.name || id}" to ${!currentStatus ? 'Active' : 'Inactive'}`,
        'Operations'
      );
      success(`Service ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const sObj = services.find(s => s.id === id);
        await deleteDoc(doc(db, 'service_catalog', id));
        logAdminActivity(
          'akyinsys@gmail.com',
          'super_admin',
          'Deleted Service',
          `Permanently deleted service "${sObj?.name || id}" from the catalog`,
          'Operations'
        );
        success('Service deleted');
      } catch (err: any) {
        error('Failed to delete service');
      }
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Service Catalog</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage products, pricing, and timelines</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none max-w-[150px]"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button 
            onClick={() => { setEditingService(null); setShowModal(true); }}
            className="px-6 py-2.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2"
          >
            <Plus size={16} /> New Service
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Name</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredServices.map(service => (
              <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <h4 className="text-sm font-black text-slate-900">{service.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 line-clamp-1 max-w-[250px]">{service.description}</p>
                </td>
                <td className="px-8 py-5">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {service.category}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="text-sm font-black text-slate-900">₹{(service.basePrice || 0).toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-slate-500">+{service.gst}% GST</div>
                </td>
                <td className="px-8 py-5">
                  <button 
                    onClick={() => handleToggleStatus(service.id, service.isActive !== false)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors ${
                      service.isActive !== false ? 'bg-emerald-100 text-emerald-600 hover:bg-rose-100 hover:text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600'
                    }`}
                  >
                    {service.isActive !== false ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {service.isActive !== false ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button 
                    onClick={() => { setEditingService(service); setShowModal(true); }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors inline-flex"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl transition-colors inline-flex"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6">{editingService ? 'Edit Service' : 'Create New Service'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Service Name</label>
                  <input name="name" defaultValue={editingService?.name} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Category</label>
                  <input name="category" defaultValue={editingService?.category} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Base Price (₹)</label>
                  <input name="basePrice" type="number" defaultValue={editingService?.basePrice} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">GST (%)</label>
                  <input name="gst" type="number" defaultValue={editingService?.gst || 18} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Timeline</label>
                  <input name="timeline" defaultValue={editingService?.timeline} placeholder="e.g. 5-7 Days" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Sub Category</label>
                  <input name="subCategory" defaultValue={editingService?.subCategory} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Description</label>
                <textarea name="description" defaultValue={editingService?.description} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Required Documents (Comma separated)</label>
                <textarea name="requiredDocs" defaultValue={editingService?.requiredDocs} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Features (Comma separated)</label>
                <textarea name="features" defaultValue={editingService?.features} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary" />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90">Save Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
