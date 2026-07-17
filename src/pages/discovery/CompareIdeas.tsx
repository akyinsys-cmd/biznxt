import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GitCompare, Plus, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CompareIdeas() {
  const { user } = useAuth();
  const { error } = useToast();
  const navigate = useNavigate();
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSavedIdeas() {
      if (!user) return;
      try {
        const q = query(collection(db, 'saved_businesses'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const ideas = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSavedIdeas(ideas);
        // Auto-select first two if available
        if (ideas.length >= 2) {
          setSelectedIds([ideas[0].id, ideas[1].id]);
        } else if (ideas.length === 1) {
          setSelectedIds([ideas[0].id]);
        }
      } catch (err) {
        console.error(err);
        error("Failed to load saved ideas.");
      } finally {
        setLoading(false);
      }
    }
    fetchSavedIdeas();
  }, [user, error]);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        error("You can compare up to 3 ideas at a time.");
      }
    }
  };

  const selectedIdeas = savedIdeas.filter(i => selectedIds.includes(i.id)).map(i => i.idea);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-2xl animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center">
            <GitCompare className="w-8 h-8 mr-3 text-indigo-500" />
            Compare Ideas
          </h1>
          <p className="text-slate-500 mt-2">Evaluate your saved business ideas side-by-side.</p>
        </div>
      </div>

      {savedIdeas.length < 2 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <GitCompare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Not enough ideas to compare</h2>
          <p className="text-slate-500 mb-6">You need at least two saved ideas to use the comparison tool.</p>
          <button 
            onClick={() => navigate('/discovery/wizard')}
            className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors"
          >
            Find more ideas
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Selector */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Select up to 3 ideas to compare:</h3>
            <div className="flex flex-wrap gap-3">
              {savedIdeas.map((saved) => {
                const isSelected = selectedIds.includes(saved.id);
                return (
                  <button
                    key={saved.id}
                    onClick={() => toggleSelection(saved.id)}
                    className={`px-4 py-2 rounded-2xl border text-sm font-bold flex items-center transition-all \${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {saved.idea.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedIdeas.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-6 border-b border-slate-200 bg-slate-50 w-48 shrink-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Metrics</span>
                      </th>
                      {selectedIdeas.map((idea, idx) => (
                        <th key={idx} className="p-6 border-b border-slate-200 bg-slate-50 min-w-[300px]">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{idea.title}</h3>
                          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                            Score: {idea.opportunityScore}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Investment</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900 font-medium">{idea.investmentRequired}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Complexity</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.estimatedComplexity}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Scalability</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.scalability}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Best Location</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.recommendedLocation}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Target Customers</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-600">{idea.targetCustomers}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Why it fits you</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-600 bg-indigo-50/30">{idea.suitableFor}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Demand</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.demand || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Competition</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.competition || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Risk</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.risk || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">Growth</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.growth || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100 font-bold text-sm text-slate-700">ROI Assumptions</td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6 text-sm text-slate-900">{idea.roiAssumptions || '-'}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-6 bg-slate-50 border-r border-slate-100"></td>
                      {selectedIdeas.map((idea, idx) => (
                        <td key={idx} className="p-6">
                          <button 
                            onClick={() => navigate('/services')}
                            className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center"
                          >
                            Launch Business <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
