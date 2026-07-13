const fs = require('fs');
let code = fs.readFileSync('src/context/ToastContext.tsx', 'utf8');

code = code.replace(
  "type ToastType = 'success' | 'error' | 'info';",
  "type ToastType = 'success' | 'error' | 'info' | 'warning';"
);

code = code.replace(
  "info: (message: string) => void;",
  "info: (message: string) => void;\n  warning: (message: string) => void;"
);

code = code.replace(
  "const info = useCallback((message: string) => addToast('info', message), [addToast]);",
  "const info = useCallback((message: string) => addToast('info', message), [addToast]);\n  const warning = useCallback((message: string) => addToast('warning', message), [addToast]);"
);

code = code.replace(
  "<ToastContext.Provider value={{ toast: addToast, success, error, info, showToast, confirm }}>",
  "<ToastContext.Provider value={{ toast: addToast, success, error, info, warning, showToast, confirm }}>"
);

code = code.replace(
  `t.type === 'error' ? "bg-white border-red-200" :`,
  `t.type === 'error' ? "bg-white border-red-200" :\n                t.type === 'warning' ? "bg-white border-yellow-200" :`
);

code = code.replace(
  `{t.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}`,
  `{t.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}\n                {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}`
);

fs.writeFileSync('src/context/ToastContext.tsx', code);
