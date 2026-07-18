// ============================================================
// Tewtorify — Signup Page (Minimalist B&W)
// ============================================================

import { useState, useEffect } from 'react';
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
import { EDUCATION_BACKGROUNDS, type EducationBackground } from '@/lib/constants';

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

const inputClass = 'w-full h-12 rounded-lg border border-border-subtle bg-surface text-heading text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all';

export default function SignupPage() {
  const { signup, userProfile } = useAuth();
  const navigate = useNavigate();
  // Steps: 1 = role, 2 = education bg (tutor only), 3 = form
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [sscBackground, setSscBackground] = useState<EducationBackground | null>(null);
  const [hscBackground, setHscBackground] = useState<EducationBackground | null>(null);
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
      await signup(
        data.email,
        data.password,
        data.name,
        data.phone,
        selectedRole,
        sscBackground ?? undefined,
        hscBackground ?? undefined
      );
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
          if (err instanceof Error) {
            setError(`Error: ${err.message}`);
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep1Continue = () => {
    if (!selectedRole) return;
    if (selectedRole === 'tutor') {
      setStep(2); // tutors go to education background step
    } else {
      setStep(3); // guardians skip to form
    }
  };

  const handleStep2Continue = () => {
    if (!sscBackground || !hscBackground) return;
    setStep(3);
  };

  const handleBack = () => {
    if (step === 3) {
      if (selectedRole === 'tutor') {
        setStep(2);
      } else {
        setStep(1);
      }
    } else if (step === 2) {
      setStep(1);
    }
  };

  const roles = [
    {
      value: 'guardian' as UserRole,
      icon: Users,
      title: 'Guardian / Student',
      description: 'আপনার বা আপনার সন্তানের জন্য verified শিক্ষক খুঁজুন। টিউশনের প্রয়োজন post করুন এবং admin-verified শিক্ষক পান।',
      features: ['টিউশন request করুন', 'Admin-verified matching', 'Review দিন'],
    },
    {
      value: 'tutor' as UserRole,
      icon: BookOpen,
      title: 'Tutor',
      description: 'Verified শিক্ষক হিসেবে apply করুন। Admin approval-এর পর open request browse করুন এবং শিক্ষার্থীদের সাথে match হন।',
      features: ['Verified হয়ে blue tick পান', 'Open request browse করুন', 'Reputation তৈরি করুন'],
    },
  ];

  // Step progress indicator for tutors (3 steps) or guardians (2 steps)
  const totalSteps = selectedRole === 'tutor' ? 3 : 2;
  const currentStepIndex = selectedRole === 'tutor' ? step : (step === 1 ? 1 : 2);

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Left Panel — Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] bg-dark flex-col justify-center p-16 relative overflow-hidden">
        {/* Doodle decoration */}
        <svg width="320" height="320" viewBox="0 0 100 100" fill="none" className="absolute -right-16 -bottom-16 text-canvas opacity-5" stroke="currentColor" strokeWidth="1">
          <path d="M 0 50 Q 25 25 50 50 T 100 50" />
          <path d="M 0 62 Q 25 37 50 62 T 100 62" />
          <path d="M 0 74 Q 25 49 50 74 T 100 74" />
          <path d="M 0 86 Q 25 61 50 86 T 100 86" />
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
            Tewtorify তে<br />যোগ দিন
          </h1>
          <p className="text-[17px] text-canvas/70 leading-relaxed mb-12">
            সম্পূর্ণ বিনামূল্যে, community-driven platform। পাবনার verified শিক্ষকদের সাথে connect হন।
          </p>

          <div className="flex flex-col gap-4">
            {[
              'প্রতিটি শিক্ষক manually verified',
              'Admin-approved matching',
              'সম্পূর্ণ বিনামূল্যে',
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-3 text-[15px] text-canvas/90 font-medium">
                <div className="h-6 w-6 rounded-full border border-canvas/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-canvas" />
                </div>
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 bg-canvas overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="h-9 w-9 rounded-lg bg-dark flex items-center justify-center text-canvas shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-heading">Tewtorify</span>
          </div>

          {/* Step Progress Bar */}
          {selectedRole && (
            <div className="flex items-center gap-2 mb-8">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i + 1 <= currentStepIndex ? 'bg-dark' : 'bg-border-subtle'
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              /* Step 1: Role Selection */
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-[32px] font-bold text-heading mb-2 tracking-tight">Sign Up</h2>
                <p className="text-[16px] text-muted mb-10">
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
                        className={`w-full text-left p-6 rounded-[16px] border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-dark bg-dark text-canvas shadow-lg scale-[1.01]'
                            : 'border-border-subtle bg-surface text-heading hover:border-dark hover:bg-canvas'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-canvas/15' : 'bg-canvas border border-border-subtle'
                          }`}>
                            <Icon className={`h-6 w-6 ${isSelected ? 'text-canvas' : 'text-dark'}`} strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 className={`font-bold text-[17px] mb-1 ${isSelected ? 'text-canvas' : 'text-heading'}`}>
                              {role.title}
                            </h3>
                            <p className={`text-sm leading-relaxed mb-3 ${isSelected ? 'text-canvas/80' : 'text-muted'}`}>
                              {role.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {role.features.map((f) => (
                                <span
                                  key={f}
                                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    isSelected
                                      ? 'bg-canvas/15 text-canvas'
                                      : 'bg-surface border border-border-subtle text-muted'
                                  }`}
                                >
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
                  onClick={handleStep1Continue}
                  disabled={!selectedRole}
                  className="w-full h-14 mt-8 rounded-full bg-dark text-canvas font-semibold text-[16px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>

                <p className="mt-8 text-center text-[15px] text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-dark hover:underline">
                    Log In
                  </Link>
                </p>
              </motion.div>
            ) : step === 2 ? (
              /* Step 2: Education Background (Tutor only) */
              <motion.div
                key="step2-bg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-[14px] text-muted hover:text-heading transition-colors mb-8 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <h2 className="text-[32px] font-bold text-heading mb-2 tracking-tight">
                  Education Background
                </h2>
                <p className="text-[16px] text-muted mb-10">
                  আপনার SSC ও HSC এর বিভাগ নির্বাচন করুন — এটি আপনি কোন বিষয়ে পড়াতে পারবেন তা নির্ধারণ করবে
                </p>

                {/* SSC Background */}
                <div className="mb-8">
                  <label className="block text-[15px] font-semibold text-heading mb-4">
                    SSC Background (মাধ্যমিক বিভাগ) *
                  </label>
                  <div className="space-y-3">
                    {EDUCATION_BACKGROUNDS.map((bg) => {
                      const isSelected = sscBackground === bg.value;
                      return (
                        <button
                          key={`ssc-${bg.value}`}
                          type="button"
                          onClick={() => setSscBackground(bg.value)}
                          className={`w-full text-left px-5 py-4 rounded-[14px] border-2 transition-all duration-200 flex items-center gap-4 ${
                            isSelected
                              ? 'border-dark bg-dark text-canvas shadow-md scale-[1.01]'
                              : 'border-border-subtle bg-surface text-heading hover:border-dark/50 hover:bg-canvas'
                          }`}
                        >
                          <span className="text-2xl">{bg.emoji}</span>
                          <div>
                            <span className={`font-semibold text-[15px] ${isSelected ? 'text-canvas' : 'text-heading'}`}>
                              {bg.label}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 ml-auto text-canvas" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* HSC Background */}
                <div className="mb-8">
                  <label className="block text-[15px] font-semibold text-heading mb-4">
                    HSC Background (উচ্চ মাধ্যমিক বিভাগ) *
                  </label>
                  <div className="space-y-3">
                    {EDUCATION_BACKGROUNDS.map((bg) => {
                      const isSelected = hscBackground === bg.value;
                      return (
                        <button
                          key={`hsc-${bg.value}`}
                          type="button"
                          onClick={() => setHscBackground(bg.value)}
                          className={`w-full text-left px-5 py-4 rounded-[14px] border-2 transition-all duration-200 flex items-center gap-4 ${
                            isSelected
                              ? 'border-dark bg-dark text-canvas shadow-md scale-[1.01]'
                              : 'border-border-subtle bg-surface text-heading hover:border-dark/50 hover:bg-canvas'
                          }`}
                        >
                          <span className="text-2xl">{bg.emoji}</span>
                          <div>
                            <span className={`font-semibold text-[15px] ${isSelected ? 'text-canvas' : 'text-heading'}`}>
                              {bg.label}
                            </span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 ml-auto text-canvas" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleStep2Continue}
                  disabled={!sscBackground || !hscBackground}
                  className="w-full h-14 rounded-full bg-dark text-canvas font-semibold text-[16px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </button>

                <p className="mt-8 text-center text-[15px] text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-dark hover:underline">
                    Log In
                  </Link>
                </p>
              </motion.div>
            ) : (
              /* Step 3: Registration Form */
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-[14px] text-muted hover:text-heading transition-colors mb-8 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <h2 className="text-[32px] font-bold text-heading mb-2 tracking-tight">
                  Create account
                </h2>
                <p className="text-[16px] text-muted mb-10">
                  Signing up as{' '}
                  <span className="font-semibold text-dark capitalize">{selectedRole}</span>
                  {selectedRole === 'tutor' && sscBackground && hscBackground && (
                    <span className="block text-[13px] text-muted mt-1">
                      SSC: <span className="font-medium text-heading capitalize">{sscBackground}</span>
                      {' · '}
                      HSC: <span className="font-medium text-heading capitalize">{hscBackground}</span>
                    </span>
                  )}
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
                  {/* Name */}
                  <div>
                    <label htmlFor="signup-name" className="block text-label text-heading mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        className={`${inputClass} pl-11 pr-4`}
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="signup-email" className="block text-label text-heading mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <input
                        id="signup-email"
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

                  {/* Phone */}
                  <div>
                    <label htmlFor="signup-phone" className="block text-label text-heading mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <input
                        id="signup-phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className={`${inputClass} pl-11 pr-4`}
                        {...register('phone')}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="signup-password" className="block text-label text-heading mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
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

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="signup-confirm-password" className="block text-label text-heading mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <input
                        id="signup-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className={`${inputClass} pl-11 pr-4`}
                        {...register('confirmPassword')}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-full bg-dark text-canvas font-semibold text-[16px] shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 rounded-full border-2 border-canvas border-t-transparent animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-[15px] text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-dark hover:underline">
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
