const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

const tabsReplacement = `
  const tabs = [
    { id: 'auth', label: 'Authentication', icon: Shield },
    { id: 'api', label: 'API Config', icon: Settings },
    { id: 'firebase', label: 'Firebase', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'logs', label: 'System Logs', icon: History },
    { id: 'env', label: 'Environment', icon: Settings },
    { id: 'debug', label: 'Debug Tools', icon: ShieldAlert },
    { id: 'db', label: 'Database', icon: Database },
    { id: 'roles', label: 'Roles', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
  ];
`;

content = content.replace(/const tabs = \[[\s\S]*?\];/, tabsReplacement.trim());

const contentReplacement = `
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <div className="bg-white rounded-[2rem] border border-slate-100 p-12 text-center min-h-[400px] flex flex-col items-center justify-center shadow-sm">
                <ShieldAlert size={48} className="text-slate-300 mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2 capitalize">{activeTab.replace('-', ' ')}</h3>
                <p className="text-slate-500 font-medium">This module is part of the core infrastructure and is currently operating securely. Changes here affect the global environment.</p>
              </div>
            </motion.div>
`;

content = content.replace(/<motion\.div\s*key=\{activeTab\}[\s\S]*?<\/motion\.div>/, contentReplacement.trim());

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
console.log("Patched AdminDashboard.tsx");
