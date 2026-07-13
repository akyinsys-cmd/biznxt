import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TradeDocs() {
  const navigate = useNavigate();

  const documents = [
    { id: 1, name: 'Commercial Invoice', type: 'Export', status: 'Approved', date: '10 Aug 2026' },
    { id: 2, name: 'Bill of Lading', type: 'Export', status: 'Pending', date: '11 Aug 2026' },
    { id: 3, name: 'Certificate of Origin', type: 'Export', status: 'Approved', date: '08 Aug 2026' },
    { id: 4, name: 'Packing List', type: 'Import', status: 'Approved', date: '05 Aug 2026' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <button 
        onClick={() => navigate('/global')}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Global Dashboard
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center">
            <FileText className="w-8 h-8 mr-3 text-primary" />
            Trade Documents
          </h1>
          <p className="text-slate-500 mt-2">Manage all your international trade documentation centrally.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-colors shadow-lg">
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Name</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="p-4 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{doc.name}</td>
                <td className="p-4 text-sm text-slate-500">{doc.type}</td>
                <td className="p-4 text-sm text-slate-500">{doc.date}</td>
                <td className="p-4">
                  {doc.status === 'Approved' ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                      <AlertCircle className="w-3 h-3 mr-1" /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button className="text-slate-500 hover:text-indigo-600 transition-colors">
                    <Download className="w-5 h-5 ml-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
