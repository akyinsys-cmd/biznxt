const fs = require('fs');

// Patch ProjectList.tsx
let pl = fs.readFileSync('src/pages/ProjectList.tsx', 'utf8');
pl = pl.replace("import { PremiumDashboardSkeleton } from '../components/SkeletonComponent';", "import { ProjectListSkeleton } from '../components/SkeletonComponent';");
pl = pl.replace("<PremiumDashboardSkeleton />", "<ProjectListSkeleton />");
fs.writeFileSync('src/pages/ProjectList.tsx', pl);

// Patch MarketplaceHome.tsx
let mh = fs.readFileSync('src/pages/marketplace/MarketplaceHome.tsx', 'utf8');

mh = mh.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
if (!mh.includes('MarketplaceGridSkeleton')) {
  mh = mh.replace(
    "import { motion } from 'motion/react';", 
    "import { motion } from 'motion/react';\nimport { MarketplaceGridSkeleton } from '../../components/SkeletonComponent';"
  );
}

// Add loading state
if (!mh.includes('const [loading, setLoading]')) {
  mh = mh.replace(
    "const [selectedCategory, setSelectedCategory] = useState('All');",
    "const [selectedCategory, setSelectedCategory] = useState('All');\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setLoading(false), 1500);\n    return () => clearTimeout(timer);\n  }, []);"
  );
}

// Replace listing grid
mh = mh.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">([\s\S]*?)<\/div>\s*<\/div>\s*\);\s*}\s*$/m,
  `{loading ? <MarketplaceGridSkeleton /> : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
$1
      </div>
      )}
    </div>
  );
}
`
);

fs.writeFileSync('src/pages/marketplace/MarketplaceHome.tsx', mh);
