const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// import UserActivityLogger
code = code.replace(
  "import { AdminWorkspace } from '../components/AdminWorkspace';",
  "import { AdminWorkspace } from '../components/AdminWorkspace';\nimport { UserActivityLogger } from '../components/widgets/UserActivityLogger';"
);

// modify admin role return
const adminReturn = `
  if (role === 'admin' || role === 'superadmin' || role === 'manager' || (role && role.includes('manager') && role !== 'bsm')) {
    return (
      <div className="flex-1 min-h-screen bg-slate-50 flex flex-col p-4 sm:p-6 lg:p-8 space-y-8">
        <AdminWorkspace />
        <div className="max-w-7xl mx-auto w-full">
          <UserActivityLogger />
        </div>
      </div>
    );
  }
`;

code = code.replace(
  /if \(role === 'admin' \|\| role === 'superadmin' \|\| role === 'manager' \|\| \(role && role\.includes\('manager'\) && role !== 'bsm'\)\) \{[\s\S]*?return \([\s\S]*?<div className="flex-1 min-h-screen bg-slate-50 flex flex-col">[\s\S]*?<AdminWorkspace \/>[\s\S]*?<\/div>[\s\S]*?\);\n  \}/m,
  adminReturn
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
