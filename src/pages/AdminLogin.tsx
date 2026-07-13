import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldAlert, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { emailSignIn, signInWithGoogle, resetPassword } from '../lib/auth';
import { useToast } from '../context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { success, error: showToastError } = useToast();

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      if (isForgotPassword) {
        if (!email) throw new Error('Please enter your email to reset password.');
        await resetPassword(email);
        success('Password reset email sent! Check your inbox.');
        setIsForgotPassword(false);
      } else {
        if (!email || !password) throw new Error('Please enter both email and password.');
        const user = await emailSignIn(email, password);
        
        // Fetch role directly to verify before redirecting
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const userRole = userData?.role;

        if (userRole === 'super_admin') {
          success('Super Admin authorized successfully!');
          navigate('/admin');
        } else if (userRole === 'manager') {
          success('Manager authorized successfully!');
          navigate('/bsm');
        } else {
          setAuthError('Unauthorized access. This portal is for Administrators only.');
          showToastError('Unauthorized access.');
        }
      }
    } catch (err: any) {
      console.error('Admin Auth failed', err);
      let errorMsg = err.message || 'An unexpected error occurred.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid admin credentials or restricted access.';
      }
      setAuthError(errorMsg);
      showToastError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await signInWithGoogle();
      
      // Fetch role directly to verify before redirecting
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const userRole = userData?.role;

      if (userRole === 'super_admin') {
        success('Super Admin authorized via Google!');
        navigate('/admin');
      } else if (userRole === 'manager') {
        success('Manager authorized via Google!');
        navigate('/bsm');
      } else {
        setAuthError('Unauthorized access. This portal is for Administrators only.');
        showToastError('Unauthorized access.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google Auth failed');
      showToastError(err.message || 'Google Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-[#0B1120] min-h-screen font-sans">
      <div className="w-full flex items-center justify-center p-4 sm:p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B1120] to-[#0B1120]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Enterprise Control
            </h1>
            <p className="text-sm text-slate-400 mt-2 tracking-wide uppercase">Super Admin Portal</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400 flex items-start gap-3"
              >
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </motion.div>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Admin Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white text-sm"
                    placeholder="admin@biznxt.online"
                  />
                </div>
              </div>

              <AnimatePresence>
                {!isForgotPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required={!isForgotPassword}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 text-blue-500 focus:ring-blue-500/50 bg-slate-800/50" />
                  <span className="ml-2 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember session</span>
                </label>
                <button 
                  type="button"
                  onClick={() => setIsForgotPassword(!isForgotPassword)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
                </button>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
                >
                  {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : 'Secure Login')}
                  {!loading && (isForgotPassword ? <KeyRound className="ml-2 w-4 h-4" /> : <ArrowRight className="ml-2 w-4 h-4" />)}
                </button>
              </div>
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
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google SSO
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
