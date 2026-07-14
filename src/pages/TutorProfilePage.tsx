// ============================================================
// Tewtorify — Tutor Profile Page (View & Edit)
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Edit, GraduationCap, BookOpen, MapPin, DollarSign,
  Clock, Star, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/features/auth/AuthContext';
import { CLASS_LEVELS, QUALIFICATION_LEVELS, TUTORING_MODES } from '@/lib/constants';
import type { TutorProfile } from '@/types';

export default function TutorProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'tutorProfiles', user.uid));
        if (docSnap.exists()) {
          setProfile({ uid: user.uid, ...docSnap.data() } as TutorProfile);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">No Profile Found</h2>
          <p className="text-sm text-muted-foreground mb-4">You haven't submitted an application yet.</p>
          <Link
            to="/tutor/apply"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg gradient-primary text-white text-sm font-semibold"
          >
            Apply Now
          </Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    verified: 'bg-green-500/10 text-green-600 border-green-500/20',
    rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Profile</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium capitalize ${statusColors[profile.verificationStatus]}`}>
                  {profile.verificationStatus === 'verified' && <CheckCircle2 className="h-3 w-3" />}
                  {profile.verificationStatus}
                </span>
                {profile.rating > 0 && (
                  <span className="inline-flex items-center gap-1 text-sm text-foreground">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    {profile.rating.toFixed(1)} ({profile.reviewCount} reviews)
                  </span>
                )}
              </div>
            </div>
            <Link
              to="/tutor/apply"
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </div>

          {/* Rejection Reason */}
          {profile.verificationStatus === 'rejected' && profile.rejectionReason && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
              <p className="text-sm text-foreground">{profile.rejectionReason}</p>
            </div>
          )}

          {/* Profile Sections */}
          <div className="space-y-6">
            {/* Qualification */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Qualification</h2>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Level:</span> {QUALIFICATION_LEVELS.find(q => q.value === profile.qualificationLevel)?.label || profile.qualificationLevel}</p>
                <p><span className="text-muted-foreground">Institution:</span> {profile.institution}</p>
                <p><span className="text-muted-foreground">Department:</span> {profile.department}</p>
              </div>
              {profile.bio && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>

            {/* Subjects & Levels */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Subjects & Levels</h2>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Class Levels</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.classLevels.map(cl => (
                    <span key={cl} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">
                      {CLASS_LEVELS.find(l => l.value === cl)?.label || cl}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Subjects</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Location & Mode */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Location & Mode</h2>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Mode:</span>{' '}
                {TUTORING_MODES.find(m => m.value === profile.tutoringMode)?.label}
              </p>
              <p className="text-sm mt-2">
                <span className="text-muted-foreground">Areas:</span>{' '}
                {profile.preferredAreas.join(', ')}
              </p>
            </div>

            {/* Salary & Availability */}
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Salary & Availability</h2>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Expected salary:</span>{' '}
                ৳{profile.expectedSalaryMin.toLocaleString()} – ৳{profile.expectedSalaryMax.toLocaleString()}/month
              </p>
              <div className="mt-3 flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-foreground">{profile.availability}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
