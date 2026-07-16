// ============================================================
// Tewtorify — Guardian Post Tuition Request Page (Minimalist B&W)
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  BookOpen, MapPin, DollarSign, Loader2, AlertCircle,
  CheckCircle2, ArrowLeft, Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { createTuitionRequest } from '@/lib/firestore';
import {
  CLASS_LEVELS, SUBJECTS, PABNA_THANAS, PABNA_SADAR_AREAS,
  TUTORING_MODES, SALARY_RANGES,
} from '@/lib/constants';

// ---------- Schema ----------

const requestSchema = z.object({
  studentClassLevel: z.string().min(1, 'Select a class level'),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  area: z.string().min(2, 'Enter or select an area'),
  tutoringMode: z.enum(['in-person', 'online', 'both']),
  budgetMin: z.number().min(500, 'Minimum budget must be at least ৳500'),
  budgetMax: z.number().max(30000, 'Maximum budget cannot exceed ৳30,000'),
  preferredTutorGender: z.enum(['male', 'female', 'none']),
  timingPreference: z.string().min(3, 'Describe your preferred timing'),
  isPublicAd: z.boolean(),
  contactInfo: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type RequestForm = z.infer<typeof requestSchema>;

// ---------- Component ----------

export default function GuardianPostRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      subjects: [],
      tutoringMode: 'both',
      budgetMin: 3000,
      budgetMax: 8000,
      preferredTutorGender: 'none',
      isPublicAd: false,
    },
  });

  const watchedClassLevel = watch('studentClassLevel');
  const watchedSubjects = watch('subjects');
  const watchedIsPublicAd = watch('isPublicAd');
  const watchedTutoringMode = watch('tutoringMode');
  const watchedGender = watch('preferredTutorGender');

  const getAvailableSubjects = () => {
    if (!watchedClassLevel) return [];
    const level = CLASS_LEVELS.find((l) => l.value === watchedClassLevel);
    if (!level) return [];
    return SUBJECTS[level.group] || [];
  };

  const toggleSubject = (subject: string) => {
    const current = watchedSubjects;
    const updated = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    setValue('subjects', updated, { shouldValidate: true });
  };

  const getSalaryHint = () => {
    if (!watchedClassLevel) return null;
    const level = CLASS_LEVELS.find((l) => l.value === watchedClassLevel);
    if (!level) return null;
    const range = SALARY_RANGES[level.group];
    return range ? `Typical: ৳${range.defaultMin.toLocaleString()} – ৳${range.defaultMax.toLocaleString()}/month` : null;
  };

  const onSubmit = async (data: RequestForm) => {
    if (!user) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await createTuitionRequest({
        guardianUid: user.uid,
        studentClassLevel: data.studentClassLevel,
        subjects: data.subjects,
        area: data.area,
        tutoringMode: data.tutoringMode,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        preferredTutorGender: data.preferredTutorGender === 'none' ? null : data.preferredTutorGender,
        timingPreference: data.timingPreference,
        status: 'open',
        isPublicAd: data.isPublicAd,
        contactInfo: data.isPublicAd ? data.contactInfo : undefined,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-canvas">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <div className="h-20 w-20 rounded-full border-2 border-dark text-dark flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-h2 text-heading mb-4">Request Submitted</h1>
          <p className="text-body text-muted leading-relaxed">
            Your tuition request has been posted. Our system will match you with verified
            tutors who fit your requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/guardian/dashboard"
              className="px-8 py-3.5 rounded-full bg-dark text-canvas text-label transition-transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                window.scrollTo(0, 0);
              }}
              className="px-8 py-3.5 rounded-full border-2 border-border-subtle text-label text-heading hover:border-dark transition-colors"
            >
              Post Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const classLevelGroups = CLASS_LEVELS.reduce((acc, cl) => {
    if (!acc[cl.group]) acc[cl.group] = [];
    acc[cl.group].push(cl);
    return acc;
  }, {} as Record<string, typeof CLASS_LEVELS[number][]>);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-16 lg:pt-0 bg-canvas">
      {/* Left Panel (Context/Reassurance) */}
      <div className="w-full lg:w-2/5 bg-dark p-8 lg:p-16 flex flex-col justify-center min-h-[300px] lg:min-h-screen relative overflow-hidden">
        {/* Subtle SVG Doodle */}
        <svg width="300" height="300" viewBox="0 0 100 100" fill="none" className="absolute -left-10 -bottom-10 text-canvas opacity-5" stroke="currentColor" strokeWidth="1">
           <path d="M 0 50 Q 25 25 50 50 T 100 50" />
           <path d="M 0 60 Q 25 35 50 60 T 100 60" />
           <path d="M 0 70 Q 25 45 50 70 T 100 70" />
        </svg>

        <div className="relative z-10">
          <Link
            to="/guardian/dashboard"
            className="inline-flex items-center gap-2 text-canvas/70 hover:text-canvas mb-12 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          
          <h2 className="text-[40px] font-bold text-canvas mb-6 leading-tight tracking-tight">Let's find your <br/>perfect tutor.</h2>
          
          <p className="text-body-lg text-canvas/70 mb-12 max-w-sm">
            Takes under 2 minutes. We'll match you with verified, admin-approved tutors near you.
          </p>

          <div className="space-y-6 hidden lg:block">
            {[
              { label: 'AI-matched based on subject & location' },
              { label: '100% free for guardians & students' },
              { label: 'Verified & trusted teachers only' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-canvas/90 text-[15px] font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-canvas/30">
                  <CheckCircle2 className="h-4 w-4 text-canvas" />
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel (The Form) */}
      <div className="w-full lg:w-3/5 bg-canvas p-6 lg:p-16 overflow-y-auto lg:h-screen">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-12 pb-24 lg:pb-12">
          
          {/* Class & Subjects */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
              <BookOpen className="h-5 w-5 text-dark" strokeWidth={1.5} />
              <h3 className="text-[20px] font-bold text-heading">Class & Subjects</h3>
            </div>

            <div className="space-y-8">
              <div>
                <label htmlFor="class-level" className="block text-label text-heading mb-3">
                  Student's Class Level
                </label>
                <select
                  id="class-level"
                  className="w-full h-14 px-4 rounded-[12px] border border-border-subtle bg-surface text-body focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all"
                  {...register('studentClassLevel')}
                >
                  <option value="">Select class level</option>
                  {Object.entries(classLevelGroups).map(([group, levels]) => (
                    <optgroup key={group} label={group}>
                      {levels.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {errors.studentClassLevel && (
                  <p className="mt-2 text-xs text-red-500 font-medium">{errors.studentClassLevel.message}</p>
                )}
              </div>

              <div>
                <label className="block text-label text-heading mb-4">
                  Required Subjects
                </label>
                {!watchedClassLevel ? (
                  <p className="text-sm text-muted italic">Select a class level to see subjects</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {getAvailableSubjects().map((subject) => {
                      const isSelected = watchedSubjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                            isSelected
                              ? 'bg-dark text-canvas border-dark shadow-sm'
                              : 'bg-surface border-border-subtle text-body hover:border-dark hover:bg-canvas'
                          }`}
                        >
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                )}
                {errors.subjects && (
                  <p className="mt-2 text-xs text-red-500 font-medium">{errors.subjects.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location & Mode */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
              <MapPin className="h-5 w-5 text-dark" strokeWidth={1.5} />
              <h3 className="text-[20px] font-bold text-heading">Location & Mode</h3>
            </div>

            <div className="space-y-8">
              <div>
                <label htmlFor="area" className="block text-label text-heading mb-3">
                  Area
                </label>
                <input
                  id="area"
                  type="text"
                  list="area-suggestions"
                  placeholder="e.g., Shalgaria, Ishwardi, Pabna Sadar"
                  className="w-full h-14 px-4 rounded-[12px] border border-border-subtle bg-surface text-body focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all"
                  {...register('area')}
                />
                <datalist id="area-suggestions">
                  {[...PABNA_THANAS, ...PABNA_SADAR_AREAS].map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
                {errors.area && (
                  <p className="mt-2 text-xs text-red-500 font-medium">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-label text-heading mb-4">
                  Tutoring Mode
                </label>
                <div className="flex flex-wrap gap-3">
                  {TUTORING_MODES.map((mode) => (
                    <label
                      key={mode.value}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer transition-all duration-200 border ${
                        watchedTutoringMode === mode.value
                          ? 'border-dark bg-dark text-canvas shadow-sm'
                          : 'border-border-subtle bg-surface text-body hover:border-dark hover:bg-canvas'
                      }`}
                    >
                      <input
                        type="radio"
                        value={mode.value}
                        {...register('tutoringMode')}
                        className="sr-only"
                      />
                      <span className="text-[15px] font-medium">{mode.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Budget & Preferences */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
              <DollarSign className="h-5 w-5 text-dark" strokeWidth={1.5} />
              <h3 className="text-[20px] font-bold text-heading">Budget & Preferences</h3>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-label text-heading mb-3">
                  Monthly Budget (BDT)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="budget-min" className="block text-[13px] text-muted mb-2 font-medium">Minimum</label>
                    <Controller
                      name="budgetMin"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="budget-min"
                          type="number"
                          min={500}
                          step={500}
                          className="w-full h-14 px-4 rounded-[12px] border border-border-subtle bg-surface text-body focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label htmlFor="budget-max" className="block text-[13px] text-muted mb-2 font-medium">Maximum</label>
                    <Controller
                      name="budgetMax"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="budget-max"
                          type="number"
                          min={500}
                          step={500}
                          className="w-full h-14 px-4 rounded-[12px] border border-border-subtle bg-surface text-body focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </div>
                </div>
                {(errors.budgetMin || errors.budgetMax) && (
                  <p className="mt-2 text-xs text-red-500 font-medium">
                    {errors.budgetMin?.message || errors.budgetMax?.message}
                  </p>
                )}
                {getSalaryHint() && (
                  <p className="mt-3 text-[13px] text-muted font-medium bg-surface inline-block px-3 py-1.5 rounded-lg border border-border-subtle">{getSalaryHint()}</p>
                )}
              </div>

              <div>
                <label className="block text-label text-heading mb-4">
                  Preferred Tutor Gender
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'none', label: 'No Preference' },
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer transition-all duration-200 border ${
                        watchedGender === opt.value
                          ? 'border-dark bg-dark text-canvas shadow-sm'
                          : 'border-border-subtle bg-surface text-body hover:border-dark hover:bg-canvas'
                      }`}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        {...register('preferredTutorGender')}
                        className="sr-only"
                      />
                      <span className="text-[15px] font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="timing" className="block text-label text-heading mb-3">
                  Preferred Timing
                </label>
                <input
                  id="timing"
                  type="text"
                  placeholder="e.g., Saturday–Thursday, 4 PM – 6 PM"
                  className="w-full h-14 px-4 rounded-[12px] border border-border-subtle bg-surface text-body focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all"
                  {...register('timingPreference')}
                />
                {errors.timingPreference && (
                  <p className="mt-2 text-xs text-red-500 font-medium">{errors.timingPreference.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Public Ad Toggle */}
          <div className="p-8 rounded-[20px] bg-surface border border-border-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-heading">Make this a Public Ad?</h3>
                <p className="text-[14px] text-muted mt-1">
                  Public ads are visible to everyone, not just matched tutors
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('isPublicAd')}
                />
                <div className="w-14 h-8 bg-border-subtle peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-dark rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-canvas after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-canvas after:border-border-subtle after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-dark shadow-inner"></div>
              </label>
            </div>

            {watchedIsPublicAd && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 pt-8 border-t border-border-subtle"
              >
                <label htmlFor="contact-info" className="block text-label text-heading mb-3">
                  Contact Info (visible in public ad)
                </label>
                <input
                  id="contact-info"
                  type="text"
                  placeholder="e.g., 01XXXXXXXXX or your preferred contact method"
                  className="w-full h-14 px-4 rounded-[12px] border border-border-subtle bg-canvas text-body focus:outline-none focus:ring-2 focus:ring-dark focus:border-dark transition-all"
                  {...register('contactInfo')}
                />
              </motion.div>
            )}
          </div>

          {/* Error */}
          {submitError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {submitError}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 rounded-full bg-dark text-canvas text-[16px] font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Post Tuition Request
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
