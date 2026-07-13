const fs = require('fs');

// Fix AdminWorkspace
let aw = fs.readFileSync('src/components/AdminWorkspace.tsx', 'utf8');
if (!aw.includes("import { auth }")) {
  aw = aw.replace(
    "import { db, auth } from '../lib/firebase';",
    "import { db, auth } from '../lib/firebase';\nimport { logUserActivity } from './widgets/UserActivityLogger';"
  );
}

// I see my previous patch did replace it, but maybe it missed if `auth` wasn't already there?
// Let's check what was actually there.
if (!aw.includes("import { logUserActivity }")) {
   aw = aw.replace(
    "import { db } from '../lib/firebase';",
    "import { db, auth } from '../lib/firebase';\nimport { logUserActivity } from './widgets/UserActivityLogger';"
   );
}
fs.writeFileSync('src/components/AdminWorkspace.tsx', aw);

// Fix MarketplaceHome
let mh = fs.readFileSync('src/pages/marketplace/MarketplaceHome.tsx', 'utf8');
if (!mh.includes("useEffect")) {
  mh = mh.replace(
    "import { useState, useEffect } from 'react';",
    "import { useState, useEffect } from 'react';"
  );
  // Actually the previous replace might have missed because it wasn't exact matching or already had other imports?
  if (mh.includes("import { useState } from 'react';")) {
      mh = mh.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
  }
}
fs.writeFileSync('src/pages/marketplace/MarketplaceHome.tsx', mh);
