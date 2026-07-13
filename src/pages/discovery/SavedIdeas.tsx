import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion } from 'motion/react';
import { 
  Bookmark, Trash2, ArrowRight, Lightbulb, Wallet, Scale, Layers, MapPin, Search 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SavedIdeas() {
  const { user } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        // Sort by savedAt descending
        ideas.sort((a: any, b: any) => b.savedAt.toDate() - a.savedAt.toDate());
        setSavedIdeas(ideas);
      } catch (err) {
        console.error(err);
        error("Failed to load saved ideas.");
      } finally {
        setLoading(false);
      }
    }
    fetchSavedIdeas();
  }, [user, error]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'saved_businesses', id));
      setSavedIdeas(prev => prev.filter(idea => idea.id !== id));
      success("Idea removed from dashboard.");
    } catch (err) {
      console.error(err);
      error("Failed to remove idea.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-2xl animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight flex items-center">
            <Bookmark className="w-8 h-8 mr-3 text-primary" />
            My Saved Ideas
          </h1>
          <p className="text-slate-500 mt-2">Your shortlisted business opportunities from the AI Discovery Engine.</p>
        </div>
        <button 
          onClick={() => navigate('/discovery/wizard')}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center shadow-lg"
        >
          <Search className="w-4 h-4 mr-2" />
          New Discovery
        </button>
      </div>

      {savedIdeas.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No ideas saved yet.</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Run the AI Discovery Engine to generate tailored business opportunities and save your favorites here.</p>
          <button 
            onClick={() => navigate('/discovery/wizard')}
            className="px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
          >
            Start Discovery Engine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {savedIdeas.map((savedDoc) => {
            const idea = savedDoc.idea;
            return (
              <motion.div 
                key={savedDoc.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 pr-4">{idea.title}</h3>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100">
                        Score {idea.opportunityScore}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{idea.shortDescription}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Wallet className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-sm font-bold text-slate-700">{idea.investmentRequired}</span>
                    </div>
                    <div className="flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-sm font-bold text-slate-700">{idea.estimatedComplexity}</span>
                    </div>
                    <div className="flex items-center">
                      <Scale className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-sm font-bold text-slate-700">{idea.scalability}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-sm font-bold text-slate-700">{idea.recommendedLocation}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 flex items-center justify-between border-t border-slate-100">
                  <button 
                    onClick={() => handleDelete(savedDoc.id)}
                    className="flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Remove
                  </button>
                  
                  <button 
                    onClick={() => navigate('/services')}
                    className="flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors group"
                  >
                    Launch this Idea
                    <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
