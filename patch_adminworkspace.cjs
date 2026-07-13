const fs = require('fs');
let code = fs.readFileSync('src/components/AdminWorkspace.tsx', 'utf8');

if (!code.includes("import { logUserActivity }")) {
  code = code.replace(
    "import { db, auth } from '../lib/firebase';",
    "import { db, auth } from '../lib/firebase';\nimport { logUserActivity } from './widgets/UserActivityLogger';"
  );
  
  // Log inside addLog? addLog is already there
  code = code.replace(
    /const addLog = \(log: string\) => \{[\s\S]*?setAuditLogs\(prev => \[\`\$\{time\} UTC - \$\{log\}\`, \.\.\.prev\.slice\(0, 15\)\]\);\n  \};/m,
    `const addLog = (log: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setAuditLogs(prev => [\`\${time} UTC - \${log}\`, ...prev.slice(0, 15)]);
    
    // Track in Firestore UserActivityLogger
    if (auth.currentUser) {
      logUserActivity('Admin Action', log, auth.currentUser.email || 'Admin');
    }
  };`
  );
  
  fs.writeFileSync('src/components/AdminWorkspace.tsx', code);
}
