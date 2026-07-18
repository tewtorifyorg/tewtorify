// ============================================================
// Tewtorify — Tutor Application Page (Milestone 3)
// Full multi-section form with certificate/NID upload
// ============================================================

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, MapPin, DollarSign, Clock, FileText,
  Upload, X, CheckCircle2, AlertCircle, Loader2, Layers,
} from 'lucide-react';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/features/auth/AuthContext';
import { compressImageToBase64 } from '@/lib/utils';
import {
  CLASS_LEVELS, SUBJECTS, PABNA_THANAS, PABNA_SADAR_AREAS,
  TUTORING_MODES, QUALIFICATION_LEVELS, INSTITUTION_SUGGESTIONS,
  SALARY_RANGES,
  SSC_SUBJECTS_BY_BACKGROUND, HSC_SUBJECTS_BY_BACKGROUND,
  EDUCATION_BACKGROUNDS, type EducationBackground,
} from '@/lib/constants';

// ---------- Zod Schema ----------

const tutorApplicationSchema = z.object({
  qualificationLevel: z.string().min(1, 'Select your qualification level'),
  institution: z.string().min(2, 'Enter your institution name'),
  department: z.string().min(2, 'Enter your department'),
  subjects: z.array(z.string()).min(1, 'Select at least one subject'),
  classLevels: z.array(z.string()).min(1, 'Select at least one class level'),
  tutoringMode: z.enum(['in-person', 'online', 'both']),
  preferredAreas: z.array(z.string()).min(1, 'Select at least one area'),
  expectedSalaryMin: z.number().min(1000, 'Minimum salary must be at least ৳1,000'),
  expectedSalaryMax: z.number().max(25000, 'Maximum salary cannot exceed ৳25,000'),
  availability: z.string().min(5, 'Describe your availability'),
  bio: z.string().min(20, 'Write at least 20 characters about yourself'),
});

type TutorApplicationForm = z.infer<typeof tutorApplicationSchema>;

// ---------- Component ----------

