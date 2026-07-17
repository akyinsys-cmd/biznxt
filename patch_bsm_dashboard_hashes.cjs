const fs = require('fs');
let content = fs.readFileSync('src/pages/BSMDashboard.tsx', 'utf8');

content = content.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';\nimport { useLocation, useNavigate } from 'react-router-dom';");
content = content.replace(/const \[activeTab, setActiveTab\] = useState\('customers'\);/, "const location = useLocation();\n  const navigate = useNavigate();\n  const [activeTab, setActiveTab] = useState(() => location.hash.replace('#', '') || 'customers');\n\n  useEffect(() => {\n    if (location.hash) {\n      setActiveTab(location.hash.replace('#', ''));\n    }\n  }, [location.hash]);\n\n  const handleTabChange = (id: string) => {\n    setActiveTab(id);\n    navigate(`#${id}`);\n  };");
content = content.replace(/onClick=\{.*?setActiveTab\(tab\.id\).*?\}/g, "onClick={() => handleTabChange(tab.id)}");

fs.writeFileSync('src/pages/BSMDashboard.tsx', content);
console.log("Patched BSMDashboard hashes");
