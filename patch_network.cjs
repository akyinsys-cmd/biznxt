const fs = require('fs');
let content = fs.readFileSync('src/components/NetworkStatus.tsx', 'utf8');

content = content.replace(/Operating in offline mode. Changes will sync later./, "Please check your internet connection. We'll reconnect you shortly.");

fs.writeFileSync('src/components/NetworkStatus.tsx', content);
