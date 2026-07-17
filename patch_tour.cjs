const fs = require('fs');
let content = fs.readFileSync('src/components/widgets/TourGuide.tsx', 'utf8');
content = content.replace(/build new legal templates/g, 'manage customer documents');
fs.writeFileSync('src/components/widgets/TourGuide.tsx', content);
console.log("Patched TourGuide");
