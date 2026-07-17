import React, { useState, useEffect } from 'react';
import { Award, FileText, Zap, ShieldCheck, Star } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

export function UserBadges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const checkAchievements = async () => {
      const earnedBadges = [];
      
      try {
        // Early Adopter (Default for all users right now)
        earnedBadges.push({
          id: 'early_adopter',
          name: 'Early Adopter',
          desc: 'Joined during the beta phase',
          icon: <Star size={24} className="text-amber-500" />,
          color: 'bg-amber-50 border-amber-200 text-amber-700'
        });

        // Document Creator Check
        const docsQuery = query(collection(db, 'document_orders'), where('userId', '==', user.uid));
        const docsSnap = await getDocs(docsQuery);
        
        if (docsSnap.size > 0) {
          earnedBadges.push({
            id: 'first_doc',
            name: 'First Document',
            desc: 'Created first generated document',
            icon: <FileText size={24} className="text-blue-500" />,
            color: 'bg-blue-50 border-blue-200 text-blue-700'
          });
        }
        
        if (docsSnap.size >= 5) {
          earnedBadges.push({
            id: 'doc_master',
            name: 'Document Master',
            desc: 'Created 5+ documents',
            icon: <Award size={24} className="text-purple-500" />,
            color: 'bg-purple-50 border-purple-200 text-purple-700'
          });
        }

        // Project Starter Check
        const projectsQuery = query(collection(db, 'client_projects'), where('customerId', '==', user.uid));
        const projectsSnap = await getDocs(projectsQuery);
        
        if (projectsSnap.size > 0) {
          earnedBadges.push({
            id: 'active_trader',
            name: 'Active Builder',
            desc: 'Started a business project',
            icon: <Zap size={24} className="text-emerald-500" />,
            color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
          });
        }

        if (user.emailVerified) {
            earnedBadges.push({
                id: 'verified',
                name: 'Verified User',
                desc: 'Completed identity verification',
                icon: <ShieldCheck size={24} className="text-indigo-500" />,
                color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
            });
        }

        setBadges(earnedBadges);
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAchievements();
  }, [user]);

  if (loading) return null;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
          <Award size={24} className="text-amber-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Achievements & Badges</h3>
          <p className="text-sm text-slate-500">Milestones unlocked on your business journey</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-2xl border ${badge.color} flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-1`}
          >
            <div className="bg-white p-3 rounded-xl shadow-sm">
              {badge.icon}
            </div>
            <div>
              <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
              <p className="text-[10px] opacity-80 leading-tight">{badge.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
