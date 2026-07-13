import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search as SearchIcon, 
  Rocket, 
  Briefcase, 
  FileText, 
  LayoutDashboard, 
  User, 
  Menu,
  X,
  Handshake,
  Users,
  Lightbulb,
  ShieldAlert,
  Factory,
  MessageCircle,
  Instagram,
  Globe2,
  TrendingUp,
  Activity,
  Database,
  BarChart3,
  LifeBuoy,
  MessageSquare,
  Sparkles,
  Settings,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalSearch } from './GlobalSearch';
import FOMOPopup from './FOMOPopup';
import { NotificationCenter } from './widgets/NotificationCenter';
import { QuickActionFAB } from './widgets/QuickActionFAB';
import { useAuth } from '../context/AuthContext';
import { siteConfig } from '../config/site';

interface NavItem {
  name: string;
  path: string;
  icon: any;
  roles?: string[];
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['client'] },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Projects', path: '/projects', icon: Briefcase, roles: ['client', 'admin', 'superadmin'] },
  { name: 'Support', path: '/bsm', icon: ShieldAlert, roles: ['bsm', 'admin', 'superadmin'] },
  { name: 'Control Panel', path: '/admin', icon: Settings, roles: ['admin', 'superadmin'] },
  { name: 'Strategic View', path: '/command-center', icon: Activity, roles: ['admin', 'superadmin'] },
  { name: 'Research', path: '/search', icon: SearchIcon },
  { name: 'Discovery', path: '/discovery', icon: Lightbulb },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Marketplace', path: '/marketplace', icon: Factory },
  { name: 'Academy', path: '/academy', icon: Sparkles },
];

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return role && item.roles.includes(role);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <header className="sticky top-6 z-50 mx-4 sm:mx-6 lg:mx-8 glass-card rounded-3xl">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-center h-20 gap-8">
            <div className="flex-shrink-0 flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl transition-colors">
                <ArrowLeft size={18} />
              </button>
              <Link to="/" className="text-2xl font-display font-black text-slate-900 tracking-tighter flex items-center gap-2 group">
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                  <Activity size={20} />
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-xl font-black text-slate-900">BIZ<span className="text-primary">NXT</span></span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Enterprise Operating System</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-2 bg-slate-50/50 p-1.5 rounded-2xl border border-white/50 overflow-x-auto max-w-[65%] no-scrollbar">
              {filteredNavItems.map((item) => {
                const isActive = item.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 flex items-center space-x-2 whitespace-nowrap",
                      isActive 
                        ? "bg-white text-primary shadow-sm border border-white/80 scale-[1.02]" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
                    )}
                  >
                    <item.icon size={14} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1 flex justify-end md:justify-center max-w-xs">
               <GlobalSearch />
            </div>

            <div className="hidden md:flex items-center space-x-3">
               {user ? (
                 <div className="flex items-center space-x-3">
                    <NotificationCenter />
                    <Link
                      to="/profile"
                      className={cn(
                        "flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all border border-transparent",
                        location.pathname === '/profile'
                          ? "bg-white text-primary shadow-sm border-white/50"
                          : "text-slate-600 hover:bg-white/40"
                      )}
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-5 h-5 rounded-2xl object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="max-w-[80px] truncate">{user.displayName || 'Profile'}</span>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="neomorph-btn text-xs font-bold text-slate-600 hover:text-red-500 px-3.5 py-1.5"
                    >
                      Log out
                    </button>
                 </div>
               ) : (
                 <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="neomorph-btn bg-primary text-white hover:bg-primary-dark border-primary/20 text-xs font-bold px-8 py-2 rounded-full whitespace-nowrap"
                    >
                      Get Started
                    </Link>
                 </div>
               )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="neomorph-btn p-2 text-slate-500 hover:text-slate-900"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-[#EDF1F7]/95 backdrop-blur-xl border-t border-white/25 rounded-b-2xl"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                {filteredNavItems.map((item) => {
                  const isActive = item.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center space-x-3 transition-colors",
                        isActive 
                          ? "bg-white text-primary shadow-sm" 
                          : "text-slate-600 hover:bg-white/40 hover:text-slate-900"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-3 flex flex-col space-y-2 border-t border-white/25">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center space-x-3 text-slate-600 hover:bg-white/40"
                      >
                         {user.photoURL ? (
                           <img src={user.photoURL} alt="Profile" className="w-4 h-4 rounded-full" />
                         ) : (
                           <User className="w-4 h-4" />
                         )}
                         <span>Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-white/40"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-2.5 rounded-full text-white font-semibold bg-primary"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mx-4 sm:mx-6 lg:mx-8 mb-8 mt-auto glass-card border border-white/45 p-8 rounded-[2.5rem]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <span className="text-xl font-display font-extrabold text-slate-950 tracking-tight">
                {siteConfig.name.split('.')[0]}<span className="text-primary">.{siteConfig.name.split('.')[1]}</span>
              </span>
              <p className="mt-3 text-xs font-medium text-slate-500 leading-relaxed">
                {siteConfig.tagline} {siteConfig.description.split('.')[0]}.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/services" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Services</Link></li>
                <li><a href="/#pricing" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Pricing</a></li>
                <li><Link to="/partners" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs font-semibold text-slate-500 hover:text-pink-600 transition-colors">
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
            <p className="text-xs font-medium text-slate-500">
              &copy; {new Date().getFullYear()} {siteConfig.name} Platform | Part of <a href="https://www.akyin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Akyin Ventures</a>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {user && <QuickActionFAB />}
      <FOMOPopup />
    </div>
  );
}
