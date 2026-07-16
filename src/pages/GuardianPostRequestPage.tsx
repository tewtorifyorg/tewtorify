// ============================================================
// Tewtorify — Guardian Post Tuition Request Page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  BookOpen, MapPin, DollarSign, User, Loader2, AlertCircle,
  CheckCircle2, ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { createTuitionRequest } from '@/lib/firestore';
import {
  CLASS_LEVELS, SUBJECTS, PABNA_THANAS, PABNA_SADAR_AREAS,
  TUTORING_MODES, GENDER_OPTIONS, SALARY_RANGES,
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

  // Get subjects based on selected class level
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

  // Get salary range hint
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
        adStatus: data.isPublicAd ? 'pending' : 'approved',
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

  // Success State
  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <div className="h-16 w-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your tuition request has been posted. Our system will match you with verified
            tutors who fit your requirements. You'll be able to see matches in your dashboard.
          </p>
          {watchedIsPublicAd && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> Your public ad is pending admin approval. It will be visible in Tuition Ads once approved.
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              to="/guardian/dashboard"
              className="px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-md"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                window.scrollTo(0, 0);
              }}
              className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Post Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Group class levels for display
  const classLevelGroups = CLASS_LEVELS.reduce((acc, cl) => {
    if (!acc[cl.group]) acc[cl.group] = [];
    acc[cl.group].push(cl);
    return acc;
  }, {} as Record<string, typeof CLASS_LEVELS[number][]>);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link
            to="/guardian/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Post Tuition Request</h1>
          <p className="text-muted-foreground mt-1">
            Tell us what you need and we'll match you with the right tutor
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Class Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Class & Subjects</h2>
            </div>

            {/* Class Level Select */}
            <div className="mb-4">
              <label htmlFor="class-level" className="block text-sm font-medium text-foreground mb-1.5">
                Student's Class Level *
              </label>
              <select
                id="class-level"
                className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                <p className="mt-1 text-xs text-destructive">{errors.studentClassLevel.message}</p>
              )}
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Required Subjects *
              </label>
              {!watchedClassLevel ? (
                <p className="text-sm text-muted-foreground italic">Select a class level to see subjects</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {getAvailableSubjects().map((subject) => {
                    const isSelected = watchedSubjects.includes(subject);
                    return (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => toggleSubject(subject)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'gradient-primary text-white shadow-sm'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.subjects && (
                <p className="mt-2 text-xs text-destructive">{errors.subjects.message}</p>
              )}
            </div>
          </motion.div>

          {/* Location & Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Location & Mode</h2>
            </div>

            {/* Area */}
            <div className="mb-4">
              <label htmlFor="area" className="block text-sm font-medium text-foreground mb-1.5">
                Area *
              </label>
              <input
                id="area"
                type="text"
                list="area-suggestions"
                placeholder="e.g., Shalgaria, Ishwardi, Pabna Sadar"
                className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register('area')}
              />
              <datalist id="area-suggestions">
                {[...PABNA_THANAS, ...PABNA_SADAR_AREAS].map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
              {errors.area && (
                <p className="mt-1 text-xs text-destructive">{errors.area.message}</p>
              )}
            </div>

            {/* Tutoring Mode */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tutoring Mode *
              </label>
              <div className="flex flex-wrap gap-3">
                {TUTORING_MODES.map((mode) => (
                  <label
                    key={mode.value}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                      watch('tutoringMode') === mode.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      value={mode.value}
                      {...register('tutoringMode')}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Budget & Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Budget & Preferences</h2>
            </div>

            {/* Budget Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Monthly Budget (BDT) *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget-min" className="block text-xs text-muted-foreground mb-1">Minimum</label>
                  <Controller
                    name="budgetMin"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="budget-min"
                        type="number"
                        min={500}
                        step={500}
                        className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="budget-max" className="block text-xs text-muted-foreground mb-1">Maximum</label>
                  <Controller
                    name="budgetMax"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="budget-max"
                        type="number"
                        min={500}
                        step={500}
                        className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </div>
              </div>
              {(errors.budgetMin || errors.budgetMax) && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.budgetMin?.message || errors.budgetMax?.message}
                </p>
              )}
              {getSalaryHint() && (
                <p className="mt-2 text-xs text-muted-foreground">{getSalaryHint()}</p>
              )}
            </div>

            {/* Gender Preference */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                      watch('preferredTutorGender') === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register('preferredTutorGender')}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div>
              <label htmlFor="timing" className="block text-sm font-medium text-foreground mb-1.5">
                Preferred Timing *
              </label>
              <input
                id="timing"
                type="text"
                placeholder="e.g., Saturday–Thursday, 4 PM – 6 PM"
                className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                {...register('timingPreference')}
              />
              {errors.timingPreference && (
                <p className="mt-1 text-xs text-destructive">{errors.timingPreference.message}</p>
              )}
            </div>
          </motion.div>

          {/* Public Ad Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Make this a Public Ad?</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Public ads are visible to everyone, not just matched tutors
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register('isPublicAd')}
                />
                <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {watchedIsPublicAd && (
              <div className="mt-4">
                <label htmlFor="contact-info" className="block text-sm font-medium text-foreground mb-1.5">
                  Contact Info (visible in public ad)
                </label>
                <input
                  id="contact-info"
                  type="text"
                  placeholder="e.g., 01XXXXXXXXX or your preferred contact method"
                  className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register('contactInfo')}
                />
              </div>
            )}
          </motion.div>

          {/* Error */}
          {submitError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {submitError}
            </div>
          )}

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Post Tuition Request'
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