export default function TutorApplyPage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [areaInput, setAreaInput] = useState('');
  const [sscBackground, setSscBackground] = useState<EducationBackground | null>(userProfile?.sscBackground ?? null);
  const [hscBackground, setHscBackground] = useState<EducationBackground | null>(userProfile?.hscBackground ?? null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TutorApplicationForm>({
    resolver: zodResolver(tutorApplicationSchema),
    defaultValues: {
      subjects: [],
      classLevels: [],
      preferredAreas: [],
      tutoringMode: 'both',
      expectedSalaryMin: 3000,
      expectedSalaryMax: 8000,
    },
  });

  const watchedClassLevels = watch('classLevels');
  const watchedSubjects = watch('subjects');
  const watchedAreas = watch('preferredAreas');

  // Get relevant subjects based on selected class levels AND education background
  const getRelevantSubjects = useCallback(() => {
    const selectedGroups = new Set(
      watchedClassLevels
        .map((cl) => CLASS_LEVELS.find((l) => l.value === cl)?.group)
        .filter(Boolean)
    );
    const allSubjects = new Set<string>();
    selectedGroups.forEach((group) => {
      const subjs = SUBJECTS[group as string];
      if (subjs) subjs.forEach((s) => allSubjects.add(s));
    });

    // Filter SSC/HSC subjects based on selected background
    if (sscBackground || hscBackground) {
      const allowedSubjects = new Set<string>();

      // For non-SSC/HSC groups, allow all subjects
      selectedGroups.forEach((group) => {
        if (group !== 'SSC' && group !== 'HSC') {
          const subjs = SUBJECTS[group as string];
          if (subjs) subjs.forEach((s) => allowedSubjects.add(s));
        }
      });

      // For SSC group, only allow subjects matching their SSC background
      if (selectedGroups.has('SSC') && sscBackground) {
        SSC_SUBJECTS_BY_BACKGROUND[sscBackground].forEach((s) => allowedSubjects.add(s));
      } else if (selectedGroups.has('SSC')) {
        const subjs = SUBJECTS['SSC'];
        if (subjs) subjs.forEach((s) => allowedSubjects.add(s));
      }

      // For HSC group, only allow subjects matching their HSC background
      if (selectedGroups.has('HSC') && hscBackground) {
        HSC_SUBJECTS_BY_BACKGROUND[hscBackground].forEach((s) => allowedSubjects.add(s));
      } else if (selectedGroups.has('HSC')) {
        const subjs = SUBJECTS['HSC'];
        if (subjs) subjs.forEach((s) => allowedSubjects.add(s));
      }

      return [...allSubjects].filter((s) => allowedSubjects.has(s)).sort();
    }

    return [...allSubjects].sort();
  }, [watchedClassLevels, sscBackground, hscBackground]);

  // Toggle functions
  const toggleClassLevel = (value: string) => {
    const current = watchedClassLevels;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue('classLevels', updated, { shouldValidate: true });
  };

  const toggleSubject = (value: string) => {
    const current = watchedSubjects;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue('subjects', updated, { shouldValidate: true });
  };

  const addArea = (area: string) => {
    const trimmed = area.trim();
    if (trimmed && !watchedAreas.includes(trimmed)) {
      setValue('preferredAreas', [...watchedAreas, trimmed], { shouldValidate: true });
    }
    setAreaInput('');
  };

  const removeArea = (area: string) => {
    setValue(
      'preferredAreas',
      watchedAreas.filter((a) => a !== area),
      { shouldValidate: true }
    );
  };

  // File handlers
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCertificates((prev) => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const handleNidUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNidFile(file);
  };

  // No longer using Firebase Storage; handled inline via base64 compression

  // Submit handler
  const onSubmit = async (data: TutorApplicationForm) => {
    if (!user) return;
    if (certificates.length === 0) {
      setSubmitError('Please upload at least one certificate.');
      return;
    }
    if (!nidFile) {
      setSubmitError('Please upload your NID.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Compress and encode certificates to Base64 (max 800px width, 60% quality)
      const certificateUrls = await Promise.all(
        certificates.map((file) => compressImageToBase64(file, 800, 0.6))
      );

      // Compress and encode NID to Base64
      const nidUrl = await compressImageToBase64(nidFile, 800, 0.6);

      // Create tutor profile document
      await setDoc(doc(db, 'tutorProfiles', user.uid), {
        uid: user.uid,
        qualificationLevel: data.qualificationLevel,
        institution: data.institution,
        department: data.department,
        certificateUrls,
        nidUrl,
        subjects: data.subjects,
        classLevels: data.classLevels,
        tutoringMode: data.tutoringMode,
        preferredAreas: data.preferredAreas,
        expectedSalaryMin: data.expectedSalaryMin,
        expectedSalaryMax: data.expectedSalaryMax,
        availability: data.availability,
        bio: data.bio,
        verificationStatus: 'pending',
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
      });

      navigate('/tutor/dashboard');
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save background to Firestore user doc
  const saveBackground = async () => {
    if (!user || !sscBackground || !hscBackground) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        sscBackground,
        hscBackground,
      });
    } catch (err) {
      console.error('Failed to save background:', err);
    }
  };

  // Steps config (7 steps: 0=Background, 1=Qualification, 2=Subjects, 3=Location, 4=Salary, 5=Documents, 6=Review)
  const steps = [
    { icon: Layers, label: 'Background' },
    { icon: GraduationCap, label: 'Qualification' },
    { icon: BookOpen, label: 'Subjects' },
    { icon: MapPin, label: 'Location' },
    { icon: DollarSign, label: 'Salary' },
    { icon: FileText, label: 'Documents' },
    { icon: Clock, label: 'Finish' },
  ];

  // Group class levels
  const classLevelGroups = CLASS_LEVELS.reduce((acc, cl) => {
    if (!acc[cl.group]) acc[cl.group] = [];
    acc[cl.group].push(cl);
    return acc;
  }, {} as Record<string, typeof CLASS_LEVELS[number][]>);

  // Filtered area suggestions
  const areaSuggestions = [...PABNA_THANAS, ...PABNA_SADAR_AREAS]
    .filter(
      (a) =>
        a.toLowerCase().includes(areaInput.toLowerCase()) &&
        !watchedAreas.includes(a)
    )
    .slice(0, 8);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Tutor Application</h1>
          <p className="text-muted-foreground mt-1">
            Complete your profile to apply for verification. Hi, {userProfile?.name}!
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="mb-10 flex items-center justify-between">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;
            return (
              <div key={step.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? 'gradient-primary'
                      : isActive
                      ? 'bg-primary/20 text-primary ring-2 ring-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 0: Education Background */}
            {currentStep === 0 && (
              <div className="space-y-6 rounded-2xl bg-card border border-border p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Education Background</h2>
                  <p className="text-sm text-muted-foreground">
                    আপনার SSC ও HSC এর বিভাগ নির্বাচন করুন — এটি আপনি কোন বিষয়ে পড়াতে পারবেন তা নির্ধারণ করবে
                  </p>
                </div>

                {/* SSC Background */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    SSC Background (মাধ্যমিক বিভাগ) *
                  </label>
                  <div className="space-y-2">
                    {EDUCATION_BACKGROUNDS.map((bg) => {
                      const isSelected = sscBackground === bg.value;
                      return (
                        <button
                          key={`ssc-${bg.value}`}
                          type="button"
                          onClick={() => setSscBackground(bg.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {bg.label}
                          </span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* HSC Background */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    HSC Background (উচ্চ মাধ্যমিক বিভাগ) *
                  </label>
                  <div className="space-y-2">
                    {EDUCATION_BACKGROUNDS.map((bg) => {
                      const isSelected = hscBackground === bg.value;
                      return (
                        <button
                          key={`hsc-${bg.value}`}
                          type="button"
                          onClick={() => setHscBackground(bg.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {bg.label}
                          </span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!sscBackground || !hscBackground ? (
                  <p className="text-xs text-muted-foreground italic">উভয় বিভাগ নির্বাচন করুন continue করতে</p>
                ) : null}
              </div>
            )}

            {/* Step 1: Qualification */}
            {currentStep === 1 && (
              <div className="space-y-6 rounded-2xl bg-card border border-border p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Qualification</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your educational background</p>
                </div>

                {/* Qualification Level */}
                <div>
                  <label htmlFor="qual-level" className="block text-sm font-medium text-foreground mb-1.5">
                    Qualification Level *
                  </label>
                  <select
                    id="qual-level"
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register('qualificationLevel')}
                  >
                    <option value="">Select your level</option>
                    {QUALIFICATION_LEVELS.map((q) => (
                      <option key={q.value} value={q.value}>{q.label}</option>
                    ))}
                  </select>
                  {errors.qualificationLevel && (
                    <p className="mt-1 text-xs text-destructive">{errors.qualificationLevel.message}</p>
                  )}
                </div>

                {/* Institution */}
                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-foreground mb-1.5">
                    Institution *
                  </label>
                  <input
                    id="institution"
                    type="text"
                    list="institution-suggestions"
                    placeholder="e.g., PUST, Edward College"
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register('institution')}
                  />
                  <datalist id="institution-suggestions">
                    {INSTITUTION_SUGGESTIONS.map((inst) => (
                      <option key={inst} value={inst} />
                    ))}
                  </datalist>
                  {errors.institution && (
                    <p className="mt-1 text-xs text-destructive">{errors.institution.message}</p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1.5">
                    Department / Major *
                  </label>
                  <input
                    id="department"
                    type="text"
                    placeholder="e.g., CSE, English, Physics"
                    className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...register('department')}
                  />
                  {errors.department && (
                    <p className="mt-1 text-xs text-destructive">{errors.department.message}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1.5">
                    About You *
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell guardians about your teaching experience, approach, and strengths..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    {...register('bio')}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Subjects & Class Levels */}
            {currentStep === 2 && (
              <div className="space-y-6 rounded-2xl bg-card border border-border p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Subjects & Class Levels</h2>
                  <p className="text-sm text-muted-foreground">Select the class levels and subjects you can teach</p>
                  {(sscBackground || hscBackground) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <span className="text-xs font-medium text-primary">Your Background:</span>
                      {sscBackground && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                          SSC: {sscBackground}
                        </span>
                      )}
                      {hscBackground && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                          HSC: {hscBackground}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">— Subjects filtered based on your background</span>
                    </div>
                  )}
                </div>

                {/* Class Levels */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Class Levels You Can Teach *
                  </label>
                  <div className="space-y-4">
                    {Object.entries(classLevelGroups).map(([group, levels]) => (
                      <div key={group}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          {group}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {levels.map((level) => {
                            const isSelected = watchedClassLevels.includes(level.value);
                            return (
                              <button
                                key={level.value}
                                type="button"
                                onClick={() => toggleClassLevel(level.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  isSelected
                                    ? 'gradient-primary shadow-sm'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                              >
                                {level.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.classLevels && (
                    <p className="mt-2 text-xs text-destructive">{errors.classLevels.message}</p>
                  )}
                </div>

                {/* Subjects (filtered by selected class levels) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Subjects You Can Teach *
                  </label>
                  {watchedClassLevels.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Select class levels above to see relevant subjects</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getRelevantSubjects().map((subject) => {
                        const isSelected = watchedSubjects.includes(subject);
                        return (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => toggleSubject(subject)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-accent text-accent-foreground shadow-sm'
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
              </div>
            )}

            {/* Step 3: Location & Mode */}
            {currentStep === 3 && (
              <div className="space-y-6 rounded-2xl bg-card border border-border p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Location & Mode</h2>
                  <p className="text-sm text-muted-foreground">Where and how you prefer to teach</p>
                </div>

                {/* Tutoring Mode */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
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

                {/* Preferred Areas */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Preferred Areas *
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Type an area name or select from suggestions
                  </p>

                  {/* Area tags */}
                  {watchedAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {watchedAreas.map((area) => (
                        <span
                          key={area}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => removeArea(area)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Area input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={areaInput}
                      onChange={(e) => setAreaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArea(areaInput);
                        }
                      }}
                      placeholder="Type area name (e.g., Shalgaria, Ishwardi)..."
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {/* Suggestions */}
                  {areaInput && areaSuggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {areaSuggestions.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => addArea(area)}
                          className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          + {area}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick-add thanas */}
                  {!areaInput && watchedAreas.length === 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Quick add Pabna thanas:</p>
                      <div className="flex flex-wrap gap-2">
                        {PABNA_THANAS.map((thana) => (
                          <button
                            key={thana}
                            type="button"
                            onClick={() => addArea(thana)}
                            className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            + {thana}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.preferredAreas && (
                    <p className="mt-2 text-xs text-destructive">{errors.preferredAreas.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Salary & Availability */}
            {currentStep === 4 && (
              <div className="space-y-6 rounded-2xl bg-card border border-border p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Salary & Availability</h2>
                  <p className="text-sm text-muted-foreground">Set your expected salary range and availability</p>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Expected Monthly Salary (BDT) *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="salary-min" className="block text-xs text-muted-foreground mb-1">Minimum</label>
                      <Controller
                        name="expectedSalaryMin"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="salary-min"
                            type="number"
                            min={1000}
                            max={25000}
                            step={500}
                            className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label htmlFor="salary-max" className="block text-xs text-muted-foreground mb-1">Maximum</label>
                      <Controller
                        name="expectedSalaryMax"
                        control={control}
                        render={({ field }) => (
                          <input
                            id="salary-max"
                            type="number"
                            min={1000}
                            max={25000}
                            step={500}
                            className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                  </div>
                  {(errors.expectedSalaryMin || errors.expectedSalaryMax) && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.expectedSalaryMin?.message || errors.expectedSalaryMax?.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Typical ranges: Primary ৳2,000–4,000 • SSC ৳4,000–8,000 • HSC ৳5,000–10,000 • Admission ৳6,000–12,000
                  </p>
                </div>

                {/* Availability */}
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-foreground mb-1.5">
                    Availability *
                  </label>
                  <textarea
                    id="availability"
                    rows={3}
                    placeholder="e.g., Saturday–Thursday, 4 PM – 8 PM. Available on weekends for online sessions."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    {...register('availability')}
                  />
                  {errors.availability && (
                    <p className="mt-1 text-xs text-destructive">{errors.availability.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Document Upload */}
            {currentStep === 5 && (
              <div className="space-y-6 rounded-2xl bg-card border border-border p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Document Upload</h2>
                  <p className="text-sm text-muted-foreground">Upload your certificates and NID for verification</p>
                </div>

                {/* Certificates */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Certificates (max 5) *
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload your SSC/HSC marksheet, university ID, or any relevant certificate
                  </p>

                  {/* File list */}
                  {certificates.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {certificates.map((file, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted">
                          <div className="flex items-center gap-2 text-sm truncate">
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(0)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCertificates((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {certificates.length < 5 && (
                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/30 cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload or drag & drop
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, PDF up to 5MB each
                      </span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        multiple
                        onChange={handleCertificateUpload}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                {/* NID */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    National ID (NID) *
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload a clear photo of your NID (front side)
                  </p>

                  {nidFile ? (
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="truncate">{nidFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNidFile(null)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/30 cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload NID photo</span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleNidUpload}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <div className="space-y-6 rounded-2xl bg-card border border-border p-6 sm:p-8">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Review & Submit</h2>
                  <p className="text-sm text-muted-foreground">
                    Review your application before submitting
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Education Background</p>
                    <p className="text-sm text-foreground capitalize">
                      SSC: {sscBackground || 'Not set'} | HSC: {hscBackground || 'Not set'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Qualification</p>
                    <p className="text-sm text-foreground">
                      {QUALIFICATION_LEVELS.find(q => q.value === watch('qualificationLevel'))?.label} — {watch('institution')}, {watch('department')}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Class Levels</p>
                    <div className="flex flex-wrap gap-1">
                      {watchedClassLevels.map(cl => (
                        <span key={cl} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
                          {CLASS_LEVELS.find(l => l.value === cl)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Subjects</p>
                    <div className="flex flex-wrap gap-1">
                      {watchedSubjects.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Areas & Mode</p>
                    <p className="text-sm text-foreground">
                      {watchedAreas.join(', ')} • {TUTORING_MODES.find(m => m.value === watch('tutoringMode'))?.label}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Salary Range</p>
                    <p className="text-sm text-foreground">৳{watch('expectedSalaryMin').toLocaleString()} – ৳{watch('expectedSalaryMax').toLocaleString()}/month</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Documents</p>
                    <p className="text-sm text-foreground">
                      {certificates.length} certificate(s) • NID: {nidFile ? 'Uploaded' : 'Missing'}
                    </p>
                  </div>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {submitError}
                  </div>
                )}
                {Object.keys(errors).length > 0 && (
                  <div className="flex flex-col gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Please fix the following errors before submitting:
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).map(([field, err]) => (
                        <li key={field}>
                          <span className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>: {err.message}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs opacity-80 mt-1">Click "Back" to navigate to the previous steps and fix these fields.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6)}
              disabled={currentStep === 0}
              className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => {
                  // On step 0, validate background selection and save to Firestore before continuing
                  if (currentStep === 0) {
                    if (!sscBackground || !hscBackground) return;
                    saveBackground();
                  }
                  setCurrentStep(Math.min(6, currentStep + 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6);
                }}
                disabled={currentStep === 0 && (!sscBackground || !hscBackground)}
                className="px-5 py-2.5 rounded-lg gradient-primary text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg gradient-primary text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
