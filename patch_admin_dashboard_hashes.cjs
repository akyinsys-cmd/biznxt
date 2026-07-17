const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

content = content.replace(/import React, \{ useState, useEffect, useRef \} from 'react';/, "import React, { useState, useEffect, useRef } from 'react';\nimport { useLocation, useNavigate } from 'react-router-dom';");
content = content.replace(/const \[activeTab, setActiveTab\] = useState\('overview'\);/, "const location = useLocation();\n  const navigate = useNavigate();\n  const [activeTab, setActiveTab] = useState(() => location.hash.replace('#', '') || 'auth');\n\n  useEffect(() => {\n    if (location.hash) {\n      setActiveTab(location.hash.replace('#', ''));\n    }\n  }, [location.hash]);\n\n  const handleTabChange = (id: string) => {\n    setActiveTab(id);\n    navigate(`#${id}`);\n  };");
content = content.replace(/onClick=\{.*?setActiveTab\(tab\.id\).*?\}/g, "onClick={() => handleTabChange(tab.id)}");

fs.writeFileSync('src/pages/AdminDashboard.tsx', content);
console.log("Patched AdminDashboard hashes");
