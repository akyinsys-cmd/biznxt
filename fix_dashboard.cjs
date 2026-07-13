const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// I will revert the return and put AdminWorkspace back, but maybe I can just wrap it nicely so it doesn't break?
// AdminWorkspace wants h-screen.
const adminReturn = `
  if (role === 'admin' || role === 'superadmin' || role === 'manager' || (role && role.includes('manager') && role !== 'bsm')) {
    return (
      <div className="flex-1 h-screen bg-slate-50 flex flex-col relative">
        <AdminWorkspace />
        
        {/* Floating UserActivityLogger for Admin Dashboard */}
        <div className="absolute bottom-6 right-6 w-96 z-[60] shadow-2xl rounded-3xl overflow-hidden pointer-events-auto">
          <UserActivityLogger />
        </div>
      </div>
    );
  }
`;

code = code.replace(
  /if \(role === 'admin' \|\| role === 'superadmin' \|\| role === 'manager' \|\| \(role && role\.includes\('manager'\) && role !== 'bsm'\)\) \{[\s\S]*?return \([\s\S]*?<div className="flex-1 min-h-screen bg-slate-50 flex flex-col p-4 sm:p-6 lg:p-8 space-y-8">[\s\S]*?<AdminWorkspace \/>[\s\S]*?<div className="max-w-7xl mx-auto w-full">[\s\S]*?<UserActivityLogger \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\);\n  \}/m,
  adminReturn
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
