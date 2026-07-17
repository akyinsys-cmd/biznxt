import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Trophy, TrendingUp, AlertTriangle, Target, Lightbulb, 
  MapPin, Briefcase, Download, BookmarkPlus, ArrowRight,
  ShieldCheck, Zap, Scale, Layers, Wallet
} from 'lucide-react';
import { motion } from 'motion/react';

export default function DiscoveryResult() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id || !user) return;
      try {
        const docRef = doc(db, 'user_discoveries', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          if (docData.userId !== user.uid) {
            error("Unauthorized access.");
            navigate('/discovery');
            return;
          }
          setData(docData);
        } else {
          error("Discovery report not found.");
          navigate('/discovery');
        }
      } catch (err: any) {
        if (err?.code === 'unavailable' || err?.message?.includes('offline')) {
          console.warn('Client offline, could not load discovery results.');
          error("Failed to load results. You are offline.");
        } else {
          console.error(err);
          error("Failed to load results.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, user, navigate, error]);

  const handleSaveIdea = async (idea: any, index: number) => {
    if (!user || !id) return;
    setSavingId(index);
    try {
      // Create saved_businesses document
      const saveRef = doc(db, 'saved_businesses', `\${user.uid}_\${id}_\${index}`);
      await setDoc(saveRef, {
        userId: user.uid,
        discoveryId: id,
        idea,
        savedAt: new Date()
      });
      success("Idea saved successfully! You can view it in your dashboard.");
    } catch (err) {
      console.error(err);
      error("Failed to save idea.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-2xl animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Loading Elite AI Analysis...</p>
      </div>
    );
  }

  if (!data) return null;

  const analysis = data.analysis;
  const recommendations = data.topRecommendations;

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-indigo-500/20 opacity-50"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>Discovery Engine Results</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight mb-4">
            Your Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Blueprint</span> is Ready.
          </h1>
          <p className="text-slate-400 text-lg">We analyzed your profile against millions of data points to find your highest-probability business matches.</p>
        </div>
        
        <div className="relative z-10 mt-8 md:mt-0 flex gap-4">
          <div className="bg-white shadow-xl shadow-slate-200/50/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center">
            <div className="text-4xl font-black text-emerald-400 mb-1">{analysis.businessOpportunityScore}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Opportunity Score</div>
          </div>
          <div className="bg-white shadow-xl shadow-slate-200/50/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center">
            <div className="text-4xl font-black text-cyan-400 mb-1">{analysis.businessReadinessScore}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Readiness Score</div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-1 lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-display flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Strategic Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm font-bold text-slate-700">
                <Wallet className="w-4 h-4 mr-2 text-emerald-500" /> Investment Fit
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{analysis.investmentSuitability}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm font-bold text-slate-700">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Risk Assessment
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{analysis.riskAnalysis}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm font-bold text-slate-700">
                <Target className="w-4 h-4 mr-2 text-indigo-500" /> Skill Match
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{analysis.skillMatch}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm font-bold text-slate-700">
                <MapPin className="w-4 h-4 mr-2 text-primary" /> Location Dynamics
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{analysis.locationMatch}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold font-display flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
            AI Trajectory
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Industry Focus</div>
              <p className="text-sm font-bold text-slate-900">{analysis.industryMatch}</p>
            </div>
            <div className="w-full h-px bg-slate-100"></div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expansion Potential</div>
              <p className="text-sm text-slate-700">{analysis.expansionPotential}</p>
            </div>
            <div className="w-full h-px bg-slate-100"></div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Growth Curve</div>
              <p className="text-sm text-slate-700">{analysis.growthPotential}</p>
            </div>
            <div className="w-full h-px bg-slate-100"></div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommended Models</div>
              <div className="flex flex-wrap gap-2">
                {analysis.recommendedBusinessModels?.map((model: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{model}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-display flex items-center text-slate-900">
            <Lightbulb className="w-6 h-6 mr-2 text-amber-500" />
            Top 10 Business Matches
          </h2>
          <button 
            onClick={() => navigate('/discovery/compare')}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm hover:bg-indigo-100 transition-colors"
          >
            Compare Ideas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((idea: any, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all group flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-black text-lg">
                    #{idx + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Score {idea.opportunityScore}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{idea.title}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-3">{idea.shortDescription}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Wallet className="w-3 h-3 mr-1" /> Est. Investment</div>
                    <div className="text-sm font-bold text-slate-900">{idea.investmentRequired}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Layers className="w-3 h-3 mr-1" /> Complexity</div>
                    <div className="text-sm font-bold text-slate-900">{idea.estimatedComplexity}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><Scale className="w-3 h-3 mr-1" /> Scalability</div>
                    <div className="text-sm font-bold text-slate-900">{idea.scalability}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1" /> Best Location</div>
                    <div className="text-sm font-bold text-slate-900">{idea.recommendedLocation}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Target Customers: </span>
                    <span className="text-xs text-slate-600">{idea.targetCustomers}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Why it fits you: </span>
                    <span className="text-xs text-slate-600">{idea.suitableFor}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 flex items-center justify-between border-t border-slate-100">
                <button 
                  onClick={() => handleSaveIdea(idea, idx)}
                  disabled={savingId === idx}
                  className="flex items-center text-sm font-bold text-slate-600 hover:text-primary transition-colors disabled:opacity-50"
                >
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  {savingId === idx ? 'Saving...' : 'Save to Dashboard'}
                </button>
                
                <button 
                  onClick={() => navigate('/services')}
                  className="flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:translate-x-1"
                >
                  Start this Business
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
