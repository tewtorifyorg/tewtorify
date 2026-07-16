// ============================================================
// Tewtorify — Login Page (Minimalist B&W)
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const inputClass = 'w-full h-12 rounded-lg border border-border-subtle bg-surface text-heading text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all';

export default function LoginPage() {
  const { login, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (userProfile) {
      if (userProfile.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (userProfile.role === 'tutor') navigate('/tutor/dashboard', { replace: true });
      else navigate('/guardian/dashboard', { replace: true });
    }
  }, [userProfile, navigate]);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setIsLoading(true);
    try {
      const profile = await login(data.email, data.password);
      
      let redirectPath = from;
      if (from === '/') {
        if (profile?.role === 'admin') redirectPath = '/admin/dashboard';
        else if (profile?.role === 'guardian') redirectPath = '/guardian/dashboard';
        else if (profile?.role === 'tutor') redirectPath = '/tutor/dashboard';
      }
      
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many login attempts. Please try again later.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Left Panel — Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-dark flex-col justify-center p-16 relative overflow-hidden">
        {/* Doodle decoration */}
        <svg width="280" height="280" viewBox="0 0 100 100" fill="none" className="absolute -right-10 top-10 text-canvas opacity-5" stroke="currentColor" strokeWidth="1">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="25" />
          <circle cx="50" cy="50" r="15" />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-sm"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="h-10 w-10 rounded-lg bg-canvas/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-canvas" />
            </div>
            <span className="text-xl font-bold text-canvas">Tewtorify</span>
          </div>

          <h1 className="text-[42px] font-bold text-canvas leading-tight tracking-tight mb-6">
            স্বাগতম<br />Tewtorify তে
          </h1>
          <p className="text-[17px] text-canvas/70 leading-relaxed">
            পাবনার verified শিক্ষকদের সাথে আবার connect করুন। সম্পূর্ণ বিনামূল্যে, community-driven.
          </p>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 bg-canvas">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-lg bg-dark flex items-center justify-center text-canvas shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-heading">Tewtorify</span>
          </div>

          <h2 className="text-[32px] font-bold text-heading mb-2 tracking-tight">Log In</h2>
          <p className="text-[16px] text-muted mb-10">
            Enter your credentials to access your account
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-label text-heading mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className={`${inputClass} pl-11 pr-4`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-label text-heading mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`${inputClass} pl-11 pr-12`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-dark text-canvas font-semibold text-[16px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-canvas border-t-transparent animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[15px] text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-dark hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
