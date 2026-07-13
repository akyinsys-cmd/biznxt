const fs = require('fs');

let mh = fs.readFileSync('src/pages/marketplace/MarketplaceHome.tsx', 'utf8');
if (mh.includes("import React, { useState } from 'react';")) {
    mh = mh.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");
}
fs.writeFileSync('src/pages/marketplace/MarketplaceHome.tsx', mh);
