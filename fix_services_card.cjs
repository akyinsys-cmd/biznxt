const fs = require('fs');

let code = fs.readFileSync('src/pages/Services.tsx', 'utf8');

const featuresCode = `
                          <p className="text-xs text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        
                        {service.premium_features_list && service.premium_features_list.length > 0 && (
                          <div className="mt-4 space-y-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                            {service.premium_features_list.slice(0, 3).map((feat: any, i: number) => (
                              <div key={i} className="group/tooltip relative flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="text-[11px] text-slate-300 font-medium cursor-help border-b border-dashed border-slate-700 hover:border-emerald-500 transition-colors truncate">
                                  {feat.text}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 bg-slate-800 text-white text-[10px] p-3 rounded-xl shadow-xl z-10 border border-slate-700">
                                  <div className="font-bold text-emerald-400 mb-1 uppercase tracking-wider text-[9px]">ROI & Professional Value</div>
                                  {feat.highlight}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-slate-500 pt-4 border-t border-slate-900">
`;

code = code.replace(
  /<p className="text-xs text-slate-500 line-clamp-3 mt-1\.5 leading-relaxed">\s*\{service\.description\}\s*<\/p>\s*<\/div>\s*<div className="flex items-center space-x-4 text-xs text-slate-500 pt-2 border-t border-slate-900">/m,
  featuresCode
);

fs.writeFileSync('src/pages/Services.tsx', code);
