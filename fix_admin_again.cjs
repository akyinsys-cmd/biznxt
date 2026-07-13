const fs = require('fs');

let code = fs.readFileSync('src/components/AdminWorkspace.tsx', 'utf8');

const replacement = `                      <PricingAdminConfig />
                    </div>

                    <div className="lg:col-span-4 glass-card p-12 rounded-[3.5rem] flex flex-col justify-between">`;

code = code.replace(
  /                      <PricingAdminConfig \/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div className="lg:col-span-4 glass-card p-12 rounded-\[3\.5rem\] flex flex-col justify-between">/m,
  replacement
);

fs.writeFileSync('src/components/AdminWorkspace.tsx', code);
