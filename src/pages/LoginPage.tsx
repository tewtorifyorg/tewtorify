// ============================================================
// Tewtorify — Login Page
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
    <div className="min-h-screen flex">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-60 h-60 rounded-full bg-accent/8 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center text-white max-w-md"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">স্বাগতম Tewtorify তে</h1>
          <p className="text-base text-white/65 leading-relaxed">
            পাবনার verified শিক্ষকদের সাথে আবার connect করুন।
            সম্পূর্ণ বিনামূল্যে, community-driven.
          </p>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Tewtorify</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Log In</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Enter your credentials to access your account
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full h-11 pl-10 pr-11 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg gradient-primary text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
