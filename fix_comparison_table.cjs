const fs = require('fs');
let code = fs.readFileSync('src/components/widgets/ValueComparisonModal.tsx', 'utf8');

const tableLayout = `
          <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 md:p-6 font-bold text-slate-900 w-1/3">Feature / Deliverable</th>
                    <th className="p-4 md:p-6 font-bold text-slate-500 w-1/3 border-l border-slate-200 text-center">Standard Market Approach<br/><span className="text-sm font-normal">₹{(service.benchmark_price || service.price || 0).toLocaleString()}</span></th>
                    <th className="p-4 md:p-6 font-black text-primary w-1/3 border-l border-slate-200 bg-indigo-50/50 text-center relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-500" />
                      BizNxt Premium<br/><span className="text-sm font-normal text-slate-900">₹{(service.biznxt_price || service.price || 0).toLocaleString()}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Document Preparation</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center">Basic automated templates</td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Custom drafted by specialists</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Quality Assurance</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Expert Review & Multi-point QA</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Business Health Score</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">AI-driven compliance tracking</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Support SLA</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center">Reactive (24-48hrs)</td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Priority 4hr guaranteed response</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 md:p-6 font-medium text-slate-900">Account Management</td>
                    <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                    <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">Dedicated Success Manager</td>
                  </tr>
                  {features && features.length > 0 && features.map((feat: any, i: number) => {
                    const isDefault = ["Dedicated Success Manager", "Expert Quality Assurance", "Business Health Scoring", "Priority SLAs", "Zero Hidden Costs"].includes(feat.text || feat.name);
                    if (isDefault) return null;
                    return (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 md:p-6 font-medium text-slate-900">{feat.text || feat.name}</td>
                        <td className="p-4 md:p-6 text-slate-500 text-sm border-l border-slate-200 text-center flex justify-center"><X className="w-5 h-5 text-rose-400" /></td>
                        <td className="p-4 md:p-6 text-slate-900 text-sm font-medium border-l border-slate-200 bg-indigo-50/10 text-center">{feat.highlight || feat.roi || <Check className="w-5 h-5 text-emerald-500 mx-auto" />}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
`;

code = code.replace(/<div className="p-6 md:p-8 overflow-y-auto no-scrollbar">[\s\S]*?<\/div>\s*<\/div>\s*<div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">/, tableLayout + '\n          <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">');

fs.writeFileSync('src/components/widgets/ValueComparisonModal.tsx', code);
