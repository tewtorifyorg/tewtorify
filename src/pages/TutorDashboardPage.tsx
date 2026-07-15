// ============================================================
// Tewtorify — Tutor Dashboard (Live Firestore Data)
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Edit, Search, Star, Loader2, FileText, BookOpen } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Link } from 'react-router-dom';
import { getTutorProfile } from '@/lib/firestore';
import { QUALIFICATION_LEVELS, CLASS_LEVELS } from '@/lib/constants';
import type { TutorProfile, VerificationStatus } from '@/types';

export default function TutorDashboardPage() {
  const { user, userProfile } = useAuth();
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const profile = await getTutorProfile(user.uid);
        if (profile) {
          setTutorProfile(profile);
          setHasApplied(true);
        }
      } catch (err) {
        console.error('Error fetching tutor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const verificationStatus: VerificationStatus = tutorProfile?.verificationStatus || 'pending';

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {userProfile?.name || 'Tutor'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Your tutor dashboard</p>
        </motion.div>

        {/* Not yet applied */}
        {!hasApplied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Complete Your Application</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You haven't submitted your tutor application yet. Fill in your qualification,
                    upload certificates and NID to get verified.
                  </p>
                  <Link
                    to="/tutor/apply"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg gradient-primary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <Edit className="h-4 w-4" />
                    Start Application
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verification Status Banner */}
        {hasApplied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            {verificationStatus === 'pending' && (
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Application Under Review</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your tutor application is being reviewed by our admin team. This usually takes 24–48 hours.
                      You'll be notified once your profile is approved.
                    </p>
                    <Link
                      to="/tutor/profile"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === 'verified' && (
              <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Profile Verified ✓</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your profile is verified. You can now browse tuition requests and appear in AI recommendations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {verificationStatus === 'rejected' && (
              <div className="p-5 rounded-xl bg-destructive/10 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Application Rejected</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your application was not approved.
                      {tutorProfile?.rejectionReason && (
                        <span className="block mt-1 text-foreground font-medium">
                          Reason: {tutorProfile.rejectionReason}
                        </span>
                      )}
                    </p>
                    <Link
                      to="/tutor/apply"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                    >
                      Re-submit Application
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Summary (when applied) */}
        {hasApplied && tutorProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-5 rounded-xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Your Profile Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Qualification:</span>{' '}
                <span className="text-foreground font-medium">
                  {QUALIFICATION_LEVELS.find(q => q.value === tutorProfile.qualificationLevel)?.label}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Institution:</span>{' '}
                <span className="text-foreground font-medium">{tutorProfile.institution}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Subjects:</span>{' '}
                <span className="text-foreground font-medium">{tutorProfile.subjects.join(', ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Areas:</span>{' '}
                <span className="text-foreground font-medium">{tutorProfile.preferredAreas.join(', ')}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verified Actions */}
        {verificationStatus === 'verified' && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Link to="/tutor/browse-requests" className="block p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Browse Requests</h3>
                    <p className="text-xs text-muted-foreground mt-1">Find open tuition requests matching your subjects</p>
                  </div>
                </div>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Link to="/tutor/profile" className="block p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">My Profile & Reviews</h3>
                    <p className="text-xs text-muted-foreground mt-1">View your ratings and manage your profile</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
