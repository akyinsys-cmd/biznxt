const fs = require('fs');
let content = fs.readFileSync('src/context/NotificationContext.tsx', 'utf8');

content = content.replace(/export interface Notification \{/, "export interface Notification {\n  link?: string;");

fs.writeFileSync('src/context/NotificationContext.tsx', content);
