const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/ValueComparisonModal.tsx', 'utf8');

const newCode = `
                  {features && features.length > 0 && features.map((feat: any, i: number) => {
                    const featureText = typeof feat === 'string' ? feat : (feat.text || feat.name || 'Premium Feature');
                    const isDefault = ["Dedicated Success Manager", "Expert Quality Assurance", "Business Health Scoring", "Priority SLAs", "Zero Hidden Costs"].includes(featureText);
                    if (isDefault) return null;
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 md:p-6 font-medium text-slate-900">{featureText}</td>
                        <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                        <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                    );
                  })}
`;

code = code.replace(/\{features && features\.length > 0 && features\.map\(\(feat: any, i: number\) => \{[\s\S]*?\}\)\}/, newCode.trim());

// Also change the default features array to use strings if we want, or keep the initial one to objects since the mapping handles both. Let's keep the fallback for robust comparison.
fs.writeFileSync('src/components/widgets/ValueComparisonModal.tsx', code);
