const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminLogin.tsx', 'utf8');

// The problematic block:
//           </div>
//           </span>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

// Remove everything after the closing of the form div to the end of the file and replace it with a clean structure
const startIdx = content.lastIndexOf('</form>');
if (startIdx !== -1) {
    const cleanTail = `
            </form>

            {!isForgotPassword && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-900 px-2 text-slate-500 uppercase tracking-widest">Or Access With</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-70 text-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-900" /> : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google SSO
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          <div className="text-center mt-8">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              Protected by Enterprise Security
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
`;
    content = content.substring(0, startIdx) + cleanTail;
    fs.writeFileSync('src/pages/AdminLogin.tsx', content);
    console.log("Fixed AdminLogin syntax");
}
