// ============================================================
// Tewtorify — Tutor Profile Page (View/Edit Own Profile)
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, GraduationCap, BookOpen, MapPin, DollarSign, Clock,
  CheckCircle2, XCircle, Edit, Loader2, FileText, ExternalLink,
  ShieldCheck, Star, Award,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { getTutorProfile, getReviewsByTutor } from '@/lib/firestore';
import { QUALIFICATION_LEVELS, CLASS_LEVELS, TUTORING_MODES } from '@/lib/constants';
import { formatBDT, formatDate, timeAgo } from '@/lib/utils';
import type { TutorProfile, Review } from '@/types';

export default function TutorProfilePage() {
  const { user, userProfile } = useAuth();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [p, r] = await Promise.all([
          getTutorProfile(user.uid),
          getReviewsByTutor(user.uid),
        ]);
        setProfile(p);
        setReviews(r);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-medium">No profile found</p>
          <p className="text-sm text-muted-foreground mt-1">Complete your tutor application first.</p>
        </div>
      </div>
    );
  }

  const verificationBadge = () => {
    switch (profile.verificationStatus) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
            <ShieldCheck className="h-4 w-4" /> Verified Tutor
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium">
            <Clock className="h-4 w-4" /> Pending Verification
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 text-sm font-medium">
            <XCircle className="h-4 w-4" /> Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card border border-border overflow-hidden"
        >
          {/* Banner */}
          <div className="h-24 gradient-hero" />
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-10 flex items-end justify-between mb-4">
              <div className="h-20 w-20 rounded-2xl gradient-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-card">
                {userProfile?.name?.[0]?.toUpperCase() || 'T'}
              </div>
              {verificationBadge()}
            </div>

            <h1 className="text-2xl font-bold text-foreground">{userProfile?.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {QUALIFICATION_LEVELS.find((q) => q.value === profile.qualificationLevel)?.label} — {profile.institution}
            </p>
            <p className="text-sm text-muted-foreground">{profile.department}</p>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-foreground">
                  {profile.rating > 0 ? profile.rating.toFixed(1) : 'N/A'}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({profile.reviewCount} {profile.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatBDT(profile.expectedSalaryMin)} – {formatBDT(profile.expectedSalaryMax)}/mo
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl bg-card border border-border p-5"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
            <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
          </motion.div>

          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl bg-card border border-border p-5"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Availability</h3>
            <p className="text-sm text-foreground">{profile.availability}</p>
            <div className="mt-3">
              <span className="text-xs text-muted-foreground">Mode: </span>
              <span className="text-sm font-medium text-foreground">
                {TUTORING_MODES.find((m) => m.value === profile.tutoringMode)?.label}
              </span>
            </div>
          </motion.div>

          {/* Class Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-card border border-border p-5"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Class Levels</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.classLevels.map((cl) => (
                <span key={cl} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                  {CLASS_LEVELS.find((l) => l.value === cl)?.label || cl}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl bg-card border border-border p-5"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subjects</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.subjects.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-card border border-border p-5"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preferred Areas</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.preferredAreas.map((a) => (
                <span key={a} className="px-2.5 py-1 rounded-lg bg-muted text-foreground text-xs font-medium">
                  <MapPin className="inline h-3 w-3 mr-1" />{a}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl bg-card border border-border p-5"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Documents</h3>
            <div className="space-y-2">
              {profile.certificateUrls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Certificate {i + 1}
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
                </a>
              ))}
              <a
                href={profile.nidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                National ID
                <ExternalLink className="h-3 w-3 text-muted-foreground ml-auto" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Reviews ({reviews.length})
            </h2>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-xl bg-card border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
                  </div>
                  <p className="text-sm text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
