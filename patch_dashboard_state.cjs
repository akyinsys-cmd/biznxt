const fs = require('fs');
let content = fs.readFileSync('src/pages/business-os/index.tsx', 'utf8');

// We want to use location.hash or search to set active tab
content = content.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';\nimport { useLocation, useNavigate } from 'react-router-dom';");
content = content.replace(/const \[activeTab, setActiveTab\] = useState\('projects'\);/, "const location = useLocation();\n  const navigate = useNavigate();\n  const [activeTab, setActiveTab] = useState(() => location.hash.replace('#', '') || 'projects');\n\n  useEffect(() => {\n    if (location.hash) {\n      setActiveTab(location.hash.replace('#', ''));\n    }\n  }, [location.hash]);\n\n  const handleTabChange = (id: string) => {\n    setActiveTab(id);\n    navigate(`#${id}`);\n  };");
content = content.replace(/onClick=\{.*?setActiveTab\(tab\.id\).*?\}/g, "onClick={() => handleTabChange(tab.id)}");

fs.writeFileSync('src/pages/business-os/index.tsx', content);
console.log("Patched Dashboard state");
