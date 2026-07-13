const fs = require('fs');

let code = fs.readFileSync('src/components/AdminWorkspace.tsx', 'utf8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

code = code.replace(regex, "");

fs.writeFileSync('src/components/AdminWorkspace.tsx', code);
