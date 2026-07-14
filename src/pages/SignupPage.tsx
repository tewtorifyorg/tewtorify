// ============================================================
// Tewtorify — Signup Page
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle,
  User, Phone, BookOpen, Users, ArrowLeft, ArrowRight, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import type { UserRole } from '@/types';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(11, 'Please enter a valid phone number').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1); // 1 = role selection, 2 = form
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    if (!selectedRole) return;
    setError('');
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.name, data.phone, selectedRole);
      // Redirect based on role
      if (selectedRole === 'tutor') {
        navigate('/tutor/apply');
      } else {
        navigate('/guardian/dashboard');
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in instead.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      value: 'guardian' as UserRole,
      icon: Users,
      title: 'Guardian / Student',
      description: 'Find verified tutors for yourself or your child. Post tuition requests and get AI-matched recommendations.',
      features: ['Post tuition requests', 'AI-powered tutor matching', 'Leave verified reviews'],
    },
    {
      value: 'tutor' as UserRole,
      icon: BookOpen,
      title: 'Tutor',
      description: 'Apply as a verified tutor. After admin approval, browse requests and get matched with students.',
      features: ['Get verified & trusted', 'Browse open requests', 'Build your reputation'],
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-1/3 -right-20 w-60 h-60 rounded-full bg-accent blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center text-white max-w-md"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Join Tewtorify</h1>
          <p className="text-base text-white/70 leading-relaxed">
            A 100% free, donation-funded platform connecting verified tutors
            with students in Pabna. No fees, no commissions — ever.
          </p>

          {/* Trust badges */}
          <div className="mt-10 flex flex-col gap-3">
            {[
              'Manually verified tutors',
              'AI-powered smart matching',
              'Zero fees for everyone',
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Tewtorify</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* ---- Step 1: Role Selection ---- */
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-1">Sign Up</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Choose how you'd like to use Tewtorify
                </p>

                <div className="space-y-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;
                    return (
                      <button
                        key={role.value}
                        onClick={() => setSelectedRole(role.value)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{role.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {role.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {role.features.map((f) => (
                                <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => selectedRole && setStep(2)}
                  disabled={!selectedRole}
                  className="w-full h-11 mt-6 rounded-lg gradient-primary text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Log In
                  </Link>
                </p>
              </motion.div>
            ) : (
              /* ---- Step 2: Registration Form ---- */
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <h2 className="text-2xl font-bold text-foreground mb-1">
                  Create your account
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Signing up as{' '}
                  <span className="font-medium text-primary capitalize">{selectedRole}</span>
                </p>

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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="signup-name" className="block text-sm font-medium text-foreground mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="signup-email"
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

                  {/* Phone */}
                  <div>
                    <label htmlFor="signup-phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="signup-phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        {...register('phone')}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
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

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-foreground mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="signup-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        {...register('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
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
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Log In
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
