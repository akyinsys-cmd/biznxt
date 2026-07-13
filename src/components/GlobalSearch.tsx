import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Building2, Briefcase, FileText, TrendingUp, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  icon: any;
  path: string;
}

const MOCK_RESULTS: SearchResult[] = [
  { id: '1', title: 'Start a Cloud Kitchen', category: 'Business Idea', icon: Lightbulb, path: '/search?q=cloud+kitchen' },
  { id: '2', title: 'Company Registration', category: 'Service', icon: Briefcase, path: '/services/registration' },
  { id: '3', title: 'Food & Beverage Manufacturing', category: 'Manufacturing', icon: Building2, path: '/search?q=fnb+manufacturing' },
  { id: '4', title: 'Q3 Market Analysis', category: 'Report', icon: FileText, path: '/reports/q3-market' },
  { id: '5', title: 'Business Loan Application', category: 'Finance', icon: TrendingUp, path: '/services/loans' },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const filteredResults = MOCK_RESULTS.filter(result => 
    result.title.toLowerCase().includes(query.toLowerCase()) || 
    result.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-colors md:w-64"
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
                  placeholder="Search business ideas, services, reports..."
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
                      <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Suggested
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
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
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
