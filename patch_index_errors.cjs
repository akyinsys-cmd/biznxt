const fs = require('fs');
let content = fs.readFileSync('src/pages/business-os/index.tsx', 'utf8');

content = content.replace(/import \{ DashboardSkeleton \} from '\.\.\/\.\.\/components\/SkeletonComponent';/, "import { SkeletonComponent } from '../../components/SkeletonComponent';");
content = content.replace(/<DashboardSkeleton \/>/g, '<SkeletonComponent className="w-full h-64" />');
content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';\nimport { useLocation, useNavigate } from 'react-router-dom';");

fs.writeFileSync('src/pages/business-os/index.tsx', content);
console.log("Fixed business-os/index.tsx errors");
