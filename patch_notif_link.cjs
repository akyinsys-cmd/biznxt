const fs = require('fs');
let content = fs.readFileSync('src/context/NotificationContext.tsx', 'utf8');

content = content.replace(/type: 'warning',\s*title: 'Approaching Deadline',\s*message: \`Milestone "\$\{milestone\.title\}" is due in \$\{hoursLeft\} hours\.\`,\s*read: false,\s*createdAt: Date\.now\(\),\s*isLocal: true,/,
`type: 'warning',
                       title: 'Approaching Deadline',
                       message: \`Milestone "\${milestone.title}" is due in \${hoursLeft} hours.\`,
                       link: \`/projects/\${milestone.projectId}\`,
                       read: false,
                       createdAt: Date.now(),
                       isLocal: true,`);

fs.writeFileSync('src/context/NotificationContext.tsx', content);
console.log("Patched notification with link");
