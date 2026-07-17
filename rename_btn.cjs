const fs = require('fs');
let content = fs.readFileSync('src/pages/documents/DocumentBuilder.tsx', 'utf8');

content = content.replace(/Finish & Export/g, 'Download as PDF');

fs.writeFileSync('src/pages/documents/DocumentBuilder.tsx', content);
console.log("Renamed export button");
