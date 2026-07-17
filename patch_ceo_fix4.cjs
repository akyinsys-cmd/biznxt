const fs = require('fs');
let content = fs.readFileSync('src/pages/CEOCommandCenter.tsx', 'utf8');

const regex = /\{auditLogs\.map\(log => \([\s\S]*?\}\)\}/;

const replacement = `{auditLogs.map(log => (
                      <div key={log.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:border-slate-200 bg-slate-50 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-primary transition-colors" />
                        <div className="flex-1 pl-2">
                          <p className="text-sm font-black text-slate-900 mb-1">{log.action || log.actionDescription}</p>
                          {log.category && (
                            <span className="inline-block px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              {log.category}
                            </span>
                          )}
                          {log.details && (
                            <div className="mb-2 p-2 bg-white rounded-lg border border-slate-100 text-[10px] text-slate-600 font-medium">
                              {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Users2 className="w-3 h-3 text-slate-400"/> {log.actorId}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400"/> {new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/pages/CEOCommandCenter.tsx', content);
