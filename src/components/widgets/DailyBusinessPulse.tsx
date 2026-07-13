import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export function DailyBusinessPulse() {
  const [pulseMessage, setPulseMessage] = useState('Analyzing your recent business activity to generate insights...');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAndAnalyzeActivity = async () => {
      if (!user) return;
      
      try {
        const eventsRef = collection(db, 'analytics_events');
        const q = query(
          eventsRef,
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(20)
        );
        
        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map(doc => doc.data());
        
        if (activities.length === 0) {
          setPulseMessage("Welcome to BizNxt! Start exploring the platform to get personalized business insights and recommendations.");
          setLoading(false);
          return;
        }

        // Call our CEO Insights API with recent activity
        const response = await fetch('/api/ceo/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metrics: { recentActionsCount: activities.length },
            trends: { 
              mostCommonAction: activities.reduce((acc, curr) => {
                acc[curr.name] = (acc[curr.name] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            },
            alerts: []
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.insights && data.insights.length > 0) {
            setPulseMessage(data.insights[0].description || data.insights[0].title);
          } else {
            setPulseMessage("Your business activity is looking healthy today. Keep up the momentum!");
          }
        } else {
          setPulseMessage("Your business activity is looking healthy today. Keep up the momentum!");
        }
      } catch (error) {
        console.error("Failed to fetch daily pulse", error);
        setPulseMessage("Your business activity is looking healthy today. Keep up the momentum!");
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyzeActivity();
  }, [user]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #780116 0%, #4a000d 100%)' }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <Sparkles className="w-32 h-32 text-[#f7b538]" />
      </div>
      
      <div className="p-6 sm:p-8 relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#f7b538]/20 border border-[#f7b538]/30 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-[#f7b538]" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white font-display">Daily Business Pulse</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#f7b538] text-[#780116]">
              AI Insight
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center gap-2 text-[#f7b538]/80">
              <div className="w-4 h-4 rounded-full border-2 border-[#f7b538]/80 border-t-transparent animate-spin" />
              <p className="text-sm font-medium">Synthesizing platform activity...</p>
            </div>
          ) : (
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl">
              {pulseMessage}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-colors"
            style={{ backgroundColor: '#f7b538', color: '#780116' }}
            onClick={() => window.location.href = '/command-center'}
          >
            Full Analysis
            <AlertCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
