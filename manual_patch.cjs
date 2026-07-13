const fs = require('fs');

let aw = fs.readFileSync('src/components/AdminWorkspace.tsx', 'utf8');

// The original import might be `import { db } from '../lib/firebase';`
aw = aw.replace(
  "import { db } from '../lib/firebase';", 
  "import { db, auth } from '../lib/firebase';\nimport { logUserActivity } from './widgets/UserActivityLogger';"
);

fs.writeFileSync('src/components/AdminWorkspace.tsx', aw);

let mh = fs.readFileSync('src/pages/marketplace/MarketplaceHome.tsx', 'utf8');
if (mh.includes("import { useState } from 'react';")) {
    mh = mh.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
}
fs.writeFileSync('src/pages/marketplace/MarketplaceHome.tsx', mh);
