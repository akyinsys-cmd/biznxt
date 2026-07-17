const fs = require('fs');
let content = fs.readFileSync('src/components/widgets/NotificationCenter.tsx', 'utf8');

// Add useNavigate
if (!content.includes('useNavigate')) {
  content = content.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';/, "import { motion, AnimatePresence } from 'motion/react';\nimport { useNavigate } from 'react-router-dom';");
}

if (!content.includes('const navigate = useNavigate();')) {
  content = content.replace(/export function NotificationCenter\(\) \{/, "export function NotificationCenter() {\n  const navigate = useNavigate();");
}

const notifDiv = `
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => {
                        if (!notif.read) markAsRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setIsOpen(false);
                        }
                      }}
                      className={\`p-4 hover:bg-slate-50 transition-colors flex gap-4 \${!notif.read ? 'bg-indigo-50/50' : ''} \${notif.link ? 'cursor-pointer' : ''}\`}
                    >`;

content = content.replace(/\{notifications\.map\(notif => \(\n\s*<div key=\{notif\.id\} className=\{\`p-4 hover:bg-slate-50 transition-colors flex gap-4 \$\{!notif\.read \? 'bg-indigo-50\/50' : ''\}\`\}>/g, notifDiv);

fs.writeFileSync('src/components/widgets/NotificationCenter.tsx', content);
console.log("Patched NotificationCenter with navigation");
