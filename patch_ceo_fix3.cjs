const fs = require('fs');
let content = fs.readFileSync('src/pages/CEOCommandCenter.tsx', 'utf8');

content = content.replace(/<\/div>\s*<\/div>\s*\}\)\}/g, '</div>\n                    ))}');

fs.writeFileSync('src/pages/CEOCommandCenter.tsx', content);
