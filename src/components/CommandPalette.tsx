import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FolderPlus, FileText, ArrowRight, Settings, LayoutDashboard, Briefcase, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Action {
  id: string;
  name: string;
  icon: React.ReactNode;
  perform: () => void;
  section: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user, role } = useAuth();

  useEffect(() => {
    let unsubs: Array<() => void> = [];
    if (isOpen) {
      const unsubProjects = onSnapshot(collection(db, 'client_projects'), (snap) => {
        setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      const unsubDocs = onSnapshot(collection(db, 'document_orders'), (snap) => {
        setDocuments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      const unsubLeads = onSnapshot(collection(db, 'crm_leads'), (snap) => {
        setCrmLeads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      unsubs = [unsubProjects, unsubDocs, unsubLeads];
    }
    return () => unsubs.forEach(u => u());
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (role === 'super_admin') {
          navigate('/admin');
        } else if (role === 'manager') {
          navigate('/bsm');
        } else {
          navigate('/dashboard');
        }
        setIsOpen(false);
      }
      if (e.key === '?') {
        // e.preventDefault(); // Don't prevent default, user might be typing '?' in an input. Check if input is focused.
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
        setShowShortcuts((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowShortcuts(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actions: Action[] = [
    {
      id: 'dashboard',
      name: 'Go to Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      perform: () => navigate('/dashboard'),
      section: 'Navigation'
    },
    {
      id: 'settings',
      name: 'Account Settings',
      icon: <Settings className="w-4 h-4" />,
      perform: () => navigate('/settings'),
      section: 'Navigation'
    },
    {
      id: 'new-project',
      name: 'Start New Project',
      icon: <FolderPlus className="w-4 h-4" />,
      perform: () => navigate('/launch'),
      section: 'Actions'
    },
    {
      id: 'download-report',
      name: 'Download Reports',
      icon: <FileText className="w-4 h-4" />,
      perform: () => navigate('/reports'),
      section: 'Actions'
    },
    {
      id: 'keyboard-shortcuts',
      name: 'Keyboard Shortcuts',
      icon: <Search className="w-4 h-4" />,
      perform: () => setShowShortcuts(true),
      section: 'Help'
    }
  ];

  const fuzzyMatch = (text: string, q: string) => {
    if (!text) return false;
    const t = text.toLowerCase();
    const queryLower = q.toLowerCase();
    if (t.includes(queryLower)) return true;
    let qIdx = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] === queryLower[qIdx]) qIdx++;
      if (qIdx === queryLower.length) return true;
    }
    return false;
  };

  const dynamicActions: Action[] = [];
  if (query.trim()) {
    projects.filter(p => fuzzyMatch(p.title || p.projectName || '', query)).slice(0, 3).forEach(p => {
      dynamicActions.push({
        id: `proj-${p.id}`,
        name: `Project: ${p.title || p.projectName}`,
        icon: <Briefcase className="w-4 h-4" />,
        perform: () => navigate(`/projects/${p.id}`),
        section: 'Projects'
      });
    });
    documents.filter(d => fuzzyMatch(d.title || d.packageName || '', query)).slice(0, 3).forEach(d => {
      dynamicActions.push({
        id: `doc-${d.id}`,
        name: `Doc: ${d.title || d.packageName}`,
        icon: <FileText className="w-4 h-4" />,
        perform: () => navigate(`/documents/edit/${d.id}`),
        section: 'Documents'
      });
    });
    crmLeads.filter(l => fuzzyMatch(l.name || l.email || l.company || '', query)).slice(0, 3).forEach(l => {
      dynamicActions.push({
        id: `lead-${l.id}`,
        name: `Lead: ${l.name} (${l.company || 'Individual'})`,
        icon: <UserCheck className="w-4 h-4" />,
        perform: () => navigate('/crm'), // or specific lead modal
        section: 'CRM Records'
      });
    });
  }

  const allActions = [...actions, ...dynamicActions];

  const filteredActions = query === '' 
    ? actions 
    : allActions.filter(action => action.name.toLowerCase().includes(query.toLowerCase()) || action.section.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 whitespace-nowrap">
                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 whitespace-nowrap"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="text-[10px] font-mono text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">ESC</div>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredActions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">No results found.</div>
                ) : (
                  Object.entries(
                    filteredActions.reduce((acc, action) => {
                      acc[action.section] = [...(acc[action.section] || []), action];
                      return acc;
                    }, {} as Record<string, Action[]>)
                  ).map(([section, sectionActions]) => (
                    <div key={section} className="mb-2">
                      <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">{section}</div>
                      {sectionActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            action.perform();
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-slate-400 group-hover:text-primary">{action.icon}</div>
                            <span className="font-medium">{action.name}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShortcuts && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
                <button onClick={() => setShowShortcuts(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <div className="text-[10px] font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">ESC</div>
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Command Palette</span>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">Cmd/Ctrl</kbd>
                    <span className="text-slate-400">+</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">K</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Quick Dashboard</span>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">Alt</kbd>
                    <span className="text-slate-400">+</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">D</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Show Shortcuts</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">?</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Close Modals</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300">Esc</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
