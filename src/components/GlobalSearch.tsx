import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Briefcase, FileText, UserCheck, Sparkles, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  icon: any;
  path: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

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

  const dynamicResults: SearchResult[] = [];
  if (query.trim()) {
    projects.filter(p => fuzzyMatch(p.title || p.projectName || '', query)).slice(0, 5).forEach(p => {
      dynamicResults.push({
        id: `proj-${p.id}`,
        title: p.title || p.projectName || 'Untitled Project',
        category: 'Project',
        icon: Briefcase,
        path: `/projects/${p.id}`
      });
    });
    documents.filter(d => fuzzyMatch(d.title || d.packageName || '', query)).slice(0, 5).forEach(d => {
      dynamicResults.push({
        id: `doc-${d.id}`,
        title: d.title || d.packageName || 'Untitled Document',
        category: 'Document',
        icon: FileText,
        path: `/documents/edit/${d.id}`
      });
    });
    crmLeads.filter(l => fuzzyMatch(l.name || l.email || l.company || '', query)).slice(0, 5).forEach(l => {
      dynamicResults.push({
        id: `lead-${l.id}`,
        title: `${l.name} (${l.company || 'Individual'})`,
        category: 'CRM Lead',
        icon: UserCheck,
        path: `/crm`
      });
    });
  }

  const filteredResults = dynamicResults;
  if (query.trim().length > 2) {
    filteredResults.push({
      id: 'ai-insight',
      title: `Ask AI to analyze "${query}"`,
      category: 'Business Intelligence Insight',
      icon: BrainCircuit,
      path: `/intelligence?q=${encodeURIComponent(query)}`
    });
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors md:w-64"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm flex-1 text-left hidden md:inline font-medium">Search for business solutions...</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="flex items-center px-4 py-4 border-b border-slate-100 whitespace-nowrap">
                <Search className="w-5 h-5 text-slate-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, documents, and CRM records..."
                  className="flex-1 ml-3 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-900 placeholder:text-slate-500 text-lg whitespace-nowrap"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-500 hover:text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-2">
                {query.length > 0 && filteredResults.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Search className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                    <p>No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {query.length === 0 && (
                      <div className="p-8 text-center text-slate-500">
                        <Search className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                        <p>Type to search across your workspace</p>
                      </div>
                    )}
                    {filteredResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          navigate(result.path);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center px-3 py-3 rounded-2xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <result.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-4 text-left">
                          <h4 className="text-sm font-medium text-slate-900">{result.title}</h4>
                          <p className="text-xs text-slate-500">{result.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
