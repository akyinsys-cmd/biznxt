import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Smartphone, 
  ArrowRight, 
  ShieldCheck, 
  User as UserIcon, 
  Lock, 
  ChevronLeft, 
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  emailSignIn, 
  emailSignUp, 
  resetPassword, 
  simulatePhoneSignIn, 
  simulateVerifyOtp,
  signInWithGoogle
} from '../lib/auth';
import { useToast } from '../context/ToastContext';

type ScreenMode = 'signin' | 'signup' | 'forgot' | 'otp-verify';

export default function Login() {
  const [screenMode, setScreenMode] = useState<ScreenMode>('signin');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Countdown State
  const [countdown, setCountdown] = useState(60);

  const navigate = useNavigate();
  const { success, error: showToastError } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (screenMode === 'otp-verify' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [screenMode, countdown]);


  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (screenMode === 'signin') {
        // Validation
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }
        await emailSignIn(email, password);
        success('Logged in successfully!');
        navigate('/dashboard');
      } else {
        // Sign Up Validation
        if (!email || !password || !displayName) {
          throw new Error('Please fill in all registration fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await emailSignUp(email, password, displayName);
        success('Account created successfully! Welcome aboard.');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Email Auth failed', err);
      let errorMsg = 'An unexpected error occurred.';
      if (err.code === 'auth/user-not-found') {
        errorMsg = 'No user account found with this email. You can switch to the Sign Up tab to create one.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'Incorrect email or password. Please verify and try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'An account already exists with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Your password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
      } else {
        errorMsg = 'Something went wrong. Please try again.';
      }
      setAuthError(errorMsg);
      showToastError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      success('Logged in successfully with Google!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google Auth failed', err);
      const msg = err.message || 'Failed to log in with Google.';
      setAuthError(msg);
      showToastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      await resetPassword(email);
      success(`Password reset link sent to ${email}. Please check your inbox.`);
      setScreenMode('signin');
    } catch (err: any) {
      const msg = err.message || 'Failed to send reset email.';
      setAuthError(msg);
      showToastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      await simulatePhoneSignIn(phoneNumber);
      success('OTP Sent successfully to ' + phoneNumber);
      setCountdown(60);
      setScreenMode('otp-verify');
    } catch (err: any) {
      const msg = err.message || 'Failed to send OTP.';
      setAuthError(msg);
      showToastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      await simulateVerifyOtp(phoneNumber, otpCode);
      success('Mobile verified! Signed in successfully.');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.message || 'Verification failed.';
      setAuthError(msg);
      showToastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50 min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-center px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary-dark/40 via-slate-900 to-slate-900" />
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-2xl text-primary-light text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>biznxt.online 3.0 Enterprise Engine</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-6 leading-tight">
            The Digital Operating System for Venture Success
          </h1>
          <p className="text-lg text-slate-400 mb-12">
            Unifying professional research workflows, deep economic AI analytics, and registered expert consultant milestones under a single secure ledger.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Attribute-Based Security</h4>
                <p className="text-sm text-slate-500">Strict zero-trust data firewalls protecting corporate intellectual properties.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <UserIcon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Dynamic Role Isolation</h4>
                <p className="text-sm text-slate-500">Instant system adaptation across Customers, Research Executives, BSMs, and Admins.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo header for small screens */}
          <div className="text-center mb-8 lg:hidden">
            <span className="text-3.5xl font-display font-bold text-slate-900 tracking-tight">
              biznxt<span className="text-primary">.online</span>
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
            {/* Header Content */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                {screenMode === 'signin' && (
                  <motion.div
                    key="signin-head"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900">Sign in to biznxt.online</h2>
                    <p className="text-sm text-slate-500 mt-1">Unlock your workspace, reports, and launch checklists.</p>
                  </motion.div>
                )}
                {screenMode === 'signup' && (
                  <motion.div
                    key="signup-head"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
                    <p className="text-sm text-slate-500 mt-1">Join the ultimate platform for modern entrepreneurs.</p>
                  </motion.div>
                )}
                {screenMode === 'forgot' && (
                  <motion.div
                    key="forgot-head"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-sm text-slate-500 mt-1">Provide your email address to recover your account.</p>
                  </motion.div>
                )}
                {screenMode === 'otp-verify' && (
                  <motion.div
                    key="otp-head"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900">Verify Code</h2>
                    <p className="text-sm text-slate-500 mt-1">We sent an OTP to {phoneNumber}. Enter it below.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Message Panel */}
            <AnimatePresence>
              {authError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start space-x-2 overflow-hidden"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{authError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms and Inputs */}
            <div className="space-y-4">
              {/* Login Methods Selection (only for signin screen) */}
              {screenMode === 'signin' && (
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                  <button
                    onClick={() => { setLoginMethod('email'); setAuthError(null); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                      loginMethod === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email & Password</span>
                  </button>
                  <button
                    onClick={() => { setLoginMethod('phone'); setAuthError(null); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2 ${
                      loginMethod === 'phone' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Phone OTP</span>
                  </button>
                </div>
              )}

              {/* Dynamic Screens */}
              <AnimatePresence mode="wait">
                {/* 1. SIGN IN SCREEN */}
                {screenMode === 'signin' && (
                  <motion.div
                    key="signin-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {loginMethod === 'email' ? (
                      <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                          <div className="relative">
                            <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                          <div className="relative">
                            <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 focus:outline-none"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="rounded text-primary focus:ring-primary/20 border-slate-300 w-4 h-4" 
                            />
                            <span className="text-slate-600">Remember me</span>
                          </label>
                          <button 
                            type="button"
                            onClick={() => { setScreenMode('forgot'); setAuthError(null); }}
                            className="text-primary hover:text-primary-dark font-medium"
                          >
                            Forgot password?
                          </button>
                        </div>

                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                        >
                          {loading ? 'Signing in...' : 'Sign In'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium text-sm">
                              +91
                            </span>
                            <div className="relative flex-1">
                              <Smartphone className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input 
                                type="tel" 
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                                placeholder="Enter 10-digit mobile number"
                                pattern="[0-9]{10}"
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70"
                        >
                          {loading ? 'Sending OTP...' : 'Send OTP'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </form>
                    )}

                    <div className="relative mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or continue with</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="mt-6 w-full flex items-center justify-center py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 text-sm font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </button>

                  </motion.div>
                )}
                {/* 2. SIGN UP SCREEN */}
                {screenMode === 'signup' && (
                  <motion.div
                    key="signup-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                          <UserIcon className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text" 
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <div className="relative">
                          <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                          <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                            placeholder="At least 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 text-sm"
                      >
                        {loading ? 'Creating Account...' : 'Register'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 3. FORGOT PASSWORD SCREEN */}
                {screenMode === 'forgot' && (
                  <motion.div
                    key="forgot-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <div className="relative">
                          <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 text-sm"
                      >
                        {loading ? 'Sending link...' : 'Send Recovery Link'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => { setScreenMode('signin'); setAuthError(null); }}
                        className="w-full flex items-center justify-center space-x-1 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to Sign In</span>
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 4. OTP VERIFICATION SCREEN */}
                {screenMode === 'otp-verify' && (
                  <motion.div
                    key="otp-verify-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-slate-700">Verification Code</label>
                          <span className="text-xs text-slate-500 font-mono">Sandbox default: 123456</span>
                        </div>
                        <div className="relative">
                          <KeyRound className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text" 
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-sm tracking-widest font-mono text-center"
                            placeholder="••••••"
                            pattern="[0-9]{6}"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        {countdown > 0 ? (
                          <span className="text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Resend in {countdown}s</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setCountdown(60);
                              success('New verification code sent!');
                            }}
                            className="text-primary hover:text-primary-dark font-medium"
                          >
                            Resend Verification Code
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => { setScreenMode('signin'); setAuthError(null); }}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          Change Number
                        </button>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 text-sm"
                      >
                        {loading ? 'Verifying...' : 'Verify & Log In'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom link toggle */}
            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
              {screenMode === 'signin' ? (
                <>
                  <p>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => { setScreenMode('signup'); setAuthError(null); }} 
                      className="font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Create account
                    </button>
                  </p>
                  <div className="mt-4">
                    <button 
                      onClick={() => navigate('/admin-login')} 
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center mx-auto gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      Admin Login
                    </button>
                  </div>
                </>
              ) : (
                screenMode === 'signup' && (
                  <p>
                    Already have an account?{' '}
                    <button 
                      onClick={() => { setScreenMode('signin'); setAuthError(null); }} 
                      className="font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                )
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
