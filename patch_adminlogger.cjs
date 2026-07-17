const fs = require('fs');
let content = fs.readFileSync('src/utils/adminLogger.ts', 'utf8');

content = content.replace(/export interface SystemAuditLog \{/, 
`export interface SystemAuditLog {
  action?: string;
  category?: string;
  details?: any;`);

content = content.replace(/actionDescription: \`\[\$\{category\}\] \$\{action\} - \$\{details\}\`/g, 
`actionDescription: \`[\${category}] \${action} - \${details}\`,
      action,
      category,
      details`);

fs.writeFileSync('src/utils/adminLogger.ts', content);
console.log("Patched adminLogger");
