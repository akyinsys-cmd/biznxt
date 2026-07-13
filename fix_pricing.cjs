const fs = require('fs');
let code = fs.readFileSync('src/lib/pricingService.ts', 'utf8');

code = code.replace(/export function calculatePremiumPrice[\s\S]*/, "");
fs.writeFileSync('src/lib/pricingService.ts', code);
