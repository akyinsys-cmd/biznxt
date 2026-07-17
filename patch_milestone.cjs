const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDashboard.tsx', 'utf8');

const updatedSection = `
const MilestonesListSection = memo(({ milestones, projectId }: { milestones: ProjectMilestone[], projectId: string }) => {
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { addLocalNotification } = useNotifications();
  const { auditLog } = useUserActivity();

  if (milestones.length === 0) {
    return (
      <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-sm font-black text-slate-600 uppercase tracking-widest">No strategic milestones established</p>
      </div>
    );
  }

  const pendingMilestones = milestones.filter(m => m.status === 'Pending');

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      const { writeBatch, doc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      const batch = writeBatch(db);
      
      for (const id of selectedIds) {
        batch.update(doc(db, 'project_milestones', id), {
          status: 'Completed',
          completedAt: new Date().toISOString()
        });
        
        // Find the milestone for notification
        const m = milestones.find(x => x.id === id);
        if (m) {
          addLocalNotification({
            type: 'success',
            title: 'Milestone Approved',
            message: \`Milestone "\${m.title}" was approved.\`,
            link: \`/projects/\${projectId}\`
          });
        }
      }
      
      await batch.commit();
      auditLog('Batch Approved Milestones', 'Business Decision', { count: selectedIds.length });
      setBatchMode(false);
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to batch approve', err);
    }
  };

  return (
    <div className="space-y-10 py-4 relative">
      {pendingMilestones.length > 0 && (
        <div className="flex justify-end mb-4 gap-4">
          {batchMode ? (
            <>
              <button 
                onClick={() => { setBatchMode(false); setSelectedIds([]); }}
                className="px-6 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-2xl uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleBatchApprove}
                disabled={selectedIds.length === 0}
                className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                Approve Selected ({selectedIds.length})
              </button>
            </>
          ) : (
            <button 
              onClick={() => setBatchMode(true)}
              className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-105 transition-all"
            >
              Batch Approval Mode
            </button>
          )}
        </div>
      )}
      {milestones.map((milestone, idx) => (
        <div key={milestone.id} className="relative pl-16">
          {idx !== milestones.length - 1 && (
            <div className="absolute left-[23px] top-10 bottom-[-40px] w-1 bg-slate-100 rounded-2xl" />
          )}
          <div className={\`absolute left-0 top-0 w-12 h-12 rounded-[1.25rem] border-4 border-white shadow-xl flex items-center justify-center z-10 \${
            milestone.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'
          }\`}>
            <Flag size={20} />
          </div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className={\`bg-white p-8 rounded-[2.5rem] border shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex items-center justify-between group transition-all \${batchMode && milestone.status === 'Pending' ? (selectedIds.includes(milestone.id) ? 'border-emerald-500 ring-2 ring-emerald-100 cursor-pointer' : 'border-slate-200 cursor-pointer hover:border-emerald-300') : 'border-slate-100 hover:border-primary/20'}\`}
            onClick={() => {
              if (batchMode && milestone.status === 'Pending') handleToggleSelect(milestone.id);
            }}
          >
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h4 className="text-lg font-black text-slate-900 tracking-tight">{milestone.title}</h4>
                {milestone.isPaymentMilestone && (
                  <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-amber-500/20">Financial Target</span>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                TARGET COMPLETION: {milestone.expectedDate ? new Date(milestone.expectedDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'PENDING SCHEDULE'}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {milestone.status === 'Completed' ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={16} /> Verified
                </div>
              ) : batchMode ? (
                <div className={\`w-6 h-6 rounded-md border-2 flex items-center justify-center \${selectedIds.includes(milestone.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}\`}>
                  {selectedIds.includes(milestone.id) && <CheckCircle2 size={14} />}
                </div>
              ) : (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleToggleSelect(milestone.id); setBatchMode(true); }}
                  className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
                >
                  Authenticate Milestone
                </button>
              )}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
});
`;

content = content.replace(/const MilestonesListSection = memo\(\(\{ milestones \}: \{ milestones: ProjectMilestone\[\] \}\) => \{[\s\S]*?\n\}\);\n/, updatedSection);

// We need to update where it's used to pass projectId
content = content.replace(/<MilestonesListSection milestones=\{milestones\} \/>/g, '<MilestonesListSection milestones={milestones} projectId={id || ""} />');

fs.writeFileSync('src/pages/ProjectDashboard.tsx', content);
